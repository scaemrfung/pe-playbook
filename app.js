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
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    const n = 2 + (h % 2); // 2 or 3
    return copy.slice(0, Math.min(n, copy.length));
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
    const sports = {
      September: ["Soccer", "goal"],
      October: ["Football", "flag"],
      November: ["Hockey", "hockey"],
      December: ["Games", "dice"],
      January: ["Basketball", "ball"],
      February: ["Ropes", "rope"],
      March: ["Volleyball", "volley"],
      April: ["Gymnastics", "gym"],
      May: ["Track", "timer"],
      June: ["Baseball", "base"],
    };
    const icons = {
      goal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
      flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M5 21V4h9l-1.5 4L14 12H5"/></svg>',
      hockey: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 20h7l9-16"/><circle cx="6" cy="18" r="2"/></svg>',
      dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
      ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 3c2 3 2 15 0 18M3 12c3-2 15-2 18 0"/></svg>',
      rope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
      volley: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M5 8c3 2 11 2 14 0M5 16c3-2 11-2 14 0"/></svg>',
      gym: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="5" r="2"/><path d="M8 22l4-9 4 9M5 12h14"/></svg>',
      timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/></svg>',
      base: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 20V8l8-4 8 4v12"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>',
    };
    grid.innerHTML = months.map((m, i) => {
      const n = m.lessons.length;
      const pair = sports[m.name] || [m.name, "goal"];
      const icon = icons[pair[1]] || icons.goal;
      const num = String(i + 1).padStart(2, "0");
      return `<a class="month-card" href="month.html?m=${encodeURIComponent(m.name)}">
        <div class="mc-top"><span class="mc-kicker">${num} · ${m.name}</span><span class="mc-icon">${icon}</span></div>
        <h3>${pair[0]}</h3>
        <p>${m.guide}</p>
        <span class="mc-go">${n} lessons →</span>
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
      const items = pickMonthOutcomes((o && o.items) || [], `${m.name}-${L.w}-${L.c}`);
      const outRow = items.length ? `<div class="row out"><div class="t">Outcomes</div>
            <div class="d">${items.map((it) => `<div><strong>${it.code}.</strong> ${it.look}</div>`).join("")}
            <span class="meta">PEW K–6 · LearnAlberta · 2–3 look-fors</span></div></div>` : "";
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
        <p class="note">These are the 30-minute classroom versions. Simplify for Grades 1–2: walk more, fewer taggers, skip grabbing games until Grade 3+. This table shows 2–3 look-fors per game. Open the game card for all seven PEW outcomes.</p>
        <table class="games">
          <thead><tr><th>Game</th><th>How we run it</th><th>Outcomes</th></tr></thead>
          <tbody>${bank.map((r) => {
          const sl = r[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const x = (window.GAME_EXTRAS || {})[r[0]] || {};
          const picked = pickMonthOutcomes(x.outcomes || [], r[0]);
          const out = picked.map((it) => `<strong>${it.code}.</strong> ${it.look}`).join("<br>");
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
    const monthBox = document.getElementById("month-filters");
    const MONTH_NAMES = ["September","October","November","December","January","February","March","April","May","June"];
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
    function typeOf(g) {
      if (g && typeof g === "object" && g.type) return g.type;
      const low = String((g && g.name) || g || "").toLowerCase();
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
      const ta = TYPES.findIndex((t) => t.id === typeOf(a));
      const tb = TYPES.findIndex((t) => t.id === typeOf(b));
      if (ta !== tb) return ta - tb;
      return a.name.localeCompare(b.name, "en");
    });
    const numbers = {};
    unique.forEach((g, i) => { numbers[g.name] = i + 1; });

    let activeType = "all";
    let activeMonth = "all";
    const urlQ = (qs.get("q") || "").trim();
    if (q && urlQ) q.value = urlQ;
    if (monthBox) {
      monthBox.innerHTML =
        `<button type="button" data-month="all" class="on">All months</button>` +
        MONTH_NAMES.map((n) => `<button type="button" data-month="${n}">${n.slice(0, 3)}</button>`).join("");
      monthBox.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-month]");
        if (!btn) return;
        activeMonth = btn.getAttribute("data-month");
        monthBox.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
        render();
      });
    }
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
        if (activeType !== "all" && typeOf(g) !== activeType) return false;
        if (activeMonth !== "all" && !(g.months || []).includes(activeMonth)) return false;
        const x = EX[g.name] || {};
        const hay = [g.name, g.source, g.purpose, (g.play || []).join(" "), (g.months || []).join(" "),
          (x.more || []).join(" "), (x.variations || []).join(" "), x.look || "", typeLabel(typeOf(g))].join(" ").toLowerCase();
        return !term || hay.includes(term);
      });

      if (indexBox) {
        const groups = TYPES.map((t) => ({
          ...t,
          games: filtered.filter((g) => typeOf(g) === t.id),
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
        games: filtered.filter((g) => typeOf(g) === t.id),
      })).filter((t) => t.games.length);

      const cards = cardGroups.map((group) => {
        const articles = group.games.map((g) => {
          const x = EX[g.name] || {};
          const more = (x.more || []).map((s) => `<li>${s}</li>`).join("");
          const cues = (x.cues || []).map((s) => `<li>${s}</li>`).join("");
          const vars = (x.variations || []).filter((s) => !/^source:|^credit:/i.test(s)).map((s) => `<li>${s}</li>`).join("");
          return `
          <article class="gcard" id="${gslug(g.name)}">
            <div class="ghead">
              <h2>${numbers[g.name]}. ${g.name}</h2>
              <span class="src">${group.label}</span>
            </div>
            <p class="meta"><strong>When:</strong> ${(g.months || []).join(", ") || "Anytime"} · <strong>Slot:</strong> ${g.slot || "—"}${x.numbers ? ` · ${x.numbers}` : ""}</p>
            <p>${g.purpose || ""}</p>
            <p class="meta"><strong>Equipment:</strong> ${g.equipment || ""}</p>
            <p class="meta"><strong>Set-up:</strong> ${g.setup || ""}</p>
            <p><strong>How we play</strong></p>
            <ol class="clean">${(g.play || []).map((s) => `<li>${s}</li>`).join("")}</ol>
            ${cues ? `<p><strong>Cues</strong></p><ul class="clean">${cues}</ul>` : ""}
            ${vars ? `<p><strong>Variations</strong></p><ul class="clean">${vars}</ul>` : ""}
            ${more ? `<p><strong>Teaching tips</strong></p><ul class="clean">${more}</ul>` : ""}
            ${videoHtml(g.name)}
            ${(() => {
              const outs = (x.outcomes && x.outcomes.length) ? x.outcomes : (x.look ? [{ code: "Look-for", look: x.look }] : []);
              if (!outs.length) return x.look ? `<p class="note"><strong>Look-for.</strong> ${x.look}</p>` : "";
              return `<div class="outcomes-box"><h3>Alberta PEW outcomes</h3><p class="note" style="margin:0 0 8px;font-style:normal">Pick one or two look-fors per class.</p><ul class="clean out-list">${outs.map((it) => `<li><strong>${it.code}.</strong> ${it.look}</li>`).join("")}</ul></div>`;
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
    const TYPES = [
      { id: "tag", label: "Tag & chase" },
      { id: "invasion", label: "Invasion & team" },
      { id: "target", label: "Target & send" },
      { id: "strike", label: "Strike & field" },
      { id: "relay", label: "Relays & stations" },
      { id: "loco", label: "Locomotor & listen" },
      { id: "coop", label: "Cooperative & circus" },
      { id: "fitness", label: "Fitness & landings" },
      { id: "dodge", label: "Dodgeball" },
      { id: "other", label: "Gymnastics & other" },
    ];
    const byName = {};
    (window.GAME_DETAILS || []).forEach((g) => { byName[String(g.name).toLowerCase()] = g.type || "loco"; });
    const dodgeNames = new Set((window.DODGE_GAMES || []).map((g) => String(g.name).toLowerCase()));
    function groupOf(v) {
      for (const n of v.games || []) {
        const low = String(n).toLowerCase();
        if (dodgeNames.has(low) || low.includes("dodgeball")) return "dodge";
        if (byName[low]) return byName[low];
      }
      if (/gymnast|log roll/i.test((v.title || "") + (v.about || ""))) return "other";
      return "other";
    }
    function render() {
      const term = ((q && q.value) || "").toLowerCase();
      const filtered = clips.filter((v) => {
        const hay = [v.title, v.channel, v.about, (v.games || []).join(" ")].join(" ").toLowerCase();
        return !term || hay.includes(term);
      });
      const html = TYPES.map((t) => {
        const group = filtered.filter((v) => groupOf(v) === t.id);
        if (!group.length) return "";
        return `<h2 style="margin:24px 0 8px;color:var(--navy)">${t.label}</h2>` + group.map((v) => `
        <article class="gcard">
          <div class="ghead"><h2>${v.title}</h2></div>
          <p class="meta">${v.channel}</p>
          <p>${v.about}</p>
          <p class="meta"><strong>Use with:</strong> ${(v.games || []).map((n) => {
            const sl = String(n).toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return `<a href="games.html#${sl}">${n}</a>`;
          }).join(" · ")}</p>
          <p class="yt"><a href="${v.url}" target="_blank" rel="noopener">Open on YouTube</a></p>
        </article>`).join("");
      }).join("");
      box.innerHTML = html || "<p>No matches.</p>";
    }
    if (q) q.addEventListener("input", render);
    render();
  }
})();
