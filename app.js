(function () {
  function videoHtml(name) {
    const v = (window.YOUTUBE || {})[name];
    if (!v) return "";
    return `<p class="yt"><a href="${v.url}" target="_blank" rel="noopener">Watch: ${v.title}</a>${v.note ? ` <span class="meta">${v.note}</span>` : ""}</p>`;
  }

  const page = document.body && document.body.dataset.page;
  const PE = window.PE;
  if (!PE && page !== "videos") return;
  const { months, MONTH_GAMES, GLANCE } = PE || { months: [], MONTH_GAMES: {}, GLANCE: [] };
  const UNIT = window.UNIT_OUTCOMES || {};
  const K2M = window.K2_MONTH_GAMES || {};
  const G36M = window.G36_MONTH_GAMES || {};
  
  function gslug(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function gameCatalog() {
    const names = new Set(Object.keys(window.GAME_EXTRAS || {}));
    [].concat(window.GAME_DETAILS || [], window.K2_DETAILS || [], window.G36_DETAILS || []).forEach((g) => {
      if (g && g.name) names.add(g.name);
    });
    const aliases = {
      "Red Light, Green Light": "Traffic Lights (kick)",
      "Red Light": "Traffic Lights (kick)",
      "Pac-Man": "Line Tag / Pac-Man",
      "Line Tag": "Line Tag / Pac-Man",
      "Sharks and Minnows": "Sharks and Dolphins",
      "Captain’s Coming": "Captain’s Deck / Shipwreck",
      "Captain's Coming": "Captain’s Deck / Shipwreck",
      "Shipwreck": "Captain’s Deck / Shipwreck",
      "Captain’s Deck": "Captain’s Deck / Shipwreck",
      "Freeze Tag": "Frozen Tag",
      "Newcomb": "FLY BACK",
      "Kickball": "Continuous Kick Ball",
      "Continuous Kickball": "Continuous Kick Ball",
      "Beat Ball": "Beat Ball / Beat the Ball",
      "End-zone catch": "End Zone Ball",
      "End-zone beanbag": "End Zone Ball",
      "Clean Your Room": "Clean Your Room",
      "Rob the Nest": "Rob the Nest (dribble)",
      "Robin’s Nest": "Robin’s Nest",
      "Four Corner Flags": "Four Corner Flags",
      "Capture the Flag": "Four Corner Flags",
      "Parachute popcorn": "Parachute popcorn / dome / cat-and-mouse",
      "parachute popcorn": "Parachute popcorn / dome / cat-and-mouse",
      "Helicopter": "Helicopter / Snake rope",
      "Snake rope": "Helicopter / Snake rope",
      "Tripod Tag": "Tripod Tag",
      "Human Bop-It": "Human Bop-It",
      "Video Game": "Video Game",
      "Chuck the Chicken": "Chuck the Chicken",
      "Wall Soccer": "Wall Soccer",
      "Skittles": "Skittles",
      "Hospital Tag": "Hospital Tag",
      "Hot Dog Tag": "Hot Dog Tag",
      "Blob Tag": "Blob Tag",
      "Octopus": "Octopus",
      "Sharks and Dolphins": "Sharks and Dolphins"
    };
    return { names, aliases };
  }

  function linkGameText(text) {
    if (!text) return text;
    const { names, aliases } = gameCatalog();
    const keys = [];
    names.forEach((n) => keys.push([n, n]));
    Object.keys(aliases).forEach((a) => keys.push([a, aliases[a]]));
    keys.sort((a, b) => b[0].length - a[0].length);
    let out = text;
    const used = [];
    keys.forEach(([label, target]) => {
      if (!names.has(target) && target !== label) {
        // still link if extras or details has it
        if (!(window.GAME_EXTRAS || {})[target] && !names.has(target)) return;
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
    return [].concat(MONTH_GAMES[name] || [], K2M[name] || [], G36M[name] || []);
  }

  function outcomesBlock(name) {
    const u = UNIT[name];
    if (!u) return "";
    return `<div class="panel outcomes">
      <h2>Outcomes and assessment</h2>
      <p class="meta"><strong>Alberta PEW organizing ideas:</strong> ${u.oi.join(" · ")}</p>
      <p>${u.why}</p>
      <div class="out-grid">
        <div><h3>Grades 1–2</h3><ul class="clean">${u.g12.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div><h3>Grades 3–4</h3><ul class="clean">${u.g34.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div><h3>Grades 5–6</h3><ul class="clean">${u.g56.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
      <h3>How you might assess this month</h3>
      <table class="games">
        <thead><tr><th>What</th><th>How</th><th>Look-for / evidence</th></tr></thead>
        <tbody>${u.assess.map((a) => `<tr><td><strong>${a.what}</strong></td><td>${a.how}</td><td>${a.evidence}</td></tr>`).join("")}</tbody>
      </table>
      <p class="note">Each lesson also lists 2000 Program of Studies codes (A/B/C/D). PEW is the current K–6 curriculum. Match report-card comments to LearnAlberta. Do not rank fitness scores.</p>
    </div>`;
  }

  const slug = (name) => name.toLowerCase();
  const qs = new URLSearchParams(location.search);
  // page already set

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  if (page === "home") {
    const grid = document.getElementById("months");
    grid.innerHTML = months.map((m) => {
      const n = m.lessons.length;
      const g = monthBank(m.name).length;
      return `<a class="card" href="month.html?m=${encodeURIComponent(m.name)}">
        <h2>${m.name}</h2>
        <p>${m.guide}</p>
        <div class="count">${n} lessons · ${g} big-group games · outcomes + assessment</div>
      </a>`;
    }).join("");
  }

  if (page === "month") {
    const name = qs.get("m") || "September";
    const m = months.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (!m) {
      document.getElementById("content").innerHTML = "<p>Month not found.</p>";
      return;
    }
    document.title = m.name + " · PE Playbook";
    const bank = monthBank(m.name);
    const nav = months.map((x) =>
      `<a href="month.html?m=${encodeURIComponent(x.name)}" class="${x.name === m.name ? "active" : ""}">${x.name.slice(0, 3)}</a>`
    ).join("");

    let week = 0;
    const LO = window.LESSON_OUTCOMES || {};
    const lessons = m.lessons.map((L) => {
      let head = "";
      if (L.w !== week) {
        week = L.w;
        head = `<h2 class="week-title">${m.name} · Week ${week}</h2>`;
      }
      const o = LO[`${m.name}-${L.w}-${L.c}`];
      const items = (o && o.items) || [];
      const outRow = items.length ? `<div class="row out"><div class="t">Outcomes</div>
            <div class="d">${items.map((it) => `<div><strong>${it.code}.</strong> ${it.look}</div>`).join("")}
            <span class="meta">2000 POS — write the grade in the code (D3–3 for Grade 3).</span></div></div>` : "";
      return head + `<article class="lesson" data-week="${L.w}">
        <div class="top"><h3>W${L.w} · C${L.c} — ${L.title}</h3><small>${L.focus}</small></div>
        <div class="rows">
          ${outRow}
          <div class="row"><div class="t">0–5</div><div class="d">${L.wu}</div></div>
          <div class="row"><div class="t">5–16</div><div class="d">${L.skill}</div></div>
          <div class="row game"><div class="t">16–25</div><div class="d">${linkGameText(L.game)}</div></div>
          <div class="row"><div class="t">25–30</div><div class="d">${L.cd}</div></div>
          <div class="row bands"><div class="t">1–2 / 3–4 / 5–6</div>
            <div class="d"><strong>1–2:</strong> ${L.g12} &nbsp;·&nbsp; <strong>3–4:</strong> ${L.g34} &nbsp;·&nbsp; <strong>5–6:</strong> ${L.g56}</div>
          </div>
        </div>
      </article>`;
    }).join("");

    document.getElementById("content").innerHTML = `
      <div class="month-head">
        <p class="note">${nav}</p>
        <h1>${m.name}</h1>
        <p class="meta"><strong>Month focus:</strong> ${m.guide}</p>
        <p class="meta"><strong>Alberta PEW focus:</strong> ${m.pew}</p>
        <p class="meta"><strong>Equipment:</strong> ${m.equipment}</p>
        <p class="meta"><strong>Fitness update:</strong> ${m.fitness}</p>
        <p class="note">${m.notes}</p>
      </div>
      ${outcomesBlock(m.name)}
      <div class="clock">
        <div><b>0–5 min</b>Warm-up</div>
        <div><b>5–16 min</b>Skill / main</div>
        <div><b>16–25 min</b>Big-group game</div>
        <div><b>25–30 min</b>Cool-down</div>
      </div>
      <div class="panel">
        <h2>Big-group games this month</h2>
        <p class="note">These are the 30-minute classroom versions. Simplify for Grades 1–2: walk more, fewer taggers, skip grabbing games until Grade 3+.</p>
        <table class="games">
          <thead><tr><th>Game</th><th>How we run it</th><th>Outcomes</th></tr></thead>
          <tbody>${bank.map((r) => {
          const sl = r[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const x = (window.GAME_EXTRAS || {})[r[0]] || {};
          const out = (x.outcomes || []).map((it) => `<strong>${it.code}.</strong> ${it.look}`).join("<br>");
          return `<tr><td><strong><a href="games.html#${sl}">${r[0]}</a></strong></td><td>${r[2]}</td><td>${out}</td></tr>`;
        }).join("")}</tbody>
        </table>
      </div>
      ${lessons}
    `;
  }

  if (page === "games") {
    const q = document.getElementById("q");
    const box = document.getElementById("list");
    const details = [].concat(window.GAME_DETAILS || [], window.K2_DETAILS || [], window.G36_DETAILS || []);
    function gslug(name) {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    function render() {
      const term = (q.value || "").toLowerCase();
      const EX = window.GAME_EXTRAS || {};
      const cards = details.filter((g) => {
        const x = EX[g.name] || {};
        const hay = [g.name, g.source, g.purpose, g.play.join(" "), (g.months || []).join(" "),
          (x.more || []).join(" "), (x.variations || []).join(" "), x.look || ""].join(" ").toLowerCase();
        return !term || hay.includes(term);
      }).map((g) => {
        const x = EX[g.name] || {};
        const more = (x.more || []).map((s) => `<li>${s}</li>`).join("");
        const cues = (x.cues || []).map((s) => `<li>${s}</li>`).join("");
        const vars = (x.variations || []).map((s) => `<li>${s}</li>`).join("");
        return `
        <article class="gcard" id="${gslug(g.name)}">
          <div class="ghead">
            <h2>${g.name}</h2>
          </div>
          <p class="meta"><strong>When:</strong> ${(g.months || []).join(", ")} · <strong>Slot:</strong> ${g.slot}${x.numbers ? ` · ${x.numbers}` : ""}</p>
          <p>${g.purpose}</p>
          <p class="meta"><strong>Equipment:</strong> ${g.equipment}</p>
          <p class="meta"><strong>Set-up:</strong> ${g.setup}</p>
          <p><strong>How we play</strong></p>
          <ol class="clean">${g.play.map((s) => `<li>${s}</li>`).join("")}${more}</ol>
          ${cues ? `<p><strong>Cues</strong></p><ul class="clean">${cues}</ul>` : ""}
          ${vars ? `<p><strong>Variations</strong></p><ul class="clean">${vars}</ul>` : ""}
          ${x.look ? `<p class="note"><strong>Look-for.</strong> ${x.look}</p>` : ""}
          ${x.outcomes ? `<p><strong>Outcomes</strong></p><ul class="clean">${x.outcomes.map((it) => `<li><strong>${it.code}.</strong> ${it.look}</li>`).join("")}</ul>` : ""}
          <div class="bands-block">
            <div><strong>Grades 1–2.</strong> ${g.g12}</div>
            <div><strong>Grades 3–4.</strong> ${g.g34}</div>
            <div><strong>Grades 5–6.</strong> ${g.g56}</div>
          </div>
          <p class="note"><strong>Safety.</strong> ${g.safety}</p>
        </article>`;
      }).join("");
      const ps = window.PAIR_STATIONS;
      let stations = "";
      if (ps && !term) {
        stations = `<div class="panel" id="pair-stations"><h2>${ps.title}</h2><p>${ps.intro}</p>` +
          ps.groups.map((g) => `<h3>${g.name}</h3><table class="games"><thead><tr><th>Station</th><th>How we run it (60–90 s)</th></tr></thead><tbody>${g.items.map((i) => `<tr><td><strong>${i[0]}</strong></td><td>${i[1]}</td></tr>`).join("")}</tbody></table>`).join("") +
          "</div>";
      }
      box.innerHTML = (cards || "<p>No matches.</p>") + stations;
    }
    q.addEventListener("input", render);
    render();
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView();
    }
  }

  if (page === "videos") {
    const q = document.getElementById("q");
    const box = document.getElementById("list");
    const clips = window.VIDEOS || [];
    function render() {
      const term = ((q && q.value) || "").toLowerCase();
      const cards = clips.filter((v) => {
        const hay = [v.title, v.channel, v.about, (v.games || []).join(" ")].join(" ").toLowerCase();
        return !term || hay.includes(term);
      }).map((v) => `
        <article class="gcard">
          <div class="ghead"><h2>${v.title}</h2></div>
          <p class="meta">${v.channel}</p>
          <p>${v.about}</p>
          <p class="meta"><strong>Use with:</strong> ${(v.games || []).join(" · ")}</p>
          <p class="yt"><a href="${v.url}" target="_blank" rel="noopener">Open on YouTube</a></p>
        </article>`).join("");
      box.innerHTML = cards || "<p>No matches.</p>";
    }
    if (q) q.addEventListener("input", render);
    render();
  }
})();
