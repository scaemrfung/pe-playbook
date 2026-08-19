(function () {
  const PE = window.PE;
  if (!PE) return;
  const { months, MONTH_GAMES, GLANCE } = PE;

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
        <p class="meta"><strong>From the Grade 1A yearly plan:</strong> ${m.guide}</p>
        <p class="meta"><strong>Alberta PEW focus:</strong> ${m.pew}</p>
        <p class="meta"><strong>Equipment:</strong> ${m.equipment}</p>
        <p class="meta"><strong>Fitness update:</strong> ${m.fitness}</p>
        <p class="note">${m.notes}</p>
      </div>
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
          <tbody>${bank.map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      ${lessons}
    `;
  }

  if (page === "games") {
    const q = document.getElementById("q");
    const box = document.getElementById("list");
    function render() {
      const term = (q.value || "").toLowerCase();
      const rows = [];
      for (const [month, list] of Object.entries(MONTH_GAMES)) {
        for (const r of list) {
          const hay = (month + " " + r.join(" ")).toLowerCase();
          if (term && !hay.includes(term)) continue;
          rows.push(`<tr><td><strong>${r[0]}</strong></td><td>${month}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`);
        }
      }
      box.innerHTML = rows.length
        ? `<table class="games"><thead><tr><th>Game</th><th>Month</th><th>Source</th><th>How we run it</th></tr></thead><tbody>${rows.join("")}</tbody></table>`
        : "<p>No matches.</p>";
    }
    q.addEventListener("input", render);
    render();
  }
})();
