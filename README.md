# SCA Elementary PE Playbook (Grades 1–6)

Static website of 30-minute PE lessons for Alberta Grades 1–6.
Live: https://scaemrfung.github.io/pe-playbook/

Open `index.html` in a browser. No install needed.

Includes the year plan, games library, dodgeball (stay-in), demo videos,
PEW outcomes, monthly fitness checklist, Track Day event sheet, and the
PHYSEDGAMES large-group handbook (`large-group-pe-games.html`).

## Yearly review (one file)

All year-specific dates (Terry Fox run, first day, Truth and Reconciliation
Day, Track Day…) live in **`school-year.js`**. Lesson text in `data.js` uses
tokens such as `{{terryFox}}` that are filled from that file. Each August:

1. Edit `school-year.js`.
2. Run `node tools/build.js`.
3. Commit.

Weekly plans (`weekly-plans-data.js`) are dated on purpose — they are a record
of each week's plan.

## Build step (month pages)

The month pages (`month-september.html` … `month-june.html`) are pre-rendered
from the data files so they load fast and work with JavaScript turned off.
After editing `data.js`, any game data file, `school-year.js`, the NAV/MONTHS
list at the top of `chrome.js`, or `tools/month.template.html`, run:

```
node tools/build.js          # regenerate
node tools/build.js --check  # verify nothing is out of date
```

The build also writes `month.html` (old `month.html?m=…` links redirect),
`months-index.js`, the homepage month grid, and the same `<nav>` into every
page (from the `NAV` list in `chrome.js`).

Month pages accept `?grade=1`…`6` (or `?grade=all`) to show one grade band's
differentiation. The homepage picks “This month” from today's date
(Mountain Time); test another date with `?today=2026-10-05`.
