(function () {
  const PE = window.PE;
  if (!PE) return;
  const { months, MONTH_GAMES, GLANCE } = PE;
  const UNIT = window.UNIT_OUTCOMES || {};

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
      <p class="note">Match report-card comments to the current learning outcome on LearnAlberta. Do not rank fitness scores.</p>
    </div>`;
  }

  const slug = (name) => name.toLowerCase();
  const qs = new URLSearchParams(location.search);
  const page = document.body.dataset.page;

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  if (page === "home") {
    const grid = document.getElementById("months");
    grid.innerHTML = months.map((m) => {
      const n = m.lessons.length;
      const g = (MONTH_GAMES[m.name] || []).length;
      return `<a class="card" href="month.html?m=${encodeURIComponent(m.name)}">
        <h2>${m.name}</h2>
        <p>${m.guide}</p>
        <div class="count">${n} lessons · ${g} booklet games</div>
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
    const bank = MONTH_GAMES[m.name] || [];
    const nav = months.map((x) =>
      `<a href="month.html?m=${encodeURIComponent(x.name)}" class="${x.name === m.name ? "active" : ""}">${x.name.slice(0, 3)}</a>`
    ).join("");

    let week = 0;
    const lessons = m.lessons.map((L) => {
      let head = "";
      if (L.w !== week) {
        week = L.w;
        head = `<h2 class="week-title">${m.name} · Week ${week}</h2>`;
      }
      return head + `<article class="lesson" data-week="${L.w}">
        <div class="top"><h3>W${L.w} · C${L.c} — ${L.title}</h3><small>${L.focus}</small></div>
        <div class="rows">
          <div class="row"><div class="t">0–5</div><div class="d">${L.wu}</div></div>
          <div class="row"><div class="t">5–16</div><div class="d">${L.skill}</div></div>
          <div class="row game"><div class="t">16–25</div><div class="d">${L.game}</div></div>
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
        <h2>Games from your booklets this month</h2>
        <p class="note">SF = Sure Fire Games (Larson). GA = school Games and Activities. Use the booklet for diagrams; this is the 30-minute classroom version. Division II–IV games are simplified for Grades 1–2.</p>
        <table class="games">
          <thead><tr><th>Game</th><th>Source</th><th>How we run it</th></tr></thead>
          <tbody>${bank.map((r) => {
          const sl = r[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return `<tr><td><strong><a href="games.html#${sl}">${r[0]}</a></strong></td><td>${r[1]}</td><td>${r[2]}</td></tr>`;
        }).join("")}</tbody>
        </table>
      </div>
      ${lessons}
    `;
  }

  if (page === "games") {
    const q = document.getElementById("q");
    const box = document.getElementById("list");
    const details = window.GAME_DETAILS || [];
    function gslug(name) {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    function render() {
      const term = (q.value || "").toLowerCase();
      const cards = details.filter((g) => {
        const hay = [g.name, g.source, g.purpose, g.play.join(" "), (g.months || []).join(" ")].join(" ").toLowerCase();
        return !term || hay.includes(term);
      }).map((g) => `
        <article class="gcard" id="${gslug(g.name)}">
          <div class="ghead">
            <h2>${g.name}</h2>
            <span class="src">${g.source}</span>
          </div>
          <p class="meta"><strong>When:</strong> ${(g.months || []).join(", ")} · <strong>Slot:</strong> ${g.slot}</p>
          <p>${g.purpose}</p>
          <p class="meta"><strong>Equipment:</strong> ${g.equipment}</p>
          <p class="meta"><strong>Set-up:</strong> ${g.setup}</p>
          <p><strong>How we play</strong></p>
          <ol class="clean">${g.play.map((s) => `<li>${s}</li>`).join("")}</ol>
          <div class="bands-block">
            <div><strong>Grades 1–2.</strong> ${g.g12}</div>
            <div><strong>Grades 3–4.</strong> ${g.g34}</div>
            <div><strong>Grades 5–6.</strong> ${g.g56}</div>
          </div>
          <p class="note"><strong>Safety.</strong> ${g.safety}</p>
        </article>`).join("");
      box.innerHTML = cards || "<p>No matches.</p>";
    }
    q.addEventListener("input", render);
    render();
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView();
    }
  }
})();
