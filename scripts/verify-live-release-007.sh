#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://unscramblehq.com}"

echo "=================================================="
echo "UnscrambleHQ live verification"
echo "Target: ${BASE_URL}"
echo "=================================================="

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

health_code="$(curl -sS -o "$tmp/health" -w '%{http_code}' "${BASE_URL}/api/health" || true)"
ads_code="$(curl -sS -o "$tmp/ads" -w '%{http_code}' "${BASE_URL}/ads.txt" || true)"
home_code="$(curl -sS -o "$tmp/home" -w '%{http_code}' "${BASE_URL}/" || true)"

echo "Homepage: ${home_code}"
echo "Health:   ${health_code}"
echo "ads.txt:  ${ads_code}"

if [[ "$health_code" == "404" ]]; then
  echo
  echo "STALE DEPLOYMENT: /api/health is not present on the live container."
  echo "Redeploy the newest main commit in Coolify, then rerun this script."
  exit 2
fi

[[ "$home_code" == "200" ]] || { echo "FAIL: homepage did not return 200"; exit 1; }
[[ "$health_code" == "200" ]] || { echo "FAIL: health endpoint did not return 200"; cat "$tmp/health"; exit 1; }
[[ "$ads_code" == "200" ]] || { echo "FAIL: ads.txt did not return 200"; cat "$tmp/ads"; exit 1; }

grep -q '"ok":true' "$tmp/health" || { echo "FAIL: health response is not healthy"; cat "$tmp/health"; exit 1; }
grep -q 'pub-3618932262167305' "$tmp/ads" || { echo "FAIL: ads.txt publisher authorization missing"; cat "$tmp/ads"; exit 1; }
grep -q 'ca-pub-3618932262167305' "$tmp/home" || { echo "FAIL: AdSense publisher missing from homepage source"; exit 1; }

echo
echo "PASS: production is serving the engineered release with AdSense authorization."
