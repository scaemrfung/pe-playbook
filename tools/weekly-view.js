/*
 * Weekly plans page (weekly-plans.html): a games-only, gym-friendly view of each posted
 * weekly plan. Called from tools/build.js.
 *
 * Source: the Word plans in weekly-plans/ (listed in weekly-plans-data.js). Each .docx is read
 * here with no dependencies (zip + XML). Only the day-by-day lesson lines and the plan's links
 * are used. The plan's outcome, rubric and assessment sections are NOT shown on the site, and
 * there is no separate "links used this week" list: each link sits on its game's card.
 * Game details (purpose, equipment, setup, steps) come from the playbook's own game cards.
 * Nothing is written into the .docx files.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ------------------------------------------------------------- docx reading
function unzip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 66000); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error("not a zip");
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let k = 0; k < n; k++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const off = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nlen).toString("utf8");
    const lnl = buf.readUInt16LE(off + 26), lxl = buf.readUInt16LE(off + 28);
    const data = buf.slice(off + 30 + lnl + lxl, off + 30 + lnl + lxl + csize);
    files[name] = () => (method === 0 ? data : zlib.inflateRawSync(data));
    p += 46 + nlen + xlen + clen;
  }
  return files;
}
const ent = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");
function runText(x) {
  let t = "";
  x.replace(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g, (m, s) => { t += s != null ? ent(s) : " "; return m; });
  return t;
}
/** -> [{ style, text, segs: [{ text, url? }] }] (top-level body paragraphs; tables skipped) */
function readDocx(file) {
  const z = unzip(fs.readFileSync(file));
  const doc = z["word/document.xml"]().toString("utf8").replace(/<w:tbl>[\s\S]*?<\/w:tbl>/g, "");
  const rels = {};
  z["word/_rels/document.xml.rels"]().toString("utf8").replace(/<Relationship\b([^>]*)\/?>/g, (m, a) => {
    const id = /Id="([^"]+)"/.exec(a), t = /Target="([^"]+)"/.exec(a);
    if (id && t) rels[id[1]] = ent(t[1]);
    return m;
  });
  const out = [];
  doc.replace(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g, (m, inner) => {
    const st = /<w:pStyle w:val="([^"]+)"/.exec(inner);
    const segs = [];
    inner.replace(/<w:hyperlink\b([^>]*)>([\s\S]*?)<\/w:hyperlink>|<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g, (mm, ha, hin, rin) => {
      if (ha != null) {
        const id = /r:id="([^"]+)"/.exec(ha);
        segs.push({ text: runText(hin), url: id ? rels[id[1]] : undefined });
      } else segs.push({ text: runText(rin) });
      return mm;
    });
    out.push({ style: st ? st[1] : "", text: segs.map((s) => s.text).join("").trim(), segs });
    return m;
  });
  return out;
}

// --------------------------------------------------------------- the module
module.exports = function weeklyView({ ROOT, W, DETAILS, ALIASES, gameHref, gslug, esc, PLANS }) {
  const warnings = [];
  const NG = ((W.NEW_GAMES && W.NEW_GAMES.games) || []);
  // name -> card { name, purpose, equipment, setup, play[], href }
  const CARDS = new Map();
  const firstSentence = (s) => { s = String(s || "").trim(); const m = /^[\s\S]*?[.!?](?=\s|$)/.exec(s); return m ? m[0] : s; };
  const add = (key, card) => { const k = String(key).toLowerCase(); if (k.length >= 4 && !CARDS.has(k)) CARDS.set(k, card); };
  NG.forEach((g) => {
    const card = { name: g.name, purpose: firstSentence(g.desc), equipment: g.equipment, setup: g.setup, play: g.how || g.cues || [], href: `new-games.html#${g.id}` };
    [g.name].concat(g.aka || [], g.aliases || [], g.oldNames || []).forEach((n) => add(n, card));
  });
  DETAILS.forEach((g) => {
    if (!g || !g.name) return;
    const card = { name: g.name, purpose: firstSentence(g.purpose), equipment: g.equipment, setup: g.setup, play: g.play || [], href: gameHref(g.name) };
    [g.name].concat(g.aka || []).forEach((n) => add(n, card));
  });
  (W.DODGE_GAMES || []).forEach((g) => add(g.name, { name: g.name, purpose: firstSentence(g.purpose), equipment: g.equipment, setup: g.setup, play: g.play || [], href: `dodgeball.html#${g.slug}` }));
  (W.WARMUP_NOGYM_GAMES || []).forEach((g) => add(g.title, { name: g.title, purpose: "", equipment: g.equipment, setup: g.space, play: [].concat(g.how || []), href: `warmup-nogym.html#${g.id}` }));
  Object.keys(ALIASES).forEach((a) => { const c = CARDS.get(ALIASES[a].toLowerCase()); if (c) add(a, c); });
  const KEYS = [...CARDS.keys()].sort((a, b) => b.length - a.length);
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const KEY_RE = new RegExp(`(^|[^A-Za-z0-9])(${KEYS.map(reEsc).join("|")})(?![A-Za-z0-9])`, "gi");
  /** Card names in the text, in order (a name must start with a capital letter in the plan). */
  function findGames(text) {
    const found = [];
    String(text).replace(KEY_RE, (m, pre, name, off) => {
      if (/^[A-Z]/.test(name)) {
        const c = CARDS.get(name.toLowerCase());
        // keep the name the plan uses; the card it opens may have another name (e.g. Hot Dog Tag -> Frozen Tag)
        if (c && !found.some((x) => x.card === c)) found.push(Object.assign({}, c, { name: name.toLowerCase() === c.name.toLowerCase() ? c.name : name, cardName: c.name, card: c }));
      }
      return m;
    });
    return found;
  }

  const SLOT_RE = /^(?:\d{1,2}:\d\d\s*[–-]\s*\d{1,2}:\d\d\s+)?((wu|warm-up|skill|game|stations?|mini game|cd)\b[^:]{0,40}):\s*([\s\S]*)$/i;
  const BAND_RE = /^Grades (1–2|3–4|5–6)$/;
  const isLessonLink = (url) => /pe-playbook\/month-[a-z]+\.html#(w\d|week-)/.test(url || "") || /pe-playbook\/month-[a-z]+\.html$/.test(url || "");
  const shortLine = (s, max = 170) => { s = firstSentence(s).replace(/\s+/g, " ").trim(); if (s.length <= max) return s; const cut = s.slice(0, max); return cut.slice(0, cut.lastIndexOf(" ")) + "…"; };

  // the plans add a "_hl" counter to every link (Google Docs export); it is not part of the address
  const cleanUrl = (u) => String(u || "").replace(/([?&])_hl=\d+(&?)/, (m, a, b) => (b ? a : "")).replace(/[?&]$/, "");
  function parsePlan(file) {
    const P = readDocx(path.join(ROOT, file));
    const plan = { info: [], days: [], linkItems: [] };
    let sec = "", band = null, day = null;
    const dayMap = new Map();
    for (const p of P) {
      if (!p.text) continue;
      if (p.style === "Heading1") { plan.h1 = p.text.replace(/^PE Weekly Plan\s*[—-]\s*/, ""); continue; }
      if (p.style === "Heading2") {
        const b = BAND_RE.exec(p.text);
        sec = b ? "band" : /links used this week/i.test(p.text) ? "links" : "other";
        band = b ? b[1] : null; day = null;
        continue;
      }
      if (/^Heading/.test(p.style)) { if (sec !== "band") sec = "other"; continue; }
      if (!sec) { // top of the plan: calendar lines only
        if (/^(EIPS calendar|Early dismissal|Equipment):/i.test(p.text)) plan.info.push(p.text);
        continue;
      }
      if (sec === "links") {
        const urls = p.segs.filter((s) => s.url);
        if (!urls.length) continue;
        const label = p.segs.filter((s) => !s.url).map((s) => s.text).join("").replace(/:\s*$/, "").trim();
        urls.forEach((u) => plan.linkItems.push({ label, text: u.text.trim(), url: cleanUrl(u.url) }));
        continue;
      }
      if (sec !== "band") continue;
      const dm = /^Day (\d+)\s*·\s*(.*)$/.exec(p.text);
      if (dm) {
        const n = +dm[1];
        if (!dayMap.has(n)) { const d = { n, heads: [], items: [], links: [], early: false }; dayMap.set(n, d); plan.days.push(d); }
        day = dayMap.get(n);
        day.heads.push(p.text);
        if (/early dismissal/i.test(p.text)) day.early = true;
        continue;
      }
      if (!day) continue;
      if (/^Links:/i.test(p.text)) { p.segs.filter((s) => s.url).forEach((s) => day.links.push({ text: s.text.trim(), url: cleanUrl(s.url), band })); continue; }
      const sm = SLOT_RE.exec(p.text);
      if (!sm) continue;
      const kind = /game/i.test(sm[1]) && !/^mini/i.test(sm[2]) ? (/^mini game/i.test(sm[1]) ? "mini game" : "game") : sm[2].toLowerCase();
      if (kind === "cd") continue;
      const body = sm[3];
      let games = findGames(body);
      if (kind === "skill" && !games.length) continue; // a drill, not a game
      if (!games.length && /^(game|mini game)$/.test(kind)) {
        // a game the playbook has no card for: name and words straight from the plan
        const nm = body.split(/\s+[—–-]\s+|\s+·\s+|[.:;(,]/)[0].trim().slice(0, 60);
        games = [{ name: nm, planOnly: true }];
      }
      games.forEach((g) => day.items.push({ g, kind, band, line: body }));
    }
    plan.days.sort((a, b) => a.n - b.n);
    return plan;
  }

  const SLOT_LABEL = { wu: "Warm-up", "warm-up": "Warm-up", skill: "Skill", game: "Game", station: "Stations", stations: "Stations", "mini game": "Mini game" };
  const dayTitle = (heads) => {
    const parts = heads.map((h) => h.split(" · "));
    const common = [];
    for (let i = 0; i < parts[0].length; i++) { if (parts.every((x) => x[i] === parts[0][i])) common.push(parts[0][i]); else break; }
    return (common.length >= 2 ? common : parts[0].slice(0, 2)).join(" · ");
  };
  const linkA = (l) => `<a href="${esc(l.url)}"${/^https?:/.test(l.url) && !/scaemrfung\.github\.io\/pe-playbook/.test(l.url) ? ' target="_blank" rel="noopener"' : ""}>${esc(l.text)}</a>`;
  const toSite = (url) => String(url || "").replace(/^https:\/\/scaemrfung\.github\.io\/pe-playbook\//, "");

  function renderWeek(entry) {
    const plan = parsePlan(entry.file);
    const wid = `week-${entry.week}`;
    // plan links -> the game whose name starts the label (or is the link text)
    const gameLinks = new Map(), weekLinks = [], extras = [];
    const pushTo = (g, l) => { const k = g.name; const a = gameLinks.get(k) || []; if (!a.some((x) => x.url === l.url)) a.push(l); gameLinks.set(k, a); };
    const played = new Set(), byCard = new Map();
    plan.days.forEach((d) => d.items.forEach((it) => { played.add(it.g.name); if (it.g.cardName && !byCard.has(it.g.cardName)) byCard.set(it.g.cardName, it.g); }));
    // the same game under another name (Knock and Run = Sneak & React's card) goes on the card the plan plays
    const resolve = (g) => (g && g.cardName && !played.has(g.name) && byCard.get(g.cardName)) || g;
    const extraNames = new Set();
    const playedNames = [...played];
    const norm = (t) => String(t).toLowerCase().replace(/^(the|parachute)\s+/, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
    const isWeekLink = (l) => /pe-playbook\/(month-[a-z]+\.html|warmup-nogym\.html|index\.html|how\.html)?([?#].*)?$/.test(l.url) && !/channel|@/.test(l.text) && !/pe-playbook\/[a-z-]+\.html#(?!w\d|week)/.test(l.url)
      || /youtube\.com\/(@|c\/|channel\/|user\/)/.test(l.url) || /channel|lessons \(playbook\)|^(Mon|Tue|Wed|Thu|Fri)\b/i.test(l.label);
    plan.linkItems.forEach((l) => {
      let g = resolve(findGames(l.label)[0] || findGames(l.text)[0]);
      const base = l.label.split(/\s+\(|\s+(?:demo|rules|video|variant)\b|:/i)[0].trim();
      if (!g && base.length >= 4) {
        for (const part of [base].concat(base.split(/\s+\/\s+/))) {
          const np = norm(part); if (np.length < 4) continue;
          const p = playedNames.find((n) => norm(n).startsWith(np) || np.startsWith(norm(n)));
          if (p) { g = { name: p }; break; }
          const x = extras.find((e) => norm(e.name).startsWith(np) || np.startsWith(norm(e.name)));
          if (x) { g = x; break; }
        }
      }
      if (!g && !isWeekLink(l) && base.length >= 3) {
        // a game the plan links but the playbook has no card for: its own card, in the plan's words
        const note = (/\(([^)]*)\)/.exec(l.label) || [])[1];
        const nb = norm(base);
        const byNorm = [...CARDS.values()].find((c) => norm(c.name) === nb);
        g = byNorm ? Object.assign({}, byNorm, { cardName: byNorm.name, card: byNorm }) : { name: base, planOnly: true, note };
      }
      const startsWithName = g && l.label.toLowerCase().startsWith(g.name.toLowerCase());
      const link = { text: l.label && startsWithName && !/\b(demo|rules|video|variant)\b/i.test(l.label) ? l.text : (l.label ? `${l.label}: ${l.text}` : l.text), url: l.url };
      if (g && !played.has(g.name)) { const first = extras.find((x) => (x.cardName || x.name) === (g.cardName || g.name) || norm(x.name) === norm(g.name)); if (first) { if (first.planOnly && !g.planOnly) Object.assign(first, g, { planOnly: false }); pushTo(first, link); return; } }
      if (g) { pushTo(g, link); if (!played.has(g.name) && !extraNames.has(g.cardName || g.name)) { extraNames.add(g.cardName || g.name); extras.push(g); } }
      else weekLinks.push({ text: l.label ? `${l.label}: ${l.text}` : l.text, url: l.url });
    });
    // the day "Links:" lines: game links go to that game's card, lesson links to the day
    const urlGame = new Map();
    gameLinks.forEach((ls, name) => ls.forEach((l) => urlGame.set(l.url, name)));
    plan.days.forEach((d) => {
      d.dayLinks = [];
      d.links.forEach((l) => {
        const gname = urlGame.get(l.url) || ((resolve(findGames(l.text)[0]) || {}).name);
        const inDay = gname && d.items.some((it) => it.g.name === gname);
        if (gname && (inDay || played.has(gname))) pushTo({ name: gname }, { text: l.text, url: l.url });
        else if (!d.dayLinks.some((x) => x.url === l.url)) d.dayLinks.push(l);
      });
    });

    const dayUrls = new Set(); plan.days.forEach((d) => d.dayLinks.forEach((l) => dayUrls.add(l.url)));
    for (let i = weekLinks.length - 1; i >= 0; i--) if (dayUrls.has(weekLinks[i].url)) weekLinks.splice(i, 1);
    const shown = new Set();
    const card = (g, rows, dayLabel, anchor) => {
      const c = g.planOnly ? null : g;
      const first = !shown.has(g.name);
      shown.add(g.name);
      const links = [];
      if (c && c.href) links.push({ text: c.cardName && c.cardName !== g.name ? `Playbook card (${c.cardName})` : "Playbook card", url: c.href });
      (gameLinks.get(g.name) || []).forEach((l) => { if (!links.some((x) => toSite(x.url) === toSite(l.url))) links.push(l); });
      const bandRows = rows.map((r) => `<li>${r.band ? `<span class="wk-band">Gr ${r.band}</span> ` : ""} ${esc(shortLine(r.line))}</li>`).join("");
      let body = "";
      if (c && c.purpose) body += `<p class="wk-purpose">${esc(c.purpose)}</p>`;
      if (c && first) {
        if (c.equipment) body += `<p class="wk-line"><strong>Equipment:</strong> ${esc(c.equipment)}</p>`;
        if (c.setup) body += `<p class="wk-line"><strong>Setup:</strong> ${esc(c.setup)}</p>`;
        if (c.play && c.play.length) body += `<div class="wk-line"><strong>How to play:</strong><ol class="wk-steps">${c.play.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>`;
      } else if (c) body += `<p class="wk-line meta">Equipment, setup and steps: <a href="#${esc(shownAt.get(g.name))}">see ${esc(shownDay.get(g.name))}</a>.</p>`;
      if (g.planOnly) body += `<p class="wk-line meta">No playbook card for this one. The plan's own words are below.</p>`;
      if (bandRows) body += `<div class="wk-line"><strong>This week:</strong><ul class="wk-bands">${bandRows}</ul></div>`;
      if (links.length) body += `<p class="wk-links"><strong>Links:</strong> ${links.map((l) => linkA({ text: l.text, url: toSite(l.url) })).join(" · ")}</p>`;
      if (first && c) { shownAt.set(g.name, anchor); shownDay.set(g.name, dayLabel); }
      const kinds = [...new Set(rows.map((r) => SLOT_LABEL[r.kind] || r.kind))].join(" · ");
      return `<article class="wk-game" id="${esc(anchor)}">
            <div class="wk-game-head"><h4>${c ? `<a href="${esc(c.href)}">${esc(g.name)}</a>` : esc(g.name)}</h4>${kinds ? `<span class="wk-slot">${esc(kinds)}</span>` : ""}</div>
            ${body}
          </article>`;
    };
    const shownAt = new Map(), shownDay = new Map();

    const days = plan.days.map((d) => {
      const label = dayTitle(d.heads);
      const order = [], rowsBy = new Map();
      d.items.forEach((it) => { if (!rowsBy.has(it.g.name)) { rowsBy.set(it.g.name, []); order.push(it.g); } rowsBy.get(it.g.name).push(it); });
      const cards = order.map((g, i) => card(g, rowsBy.get(g.name), label.replace(/^Day \d+\s*·\s*/, ""), `${wid}-d${d.n}-${gslug(g.name).replace(/^-|-$/g, "")}`)).join("\n");
      const dl = d.dayLinks.length ? `<p class="wk-day-links meta">Lesson links: ${d.dayLinks.map((l) => linkA({ text: l.text, url: toSite(l.url) })).join(" · ")}</p>` : "";
      return `<section class="wk-day" id="${wid}-d${d.n}">
          <h3>${esc(label)}${d.early && !/early dismissal/i.test(label) ? ' <span class="wk-flag">Early dismissal</span>' : ""}</h3>
          ${dl}
          <div class="wk-games">
          ${cards || '<p class="meta">No games listed for this day.</p>'}
          </div>
        </section>`;
    }).join("\n");
    const extraHtml = extras.length ? `<section class="wk-day" id="${wid}-extras">
          <h3>More games and demos in this plan</h3>
          <div class="wk-games">
          ${extras.map((g) => card(g, g.note ? [{ band: null, line: g.note, kind: "" }] : [], "Extras", `${wid}-x-${gslug(g.name).replace(/^-|-$/g, "")}`)).join("\n")}
          </div>
        </section>` : "";
    const info = plan.info.map((t) => { const m = /^([^:]+):\s*([\s\S]*)$/.exec(t); return `<p class="wk-info"><strong>${esc(m[1])}:</strong> ${esc(m[2])}</p>`; }).join("");
    const more = weekLinks.length ? `<p class="wk-info meta"><strong>Playbook pages and video channels:</strong> ${weekLinks.map((l) => linkA({ text: l.text, url: toSite(l.url) })).join(" · ")}</p>` : "";
    const name = entry.file.split("/").pop();
    const html = `<details class="wk-plan" id="${wid}" data-week="${esc(entry.week)}">
      <summary><span class="wk-title">${esc(entry.title)}</span><span class="wk-sub">${esc(entry.month || "")}</span></summary>
      <div class="wk-body">
        <div class="wk-top">
          <h2>${esc(plan.h1 || entry.title)}</h2>
          ${info}
          ${more}
          <p class="wk-actions no-print"><button type="button" class="btn wk-print" data-week="${wid}">Print this week</button> <a class="btn" href="${esc(entry.file)}" download="${esc(name)}">Download the Word plan</a></p>
        </div>
        ${days}
        ${extraHtml}
      </div>
    </details>`;
    // every link from the plan's link list must still be on this week's page
    plan.linkItems.forEach((l) => { if (!html.includes(`href="${esc(toSite(l.url))}"`)) warnings.push(`weekly plan ${entry.week}: link ${l.url} (${l.label}) is not shown`); });
    return { html, games: shown.size, days: plan.days.length };
  }

  const weeks = PLANS.filter((p) => p.file && fs.existsSync(path.join(ROOT, p.file))).map((p) => ({ p, r: renderWeek(p) }));
  const list = weeks.map(({ p }) => `<li><a href="#week-${esc(p.week)}">${esc(p.title)}</a></li>`).join("\n          ");
  const html = `<nav class="panel wk-index no-print" aria-label="Pick a week">
        <h2>Pick a week</h2>
        <ul class="clean wk-week-list">
          ${list}
        </ul>
      </nav>
      ${weeks.map((w) => w.r.html).join("\n      ")}`;
  return { html, warnings, report: `weekly-plans.html: ${weeks.length} weeks, ${weeks.reduce((a, w) => a + w.r.games, 0)} game cards (games only, links on each card)` };
};
