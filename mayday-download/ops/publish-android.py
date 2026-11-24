#!/usr/bin/env python3
"""Replace the website's public Android release under the existing publish lock."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time


SITE = "mayday.colorchain.ru"
BASE = Path("/srv/mayday-showcase")
RELEASES = BASE / "static-releases"
CONFIG = Path("/etc/nginx/sites-available/mayday-showcase.conf")
APK = re.compile(r"mayday-([1-9][0-9]*)\.apk")
RELEASE_DIR = re.compile(r"mayday-[1-9][0-9]*-[a-f0-9]{12}")
RELEASE_EXPORT = re.compile(rb"(?<=export const androidRelease = )\{[^\r\n;]+\}(?=;)")
CURRENT_ROOT = re.compile(rb"(?m)^    root (/srv/mayday-showcase/static-releases/mayday-[^;\r\n]+);$")
DOWNLOAD_LOCATIONS = re.compile(
    rb"(?m)^    location (?:= /releases/mayday-(?:[0-9]+)\.apk|"
    rb"~ \^/releases/mayday-\[0-9\]\+\\\.apk\$|= /releases/mayday\.apk) \{\n"
    rb"(?:        [^\n]*\n)+?    \}\n\n"
)
PAGES = {"index.html", "en/index.html", "invite/index.html", "en/invite/index.html",
         "bankomet/index.html", "en/bankomet/index.html", "release.mjs"}


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def regular(file):
    return file.is_file() and file.resolve(strict=True) == file


def sha_from(stream):
    sha = hashlib.sha256()
    for chunk in iter(lambda: stream.read(1024 * 1024), b""):
        sha.update(chunk)
    return sha.hexdigest()


def verify(file, release):
    require(regular(file) and file.stat().st_size == release["bytes"], "Unexpected APK size or path")
    with file.open("rb") as stream:
        require(sha_from(stream) == release["sha256"], "APK SHA-256 mismatch")


def atomic_write(file, data):
    descriptor, name = tempfile.mkstemp(dir=file.parent, prefix=".mayday-")
    try:
        os.fchmod(descriptor, file.stat().st_mode & 0o777)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(name, file)
    finally:
        Path(name).unlink(missing_ok=True)


def metadata(root):
    path = root / "release.mjs"
    require(regular(path), "Missing valid release.mjs")
    matches = RELEASE_EXPORT.findall(path.read_bytes())
    require(len(matches) == 1, "Missing or ambiguous website release metadata")
    release = json.loads(matches[0])
    require(APK.fullmatch(release["filename"]), "Unexpected release filename")
    return release, matches[0]


def update_metadata(root, previous, release):
    encoded = json.dumps(release, separators=(",", ":")).encode()
    updated = set()
    for path in [*root.rglob("*.html"), root / "release.mjs"]:
        require(regular(path), "Unsafe website file " + str(path))
        content = path.read_bytes()
        if previous in content:
            atomic_write(path, content.replace(previous, encoded))
            updated.add(path.relative_to(root).as_posix())
    require(PAGES <= updated, "Missing release metadata on " + ", ".join(sorted(PAGES - updated)))
    return updated


def nginx_config(original, root, release):
    replaced = CURRENT_ROOT.sub(lambda _: b"    root " + os.fsencode(root) + b";", original)
    replaced, count = DOWNLOAD_LOCATIONS.subn(b"", replaced)
    require(count > 0, "Cannot locate APK routes")
    anchor = b"    location @mayday_timeweb {"
    require(replaced.count(anchor) == 1, "Missing website fallback route")
    apk = release["filename"].encode()
    routes = (
        b"    location = /releases/mayday.apk {\n"
        b"        return 307 /releases/" + apk + b"$is_args$args;\n"
        b"    }\n\n"
        b"    location ~ ^/releases/mayday-[0-9]+\\.apk$ {\n"
        b"        limit_except GET { deny all; }\n"
        b"        types { application/vnd.android.package-archive apk; }\n"
        b"        try_files $uri =404;\n"
        b"    }\n\n"
    )
    return replaced.replace(anchor, routes + anchor)


def reload_nginx():
    subprocess.run(["nginx", "-t"], check=True, timeout=15)
    subprocess.run(["systemctl", "reload", "nginx"], check=True, timeout=15)


def curl(path):
    return ["curl", "--fail", "--silent", "--show-error", "--max-time", "45",
            "--resolve", SITE + ":443:127.0.0.1", "https://" + SITE + path]


def verify_served(root, release):
    encoded = metadata(root)[1]
    deadline = time.monotonic() + 10
    for page in sorted(PAGES):
        route = "/" + page.removesuffix("index.html")
        # Nginx reload returns before the new workers have started serving requests.
        while encoded not in subprocess.check_output(curl(route)):
            require(time.monotonic() < deadline, "Old metadata at " + route)
            time.sleep(0.25)
    with subprocess.Popen(curl("/releases/mayday.apk") + ["--location"], stdout=subprocess.PIPE) as request:
        served = sha_from(request.stdout)
        require(request.wait() == 0 and served == release["sha256"], "HTTPS APK checksum mismatch")


def stale_apks(keep):
    for directory in RELEASES.iterdir():
        if not RELEASE_DIR.fullmatch(directory.name) or not (directory / "releases").is_dir():
            continue
        folder = directory / "releases"
        require(folder.resolve(strict=True) == folder, "Unsafe website release directory")
        for file in folder.iterdir():
            if APK.fullmatch(file.name) and file != keep:
                require(regular(file), "Unsafe APK path")
                yield file


def receive(file, size):
    with file.open("xb") as stream:
        remaining = size
        while remaining:
            chunk = sys.stdin.buffer.read(min(1024 * 1024, remaining))
            require(chunk, "APK upload incomplete")
            stream.write(chunk)
            remaining -= len(chunk)
        require(not sys.stdin.buffer.read(1), "APK upload exceeds declared size")
        stream.flush()
        os.fsync(stream.fileno())


def main():
    import fcntl

    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--plan", action="store_true")
    mode.add_argument("--configure", action="store_true", help="Keep current version and retire previous website APKs")
    mode.add_argument("--publish", nargs=4, metavar=("NUMBER", "VERSION", "BYTES", "SHA256"))
    args = parser.parse_args()
    with (BASE / "publish.lock").open("r") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        require(regular(CONFIG), "Unexpected Nginx configuration path")
        original = CONFIG.read_bytes()
        roots = CURRENT_ROOT.findall(original)
        require(len(roots) == 1, "Missing or ambiguous website root")
        current = Path(os.fsdecode(roots[0]))
        require(RELEASE_DIR.fullmatch(current.name) and current.parent == RELEASES, "Unexpected website root")
        release, previous = metadata(current)
        keep = current / "releases" / release["filename"]
        verify(keep, release)
        require(current.name == keep.stem + "-" + release["sha256"][:12], "Current release directory does not match metadata")
        if args.plan:
            print(json.dumps({"current": release, "retire": list(map(str, stale_apks(keep)))}, indent=2))
            return

        root = current
        with tempfile.TemporaryDirectory(prefix=".android-upload-", dir=RELEASES) as temporary:
            stage = None
            if args.publish:
                number, version, size, digest = args.publish
                require(re.fullmatch(r"[1-9][0-9]*", number) and re.fullmatch(r"[0-9]+(?:\.[0-9]+)*", version)
                        and size.isdecimal() and 0 < int(size) <= 512 * 1024 * 1024
                        and re.fullmatch(r"[a-f0-9]{64}", digest), "Invalid release metadata")
                next_release = {"filename": f"mayday-{number}.apk", "version": version,
                                "bytes": int(size), "sha256": digest}
                if next_release != release:
                    require(int(number) > int(APK.fullmatch(keep.name)[1]), "Release number must increase")
                    stage = Path(temporary) / "site"
                    shutil.copytree(
                        current, stage, symlinks=True, copy_function=os.link,
                        ignore=lambda folder, files: [file for file in files if APK.fullmatch(file)]
                        if Path(folder) == current / "releases" else [],
                    )
                    apk = stage / "releases" / next_release["filename"]
                    receive(apk, next_release["bytes"])
                    verify(apk, next_release)
                    update_metadata(stage, previous, next_release)
                    root = RELEASES / (apk.stem + "-" + digest[:12])
                    require(not root.exists() and not root.is_symlink(), "Candidate directory already exists")
                    release = next_release
                    keep = root / "releases" / release["filename"]
                else:
                    require(sha_from(sys.stdin.buffer) == digest, "Retried upload checksum mismatch")
            cleanup = list(stale_apks(keep))
            candidate = nginx_config(original, root, release)
            activated = False
            try:
                if stage is not None:
                    stage.rename(root)
                    activated = True
                if candidate != original:
                    require(CONFIG.read_bytes() == original, "Website configuration changed during upload")
                    atomic_write(CONFIG, candidate)
                    reload_nginx()
                verify_served(root, release)
            except BaseException:
                if candidate != original and CONFIG.read_bytes() == candidate:
                    atomic_write(CONFIG, original)
                    reload_nginx()
                if activated and CONFIG.read_bytes() == original:
                    root.rename(Path(temporary) / "failed")
                raise
            for apk in cleanup:
                apk.unlink()
            require(not list(stale_apks(keep)), "Other website APK files remain")
            print(json.dumps(release, separators=(",", ":")))


if __name__ == "__main__":
    main()
