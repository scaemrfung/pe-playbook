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
  "daly-games.js", "daly-month-games.js",
];
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of DATA_FILES) vm.runInContext(read(f), sandbox, { filename: f });
const W = sandbox;
const SY = W.SCHOOL_YEAR;
const fill = (s) => SY.fill(s);

// NAV + MONTHS come from chrome.js (SITE:START … SITE:END)
const chromeSrc = read("chrome.js");
const siteBlock = /\/\* SITE:START[\s\S]*?\*\/([\s\S]*?)\/\* SITE:END \*\//.exec(chromeSrc);
if (!siteBlock) throw new Error("chrome.js is missing the SITE:START/SITE:END block");
const SITE = vm.runInNewContext(siteBlock[1] + "\n;({ MONTHS, NAV })");
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
const DETAILS = [].concat(W.GAME_DETAILS || [], W.K2_DETAILS || [], W.G36_DETAILS || [], W.SKILL_DETAILS || [], W.BG30_DETAILS || [], W.DALY_DETAILS || []);
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
      return `<a href="games.html#${slug}">${m}</a>`;
    });
  });
  return out;
}

function monthBank(name) {
  const all = [].concat(MONTH_GAMES[name] || [], K2M[name] || [], G36M[name] || [], SKILLM[name] || [], BG30[name] || []);
  return all;
}

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

function renderMonth(m) {
  const bank = monthBank(m.name);
  const nav = months.map((x) =>
    `<a href="${monthFile(x.name)}" class="${x.name === m.name ? "active" : ""}"${x.name === m.name ? ' aria-current="page"' : ""}>${x.name.slice(0, 3)}</a>`
  ).join(" · ");
  let week = 0;
  let missingBands = 0;
  const lessons = m.lessons.map((L) => {
    let head = "";
    if (L.w !== week) {
      week = L.w;
      head = `<h2 class="week-title">${m.name} · Week ${week}</h2>`;
    }
    const o = LO[`${m.name}-${L.w}-${L.c}`];
    const items = pickMonthOutcomes((o && o.items) || [], `${m.name}-${L.w}-${L.c}`);
    const outRow = items.length ? `<div class="row out"><div class="t">Outcomes</div>
            <div class="d">${items.map((it) => `<div><strong>${it.code}.</strong> ${it.look}</div>`).join("")}
            <span class="meta">PEW K–6 · LearnAlberta · 2–3 look-fors</span></div></div>` : "";
    return head + `<article class="lesson" data-week="${L.w}">
        <div class="top"><h3>W${L.w} · C${L.c} — ${fill(L.title)}</h3><small>${fill(L.focus)}</small></div>
        <div class="rows">
          ${outRow}
          <div class="row"><div class="t">0–5</div><div class="d">${fill(L.wu)}</div></div>
          <div class="row"><div class="t">5–16</div><div class="d">${fill(L.skill)}</div></div>
          <div class="row game"><div class="t">16–25</div><div class="d">${linkGameText(fill(L.game))}</div></div>
          <div class="row"><div class="t">25–30</div><div class="d">${fill(L.cd)}</div></div>
          <div class="row bands"><div class="t"><span class="band-t-all">1–2 / 3–4 / 5–6</span><span class="band-t" data-for="g12">Grades 1–2</span><span class="band-t" data-for="g34">Grades 3–4</span><span class="band-t" data-for="g56">Grades 5–6</span></div>
            <div class="d">${bandSpans(L, '<span class="band-sep"> &nbsp;·&nbsp; </span>')}</div>
          </div>
        </div>
      </article>`;
  }).join("");

  const seen = new Set();
  const rows = bank.filter((r) => r && r[0] && !seen.has(r[0]) && seen.add(r[0])).map((r) => {
    const sl = gslug(r[0]);
    const x = EXTRAS[r[0]] || {};
    const picked = pickMonthOutcomes(x.outcomes || [], r[0]);
    const out = picked.map((it) => `<strong>${it.code}.</strong> ${it.look}`).join("<br>");
    const d = detailFor(r[0]);
    let bands;
    if (d && (d.g12 || d.g34 || d.g56)) bands = bandSpans(d, "");
    else {
      missingBands++;
      bands = BANDS.map(([k]) => `<span class="band" data-band="${k}">No grade notes for this game yet — adjust pace, space and number of taggers.</span>`).join("");
    }
    return `<tr><td><strong><a href="games.html#${sl}">${r[0]}</a></strong></td><td>${r[2]}</td><td class="bands-cell">${bands}</td><td>${out}</td></tr>`;
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
        <p class="note">These are the 30-minute classroom versions. Simplify for Grades 1–2: walk more, fewer taggers, skip grabbing games until Grade 3+. This table shows 2–3 look-fors per game. Open the game card for all seven PEW outcomes.</p>
        <div class="table-scroll">
        <table class="games">
          <thead><tr><th>Game</th><th>How we run it</th><th>By grade <span class="grade-th" id="grade-th">(1–2 / 3–4 / 5–6)</span></th><th>Outcomes</th></tr></thead>
          <tbody>
          ${rows.join("\n          ")}
          </tbody>
        </table>
        </div>
      </div>
      ${lessons}
    `;
  return { content, games: rows.length, missingBands };
}

// --------------------------------------------------------------- templates
function navHtml(activeHref) {
  const items = SITE.NAV.map(([h, l]) =>
    `        <a ${h === activeHref ? 'class="active" aria-current="page" ' : ""}href="${h}">${l}</a>`
  ).join("\n");
  return `<nav aria-label="Site">\n${items}\n      </nav>`;
}
function withStaticNav(html, activeHref) {
  return html.replace(/(<header class="site">[\s\S]*?)<nav\b[^>]*>[\s\S]*?<\/nav>/, (m, pre) => pre + navHtml(activeHref));
}
const TEMPLATE = read("tools/month.template.html");
function page({ title, description, body, scripts }) {
  return withStaticNav(
    TEMPLATE.replace("{{TITLE}}", esc(title))
      .replace("{{DESCRIPTION}}", esc(description))
      .replace("{{CONTENT}}", body)
      .replace("{{SCRIPTS}}", scripts),
    null
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
    title: `${m.name}: ${theme} · SCA Elementary PE Playbook`,
    description: desc,
    body: `${GEN}\n    <div id="content" data-month="${m.name}">${r.content}</div>`,
    scripts: `<script src="school-year.js" defer></script>
  <script src="chrome.js" defer></script>
  <script src="month-page.js" defer></script>`,
  });
  report.push(`${monthFile(m.name)}: ${m.lessons.length} lessons, ${r.games} games (${r.missingBands} without band notes)`);
});

// month.html — legacy router (?m=September&grade=4) + no-JS month list
outputs["month.html"] = page({
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
outputs["months-index.js"] = `/* Generated by tools/build.js — do not edit by hand. */\nwindow.PE_MONTHS = ${JSON.stringify(summary, null, 2)};\n`;

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
outputs["index.html"] = withStaticNav(index, "index.html");

// every other hand-written page: static nav from chrome.js NAV
const SKIP = new Set(Object.keys(outputs).concat(["large-group-pe-games.html"]));
fs.readdirSync(ROOT).filter((f) => f.endsWith(".html") && !SKIP.has(f) && !/^month-/.test(f)).forEach((f) => {
  const html = read(f);
  if (!/<header class="site">[\s\S]*?<nav\b/.test(html)) return;
  const active = SITE.NAV.some(([h]) => h === f) ? f : null;
  outputs[f] = withStaticNav(html, active);
});

// ------------------------------------------------------------------- write
let stale = [];
for (const [f, content] of Object.entries(outputs)) {
  const p = path.join(ROOT, f);
  const cur = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (cur === content) continue;
  if (CHECK) stale.push(f);
  else { fs.writeFileSync(p, content); console.log("wrote", f); }
}
report.forEach((l) => console.log("  " + l));
if (CHECK) {
  if (stale.length) { console.error("Out of date (run node tools/build.js):\n  " + stale.join("\n  ")); process.exit(1); }
  console.log("All generated files are up to date.");
}
