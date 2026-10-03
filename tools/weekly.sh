#!/bin/sh
# One command for the routine upkeep:  sh tools/weekly.sh   (or: npm run weekly)
#   1. node tools/build.js            regenerate month pages, nav, indexes, counts
#   2. node tools/build.js --check    make sure nothing is out of date
#   3. fitness PDF                    rebuilt only if the MONTHS list in fitness.html changed
#   4. (optional) --links             crawl the site for broken links/anchors (needs playwright + Chrome)
#   5. sh tools/bake-updated.sh       stamp the "Updated … MT" time (always last, right before committing)
# Then:  git add -A && git commit -m "..." && git pull --rebase origin main && sh tools/weekly.sh && git push
set -e
cd "$(dirname "$0")/.."

echo "== build"
node tools/build.js
echo "== build --check"
node tools/build.js --check

echo "== fitness PDF"
HASH=$(node -e '
const s=require("fs").readFileSync("fitness.html","utf8");
const m=/const MONTHS = (\[[\s\S]*?\n    \]);/.exec(s);
if(!m){console.error("MONTHS list not found in fitness.html");process.exit(1)}
console.log(require("crypto").createHash("sha1").update(m[1]).digest("hex"))')
if [ "$HASH" != "$(cat tools/fitness-pdf.sha1 2>/dev/null)" ]; then
  echo "fitness.html months changed -> rebuilding Monthly_Fitness_Checklist_Grades_1-6.pdf"
  python3 tools/fitness-pdf.py
  echo "$HASH" > tools/fitness-pdf.sha1
else
  echo "fitness PDF is up to date"
fi

if [ "$1" = "--links" ]; then
  echo "== link check"
  python3 tools/check-links.py
fi

echo "== bake Updated stamp"
sh tools/bake-updated.sh
echo "Done. Review with: git status"
