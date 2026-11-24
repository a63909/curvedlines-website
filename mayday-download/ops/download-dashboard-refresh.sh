#!/bin/bash
set -euo pipefail

report_dir=/var/lib/mayday-download-dashboard
snapshot=$(mktemp "$report_dir/.dashboard.XXXXXXXX")
trap 'rm -f -- "$snapshot"' EXIT

/usr/local/sbin/mayday-download-counts |
    /usr/local/libexec/mayday-download-dashboard > "$snapshot"
chgrp www-data "$snapshot"
chmod 0640 "$snapshot"
mv -fT -- "$snapshot" "$report_dir/dashboard.html"
