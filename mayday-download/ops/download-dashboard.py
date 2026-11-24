#!/usr/bin/env python3
"""Render the administrator's download summary from the existing counter."""
from datetime import datetime, timedelta, timezone
from html import escape
import json
import sys


def number(value):
    return f"{int(value):,}".replace(",", " ")


def render(report):
    updated = datetime.now(timezone(timedelta(hours=3))).strftime("%d.%m.%Y %H:%M:%S МСК")
    platforms = "".join(
        f"<div><dt>{escape(name)}</dt><dd>{number(count)}</dd></div>"
        for name, count in report["platforms"].items()
    )
    rows = "".join(
        f"<tr><th scope='row'>{escape(name)}</th><td>{number(count)}</td></tr>"
        for name, count in report["releases"].items()
    )
    releases = (
        "<table><thead><tr><th scope='col'>Файл</th><th scope='col'>Скачивания</th></tr></thead>"
        f"<tbody>{rows}</tbody></table>"
        if rows else "<p>Завершённых скачиваний пока нет.</p>"
    )
    return f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="refresh" content="5">
  <title>Скачивания · Mayday</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: #fffaf9; color: #252429; font: 16px/1.5 system-ui, sans-serif; }}
    main {{ width: min(100% - 32px, 760px); margin: 0 auto; padding: 36px 0 64px; }}
    .brand {{ color: #bd2537; font-weight: 750; font-size: 1.2rem; }}
    h1 {{ font-size: clamp(2rem, 7vw, 3rem); margin: 18px 0 4px; }}
    h2 {{ font-size: 1.25rem; margin: 32px 0 12px; }}
    p {{ color: #666069; margin: 0 0 20px; }}
    dl {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px; margin: 24px 0 0; }}
    dl div {{ background: #fff; border: 1px solid #ede1e0; border-radius: 14px; padding: 14px 16px; }}
    dl div:first-child {{ color: #9e2033; border-color: #f6dce1; background: #fdf0f2; }}
    dt {{ font-weight: 600; }}
    dd {{ margin: 4px 0 0; font-weight: 750; font-size: 1.8rem; font-variant-numeric: tabular-nums; }}
    table {{ width: 100%; border-collapse: collapse; }}
    th, td {{ padding: 10px 4px; border-bottom: 1px solid #ede1e0; text-align: left; }}
    th[scope=row] {{ font-weight: 500; overflow-wrap: anywhere; }}
    th:last-child, td:last-child {{ text-align: right; }}
    .updated {{ margin-top: 20px; font-size: .875rem; }}
    @media (min-width: 630px) {{ dl {{ grid-template-columns: repeat(4, minmax(0, 1fr)); }} }}
  </style>
</head>
<body>
  <main>
    <span class="brand">Mayday</span>
    <h1>Скачивания</h1>
    <p>Завершённые скачивания установщиков с сайта Mayday.</p>
    <dl><div><dt>Всего</dt><dd>{number(report["total"])}</dd></div>{platforms}</dl>
    <h2>По версиям</h2>
    {releases}
    <p class="updated">Обновлено {updated}</p>
  </main>
</body>
</html>"""


if __name__ == "__main__":
    print(render(json.load(sys.stdin)))
