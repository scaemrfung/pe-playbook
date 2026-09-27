# SCA Elementary PE Playbook (Grades 1–6)

Static website of 30-minute PE lessons for Alberta Grades 1–6.
Live: https://scaemrfung.github.io/pe-playbook/

Open `index.html` in a browser. No install needed.

Includes the year plan, Big-Group Games, New Games, dodgeball (stay-in), per-card demo videos,
PEW outcomes, monthly fitness checklist, and Track Day event sheet. The 67
PHYSEDGAMES large-group games are Big-Group Games page cards (`physedgames-games.js`:
new cards in `PEG_DETAILS`, and every original entry in `PEG_HANDBOOK`, shown
as a “From PHYSEDGAMES” box on the card that holds it). The old handbook page
was retired in Sep 2026; `large-group-pe-games.html` now redirects to `games.html`.

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

## New Games This Week (`new-games.html`)

Shows the games PE Game Ideas added to the **PE Games Library** doc this week
(Drive: My Drive/SCAE/2026-2027/PE Weekly Plan/PE Games Library.docx), then
every game with a how-to card, suggested unit and grade band, and an archive
grouped by week.

- Data: `new-games-data.js` (generated). Renderer: `new-games.js` (the same
  code bakes the no-JS copy between the `newgames:start/end` markers in
  `new-games.html`).
- Weekly update: run the update script (`update.py`, kept on the box in
  `/workspace/pe-newgames`) on the new docx. It diffs the doc against
  `new-games-data.js`, files new games under that Monday's week, and rewrites
  only `new-games-data.js` and the baked block in `new-games.html`.
- Dedupe: New Games lists only games that are NOT already on the Big-Group
  Games page (`games.html`). The update script leaves out every library game
  named in its exclusion list (`dedupe.json`, same game or a clearly similar
  variant) and any game whose name matches a Big-Group Games card or aka.
  Games there keep one card, on the Big-Group Games page.
- Card layout = the full Big-Group Games card (same elements and order as
  Everybody's It): head + type pill, When/Slot/grouping, purpose, Equipment,
  Set-up, How we play, If this happens, How a round ends, Cues, Variations,
  Teaching tips, Video, More details, Alberta PEW outcomes (the site's 7 codes),
  Grades 1–2 / 3–4 / 5–6, Safety, Source. It lives in `new-games.js`; the
  generator fills the extra fields by game type from `card-templates.json`
  (per-game overrides in `details.json`), so every weekly rebuild keeps them.

## Renamed games (Sep 2026)

Some game names were changed because they were culturally insensitive or ableist
(e.g. Chinese Wall -> Castle Wall, Hula Hut -> Hoop Hut, Ultimate Warriors ->
Three-Court Dodgeball, Crazy Beans -> Jumping Beans). The map lives at the top of
`chrome.js` (`window.RENAMED_GAMES` + old anchor ids). Old `#anchors` redirect to
the new card, and the searches still find a game by its old name. The New Games
updater (on the box) maps old names in the library doc to the new ones.

## Video links (Videos page retired Sep 2026)

The Videos page was removed. `videos.html` is now a tiny redirect to
`games.html` so old links don't 404. Every game card keeps its own video links.

- `node tools/build.js` still writes `videos-data.js` (via `tools/videos.js`).
  It indexes every video linked on the site, and no page loads it; it is only
  used for link checks.
- Link checks: `node tools/check-videos.js` (all) or `--new` (only unseen
  videos) calls YouTube oEmbed and records title/status in
  `videos-meta.json`. Replace a broken link in its source only with a verified
  working video and log it under `replacements` in `videos-meta.json`.

## "Updated" stamp and "Mr. Fung's sites" footer

`chrome.js` adds the "Updated … MT" stamp and the shared "Mr. Fung's sites" footer to every page. The date is baked into `chrome.js` (`SITE_UPDATED`), so pages make no GitHub API calls. Before committing a change, run:

    sh tools/bake-updated.sh && git add chrome.js

The footer never links to Sub Day Plans.
