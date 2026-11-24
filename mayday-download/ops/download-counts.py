#!/usr/bin/env python3
"""Print completed Mayday downloads without reporting client identifiers."""
from collections import Counter, defaultdict
import json
from pathlib import Path
import re
import sys


PLATFORM = {
    ".apk": "Android",
    ".zip": "Windows",
    ".msi": "Windows",
    ".exe": "Windows",
    ".dmg": "macOS",
}

TRANSFER = re.compile(r"[0-9a-f]{32}")
RANGE = re.compile(r"bytes ([0-9]+)-([0-9]+)/([0-9]+)")


def download_part(record):
    """Return the filename, transfer ID and half-open interval served."""
    if not record.startswith("{"):
        fields = record.split()
        if len(fields) == 4:
            _, uri, sent, length = fields
            if sent.isdecimal() and length.isdecimal() and 0 < int(sent) == int(length):
                size = int(sent)
                return Path(uri).name, None, 0, size, size
        return None

    try:
        event = json.loads(record)
        if not isinstance(event, dict):
            return None
        release = Path(event["uri"]).name
        sent = int(event["sent"])
        if sent <= 0:
            return None
        if event["status"] == "200":
            first, size = 0, int(event["length"])
            last = size - 1
        elif event["status"] == "206":
            match = RANGE.fullmatch(event["range"])
            if not match:
                return None
            first, last, size = map(int, match.groups())
        else:
            return None
        if not 0 <= first <= last < size or sent > last - first + 1:
            return None
        tag = event.get("download", "")
        transfer = tag if TRANSFER.fullmatch(tag) else None
        return release, transfer, first, first + sent, size
    except (KeyError, TypeError, ValueError):
        return None


def whole_file(parts, size):
    covered = 0
    for first, end in sorted(parts):
        if first > covered:
            return False
        covered = max(covered, end)
        if covered == size:
            return True
    return False


def report(log):
    totals = Counter(dict.fromkeys(PLATFORM.values(), 0))
    releases = Counter()
    transfers = defaultdict(list)
    with log.open(encoding="utf-8") as records:
        for record in records:
            part = download_part(record)
            if not part:
                continue
            release, transfer, first, end, size = part
            platform = PLATFORM.get(Path(release).suffix)
            if not platform:
                continue
            if transfer:
                transfers[platform, release, transfer, size].append((first, end))
            elif first == 0 and end == size:
                totals[platform] += 1
                releases[release] += 1
    for (platform, release, _, size), parts in transfers.items():
        if whole_file(parts, size):
            totals[platform] += 1
            releases[release] += 1
    return {"total": sum(totals.values()), "platforms": dict(totals), "releases": dict(sorted(releases.items()))}


if __name__ == "__main__":
    path = Path(sys.argv[1]) if len(sys.argv) == 2 else Path("/var/log/mayday-downloads/events.log")
    print(json.dumps(report(path), ensure_ascii=False, indent=2))
