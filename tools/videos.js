/*
 * Video index for videos.html — no dependencies, Node 16+.
 * Called by tools/build.js (so `node tools/build.js` / `--check` keep it fresh).
 *
 * Scans every place the site links a video and writes videos-data.js
 * (window.VIDEO_INDEX): one entry per video (deduped by YouTube id), each with
 * every lesson / game / page that uses it.
 *
 * Sources
 *   youtube-data.js          curated clips (title, channel, about, games[])
 *   games page               game cards that show a curated clip (exact name)
 *   warmup-nogym-data.js     Warm Up Games  (youtube field)
 *   new-games-data.js        New Games      (links[])
 *   physedgames-games.js     PHYSEDGAMES large-group games (Big-Group Games page cards + playlist)
 *   weekly-plans/*.docx      Weekly plans   (hyperlinks, per grade band + day)
 *   data.js lessons          month lessons that name a game with a video
 *   month game tables        "Big-group games this month" rows with a video
 *   dodgeball-data.js        Dodgeball cards with a video
 * Link checks (titles, broken/working) come from videos-meta.json, written by
 * tools/check-videos.js (network). The build itself stays offline.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ------------------------------------------------------------------ helpers
function ytKey(url) {
  const u = String(url || "").trim();
  let m = /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(u);
  if (m) return "yt:" + m[1];
  m = /youtube\.com\/playlist\?(?:[^#]*&)?list=([A-Za-z0-9_-]+)/.exec(u);
  if (m) return "pl:" + m[1];
  m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(u);
  if (m) return "vm:" + m[1];
  return null; // channels (@name), articles, etc. are not videos
}
function canonical(key) {
  const [t, id] = key.split(":");
  if (t === "yt") return "https://www.youtube.com/watch?v=" + id;
  if (t === "pl") return "https://www.youtube.com/playlist?list=" + id;
  if (t === "vm") return "https://vimeo.com/" + id;
  return "";
}
const decodeEnt = (s) => String(s).replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const normName = (s) => String(s || "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

// minimal .docx reader: returns [{style, text, links:[{text,url}]}] for body paragraphs
function readZipEntry(buf, name) {
  // find central directory
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) return null;
  const cdCount = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < cdCount; i++) {
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const off = buf.readUInt32LE(p + 42);
    const fname = buf.toString("utf8", p + 46, p + 46 + nlen);
    if (fname === name) {
      const lnlen = buf.readUInt16LE(off + 26), lxlen = buf.readUInt16LE(off + 28);
      const data = buf.subarray(off + 30 + lnlen + lxlen, off + 30 + lnlen + lxlen + csize);
      return (method === 0 ? data : zlib.inflateRawSync(data)).toString("utf8");
    }
    p += 46 + nlen + xlen + clen;
  }
  return null;
}
function readDocx(file) {
  const buf = fs.readFileSync(file);
  const doc = readZipEntry(buf, "word/document.xml") || "";
  const relsXml = readZipEntry(buf, "word/_rels/document.xml.rels") || "";
  const rels = {};
  relsXml.replace(/<Relationship\b[^>]*>/g, (tag) => {
    const id = /Id="([^"]+)"/.exec(tag), t = /Target="([^"]+)"/.exec(tag);
    if (id && t) rels[id[1]] = decodeEnt(t[1]);
    return "";
  });
  const out = [];
  const paraRe = /<w:p\b[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = paraRe.exec(doc))) {
    const px = m[0];
    const style = (/<w:pStyle w:val="([^"]+)"/.exec(px) || [])[1] || "";
    const textOf = (x) => decodeEnt((x.match(/<w:t\b[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join(""));
    const links = [];
    px.replace(/<w:hyperlink\b([^>]*)>([\s\S]*?)<\/w:hyperlink>/g, (all, attrs, inner) => {
      const rid = /r:id="([^"]+)"/.exec(attrs);
      if (rid && rels[rid[1]]) links.push({ text: textOf(inner), url: rels[rid[1]] });
      return "";
    });
    out.push({ style, text: textOf(px), links });
  }
  return out;
}

// ------------------------------------------------------------------ main
module.exports = function buildVideos(ctx) {
  const { ROOT, W, months, monthBank, fill, gslug, ALIASES, SITE } = ctx;
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  const exists = (f) => fs.existsSync(path.join(ROOT, f));
  const META = exists("videos-meta.json") ? JSON.parse(read("videos-meta.json")) : { videos: {}, replacements: [] };
  const THEME = Object.fromEntries(SITE.MONTHS.map(([n, s]) => [n, s]));
  const MONTH_ORDER = SITE.MONTHS.map(([n]) => n);

  const V = {}; // key -> entry
  function entry(key, url) {
    if (!V[key]) V[key] = { key, url: canonical(key) || url, titles: [], channels: [], about: "", games: new Set(), refs: [], months: new Set(), labels: [] };
    return V[key];
  }
  function addRef(e, ref) {
    if (!e.refs.some((r) => r.href === ref.href && r.label === ref.label)) e.refs.push(ref);
  }
  const seenOcc = []; // raw occurrences, for counting

  // 1. curated clips
  const VIDEOS = W.VIDEOS || [];
  VIDEOS.forEach((v) => {
    const key = ytKey(v.url);
    if (!key) return;
    seenOcc.push(["Videos (curated)", key]);
    const e = entry(key, v.url);
    if (v.title) e.titles.push(v.title);
    if (v.channel) e.channels.push(v.channel);
    if (v.about && !e.about) e.about = v.about;
    (v.games || []).forEach((g) => e.games.add(g));
  });

  // 2. games page cards (videoHtml shows curated clips whose games[] match the card name)
  const DETAILS = [].concat(W.GAME_DETAILS || [], W.K2_DETAILS || [], W.G36_DETAILS || [], W.SKILL_DETAILS || [], W.BG30_DETAILS || [], W.DALY_DETAILS || [], W.PEG_DETAILS || []);
  const cardNames = new Map();
  DETAILS.forEach((g) => { if (g && g.name && !cardNames.has(normName(g.name))) cardNames.set(normName(g.name), g); });
  Object.values(V).forEach((e) => {
    e.games.forEach((n) => {
      const card = cardNames.get(normName(n));
      if (card) {
        addRef(e, { page: "games", label: `Big-Group Games · ${card.name}`, href: `games.html#${gslug(card.name)}` });
        (card.months || []).forEach((mo) => e.months.add("detail:" + mo));
      }
    });
  });

  // 3. Warm Up Games
  (W.WARMUP_NOGYM_GAMES || []).forEach((g) => {
    [g.youtube].concat(g.videos || []).filter(Boolean).forEach((url) => {
      const key = ytKey(url);
      if (!key) return;
      seenOcc.push(["Warm Up Games", key]);
      const e = entry(key, url);
      if (g.youtubeLabel) e.labels.push(g.youtubeLabel.replace(/\s*\(([^)]+)\)\s*$/, (m, ch) => { e.channels.push(ch); return ""; }));
      e.games.add(g.title);
      addRef(e, { page: "warmups", label: `Warm Up Games · ${g.title}`, href: `warmup-nogym.html#${g.id}` });
    });
  });

  // 4. New Games This Week
  const NG = W.NEW_GAMES || { games: [] };
  (NG.games || []).forEach((g) => {
    (g.links || []).forEach((url) => {
      const key = ytKey(url);
      if (!key) return;
      seenOcc.push(["New Games", key]);
      const e = entry(key, url);
      e.games.add(g.name);
      if (g.source) e.channels.push({ PhysEdGames: "PhysEdGames", Daly: "Daly Exercise", Gelardi: "Coach Gelardi", Prime: "Prime Coaching Sport" }[g.source.split(/\s*\/\s*/)[0]] || "");
      addRef(e, { page: "newgames", label: `New Games · ${g.name}`, href: `new-games.html#${g.id}` });
      if (g.unit) e.months.add("unit:" + g.unit);
    });
  });

  // 5. PHYSEDGAMES large-group games (on the Big-Group Games page; the old handbook page was retired)
  const PEG = W.PEG_HANDBOOK;
  if (PEG && PEG.intro && PEG.intro.playlist) {
    const key = ytKey(PEG.intro.playlist);
    if (key) {
      seenOcc.push(["Games", key]);
      const e = entry(key, PEG.intro.playlist);
      e.labels.push("Large Group Games (playlist)");
      e.channels.push("PhysEdGames");
      addRef(e, { page: "games", label: "Big-Group Games · PHYSEDGAMES large-group games (playlist)", href: "games.html#peg-intro" });
    }
  }


  // 6. Weekly plans (.docx)
  (W.WEEKLY_PLANS || []).forEach((p) => {
    if (!p.file || !exists(p.file)) return;
    const paras = readDocx(path.join(ROOT, p.file));
    const planId = "plan-" + gslug(path.basename(p.file, ".docx")).replace(/^-|-$/g, "");
    const monthName = (/^(\w+)/.exec(p.month || "") || [])[1];
    let band = "", day = "";
    const byKey = {};
    paras.forEach((para) => {
      if (/^Heading/.test(para.style) || /^Heading/i.test(para.style)) {
        const b = /Grades?\s*([1-6]\s*[–-]\s*[1-6])/.exec(para.text);
        band = b ? "Gr " + b[1].replace(/\s/g, "") : "";
        day = "";
      }
      const d = /^Day\s*(\d)\s*·\s*(\w+)/.exec(para.text);
      if (d) day = `Day ${d[1]} ${d[2]}`;
      const textUrls = (para.text.match(/https?:\/\/[^\s)]+/g) || []).filter((u) => !para.links.some((l) => l.url === u)).map((u) => ({ text: "", url: u }));
      para.links.concat(textUrls).forEach((l) => {
        const key = ytKey(l.url);
        if (!key) return;
        const k = byKey[key] || (byKey[key] = { names: new Set(), where: [] });
        // "Game name: link text" lines in the links list name the game
        const lead = /^([^:]+):/.exec(para.text);
        if (lead && !/^Links$/i.test(lead[1].trim())) k.names.add(lead[1].replace(/\s*\((?:wu|warm-up|lead-pass|apply-day)[^)]*\)/i, "").replace(/\s+(demo|rules)$/i, "").trim());
        else if (l.text) k.names.add(l.text.replace(/\s*\([^)]*\)\s*$/, "").replace(/\s+(idea|shape|demo)$/i, "").trim());
        if (band && day) { const w = `${band} ${day}`; if (!k.where.includes(w)) k.where.push(w); }
      });
    });
    Object.entries(byKey).forEach(([key, k]) => {
      seenOcc.push(["Weekly plans", key]);
      const e = entry(key, canonical(key));
      const seenN = new Set();
      const names = [...k.names].map((n) => n.replace(/\s*\([^)]*\)\s*$/, "").replace(/\s+(idea|shape|demo|rules|warm-up)$/i, "").trim())
        .filter((n) => n && !/youtube|physedgames|coach gelardi|daly exercise|prime coaching/i.test(n))
        .filter((n) => !seenN.has(normName(n)) && seenN.add(normName(n)));
      names.forEach((n) => e.games.add(n));
      const where = k.where.length ? ` (${k.where.join(", ")})` : "";
      addRef(e, { page: "weekly", label: `Weekly plan ${p.title}${names.length ? ": " + names.join(" / ") : ""}${where}`, href: `weekly-plans.html#${planId}` });
      if (monthName) e.months.add("weekly:" + monthName);
    });
  });

  // 7. Dodgeball cards
  const dodge = new Map((W.DODGE_GAMES || []).map((g) => [normName(g.name), g]));

  // name matcher (lesson text, month tables, dodgeball)
  const STOP = new Set(["numbers", "tag", "relay", "dance", "end zone"].map(normName));
  function namesOf(e) {
    const out = new Set();
    e.games.forEach((n) => {
      String(n).split(/\s*\/\s*/).forEach((part) => {
        const base = part.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
        if (base.length >= 4) out.add(base);
      });
      Object.entries(ALIASES).forEach(([alias, target]) => { if (normName(target) === normName(n)) out.add(alias); });
    });
    return [...out];
  }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/['’]/g, "['’]");
  const lessons = [];
  months.forEach((m) => (m.lessons || []).forEach((L) => {
    const text = [L.wu, L.skill, L.game, L.cd].map((x) => fill(x || "")).join(" \n ");
    lessons.push({ m: m.name, L, text });
  }));

  Object.values(V).forEach((e) => {
    const names = namesOf(e);
    names.forEach((n) => {
      const nn = normName(n);
      // Four Corners etc. are fine as exact multi-word phrases; skip only 1-word generic names
      if (STOP.has(nn)) return;
      const re = new RegExp("(^|[^A-Za-z])" + esc(n) + "(?![A-Za-z])", "i");
      lessons.forEach(({ m, L, text }) => {
        if (re.test(text)) {
          addRef(e, { page: "lessons", month: m, label: `${m} Week ${L.w} · Class ${L.c}: ${fill(L.title)}`, href: `month-${m.toLowerCase()}.html#w${L.w}-c${L.c}`, order: MONTH_ORDER.indexOf(m) * 100 + L.w * 10 + L.c });
          e.months.add("lesson:" + m);
        }
      });
      months.forEach((m) => {
        const bank = monthBank(m.name) || [];
        if (bank.some((r) => r && r[0] && normName(r[0]) === nn)) {
          addRef(e, { page: "monthgames", month: m.name, label: `${m.name} · Big-group games: ${bank.find((r) => normName(r[0]) === nn)[0]}`, href: `month-${m.name.toLowerCase()}.html#month-games`, order: MONTH_ORDER.indexOf(m.name) * 100 + 99 });
          e.months.add("table:" + m.name);
        }
      });
      const dg = dodge.get(nn);
      if (dg) addRef(e, { page: "dodgeball", label: `Dodgeball · ${dg.name}`, href: `dodgeball.html#${dg.slug}` });
    });
  });

  // curated clips still without a home: try the clip title in the lessons (e.g. "Log roll teaching points")
  Object.values(V).forEach((e) => {
    if (e.refs.length || !e.titles.length) return;
    const t = e.titles[0].replace(/\s+(teaching points|tutorial|demo|drill|how to)$/i, "").trim();
    if (t.length < 4) return;
    const re = new RegExp("(^|[^A-Za-z])" + esc(t) + "(?![A-Za-z])", "i");
    lessons.forEach(({ m, L, text }) => {
      if (re.test(text + " " + fill(L.title))) {
        addRef(e, { page: "lessons", month: m, label: `${m} Week ${L.w} · Class ${L.c}: ${fill(L.title)}`, href: `month-${m.toLowerCase()}.html#w${L.w}-c${L.c}`, order: MONTH_ORDER.indexOf(m) * 100 + L.w * 10 + L.c });
        e.months.add("lesson:" + m);
      }
    });
  });

  // ------------------------------------------------------------ finalize
  const PAGE_ORDER = ["lessons", "monthgames", "weekly", "games", "warmups", "newgames", "dodgeball"];
  const PAGE_LABEL = { lessons: "Month lessons", monthgames: "Month game tables", weekly: "Weekly plans", games: "Big-Group Games", warmups: "Warm Up Games", newgames: "New Games", dodgeball: "Dodgeball" };
  function primaryMonth(e) {
    for (const kind of ["lesson", "table", "unit", "weekly", "detail"]) {
      const hits = MONTH_ORDER.filter((mo) => e.months.has(kind + ":" + mo));
      if (hits.length) return hits[0];
    }
    return "";
  }
  const list = Object.values(V).map((e) => {
    const meta = (META.videos || {})[e.key] || {};
    const title = e.titles[0] || meta.title || e.labels[0] || [...e.games][0] || "Video";
    const channel = e.channels.filter(Boolean)[0] || meta.channel || "";
    const refs = e.refs.slice().sort((a, b) => PAGE_ORDER.indexOf(a.page) - PAGE_ORDER.indexOf(b.page) || (a.order || 0) - (b.order || 0) || a.label.localeCompare(b.label));
    refs.forEach((r) => { delete r.order; });
    const mo = primaryMonth(e);
    return {
      key: e.key,
      url: e.url,
      kind: e.key.startsWith("pl:") ? "playlist" : "video",
      title,
      channel,
      about: e.about || "",
      games: [...e.games],
      month: mo,
      unit: mo ? `${mo} · ${THEME[mo] || ""}` : "Any time",
      months: MONTH_ORDER.filter((x) => [...e.months].some((k) => k.endsWith(":" + x))),
      pages: PAGE_ORDER.filter((pg) => refs.some((r) => r.page === pg)),
      refs,
      status: meta.status || "unchecked",
      checked: meta.checked || "",
      ytTitle: meta.title || "",
    };
  });
  list.sort((a, b) => {
    const ma = a.month ? MONTH_ORDER.indexOf(a.month) : 99, mb = b.month ? MONTH_ORDER.indexOf(b.month) : 99;
    return ma - mb || a.title.localeCompare(b.title, "en");
  });
  const data = {
    count: list.length,
    occurrences: seenOcc.length,
    groups: MONTH_ORDER.map((mo) => ({ id: mo, label: `${mo} · ${THEME[mo]}`, href: `month-${mo.toLowerCase()}.html` })).concat([{ id: "", label: "Any time · not tied to a month", href: "" }]),
    pages: PAGE_ORDER.map((id) => ({ id, label: PAGE_LABEL[id] })),
    replacements: META.replacements || [],
    lastChecked: META.lastChecked || "",
    videos: list,
  };
  const js = "/* Video index for videos.html — GENERATED by tools/build.js (tools/videos.js).\n   Edit the source pages/data, then run: node tools/build.js */\nwindow.VIDEO_INDEX = " + JSON.stringify(data, null, 1) + ";\n";
  return { data, js };
};
module.exports.ytKey = ytKey;
module.exports.readDocx = readDocx;
