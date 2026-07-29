#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://unscramblehq.com}"

echo "Checking ${BASE_URL}"

health="$(curl -fsS "${BASE_URL}/api/health")"
ads="$(curl -fsS "${BASE_URL}/ads.txt")"
home="$(curl -fsS "${BASE_URL}/")"

echo "$health"
echo "$ads"

grep -q '"release":"release-006-stable-build"' <<<"$health"
grep -q '"ok":true' <<<"$health"
grep -q 'pub-3618932262167305' <<<"$ads"
grep -q 'ca-pub-3618932262167305' <<<"$home"

echo "PASS: Release 006 is live, ads.txt is authorized, and AdSense is present."
