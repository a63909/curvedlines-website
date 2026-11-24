import json
from pathlib import Path
from runpy import run_path
from tempfile import TemporaryDirectory
import unittest


report = run_path(Path(__file__).with_name("download-counts.py"))["report"]


def part(transfer, sent, byte_range=None, filename="mayday-54.apk"):
    return json.dumps({
        "uri": "/releases/" + filename,
        "sent": str(sent),
        "length": "100",
        "status": "206" if byte_range else "200",
        "range": byte_range or "-",
        "download": transfer,
    })


class DownloadCountsTest(unittest.TestCase):
    def count(self, *records):
        with TemporaryDirectory() as directory:
            log = Path(directory) / "events.log"
            log.write_text("\n".join(records), encoding="utf-8")
            return report(log)

    def test_keeps_previous_totals_and_counts_a_resumed_download_once(self):
        transfer = "a" * 32
        counts = self.count(
            "2026-11-21T19:32:50+03:00 /releases/Mayday-Windows-x64-0.2.2.msi 278528 278528",
            "2026-11-21T19:33:50+03:00 /releases/mayday-54.apk 100 100",
            part(transfer, 34),
            part(transfer, 50, "bytes 50-99/100"),
            part(transfer, 22, "bytes 28-60/100"),
            part(transfer, 50, "bytes 50-99/100"),
            part(transfer, 100),
        )
        self.assertEqual(counts["total"], 3)
        self.assertEqual(counts["platforms"], {"Android": 2, "Windows": 1, "macOS": 0})

    def test_does_not_count_overlapping_parts_with_a_gap_or_mix_transfer_ids(self):
        first, second = "a" * 32, "b" * 32
        self.assertEqual(self.count(
            part(first, 55, "bytes 0-54/100"),
            part(first, 55, "bytes 0-54/100"),
            part(first, 35, "bytes 65-99/100"),
            part(second, 10, "bytes 55-64/100"),
            part(first, 100, "bytes 50-99/100"),
            part("-", 100, "bytes 40-99/100"),
            '{"incomplete"',
        )["total"], 0)

    def test_counts_independent_complete_downloads_of_the_same_file(self):
        self.assertEqual(self.count(
            part("a" * 32, 100),
            part("b" * 32, 100, "bytes 0-99/100"),
        )["total"], 2)

    def test_counts_resumed_windows_exe_once(self):
        name = "MaydaySetup-x64-0.3.0.exe"
        transfer = "a" * 32
        counts = self.count(
            part(transfer, 45, "bytes 0-44/100", name),
            part(transfer, 55, "bytes 45-99/100", name),
            part(transfer, 55, "bytes 45-99/100", name),
        )
        self.assertEqual(counts["platforms"]["Windows"], 1)
        self.assertEqual(counts["releases"], {name: 1})


if __name__ == "__main__":
    unittest.main()
