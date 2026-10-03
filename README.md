# SCA Elementary PE Playbook (Grades 1–6)

Static website of 30-minute PE lessons for Alberta Grades 1–6.
Live: https://scaemrfung.github.io/pe-playbook/

Open `index.html` in a browser. No install needed.

The homepage is a **This week** page: this week's plan download, this week's lesson links and the New Games added this week (all follow today's date, with a warning if `weekly-plans-data.js` has no plan for the week). The 10-month Year map sits below it, collapsed.

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

Catch-up weeks (Dec 14, Feb 1, Jun 21) add no lesson to the lesson count, but keep the lesson set listed in `PE_WEEKS` as the suggested plan; the month page notes this. Week numbers in messages are school-week numbers (Week 5 = Sept 28–Oct 1).

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


**Standing rules (Oct 3, 2026).** New games are added only to New Games, never to Big-Group Games. The page shows "Last updated", a "Newly added" box and a short history by date. Every game has a `suggestedMonth`, and the page can be viewed by week added, by type (`?view=type`) or by month (`?view=month`). Games added by hand between Monday updates live in the updater's `manual.json` (kept with the updater, not in this repo) and are never flagged as removed. Same or close matches on Big-Group Games, Warm Up Games or Dodgeball are left off and listed in `dedupe.json`.

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

**Standing rule (Oct 3, 2026): no weekly rubric panel on the Outcomes page.** `outcomes.html` carries only the monthly rubric/assessment content (the `#month-assessment` panel, built from `outcomes-data.js`). Do not add a "Weekly rubrics by month" panel, `#weekly-rubrics` / `#football-week-6` anchors, a `rubric:` field or "Weekly rubric for this week" link in `weekly-plans-data.js`, or a "Weekly rubrics" link in the month-page rubric line (`tools/build.js`). The weekly-plan updater only adds the plan entry and its `.docx`.

**Fitness checklist PDF.** `Monthly_Fitness_Checklist_Grades_1-6.pdf` is generated from the `MONTHS` array in `fitness.html` by `python3 tools/fitness-pdf.py` (needs reportlab + node). After editing the fitness page, rerun it and commit the PDF.


## Navigation, names and page map (Oct 2026)

Top nav (from `NAV` in `chrome.js`, six items): **This week** (`index.html`) · **Games** (`games-hub.html`) · **Plans** (`weekly-plans.html`) · **Month** (opens the current month) · **Outcomes** (`outcomes.html`) · **More** (`more.html`).
Section menus (`SUBNAV` in `chrome.js`) show under the active item, with no dropdowns or JavaScript needed to read them:

- Games: Big-Group Games (`games.html`) · New Games (`new-games.html`) · Warm Up Games (`warmup-nogym.html`) · Dodgeball (`dodgeball.html`)
- Plans: Weekly plans · Downloads (`downloads.html`)
- Outcomes: Outcomes · Sample rubric (`rubric.html`)
- More: Gymnastics · Track Day · Fitness · How to teach · Indigenous games (`indigenous.html`)

Names used everywhere: **This week**, **Year map** (the 10-month grid), **Outcomes** (Alberta PEW is the curriculum, not a page name), **How to teach**, **Warm Up Games**, **Dodgeball**, **Weekly plans**. Old pages and `#anchors` all still work (`videos.html` and `large-group-pe-games.html` redirect to `games.html`).

## Site search

The search box in the top bar (and `search.html?q=…`) finds games on Big-Group, New, Warm Up and Dodgeball with a page badge. It reads `search-index.js`, a small generated list of `[title, page, anchor, other names]` (about 20 KB). It is loaded the first time someone uses the box, so the big data files are never loaded just to search. `node tools/build.js` regenerates it; it includes old (renamed) names and "also called" names.

## One game, one page (de-duplication)

`game-homes.js` says where a game lives when its title is on more than one page. Today the 9 dodgeball variants live on Dodgeball and 4 warm-ups (Tail Tag, Aces, Chuck the Chicken, Musical Hoops) on Warm Up Games. On Big-Group Games those titles are short "see this page" link cards, and the `#anchor` still works. Month pages and the search link straight to the home page. To move another game, add it to `game-homes.js` (key = the Big-Group card anchor) and run `node tools/build.js`.
The build also prints a warning for any title that still has a full card on more than one page (warning only, never fails). New games go only on New Games; if one matches a game elsewhere, the warning is the reminder to record it in the updater's `dedupe.json`.

## Big-Group Games on a phone

Under 700 px wide, each card shows the title plus a one-line summary; tap to open the full card (the "Open card / Close" button or the title). Month/Type filters and the jump list stay (the jump list starts closed on a phone), and a floating **↑ Top / Filters** button appears once you scroll. Deep links such as `games.html#hoop-hut`, renamed (old) anchors and "also called" anchors open the card they point to. Printing always prints the full cards. (The old per-card "Print this game" button was removed on purpose in Sept 2026 and was not brought back.)

## Downloads and printing

`downloads.html` lists the current week's plan, every weekly plan, the fitness PDF, the gymnastics files and the Track Day booklet. Files stay where they are (GitHub Pages cannot redirect files, so moving them would break old links). Month pages load `print.css` for a clean printout (no menus, lessons and table rows kept together).

## Upkeep: one command

    npm run weekly        # same as: sh tools/weekly.sh   (add --links for a link/anchor crawl)

It runs `node tools/build.js`, `node tools/build.js --check`, rebuilds the fitness PDF only when the `MONTHS` list in `fitness.html` changed (hash kept in `tools/fitness-pdf.sha1`), optionally `python3 tools/check-links.py` (needs playwright + Chrome; crawls every page, link and anchor), and finally `sh tools/bake-updated.sh` (the "Updated" stamp). Run it right before committing. Optional: a GitHub Action that runs `node tools/build.js --check` on every push (`.github/workflows/check.yml`; it needs a token with the `workflow` scope to add, so it is not installed yet — see the workflow text in `tools/check-workflow.yml.txt`).
The New Games updater (`update.py`, `renames.py`, `details.json`, `dedupe.json`, `manual.json`) lives on the box in `/workspace/pe-newgames`, not in this repo, because it keeps its own state (history, snapshots, last-run). It calls `node tools/build.js` for you.

## Load weight: fonts, data files, cache busters
- **Fonts are self-hosted** in `fonts/` (Figtree, Figtree italic, and a small Newsreader subset; Latin characters only) and declared at the top of `styles.css`. There is no Google Fonts request any more. Characters outside Latin fall back to the system font.
- **Big data files load only where needed:** `games.html` (Big-Group) loads `games-data.js`, `game-extras.js`, `data.js` and friends; `new-games.html` loads `new-games-data.js`; Indigenous games loads `youtube-data.js`. Every other page (This week, Games hub, month pages, Downloads, More, search) avoids them. Search uses the small generated `search-index.js`.
- **Cache busters:** `node tools/build.js` adds `?v=<hash of the file>` to every local `<script>` and stylesheet link in every page, so visitors get new code right after a deploy. (The "Updated" stamp in `chrome.js` is left out of its hash, so baking the stamp never makes `--check` fail.) If you edit a script or `styles.css`, just run the build again.
- `new-games.html` still carries a baked copy of the list as well as `new-games-data.js`. That copy is what shows with JavaScript off and is written by the New Games updater, so it is left alone on purpose.
