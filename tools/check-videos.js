#!/usr/bin/env node
/*
 * Check every video in videos-data.js and record the result in videos-meta.json.
 *   node tools/check-videos.js            check all (network), write videos-meta.json
 *   node tools/check-videos.js --new      only videos never checked
 * Then run node tools/build.js to refresh videos-data.js.
 *
 * Method: YouTube oEmbed (200 = public video, gives title + channel;
 * 401/403 = exists but embedding is off, still watchable = ok-noembed;
 * 400/404 = removed/private = broken). Playlists: HTTP GET of the playlist page.
 * Broken links are listed on stdout with every page that uses them; replace them
 * in the source data only with a verified working video, and add an entry to
 * "replacements" in videos-meta.json (where, old, new, newTitle, reason).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const ONLY_NEW = process.argv.includes("--new");
const metaFile = path.join(ROOT, "videos-meta.json");
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, "utf8")) : { videos: {}, replacements: [] };
meta.videos = meta.videos || {};
const sb = {}; sb.window = sb; vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(ROOT, "videos-data.js"), "utf8"), sb);
const vids = sb.VIDEO_INDEX.videos;
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton" }).format(new Date());

async function check(v) {
  if (v.kind === "playlist") {
    const r = await fetch(v.url, { headers: { "Accept-Language": "en" } });
    const html = r.ok ? await r.text() : "";
    const ok = r.ok && !/"alerts":\[\{"alertRenderer".*?(does not exist|unavailable)/i.test(html);
    const t = /<meta property="og:title" content="([^"]*)"/.exec(html);
    return { status: ok ? "ok" : "broken", http: r.status, title: t ? t[1] : "" };
  }
  const u = "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(v.url);
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(u);
    if (r.status === 200) { const j = await r.json(); return { status: "ok", http: 200, title: j.title, channel: j.author_name }; }
    if (r.status === 401 || r.status === 403) return { status: "ok-noembed", http: r.status };
    if (r.status === 400 || r.status === 404) return { status: "broken", http: r.status };
    await new Promise((res) => setTimeout(res, 1500));
  }
  return { status: "unknown", http: 0 };
}
(async () => {
  const todo = vids.filter((v) => !ONLY_NEW || !meta.videos[v.key]);
  if (!todo.length) { console.log("no new videos to check"); return; }
  const broken = [];
  let i = 0;
  const pool = Array.from({ length: 6 }, async () => {
    while (i < todo.length) {
      const v = todo[i++];
      let res;
      try { res = await check(v); } catch (e) { res = { status: "unknown", error: String(e.message || e) }; }
      meta.videos[v.key] = Object.assign({}, meta.videos[v.key], res, { url: v.url, checked: today });
      if (res.status === "broken") broken.push(v);
    }
  });
  await Promise.all(pool);
  meta.lastChecked = today;
  const sorted = {};
  Object.keys(meta.videos).sort().forEach((k) => { sorted[k] = meta.videos[k]; });
  meta.videos = sorted;
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1) + "\n");
  const counts = {};
  Object.values(meta.videos).forEach((m) => { counts[m.status] = (counts[m.status] || 0) + 1; });
  console.log(`checked ${todo.length} · totals`, counts);
  broken.forEach((v) => console.log(`BROKEN ${v.url} — ${v.title}\n  used in: ${v.refs.map((r) => r.label).join(" | ")}`));
  process.exitCode = broken.length ? 2 : 0;
})();
