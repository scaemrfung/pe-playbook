#!/usr/bin/env node
/*
 * PE Playbook static build — no dependencies, Node 16+.
 *
 *   node tools/build.js          write generated files
 *   node tools/build.js --check  exit 1 if any generated file is out of date
 *
 * What it does
 *   1. Pre-renders one static page per school month (month-september.html …
 *      month-june.html) from data.js + the game/outcome data files, so month
 *      pages need no big data scripts and work with JavaScript turned off.
 *   2. Writes month.html (legacy ?m= links redirect to the static pages;
 *      without JS it is a plain list of months).
 *   3. Writes months-index.js (small month summary used by the homepage).
 *   4. Bakes the homepage month grid + default "This month" box into index.html.
 *   5. Rewrites the static <nav> in every page from the NAV list in chrome.js,
 *      so every page has the same nav with or without JavaScript.
 *
 * Year-specific dates come from school-year.js ({{tokens}} in data.js).
 * Re-run after editing data.js, the game data files, chrome.js NAV/MONTHS,
 * school-year.js or tools/month.template.html.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const CHECK = process.argv.includes("--check");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// ---------------------------------------------------------------- data load
const DATA_FILES = [
  "school-year.js", "data.js", "games-data.js", "outcomes-data.js", "lesson-outcomes.js",
  "game-extras.js", "k2-games.js", "g36-games.js", "skill-pack.js", "big-group.js",
  "daly-games.js", "daly-month-games.js", "physedgames-games.js",
];
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of DATA_FILES) vm.runInContext(read(f), sandbox, { filename: f });
for (const f of ["new-games-data.js", "weekly-plans-data.js", "dodgeball-data.js", "warmup-nogym-data.js", "game-homes.js"]) if (fs.existsSync(path.join(ROOT, f))) vm.runInContext(read(f), sandbox, { filename: f });
const W = sandbox;
const SY = W.SCHOOL_YEAR;
const fill = (s) => SY.fill(s);

// NAV + MONTHS come from chrome.js (SITE:START … SITE:END)
const chromeSrc = read("chrome.js");
const siteBlock = /\/\* SITE:START[\s\S]*?\*\/([\s\S]*?)\/\* SITE:END \*\//.exec(chromeSrc);
if (!siteBlock) throw new Error("chrome.js is missing the SITE:START/SITE:END block");
const SITE = vm.runInNewContext(siteBlock[1] + "\n;({ MONTHS, NAV, SUBNAV })");
const THEME = Object.fromEntries(SITE.MONTHS.map(([n, s]) => [n, s]));

const { months, MONTH_GAMES } = W.PE;
const UNIT = W.UNIT_OUTCOMES || {};
const LO = W.LESSON_OUTCOMES || {};
const EXTRAS = W.GAME_EXTRAS || {};
const K2M = W.K2_MONTH_GAMES || {};
const G36M = W.G36_MONTH_GAMES || {};
const SKILLM = W.SKILL_MONTH_GAMES || {};
const BG30 = W.BG30_MONTH || {};

const monthFile = (name) => `month-${name.toLowerCase()}.html`;
const gslug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (s) => String(s || "").replace(/<[^>]+>/g, "");

// ------------------------------------------------ helpers ported from app.js
/** Stable 2–3 look-fors for the month table. Full list stays on the game card. */
function pickMonthOutcomes(list, seed) {
  const src = (list || []).filter((it) => it && it.look);
  if (src.length <= 3) return src;
  let h = 2166136261;
  const key = String(seed || "");
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const copy = src.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
  }
  const n = 2 + (h % 2);
  return copy.slice(0, Math.min(n, copy.length));
}

const ALIASES = {
  "Red Light, Green Light": "Traffic Lights (kick)", "Red Light": "Traffic Lights (kick)",
  "Pac-Man": "Line Tag / Pac-Man", "Line Tag": "Line Tag / Pac-Man",
  "Sharks and Minnows": "Sharks and Dolphins",
  "Captain’s Coming": "Captain’s Deck / Shipwreck", "Captain's Coming": "Captain’s Deck / Shipwreck",
  "Shipwreck": "Captain’s Deck / Shipwreck", "Captain’s Deck": "Captain’s Deck / Shipwreck",
  "Freeze Tag": "Frozen Tag", "Newcomb": "FLY BACK", "Kickball": "Continuous Kick Ball",
  "Continuous Kickball": "Continuous Kick Ball", "Beat Ball": "Beat Ball / Beat the Ball",
  "End-zone catch": "End Zone Ball", "End-zone beanbag": "End Zone Ball",
  "Clean Your Room": "Clean Your Room", "Rob the Nest": "Rob the Nest (dribble)",
  "Robin’s Nest": "Robin’s Nest", "Four Corner Flags": "Four Corner Flags",
  "Capture the Flag": "Four Corner Flags",
  "Parachute popcorn": "Parachute popcorn / dome / cat-and-mouse",
  "parachute popcorn": "Parachute popcorn / dome / cat-and-mouse",
  "Helicopter": "Helicopter / Snake rope", "Snake rope": "Helicopter / Snake rope",
  "Tripod Tag": "Tripod Tag", "Human Bop-It": "Human Bop-It", "Video Game": "Video Game",
  "Chuck the Chicken": "Chuck the Chicken", "Wall Soccer": "Wall Soccer", "Skittles": "Skittles",
  "Hospital Tag": "Hospital Tag", "Hot Dog Tag": "Hot Dog Tag", "Blob Tag": "Blob Tag",
  "Octopus": "Octopus", "Sharks and Dolphins": "Sharks and Dolphins",
};
const DETAILS = [].concat(W.GAME_DETAILS || [], W.K2_DETAILS || [], W.G36_DETAILS || [], W.SKILL_DETAILS || [], W.BG30_DETAILS || [], W.DALY_DETAILS || [], W.PEG_DETAILS || []);
const NAMES = new Set(Object.keys(EXTRAS));
DETAILS.forEach((g) => { if (g && g.name) NAMES.add(g.name); });
const DETAIL_BY_NAME = {};
DETAILS.forEach((g) => {
  if (g && g.name && !DETAIL_BY_NAME[g.name.toLowerCase()]) DETAIL_BY_NAME[g.name.toLowerCase()] = g;
});
function detailFor(name) {
  const k = String(name).toLowerCase();
  if (DETAIL_BY_NAME[k]) return DETAIL_BY_NAME[k];
  const alias = ALIASES[name];
  if (alias && DETAIL_BY_NAME[alias.toLowerCase()]) return DETAIL_BY_NAME[alias.toLowerCase()];
  return null;
}

const HOMES = W.GAME_HOMES || {};
/** Link to a game's page: its home page if the Big-Group card is only a "see this page" card. */
const HOME_BY_AKA = {};
DETAILS.forEach((g) => {
  if (!g || !g.name || !HOMES[gslug(g.name)]) return;
  [].concat(g.aka || [], (EXTRAS[g.name] || {}).aka || []).forEach((a) => { HOME_BY_AKA[gslug(a)] = HOMES[gslug(g.name)]; });
});
function gameHref(name) {
  const sl = gslug(name), h = HOMES[sl] || HOME_BY_AKA[sl];
  return h ? `${h.page}#${h.anchor}` : `games.html#${sl}`;
}
function linkGameText(text) {
  if (!text) return text;
  const keys = [];
  NAMES.forEach((n) => keys.push([n, n]));
  Object.keys(ALIASES).forEach((a) => keys.push([a, ALIASES[a]]));
  keys.sort((a, b) => b[0].length - a[0].length);
  let out = text;
  const used = [];
  keys.forEach(([label, target]) => {
    if (!NAMES.has(target) && target !== label) {
      if (!EXTRAS[target] && !NAMES.has(target)) return;
    }
    const slug = gslug(target);
    const re = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, (m) => {
      if (used.some((u) => m.toLowerCase().indexOf(u) >= 0 || u.indexOf(m.toLowerCase()) >= 0)) return m;
      if (/href=/.test(out.slice(Math.max(0, out.indexOf(m) - 40), out.indexOf(m)))) return m;
      used.push(m.toLowerCase());
      return `<a href="${gameHref(target)}">${m}</a>`;
    });
  });
  return out;
}

const ALL_BANK_ROWS = new Map(); // game name -> its [name, "", "how we run it"] row from any month's bank
[MONTH_GAMES, K2M, G36M, SKILLM, BG30].forEach((bk) => Object.keys(bk || {}).forEach((mn) => (bk[mn] || []).forEach((r) => { if (r && r[0] && !ALL_BANK_ROWS.has(r[0])) ALL_BANK_ROWS.set(r[0], r); })));
function monthBank(name) {
  const all = [].concat(MONTH_GAMES[name] || [], K2M[name] || [], G36M[name] || [], SKILLM[name] || [], BG30[name] || []);
  return all;
}


// ---------------------------------------------------- month-games.json + lesson links
/* month-games.json: the (up to) 15 Big-Group games each month page lists, chosen as the best fit for the month's
   lessons. The full list stays on the Big-Group Games page. Edit that file, then run node tools/build.js. */
const MONTH_GAMES_MAX = 15;
const MONTH_PICKS = JSON.parse(read("month-games.json"));
const warnings = [];
const BG_NAMES_ALL = [];
{ const seen = new Set(); []
  .concat(W.GAME_DETAILS || [], W.K2_DETAILS || [], W.G36_DETAILS || [], W.SKILL_DETAILS || [], W.BG30_DETAILS || [], W.PEG_DETAILS || [])
  .forEach((g) => { if (g && g.name && !seen.has(g.name)) { seen.add(g.name); BG_NAMES_ALL.push(g); } }); }
const PEG_GAMES = (W.PEG_HANDBOOK && W.PEG_HANDBOOK.games) || [];
// every anchor that exists on each games page (id, "also called" names, handbook names, link-card ids)
const ANCHORS = { "games.html": new Set(), "warmup-nogym.html": new Set(), "dodgeball.html": new Set(), "new-games.html": new Set() };
BG_NAMES_ALL.forEach((g) => {
  ANCHORS["games.html"].add(gslug(g.name));
  [].concat(g.aka || [], (EXTRAS[g.name] || {}).aka || []).forEach((a) => ANCHORS["games.html"].add(gslug(a)));
});
PEG_GAMES.forEach((h) => ANCHORS["games.html"].add(gslug(h.name)));
(W.WARMUP_NOGYM_GAMES || []).forEach((g) => ANCHORS["warmup-nogym.html"].add(gslug(g.title)));
(W.DODGE_GAMES || []).forEach((g) => ANCHORS["dodgeball.html"].add(g.slug));
((W.NEW_GAMES && W.NEW_GAMES.games) || []).forEach((g) => ANCHORS["new-games.html"].add(g.id));
// anchor -> the card that owns it (so "Four Corners Stay-In" and "Four Corners" count as one game)
const ANCHOR_CARD = {};
BG_NAMES_ALL.forEach((g) => { [].concat(g.aka || [], (EXTRAS[g.name] || {}).aka || []).forEach((a) => { if (!ANCHORS["games.html"].has(gslug(a)) || true) ANCHOR_CARD[gslug(a)] = ANCHOR_CARD[gslug(a)] || gslug(g.name); }); });
BG_NAMES_ALL.forEach((g) => { ANCHOR_CARD[gslug(g.name)] = gslug(g.name); }); // a card's own name always wins
PEG_GAMES.forEach((h) => { if (!ANCHOR_CARD[gslug(h.name)]) ANCHOR_CARD[gslug(h.name)] = gslug(h.card); });
const canon = (href) => { const [pg, a] = href.split("#"); return pg === "games.html" && ANCHOR_CARD[a] ? `${pg}#${ANCHOR_CARD[a]}` : href; };
const anchorOk = (href) => { const [pg, a] = href.split("#"); return !ANCHORS[pg] || ANCHORS[pg].has(a); };

/* Every game title a lesson can mention -> where its card is (Big-Group card, or the home page for
   Warm Up Games / Dodgeball / New Games). Used to link each mention inside a lesson. */
const MENTION_SKIP = new Set([ // too generic to link when it appears in ordinary lesson sentences
  "pulse", "switch", "popcorn", "circle hoop", "hoop relay", "around-the-gym", "animals", "octopus", "volcanoes",
]);
const MENTIONS = new Map(); // lowercase title -> { name, href }
function addMention(t, href) {
  t = String(t || "").trim();
  if (t.length < 4 || MENTION_SKIP.has(t.toLowerCase()) || MENTIONS.has(t.toLowerCase())) return;
  MENTIONS.set(t.toLowerCase(), { name: t, href });
}
// Plain-English mentions in lessons that name a game on another page / under another name
addMention("Jail-catch", "dodgeball.html#prison");
addMention("Lily-pad hoop jumps", "games.html#frogs-on-the-lily-pads");
// order = priority when two titles are the same word(s)
BG_NAMES_ALL.forEach((g) => { addMention(g.name, gameHref(g.name)); [].concat(g.aka || [], (EXTRAS[g.name] || {}).aka || []).forEach((a) => addMention(a, gameHref(g.name))); });
PEG_GAMES.forEach((h) => addMention(h.name, `games.html#${gslug(h.card)}`));
(W.WARMUP_NOGYM_GAMES || []).forEach((g) => addMention(g.title, `warmup-nogym.html#${gslug(g.title)}`));
(W.DODGE_GAMES || []).forEach((g) => addMention(g.name, `dodgeball.html#${g.slug}`));
((W.NEW_GAMES && W.NEW_GAMES.games) || []).forEach((g) => addMention(g.name, `new-games.html#${g.id}`));
Object.keys(ALIASES).forEach((a) => addMention(a, gameHref(ALIASES[a])));
[MONTH_GAMES, K2M, G36M, SKILLM, BG30].forEach((bk) => Object.keys(bk || {}).forEach((mn) => (bk[mn] || []).forEach((r) => { if (r && r[0]) addMention(r[0], gameHref(r[0])); })));
const MENTION_KEYS = [...MENTIONS.keys()].sort((a, b) => b.length - a.length);
const MENTION_RE = new RegExp("(^|[^A-Za-z0-9])(" + MENTION_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[’']/g, "[’']")).join("|") + ")(?![A-Za-z0-9])", "gi");
function mentionFor(text) {
  const k = text.toLowerCase();
  return MENTIONS.get(k) || MENTIONS.get(k.replace(/'/g, "’")) || MENTIONS.get(k.replace(/’/g, "'"));
}
/** Link every game title in a lesson row that is not already a link (first mention of each game). */
function autoLinkMentions(html, found) {
  return String(html).split(/(<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>)/).map((part, i) => {
    if (i % 2 === 1) { // tag or existing link: remember which targets are already linked in this row
      const m = /^<a\b[^>]*href="([^"]+)"/.exec(part);
      if (m) found.add(canon(m[1]));
      return part;
    }
    return part.replace(MENTION_RE, (all, pre, title) => {
      const e = mentionFor(title);
      if (!e || found.has(canon(e.href))) return all;
      found.add(canon(e.href));
      return `${pre}<a href="${e.href}">${title}</a>`;
    });
  }).join("");
}
function rowLinks(html) { const s = new Set(); String(html).replace(/<a\b[^>]*href="([^"]+)"/g, (m, h) => { s.add(canon(h)); return m; }); return s; }

const BANDS = [["g12", "1–2"], ["g34", "3–4"], ["g56", "5–6"]];
function bandSpans(obj, sep) {
  return BANDS.map(([k, label]) =>
    `<span class="band" data-band="${k}"><strong>${label}:</strong> ${fill(obj[k] || "") || "—"}</span>`
  ).join(sep);
}

function outcomesBlock(name) {
  const u = UNIT[name];
  if (!u) return "";
  return `<div class="panel outcomes">
      <h2>Outcomes and assessment</h2>
      <p class="meta"><strong>Alberta PEW organizing ideas:</strong> ${u.oi.join(" · ")}</p>
      <p>${u.why}</p>
      <div class="out-grid">
        <div data-band="g12"><h3>Grades 1–2</h3><ul class="clean">${u.g12.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div data-band="g34"><h3>Grades 3–4</h3><ul class="clean">${u.g34.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div data-band="g56"><h3>Grades 5–6</h3><ul class="clean">${u.g56.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
      <h3>How you might assess this month</h3>
      <table class="games">
        <thead><tr><th>What</th><th>How</th><th>Look-for / evidence</th></tr></thead>
        <tbody>${u.assess.map((a) => `<tr><td><strong>${a.what}</strong></td><td>${a.how}</td><td>${a.evidence}</td></tr>`).join("")}</tbody>
      </table>
      <p class="meta no-print"><a href="outcomes.html?month=${name}#month-assessment">${name} rubric (K–2 and 3–6)</a> · <a href="rubric.html">Sample rubric and comment stems</a></p>
      <p class="note">Outcomes follow Physical Education and Wellness K–6 (LearnAlberta, current curriculum). Match report-card comments to the learning outcome on LearnAlberta. Do not rank fitness scores.</p>
    </div>`;
}

function gradePicker(m) {
  const opts = [["all", "All grades"], ["1", "G1"], ["2", "G2"], ["3", "G3"], ["4", "G4"], ["5", "G5"], ["6", "G6"]];
  return `<div class="grade-picker no-print" id="grade-picker" hidden>
        <p class="meta grade-picker-label" id="grade-picker-label">Show differentiation for</p>
        <div class="filters" role="group" aria-labelledby="grade-picker-label">
          ${opts.map(([v, l]) => `<a href="${monthFile(m.name)}?grade=${v}" data-grade="${v}" role="button" aria-pressed="${v === "all"}">${l}</a>`).join("\n          ")}
        </div>
        <p class="meta grade-status" id="grade-status" aria-live="polite">Showing all grade bands (1–2 / 3–4 / 5–6).</p>
      </div>`;
}

/* "School weeks this month" — from the PE week plan in school-year.js.
   A week belongs to the month it starts in (Sept 28–Oct 1 is September W5). */
const PLAN = {};
months.forEach((mm) => mm.lessons.forEach((L) => { (PLAN[`${mm.name}-${L.w}`] = PLAN[`${mm.name}-${L.w}`] || []).push(L); }));
function schoolWeeks(name) {
  if (!SY.peWeeksForMonth) return "";
  const list = SY.peWeeksForMonth(name);
  if (!list.length) return "";
  const li = list.map((x) => {
    const label = `<a href="#week-${x.w}">Week ${x.schoolWeek}${x.theme ? " · " + x.theme : ""}</a>`;
    const bits = [`${x.month} W${x.w}`, x.startup ? "start-up" : "", x.note, x.planNote].filter(Boolean).join(" · ");
    return `<li data-school-week="${x.schoolWeek}" data-start="${x.start}" data-end="${x.end}"><strong>${label}</strong> · ${x.range}${bits ? ` <span class="meta">(${bits})</span>` : ""}</li>`;
  }).join("");
  // Lessons planned under this month but taught in a week that starts in another month.
  const away = SY.peWeekList().filter((x) => x.planMonth === name && x.month !== name);
  const awayNote = away.length ? `<p class="meta school-weeks-away">Also from ${name}'s lessons: ${away.map((x) =>
    `<a href="${monthFile(x.month)}#week-${x.w}">Week ${x.schoolWeek} (${x.range})</a> is on the ${x.month} page`).join("; ")}, because a week belongs to the month it starts in.</p>` : "";
  return `<div class="school-weeks" id="school-weeks"><p class="meta"><strong>School weeks this month (${SY.config.label}):</strong></p><ul class="clean">${li}</ul>${awayNote}</div>`;
}

/* Games each month page's lessons mention (after linking): month -> [{ lesson, href, title }] */
const LESSON_REFS = {};
function lessonCard(L, id, wlabel, planMonth, calW, pageMonth) {
  const link = (html, isGame) => {
    let h = isGame ? linkGameText(html) : html;
    h = autoLinkMentions(h, rowLinks(h));
    // record + verify: every game title still unlinked in this row, and every game link's target
    const plain = h.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, " ").replace(/<[^>]+>/g, " ");
    const have = rowLinks(h);
    plain.replace(MENTION_RE, (all, pre, t) => { const e = mentionFor(t); if (e && !have.has(canon(e.href))) warnings.push(`${pageMonth} ${id}: "${e.name}" is mentioned but not linked`); return all; });
    h.replace(/<a\b[^>]*href="([^"#]+#[^"]+)"[^>]*>([^<]*)<\/a>/g, (all, href, text) => {
      if (!ANCHORS[href.split("#")[0]]) return all;
      if (!anchorOk(href)) warnings.push(`${pageMonth} ${id}: link "${text}" -> ${href} has no matching game card`);
      (LESSON_REFS[pageMonth] = LESSON_REFS[pageMonth] || []).push({ lesson: id, href, title: text });
      return all;
    });
    return h;
  };
  const key = `${planMonth}-${L.w}-${L.c}`;
  const o = LO[key];
  const items = pickMonthOutcomes((o && o.items) || [], key);
  const outRow = items.length ? `<div class="row out"><div class="t">Outcomes</div>
            <div class="d">${items.map((it) => `<div><strong>${it.code}.</strong> ${it.look}</div>`).join("")}
            <span class="meta">PEW K–6 · LearnAlberta · 2–3 look-fors</span></div></div>` : "";
  return `<article class="lesson" id="${id}" data-week="${calW}">
        <div class="top"><h3>${wlabel} · C${L.c} — ${fill(L.title)}</h3><small>${fill(L.focus)}</small></div>
        <div class="rows">
          ${outRow}
          <div class="row"><div class="t">0–5</div><div class="d">${link(fill(L.wu))}</div></div>
          <div class="row"><div class="t">5–16</div><div class="d">${link(fill(L.skill))}</div></div>
          <div class="row game"><div class="t">16–25</div><div class="d">${link(fill(L.game), true)}</div></div>
          <div class="row"><div class="t">25–30</div><div class="d">${link(fill(L.cd))}</div></div>
          <div class="row bands"><div class="t"><span class="band-t-all">1–2 / 3–4 / 5–6</span><span class="band-t" data-for="g12">Grades 1–2</span><span class="band-t" data-for="g34">Grades 3–4</span><span class="band-t" data-for="g56">Grades 5–6</span></div>
            <div class="d">${bandSpans(L, '<span class="band-sep"> &nbsp;·&nbsp; </span>')}</div>
          </div>
        </div>
      </article>`;
}

/* Month page sections: one per school week that starts in this month (W1, W2, …),
   each with the lessons that week teaches, then any unscheduled extra sets. */
const WEEK_LESSONS = {}; // month page -> calendar week -> [[class, title]] (homepage "This week" links)
const LESSON_REF = {}; // "October-1-2" (plan month-week-class) -> where that lesson is on the site
const MONTHS_ORDER_IDX = (n) => months.findIndex((x) => x.name === n);
function monthSections(m) {
  const groups = [];
  SY.peWeeksForMonth(m.name).forEach((x) => {
    const g = groups[groups.length - 1];
    if (g && !x.startup && g.planMonth === x.planMonth && g.planW === x.planW) g.weeks.push(x);
    else groups.push({ planMonth: x.planMonth, planW: x.planW, startup: x.startup, weeks: [x] });
  });
  let html = "", count = 0;
  groups.forEach((g) => {
    const ws = g.weeks, first = ws[0];
    const name = "Week" + (ws.length > 1 ? "s " : " ") + ws.map((x) => x.schoolWeek).join(" + ") + (first.theme ? " · " + first.theme : "");
    const tag = `${m.name} W${ws.map((x) => x.w).join("–")}`;
    const from = !g.startup && g.planMonth !== m.name ? ` · lessons from the ${g.planMonth} plan` : "";
    const dates = ws.map((x) => x.range + (x.note ? " · " + x.note : "") + (x.planNote ? " · " + x.planNote : "")).join(" + ") + from;
    const aliases = ws.slice(1).map((x) => `<span id="week-${x.w}" class="anchor-alias"></span>`).join("");
    html += `<h2 class="week-title" id="week-${first.w}" data-week="${first.w}">${aliases}${name} <span class="plan-week">${tag}</span><span class="week-dates">${dates}</span></h2>`;
    if (g.startup) return;
    (PLAN[`${g.planMonth}-${g.planW}`] || []).forEach((L) => { count++;
      ((WEEK_LESSONS[m.name] = WEEK_LESSONS[m.name] || {})[first.w] = WEEK_LESSONS[m.name][first.w] || []).push([L.c, strip(fill(L.title))]);
      LESSON_REF[`${g.planMonth}-${g.planW}-${L.c}`] = { href: `${monthFile(m.name)}#w${first.w}-c${L.c}`, label: `${tag} (Week ${first.schoolWeek})`, month: m.name, order: MONTHS_ORDER_IDX(m.name) * 100 + first.w * 10 + L.c };
      html += lessonCard(L, `w${first.w}-c${L.c}`, `W${first.w}`, g.planMonth, first.w, m.name); });
  });
  SY.peExtras(m.name).forEach((ex) => {
    html += `<h2 class="week-title" id="extra-${ex.planW}" data-week="extra-${ex.planW}">Extra lessons <span class="plan-week">${m.name} · use any time</span><span class="week-dates extra">${ex.text}</span></h2>`;
    (PLAN[`${m.name}-${ex.planW}`] || []).forEach((L) => { count++;
      LESSON_REF[`${m.name}-${ex.planW}-${L.c}`] = { href: `${monthFile(m.name)}#x${ex.planW}-c${L.c}`, label: `${m.name} extra lessons`, month: m.name, order: MONTHS_ORDER_IDX(m.name) * 100 + 90 + L.c };
      html += lessonCard(L, `x${ex.planW}-c${L.c}`, "Extra", m.name, `extra-${ex.planW}`, m.name); });
  });
  return { html, count };
}

function renderMonth(m) {
  const bank = monthBank(m.name);
  const nav = months.map((x) =>
    `<a href="${monthFile(x.name)}" class="${x.name === m.name ? "active" : ""}"${x.name === m.name ? ' aria-current="page"' : ""}>${x.name.slice(0, 3)}</a>`
  ).join(" · ");
  let missingBands = 0;
  const sec = monthSections(m);
  const lessons = sec.html;

  // The games listed on the month page: month-games.json (max 15), in that order.
  const picks = MONTH_PICKS[m.name] || [];
  if (picks.length > MONTH_GAMES_MAX) warnings.push(`${m.name}: month-games.json lists ${picks.length} games (max ${MONTH_GAMES_MAX}); only the first ${MONTH_GAMES_MAX} are shown`);
  { const by = {}; picks.forEach((n) => { (by[canon(gameHref(n))] = by[canon(gameHref(n))] || []).push(n); });
    Object.values(by).filter((l) => l.length > 1).forEach((l) => warnings.push(`${m.name}: month-games.json lists the same game twice (${l.join(" = ")})`)); }
  const rowsSrc = picks.slice(0, MONTH_GAMES_MAX).map((n) => {
    const own = bank.find((r) => r && r[0] === n) || ALL_BANK_ROWS.get(n);
    if (!own) { const d = detailFor(n); return [n, "", d ? d.purpose || "" : ""]; }
    return own;
  });
  picks.forEach((n) => { if (!anchorOk(gameHref(n))) warnings.push(`${m.name}: month-games.json "${n}" has no game card (${gameHref(n)})`); });
  const rows = rowsSrc.map((r) => {
    const sl = gslug(r[0]);
    // a name folded into another card (e.g. Hot Dog Tag -> the Frozen Tag card) uses that card's notes when it has none of its own
    const cardName = (BG_NAMES_ALL.find((g) => gslug(g.name) === (canon(gameHref(r[0])).split("#")[1])) || {}).name;
    const x = EXTRAS[r[0]] || (cardName && EXTRAS[cardName]) || {};
    const picked = pickMonthOutcomes(x.outcomes || [], r[0]);
    const out = picked.map((it) => `<strong>${it.code}.</strong> ${it.look}`).join("<br>");
    let d = detailFor(r[0]);
    if (!(d && (d.g12 || d.g34 || d.g56)) && cardName) d = detailFor(cardName);
    let bands;
    if (d && (d.g12 || d.g34 || d.g56)) bands = bandSpans(d, "");
    else {
      missingBands++;
      bands = BANDS.map(([k]) => `<span class="band" data-band="${k}">No grade notes for this game yet — adjust pace, space and number of taggers.</span>`).join("");
    }
    return `<tr><td><strong><a href="${gameHref(r[0])}">${r[0]}</a></strong></td><td>${r[2]}</td><td class="bands-cell">${bands}</td><td>${out}</td></tr>`;
  });

  const content = `
      <div class="month-head">
        <p class="note month-nav">${nav}</p>
        <h1>${m.name}</h1>
        <p class="meta"><strong>Month focus:</strong> ${fill(m.guide)}</p>
        <p class="meta"><strong>Alberta PEW focus:</strong> ${fill(m.pew)}</p>
        <p class="meta"><strong>Equipment:</strong> ${fill(m.equipment)}</p>
        <p class="meta"><strong>Fitness update:</strong> ${fill(m.fitness)}</p>
        <p class="note">${fill(m.notes)}</p>
        ${schoolWeeks(m.name)}
      </div>
      <noscript><p class="note noscript-note">JavaScript is off, so the grade picker and sidebar are not available. Everything below is shown for all grade bands (1–2 / 3–4 / 5–6) and prints as-is.</p></noscript>
      ${gradePicker(m)}
      ${outcomesBlock(m.name)}
      <div class="clock">
        <div><b>0–5 min</b>Warm-up</div>
        <div><b>5–16 min</b>Skill / main</div>
        <div><b>16–25 min</b>Big-group game</div>
        <div><b>25–30 min</b>Cool-down</div>
      </div>
      <div class="panel" id="month-games">
        <h2>Big-group games this month</h2>
        <p class="note">${rows.length} games picked for this month\u2019s lessons. Any other game a lesson uses is linked to its card. These are the 30-minute classroom versions. Simplify for Grades 1–2: walk more, fewer taggers, skip grabbing games until Grade 3+. This table shows 2–3 look-fors per game. Open the game card for all seven PEW outcomes.</p>
        <div class="table-scroll">
        <table class="games">
          <thead><tr><th>Game</th><th>How we run it</th><th>By grade <span class="grade-th" id="grade-th">(1–2 / 3–4 / 5–6)</span></th><th>Outcomes</th></tr></thead>
          <tbody>
          ${rows.join("\n          ")}
          </tbody>
        </table>
        </div>
        <p class="meta see-all no-print"><a href="games.html?month=${m.name}">See all Big-Group games →</a></p>
      </div>
      ${lessons}
    `;
  return { content, games: rows.length, missingBands, lessons: sec.count };
}

// --------------------------------------------------------------- templates
/** Which top-nav item a page belongs to (same rules as groupKey() in chrome.js). */
function groupKey(f) {
  if (f === "index.html") return "index.html";
  if (/^month(-[a-z]+)?\.html$/.test(f)) return "month.html";
  if (f === "search.html") return "games-hub.html";
  for (const k of Object.keys(SITE.SUBNAV)) if (k === f || SITE.SUBNAV[k].some(([h]) => h === f)) return k;
  return SITE.NAV.some(([h]) => h === f) ? f : null;
}
function navHtml(file) {
  const g = groupKey(file);
  const items = SITE.NAV.map(([h, l]) =>
    `        <a ${h === g ? 'class="active" aria-current="page" ' : ""}href="${h}">${l}</a>`
  ).join("\n");
  const sub = g && SITE.SUBNAV[g];
  const subHtml = sub ? `\n      <nav aria-label="Section menu" class="subnav">\n${sub.map(([h, l]) =>
    `        <a ${h === file ? 'class="active" aria-current="page" ' : ""}href="${h}">${l}</a>`).join("\n")}\n      </nav>` : "";
  return `<nav aria-label="Site">\n${items}\n      </nav>${subHtml}`;
}
// tiny inline icon so browsers don't request a missing /favicon.ico (404 in the console)
const ICON_LINK = '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Ccircle cx=%2712%27 cy=%2712%27 r=%2711%27 fill=%27%231f6f4a%27/%3E%3Cpath d=%27M12 4v16M4 12h16%27 stroke=%27white%27 stroke-width=%271.6%27/%3E%3C/svg%3E" />';
const NOSCRIPT_NAV = "<noscript><style>header.site{display:block!important}</style></noscript>";
function withStaticNav(html, file) {
  html = html.replace(/(<header class="site">[\s\S]*?)<nav\b[^>]*>[\s\S]*?<\/nav>(\s*<nav\b[^>]*class="subnav"[^>]*>[\s\S]*?<\/nav>)?/, (m, pre) => pre + navHtml(file));
  html = html.replace(/<form class="site-search"[^>]*>/, '<form class="site-search" action="search.html" method="get" role="search">');
  if (!html.includes(NOSCRIPT_NAV)) html = html.replace("</head>", `  ${NOSCRIPT_NAV}\n</head>`);
  if (!/rel="icon"/.test(html)) html = html.replace("</head>", `  ${ICON_LINK}\n</head>`);
  return html;
}
const TEMPLATE = read("tools/month.template.html");
function page({ file, title, description, body, scripts }) {
  return withStaticNav(
    TEMPLATE.replace("{{TITLE}}", esc(title))
      .replace("{{DESCRIPTION}}", esc(description))
      .replace("{{CONTENT}}", body)
      .replace("{{SCRIPTS}}", scripts),
    file
  );
}

// ------------------------------------------------------------------ output
const outputs = {};
const report = [];
const GEN = "<!-- Generated by tools/build.js from data.js — edit the data, then run: node tools/build.js -->";

months.forEach((m) => {
  const r = renderMonth(m);
  const theme = THEME[m.name] || "";
  const desc = `${m.name} PE lessons (${theme}) for Alberta Grades 1–6: ${strip(fill(m.guide))}. ${r.games} big-group games with Grade 1–2, 3–4 and 5–6 differentiation.`;
  outputs[monthFile(m.name)] = page({
    file: monthFile(m.name),
    title: `${m.name}: ${theme} · SCA Elementary PE Playbook`,
    description: desc,
    body: `${GEN}\n    <div id="content" data-month="${m.name}">${r.content}</div>`,
    scripts: `<script src="school-year.js" defer></script>
  <script src="chrome.js" defer></script>
  <script src="month-page.js" defer></script>`,
  });
  report.push(`${monthFile(m.name)}: ${r.lessons} lessons, ${r.games} games (${r.missingBands} without band notes)`);
  {
    const listed = new Set((MONTH_PICKS[m.name] || []).slice(0, MONTH_GAMES_MAX).map((n) => canon(gameHref(n))));
    const extra = new Map();
    (LESSON_REFS[m.name] || []).forEach((x) => { if (!listed.has(canon(x.href)) && !extra.has(canon(x.href))) extra.set(canon(x.href), x.title); });
    report.push(`  ${m.name}: lessons also use ${extra.size} game(s) not in the list (each linked): ${[...extra.values()].join(", ")}`);
    if (process.env.DUMP_REFS) {
      const cnt = {};
      (LESSON_REFS[m.name] || []).forEach((x) => { cnt[x.href] = cnt[x.href] || { title: x.title, n: 0, lessons: new Set() }; cnt[x.href].n++; cnt[x.href].lessons.add(x.lesson); });
      (global.__refs = global.__refs || {})[m.name] = Object.entries(cnt).map(([h, v]) => [h, v.title, v.n, [...v.lessons]]);
    }
  }
});

// month.html — legacy router (?m=September&grade=4) + no-JS month list
outputs["month.html"] = page({
  file: "month.html",
  title: "Months · SCA Elementary PE Playbook",
  description: "Pick a month of Alberta Grades 1–6 PE lessons.",
  body: `${GEN}
    <div id="content">
      <h1>Months</h1>
      <p class="meta" id="month-redirect-note">Opening the month…</p>
      <noscript><p class="note">JavaScript is off. Pick a month:</p></noscript>
      <ul class="clean month-list">
${months.map((m) => `        <li><a href="${monthFile(m.name)}"><strong>${m.name}</strong> · ${THEME[m.name] || ""}</a> — ${fill(m.guide)}</li>`).join("\n")}
      </ul>
    </div>`,
  scripts: `<script src="school-year.js"></script>
  <script>
    (function () {
      var q = new URLSearchParams(location.search);
      var names = ${JSON.stringify(months.map((m) => m.name))};
      var want = (q.get("m") || "").toLowerCase();
      var name = names.find(function (n) { return n.toLowerCase() === want; });
      if (!name) name = window.SCHOOL_YEAR ? window.SCHOOL_YEAR.currentMonth().name : names[0];
      var out = new URLSearchParams();
      if (q.get("grade")) out.set("grade", q.get("grade"));
      if (q.get("today")) out.set("today", q.get("today"));
      var s = out.toString();
      location.replace("month-" + name.toLowerCase() + ".html" + (s ? "?" + s : "") + location.hash);
    })();
  </script>
  <script src="chrome.js" defer></script>`,
});

// months-index.js — tiny summary for the homepage
const summary = months.map((m) => ({
  name: m.name, file: monthFile(m.name), theme: THEME[m.name] || m.name,
  guide: fill(m.guide), lessons: m.lessons.length,
}));
// New Games added per week (key = the Monday), for the homepage "New games this week" box
const NEW_BY_WEEK = {};
((W.NEW_GAMES && W.NEW_GAMES.games) || []).forEach((g) => {
  if (!g.added || g.added === "baseline" || g.removedFromDoc) return;
  const wk = ((W.NEW_GAMES.weeks || []).find((x) => x.key === g.added) || {});
  (NEW_BY_WEEK[g.added] = NEW_BY_WEEK[g.added] || { label: wk.label || g.added, games: [] }).games.push([g.name, g.id]);
});
outputs["months-index.js"] = `/* Generated by tools/build.js — do not edit by hand. */\nwindow.PE_MONTHS = ${JSON.stringify(summary, null, 2)};\nwindow.PE_WEEK_LESSONS = ${JSON.stringify(WEEK_LESSONS)};\nwindow.PE_NEW_BY_WEEK = ${JSON.stringify(NEW_BY_WEEK)};\n`;

// index.html — bake month grid + default This-month box; static nav
const ICONS = {
  Soccer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
  Football: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M5 21V4h9l-1.5 4L14 12H5"/></svg>',
  Hockey: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 20h7l9-16"/><circle cx="6" cy="18" r="2"/></svg>',
  Games: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  Basketball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 3c2 3 2 15 0 18M3 12c3-2 15-2 18 0"/></svg>',
  Ropes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  Volleyball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M5 8c3 2 11 2 14 0M5 16c3-2 11-2 14 0"/></svg>',
  Gymnastics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="5" r="2"/><path d="M8 22l4-9 4 9M5 12h14"/></svg>',
  Track: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/></svg>',
  Baseball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 20V8l8-4 8 4v12"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>',
};
const grid = summary.map((m, i) => `        <a class="month-card" href="${m.file}">
          <div class="mc-top"><span class="mc-kicker">${String(i + 1).padStart(2, "0")} · ${m.name}</span><span class="mc-icon">${ICONS[m.theme] || ICONS.Soccer}</span></div>
          <h3>${m.theme}</h3>
          <p>${m.guide}</p>
          <span class="mc-go">${m.lessons} lessons →</span>
        </a>`).join("\n");
function between(html, name, inner) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing <!-- build:${name} --> markers`);
  return html.replace(re, (m, a, b) => `${a}\n${inner}\n        ${b}`);
}
const first = summary[0];
let index = read("index.html");
index = between(index, "months", grid);
index = between(index, "this-month", `        <h2 id="this-month-title">${first.name}: ${first.theme}</h2>
        <p id="this-month-guide">${first.guide}</p>
        <p class="note" id="this-month-note" hidden></p>`);
// static fallback for the "What's New This Week" box: the newest posted plan (home.js picks the current week's)
const PLANS = (W.WEEKLY_PLANS || []).slice().sort((a, b) => String(b.week).localeCompare(String(a.week)));
const planFallback = PLANS.length
  ? `          <p class="whats-new-title">${esc(PLANS[0].title)}</p>
          <p class="whats-new-actions"><a class="whats-new-btn" href="${esc(PLANS[0].file)}" download>Download the latest plan</a><a class="whats-new-link" href="weekly-plans.html">All weekly plans</a></p>`
  : `          <p class="whats-new-title">No weekly plan posted yet.</p>\n          <p><a href="weekly-plans.html">See weekly plans</a></p>`;
index = between(index, "whats-new", planFallback);
outputs["index.html"] = withStaticNav(index, "index.html");

// videos-data.js — index of every video the site links, with the lessons /
// games / pages that use it (tools/videos.js). No page shows it any more (the
// Videos page was retired Sep 2026; videos.html is a redirect to games.html);
// tools/check-videos.js uses it to check links (results in videos-meta.json).
for (const f of ["youtube-data.js", "warmup-nogym-data.js", "new-games-data.js", "dodgeball-data.js", "weekly-plans-data.js"]) {
  if (fs.existsSync(path.join(ROOT, f))) vm.runInContext(read(f), sandbox, { filename: f });
}
const VID = require("./videos.js")({ ROOT, W, LESSON_REF, months, monthBank, fill, gslug, ALIASES, SITE });
outputs["videos-data.js"] = VID.js;
report.push(`videos-data.js: ${VID.data.count} videos from ${VID.data.occurrences} links (link-check index only)`);

// Game lists: the same four libraries the pages show (Big-Group list mirrors app.js).
const BG_DETAILS = [].concat(W.GAME_DETAILS || [], W.K2_DETAILS || [], W.G36_DETAILS || [], W.SKILL_DETAILS || [], W.BG30_DETAILS || [], W.PEG_DETAILS || []);
const BG_LIST = [];
{ const seenBg = new Set(); BG_DETAILS.forEach((g) => { if (g && g.name && !seenBg.has(g.name)) { seenBg.add(g.name); BG_LIST.push(g); } }); }
const COUNTS = { bg: BG_LIST.length, ng: ((W.NEW_GAMES && W.NEW_GAMES.games) || []).length, wu: (W.WARMUP_NOGYM_GAMES || []).length, db: (W.DODGE_GAMES || []).length };
function fillCounts(html) {
  return html.replace(/<!--count:(\w+)-->[\s\S]*?<!--\/count-->/g, (m, k) => `<!--count:${k}-->${COUNTS[k]}<!--/count-->`);
}

// ---- search-index.js: one small name index for the site search (title, page, anchor, aliases).
// Built from the four game libraries; the big data files are never loaded just to search.
const RENAMED = (() => {
  const m = /var NAMES = (\{[\s\S]*?\n\s*\});/.exec(chromeSrc);
  return m ? vm.runInNewContext("(" + m[1] + ")") : {};
})();
const oldNames = (name) => Object.keys(RENAMED).filter((o) => RENAMED[o] === name);
const SEARCH = [];
const pegBy = {};
((W.PEG_HANDBOOK && W.PEG_HANDBOOK.games) || []).forEach((h) => { (pegBy[h.card] = pegBy[h.card] || []).push(h.name); });
BG_LIST.forEach((g) => {
  const slug = gslug(g.name);
  if (HOMES[slug]) return; // short "see the other page" card: the full game is indexed on its home page
  const x = EXTRAS[g.name] || {};
  SEARCH.push([g.name, "b", slug, [...new Set([].concat(g.aka || x.aka || [], pegBy[g.name] || [], oldNames(g.name)))].join(" ")]);
});
((W.NEW_GAMES && W.NEW_GAMES.games) || []).forEach((g) => {
  SEARCH.push([g.name, "n", g.id, [...new Set([].concat(g.oldNames || [], g.aliases || [], oldNames(g.name)))].join(" ")]);
});
(W.WARMUP_NOGYM_GAMES || []).forEach((g) => { SEARCH.push([g.title, "w", g.id, oldNames(g.title).join(" ")]); });
(W.DODGE_GAMES || []).forEach((g) => { SEARCH.push([g.name, "d", g.slug, oldNames(g.name).join(" ")]); });
outputs["search-index.js"] = `/* Generated by tools/build.js — do not edit by hand. [title, page (b=Big-Group, n=New, w=Warm Up, d=Dodgeball), anchor, other names] */\nwindow.GAME_INDEX = [\n${SEARCH.map((e) => JSON.stringify(e)).join(",\n")}\n];\n`;
report.push(`search-index.js: ${SEARCH.length} games (${(outputs["search-index.js"].length / 1024).toFixed(1)} KB)`);

// ---- duplicate titles across pages (warning only; never fails the build)
{
  const PAGE_NAME = { b: "Big-Group Games", n: "New Games", w: "Warm Up Games", d: "Dodgeball" };
  const key = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const by = {};
  BG_LIST.forEach((g) => { (by[key(g.name)] = by[key(g.name)] || []).push({ p: "b", t: g.name, stub: !!HOMES[gslug(g.name)] }); });
  ((W.NEW_GAMES && W.NEW_GAMES.games) || []).forEach((g) => { (by[key(g.name)] = by[key(g.name)] || []).push({ p: "n", t: g.name }); });
  (W.WARMUP_NOGYM_GAMES || []).forEach((g) => { (by[key(g.title)] = by[key(g.title)] || []).push({ p: "w", t: g.title }); });
  (W.DODGE_GAMES || []).forEach((g) => { (by[key(g.name)] = by[key(g.name)] || []).push({ p: "d", t: g.name }); });
  const open = [], done = [];
  Object.keys(by).forEach((k) => {
    const list = by[k];
    if (list.length < 2) return;
    const full = list.filter((e) => !e.stub); // copies that still show a full card
    const where = list.map((e) => PAGE_NAME[e.p] + (e.stub ? " (link card)" : "")).join(" + ");
    (full.length > 1 ? open : done).push(`"${list[0].t}": ${where}`);
  });
  report.push(`duplicate titles: ${done.length} resolved with a link card, ${open.length} still on more than one page (warning only)`);
  open.forEach((l) => report.push("  WARNING duplicate title " + l));
  // the Big-Group page needs the stub homes to exist on the target page
  Object.keys(HOMES).forEach((k) => {
    const h = HOMES[k];
    const ok = h.page === "dodgeball.html" ? (W.DODGE_GAMES || []).some((g) => g.slug === h.anchor)
      : h.page === "warmup-nogym.html" ? (W.WARMUP_NOGYM_GAMES || []).some((g) => gslug(g.title) === h.anchor) : true;
    if (!ok) report.push(`  WARNING game-homes.js: ${k} -> ${h.page}#${h.anchor} has no matching game`);
  });
}

// Downloads page: static list of every weekly plan (+ the newest as the no-JS default for "this week")
function fillDownloads(html) {
  const li = (p) => `        <li class="dl-row">
          <div class="dl-text"><strong>${esc(p.title)}</strong><span class="meta">${esc(p.note || "")}</span></div>
          <a class="btn" href="${esc(p.file)}" download>Download <span class="dl-fmt">Word</span></a>
        </li>`;
  html = between(html, "dl-plans", PLANS.map(li).join("\n"));
  html = between(html, "dl-latest", PLANS.length
    ? `        <p class="meta">Newest plan (with JavaScript on, this shows the plan for the current week):</p>\n        <ul class="dl-list clean">\n${li(PLANS[0])}\n        </ul>` : `        <p class="meta">No weekly plan posted yet.</p>`);
  return html;
}

// every other hand-written page: static nav from chrome.js NAV
const SKIP = new Set(Object.keys(outputs));
fs.readdirSync(ROOT).filter((f) => f.endsWith(".html") && !SKIP.has(f) && !/^month-/.test(f)).forEach((f) => {
  let html = read(f);
  if (!/<header class="site">[\s\S]*?<nav\b/.test(html)) return;
  if (f === "games-hub.html") html = fillCounts(html);
  if (f === "downloads.html") html = fillDownloads(html);
  outputs[f] = withStaticNav(html, f);
});


// ---------------------------------------------------------- load weight
// Fonts are self-hosted (fonts/ + @font-face in styles.css): drop any Google Fonts link, preload the two main files,
// and add ?v=<hash of the file> to every local script/stylesheet so a deploy is never served stale from cache.
const crypto = require("crypto");
const verCache = {};
function fileVer(name) {
  if (verCache[name]) return verCache[name];
  let txt = fs.readFileSync(path.join(ROOT, name), "utf8");
  if (name === "chrome.js") txt = txt.replace(/(SITE_UPDATED = ")[^"]*(")/, "$1$2"); // the Updated stamp must not change the hash
  return (verCache[name] = crypto.createHash("md5").update(txt).digest("hex").slice(0, 8));
}
const FONT_PRELOAD = ["figtree-latin", "newsreader-latin"].map((f) => `  <link rel="preload" href="fonts/${f}.woff2" as="font" type="font/woff2" crossorigin />`).join("\n");
function finalize(html) {
  html = html.replace(/[ \t]*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\n?/g, "")
             .replace(/[ \t]*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, "");
  if (!html.includes("fonts/figtree-latin.woff2")) html = html.replace(/([ \t]*)(<link rel="stylesheet" href="styles\.css)/, `${FONT_PRELOAD}\n$1$2`);
  return html.replace(/(<script\b[^>]*?\bsrc="|<link\b[^>]*?\bhref=")([\w.\/-]+\.(?:js|css))(?:\?v=[\w]*)?"/g, (m, pre, f) =>
    fs.existsSync(path.join(ROOT, f)) ? `${pre}${f}?v=${fileVer(f)}"` : m);
}

// ------------------------------------------------------------------- write
let stale = [];
for (let [f, content] of Object.entries(outputs)) {
  content = finalize(content);
  const p = path.join(ROOT, f);
  const cur = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (cur === content) continue;
  if (CHECK) stale.push(f);
  else { fs.writeFileSync(p, content); console.log("wrote", f); }
}
report.forEach((l) => console.log("  " + l));
if (process.env.DUMP_REFS) fs.writeFileSync(process.env.DUMP_REFS, JSON.stringify(global.__refs, null, 1));
warnings.forEach((w) => console.warn("  WARNING " + w)); // month-games / lesson-link checks: warn only, never fail the build
if (!warnings.length) console.log("  month games + lesson links: OK (every month lists at most " + MONTH_GAMES_MAX + " games; every game a lesson mentions is a link)");
if (CHECK) {
  if (stale.length) { console.error("Out of date (run node tools/build.js):\n  " + stale.join("\n  ")); process.exit(1); }
  console.log("All generated files are up to date.");
}
