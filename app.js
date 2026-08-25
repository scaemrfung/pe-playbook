(function () {
  function videoHtml(name) {
    const clips = window.VIDEOS || [];
    if (!name) return "";
    const hit = clips.filter((v) => (v.games || []).some((g) => g.toLowerCase() === String(name).toLowerCase()));
    if (!hit.length) return "";
    return `<p class="yt"><strong>Video.</strong> ${hit.map((v) => `<a href="${v.url}" target="_blank" rel="noopener">${v.title}</a> <span class="meta">(${v.channel})</span>`).join(" · ")}</p>
      <p class="meta">Clips are demos. Our house rules still apply (no elimination, soft tag; dodgeballs stay on the Dodgeball page).</p>`;
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
    [].concat(window.GAME_DETAILS || [], window.K2_DETAILS || [], window.G36_DETAILS || [], window.SKILL_DETAILS || [], window.BG30_DETAILS || []).forEach((g) => {
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

const SKILLM = window.SKILL_MONTH_GAMES || {};
  const BG30 = window.BG30_MONTH || {};
  function monthBank(name) {
    return [].concat(MONTH_GAMES[name] || [], K2M[name] || [], G36M[name] || [], SKILLM[name] || [], BG30[name] || []);
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
      <p class="note">Outcomes follow Physical Education and Wellness K–6 (LearnAlberta, current curriculum). Match report-card comments to the learning outcome on LearnAlberta. Do not rank fitness scores.</p>
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
    document.title = m.name + " · SCA Elementary PE Playbook";
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
            <span class="meta">PEW K–6 · LearnAlberta</span></div></div>` : "";
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
    const indexBox = document.getElementById("game-index");
    const filterBox = document.getElementById("type-filters");
    const details = [].concat(window.GAME_DETAILS || [], window.K2_DETAILS || [], window.G36_DETAILS || [], window.SKILL_DETAILS || [], window.BG30_DETAILS || []);
    const TYPES = [
      { id: "tag", label: "Tag & chase" },
      { id: "invasion", label: "Invasion & team" },
      { id: "target", label: "Target & send" },
      { id: "strike", label: "Strike & field" },
      { id: "relay", label: "Relays & stations" },
      { id: "loco", label: "Locomotor & listen" },
      { id: "coop", label: "Cooperative & circus" },
      { id: "fitness", label: "Fitness & landings" },
    ];
    const TYPE_WORDS = {
      tag: ["hospital tag","hot dog tag","line tag","sharks and dolphins","frozen tag","clothespin","blob tag","tripod tag","bug tag","chicken checkers","octopus","shadow tag","waspital","icebergs","tail tag","survivor tag","ten-second","wake-up","wolf","tunnel freeze","everybody","duck duck","squirrel","mr. clean","buzz off","slap rover","kangaroos"],
      invasion: ["switch","wall soccer","team tag","end zone","booger","four corner flags","stones","fruit salad","traffic lights","through the gates","rob the nest","captain ball","collect the treasure","numbers hockey","go for goal","reverse soccer","end ball","hurley","guard the gates","crab football","heist","perfect pass","capture the egg","cornerball","protect the king","steal the bacon"],
      target: ["robin","skittles","card sharks","fly back","bucket ball","tidy the bedroom","protect the castle","skittle ball","team bowling","battleships","poison ball","slide sling","flying saucers","survivor dodgeball","frisbee","low-ball","guard the cone","tunnel kick","hockey pin","punt to the line","overarm"],
      strike: ["chuck the chicken","continuous kick","beat ball","thunderball","aces","rps rounders","barkball","quick baseball","jailbreakers","diamond strike","kick it","hit and run","striking"],
      relay: ["rescue relay","hungry snake","pip, squeak","around the bases","cone relay","memory relay","attention relay","dash and dribble","plant the trees","jungle run","speed run","zig-zag","crab-bear","hop-the-hoops","soccer weave","toe-tap","wall chest","throw-clap","hoop underhand","dribble the gates","hockey hurdle","circle run"],
      loco: ["captain’s deck","captain's deck","rikki","buffalo","laps and lines","european rhythmic","human bop","video game","rubber band","signals","daytime","volcanoes","crazy beans","group numbers","land and sea","here, there","follow the leader","silly bananas","back to base","dash for safety","four corners stay","elements","simon says","moving","bouncing"],
      coop: ["elves","invent-a-game","helicopter","sharks and dolphins (chute)","object toss","parachute","slippery snakes","balloon keep-up","birthday","circle hoop","cross the river","human knot","pulse race","caterpillar","bucket carry","voice path"],
      fitness: ["mass challenges","magic numbers","body-part","frogs on the lily","safe to shore","beanbag head","knee-ball","racquet waiter","balloon keep-up station","floor rope","spot-jump","throwing and catching","kicking"],
    };
    function gslug(name) {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    function typeOf(name) {
      const low = String(name || "").toLowerCase();
      for (const t of TYPES) {
        for (const w of TYPE_WORDS[t.id] || []) {
          if (low.includes(w)) return t.id;
        }
      }
      return "loco";
    }
    function typeLabel(id) {
      const hit = TYPES.find((t) => t.id === id);
      return hit ? hit.label : id;
    }
    // Deduplicate by name, keep first
    const seen = new Set();
    const unique = [];
    details.forEach((g) => {
      if (!g || !g.name || seen.has(g.name)) return;
      seen.add(g.name);
      unique.push(g);
    });
    unique.sort((a, b) => {
      const ta = TYPES.findIndex((t) => t.id === typeOf(a.name));
      const tb = TYPES.findIndex((t) => t.id === typeOf(b.name));
      if (ta !== tb) return ta - tb;
      return a.name.localeCompare(b.name, "en");
    });
    const numbers = {};
    unique.forEach((g, i) => { numbers[g.name] = i + 1; });

    let activeType = "all";
    if (filterBox) {
      filterBox.innerHTML =
        `<button type="button" data-type="all" class="on">All types</button>` +
        TYPES.map((t) => `<button type="button" data-type="${t.id}">${t.label}</button>`).join("");
      filterBox.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-type]");
        if (!btn) return;
        activeType = btn.getAttribute("data-type");
        filterBox.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
        render();
      });
    }

    function render() {
      const term = (q && q.value || "").toLowerCase();
      const EX = window.GAME_EXTRAS || {};
      const filtered = unique.filter((g) => {
        if (activeType !== "all" && typeOf(g.name) !== activeType) return false;
        const x = EX[g.name] || {};
        const hay = [g.name, g.source, g.purpose, (g.play || []).join(" "), (g.months || []).join(" "),
          (x.more || []).join(" "), (x.variations || []).join(" "), x.look || "", typeLabel(typeOf(g.name))].join(" ").toLowerCase();
        return !term || hay.includes(term);
      });

      if (indexBox) {
        const groups = TYPES.map((t) => ({
          ...t,
          games: filtered.filter((g) => typeOf(g.name) === t.id),
        })).filter((t) => t.games.length);
        indexBox.innerHTML = groups.map((group) =>
          `<h3 style="margin:16px 0 6px;color:var(--green);font-size:.92rem;text-transform:uppercase;letter-spacing:.08em">${group.label}</h3>
           <ol class="jump-list numbered">${group.games.map((g) =>
             `<li><a href="#${gslug(g.name)}"><span style="color:var(--navy);font-weight:800">${numbers[g.name]}.</span> ${g.name}</a></li>`
           ).join("")}</ol>`
        ).join("");
      }

      const cardGroups = TYPES.map((t) => ({
        ...t,
        games: filtered.filter((g) => typeOf(g.name) === t.id),
      })).filter((t) => t.games.length);

      const cards = cardGroups.map((group) => {
        const articles = group.games.map((g) => {
          const x = EX[g.name] || {};
          const more = (x.more || []).map((s) => `<li>${s}</li>`).join("");
          const cues = (x.cues || []).map((s) => `<li>${s}</li>`).join("");
          const vars = (x.variations || []).map((s) => `<li>${s}</li>`).join("");
          return `
          <article class="gcard" id="${gslug(g.name)}">
            <div class="ghead">
              <h2>${numbers[g.name]}. ${g.name}</h2>
            </div>
            <p class="meta"><strong>Type:</strong> ${group.label} · <strong>When:</strong> ${(g.months || []).join(", ") || "Anytime"} · <strong>Slot:</strong> ${g.slot || "—"}${x.numbers ? ` · ${x.numbers}` : ""}</p>
            <p>${g.purpose || ""}</p>
            <p class="meta"><strong>Equipment:</strong> ${g.equipment || ""}</p>
            <p class="meta"><strong>Set-up:</strong> ${g.setup || ""}</p>
            <p><strong>How we play</strong></p>
            <ol class="clean">${(g.play || []).map((s) => `<li>${s}</li>`).join("")}${more}</ol>
            ${cues ? `<p><strong>Cues</strong></p><ul class="clean">${cues}</ul>` : ""}
            ${vars ? `<p><strong>Variations</strong></p><ul class="clean">${vars}</ul>` : ""}
            ${videoHtml(g.name)}${x.look ? `<p class="note"><strong>Look-for.</strong> ${x.look}</p>` : ""}
            ${(() => {
              const outs = (x.outcomes && x.outcomes.length) ? x.outcomes : (x.look ? [{ code: "Look-for", look: x.look }] : []);
              if (!outs.length) return "";
              return `<div class="outcomes-box"><h3>Alberta PEW outcomes</h3><ul class="clean">${outs.map((it) => `<li><strong>${it.code}.</strong> ${it.look}</li>`).join("")}</ul></div>`;
            })()}
            <div class="bands-block">
              <div><strong>Grades 1–2.</strong> ${g.g12 || ""}</div>
              <div><strong>Grades 3–4.</strong> ${g.g34 || ""}</div>
              <div><strong>Grades 5–6.</strong> ${g.g56 || ""}</div>
            </div>
            <p class="note"><strong>Safety.</strong> ${g.safety || ""}</p>
          </article>`;
        }).join("");
        return `<h2 class="week-title">${group.label}</h2>${articles}`;
      }).join("");

      const ps = window.PAIR_STATIONS;
      let stations = "";
      if (ps && !term && activeType === "all") {
        stations = `<div class="panel" id="pair-stations"><h2>${ps.title}</h2><p>${ps.intro}</p>` +
          ps.groups.map((g) => `<h3>${g.name}</h3><table class="games"><thead><tr><th>Station</th><th>How we run it (60–90 s)</th></tr></thead><tbody>${g.items.map((i) => `<tr><td><strong>${i[0]}</strong></td><td>${i[1]}</td></tr>`).join("")}</tbody></table>`).join("") +
          "</div>";
      }
      box.innerHTML = (cards || "<p>No matches.</p>") + stations;
    }
    if (q) q.addEventListener("input", render);
    render();
    if (location.hash) {
      setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) target.scrollIntoView();
      }, 50);
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
