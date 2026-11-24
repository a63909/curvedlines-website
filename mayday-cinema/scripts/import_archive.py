"""Refresh movie cards from the Internet Archive's public search index."""
import argparse
import html
import json
import re
import time
import unicodedata
from pathlib import Path
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ENDPOINT = "https://archive.org/advancedsearch.php"
QUERY = ('mediatype:movies AND collection:feature_films AND runtime:[* TO *] '
         'AND format:(MPEG4 OR "h.264" OR "512Kb MPEG4") '
         'AND (licenseurl:*publicdomain* OR licenseurl:*creativecommons*)')
FIELDS = ("identifier", "title", "year", "date", "runtime", "licenseurl", "creator", "subject")
GENRES = {
    "комедия": ("comedy", "comedie", "комедия"),
    "боевик": ("action", "adventure", "western", "боевик", "вестерн"),
    "триллер": ("thriller", "suspense", "horror", "триллер"),
    "драма": ("drama", "melodrama", "драма"),
    "фантастика": ("sci-fi", "science fiction", "fantasy", "фантастика"),
    "документальный": ("documentary", "documental", "документальный"),
    "анимация": ("animation", "cartoon", "анимация"),
    "детектив": ("mystery", "detective", "crime", "детектив"),
}
NON_FILM = re.compile(r"\b(trailer|teaser|compilation|compilations|film fest(?:ival)?|excerpts?|highlights?|playlist|"
                      r"episode|season|parts?|reacts?|reaction|interviews?|commercials?|"
                      r"porn\w*|xxx|workprint|full movie cinematic dump|"
                      r"behind the scenes|adult film)\b|трейлер|тизер|сборник|нарезка|"
                      r"(?<!\d)\d{1,2}\s+серия\b", re.I)
ID_PATTERN = re.compile(r"[A-Za-z0-9][A-Za-z0-9_.-]{1,99}\Z")
YEAR = re.compile(r"\b(18[89]\d|19\d\d|20[012]\d)\b")


def text(value):
    if isinstance(value, list):
        return " ".join(text(entry) for entry in value)
    if not isinstance(value, (int, str)):
        return ""
    cleaned = re.sub(r"<[^>]{1,250}>", "", html.unescape(str(value)))
    return " ".join(cleaned.split())


def runtime(value):
    value = text(value).lower()
    clock = re.fullmatch(r"(\d{1,3}):([0-5]\d)(?::([0-5]\d))?", value)
    if clock:
        a, b = int(clock[1]), int(clock[2])
        return a if clock[3] is None else a * 60 + b
    hours = re.fullmatch(r"(\d{1,2})\s*h(?:ours?)?\s*(?:(\d{1,2})\s*m(?:in(?:utes?)?)?)?", value)
    if hours:
        return int(hours[1]) * 60 + int(hours[2] or 0)
    minutes = re.fullmatch(r"(?:approx\.?\s*)?(\d{1,3})(?:\s*m(?:in(?:ute)?s?\.?)?)?", value)
    return int(minutes[1]) if minutes else 0


def open_mark(field):
    for raw in field if isinstance(field, list) else [field]:
        link = urlparse(raw) if isinstance(raw, str) else None
        if not link or link.scheme not in {"http", "https"} or link.hostname not in {
            "creativecommons.org", "www.creativecommons.org",
        }:
            continue
        path = link.path.lower().strip("/")
        if path in {"publicdomain/mark/1.0", "publicdomain/zero/1.0", "licenses/publicdomain"}:
            return {"label": "CC0" if "/zero/" in path else "Public Domain", "url": link.geturl()}
        match = re.fullmatch(r"licenses/(by|by-sa)/([1-4]\.0)(?:/(?!legalcode|deed)[a-z-]+)?", path)
        if match:
            return {"label": "CC " + match[1].upper() + " " + match[2], "url": link.geturl()}
    return None


def title_key(title, year):
    title = re.sub(r"\s*[\[(]\s*(?:18\d\d|19\d\d|20\d\d)[^)\]]*[\])]", " ", title)
    title = re.split(r"\s(?:-|–|—|\|)\s", title, maxsplit=1)[0]
    title = re.sub(r"\b(?:1080p|720p|4k|hd|full film|full movie|public domain)\b", "", title.lower())
    return year, "".join(
        character for character in unicodedata.normalize("NFKC", title) if character.isalnum()
    )


def card(item):
    identifier, title = text(item.get("identifier")), text(item.get("title"))
    if not ID_PATTERN.fullmatch(identifier) or not 2 <= len(title) <= 170 or NON_FILM.search(title):
        return None
    year_match = YEAR.search(text(item.get("year")) or text(item.get("date")) or title)
    length = runtime(item.get("runtime"))
    mark = open_mark(item.get("licenseurl"))
    if not year_match or not 40 <= length <= 200 or not mark:
        return None
    year = int(year_match[1])
    if mark["label"] == "Public Domain" and year > 1977:
        return None
    topics = text(item.get("subject")).casefold()
    if NON_FILM.search(topics):
        return None
    genres = [label.capitalize() for label, words in GENRES.items()
              if any(re.search(r"\b" + re.escape(word) + r"\b", topics) for word in words)]
    author = text(item.get("creator"))[:140]
    return {
        "id": "ia-" + identifier,
        "title": title,
        "year": year,
        "type": "film",
        "genres": genres[:3] or ["Классика"],
        "duration": f"{length} мин",
        "service": "Internet Archive",
        "access": "В плеере",
        "note": " · ".join(part for part in (author, mark["label"] + " по данным архива") if part),
        "license": mark["url"],
        "source": f"https://archive.org/details/{identifier}",
        "embed": f"https://archive.org/embed/{identifier}",
        "imageUrl": f"https://archive.org/services/img/{identifier}",
    }


def fetch(page):
    query = urlencode({"q": QUERY, "output": "json", "rows": 300, "page": page,
                       "fl[]": FIELDS, "sort[]": ("downloads desc", "identifier asc")}, doseq=True)
    request = Request(ENDPOINT + "?" + query, headers={
        "User-Agent": "KadrCinemaCatalog/1.0 (+https://mayday.colorchain.ru/cinema/)",
        "Accept": "application/json",
    })
    for attempt in range(3):
        try:
            with urlopen(request, timeout=24) as response:
                content = json.load(response)
            return content["response"]
        except (OSError, ValueError, KeyError):
            if attempt == 2:
                raise
            time.sleep(2 ** (attempt + 1))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, default=1000)
    args = parser.parse_args()
    if not 1 <= args.limit <= 2500:
        parser.error("--limit must be between 1 and 2500")
    result, seen, seen_ids = [], set(), set()
    for page in range(1, 11):
        batch = fetch(page)
        for raw in batch["docs"]:
            movie = card(raw)
            if not movie:
                continue
            key = title_key(movie["title"], movie["year"])
            if key in seen or movie["id"] in seen_ids or not key[1]:
                continue
            seen.add(key)
            seen_ids.add(movie["id"])
            result.append(movie)
            if len(result) == args.limit:
                break
        print(f"Page {page}: {len(result)} unique cards of {batch['numFound']} index records", flush=True)
        if len(result) == args.limit or not batch["docs"]:
            break
        time.sleep(0.7)
    if not result:
        raise SystemExit("No usable cards; the existing catalogue is preserved.")
    if len(result) < args.limit and (ROOT / "archive-catalogue.json").exists():
        existing = json.loads((ROOT / "archive-catalogue.json").read_text(encoding="utf-8"))
        if len(existing) > len(result):
            raise SystemExit(f"Only {len(result)} usable cards; the larger existing catalogue is preserved.")
    temp = ROOT / "archive-catalogue.tmp"
    temp.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    temp.replace(ROOT / "archive-catalogue.json")
    print(f"Published {len(result)} locally verified cards; no video files downloaded.", flush=True)


if __name__ == "__main__":
    main()

