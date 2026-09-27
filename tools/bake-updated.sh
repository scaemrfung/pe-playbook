#!/bin/sh
# Bake the "Updated … MT" stamp: sets SITE_UPDATED in chrome.js to the current time (UTC).
# Run just before committing:  sh tools/bake-updated.sh && git add chrome.js
cd "$(dirname "$0")/.." || exit 1
now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
sed -E "s/(SITE_UPDATED = \")[^\"]*(\")/\1$now\2/" chrome.js > chrome.js.tmp && mv chrome.js.tmp chrome.js
grep -q "SITE_UPDATED = \"$now\"" chrome.js && echo "Stamp baked: $now"
