(function () {
  if (!document.querySelector('link[href="palette.css"]')) {
    const pal = document.createElement("link");
    pal.rel = "stylesheet";
    pal.href = "palette.css";
    document.head.appendChild(pal);
  }
  /* SITE:START — single source of truth for the nav and month list.
     tools/build.js reads this block to write the static <nav> in every HTML
     page, so the no-JS nav, the sidebar and the mobile nav always match.
     After editing, run: node tools/build.js */
  const MONTHS = [
    ["September", "Soccer"],
    ["October", "Football"],
    ["November", "Hockey"],
    ["December", "Games"],
    ["January", "Basketball"],
    ["February", "Ropes"],
    ["March", "Volleyball"],
    ["April", "Gymnastics"],
    ["May", "Track"],
    ["June", "Baseball"],
  ];
  const NAV = [
    ["index.html", "Year"],
    ["weekly-plans.html", "Weekly plans"],
    ["games.html", "Games"],
    ["warmup-nogym.html", "Warm Up Games"],
    ["dodgeball.html", "Dodgeball"],
    ["gymnastics.html", "Gymnastics"],
    ["track-day.html", "Track Day"],
    ["videos.html", "Videos"],
    ["outcomes.html", "Outcomes"],
    ["fitness.html", "Fitness"],
    ["how.html", "How to teach"],
  ];
  /* SITE:END */
  function monthFile(name) {
    return `month-${String(name).toLowerCase()}.html`;
  }
  function file() {
    return (location.pathname.split("/").pop() || "index.html") || "index.html";
  }
  function currentMonthName() {
    const sy = window.SCHOOL_YEAR;
    if (sy && sy.currentMonth) return sy.currentMonth().name;
    const n = new Date().getMonth(); // 0-11
    const order = [4, 5, 6, 7, 8, 9, null, null, 0, 1, 2, 3]; // Jan..Dec → index in MONTHS
    const i = order[n];
    return MONTHS[i == null ? 0 : i][0];
  }
  function pageMonth() {
    const f = file();
    const m = /^month-([a-z]+)\.html$/.exec(f);
    if (m) return m[1];
    return "";
  }
  function mark(href) {
    const f = file();
    if (href === "index.html") return f === "index.html" || f === "" || f === "pe-playbook";
    return f === href;
  }
  function link(href, ico, label, active) {
    return `<a class="nav-link${active ? " active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}><span class="nav-ico">${ico}</span>${label}</a>`;
  }
  function sidebar() {
    const pm = pageMonth();
    const main = NAV.map(([h, l], i) => link(h, String(i + 1).padStart(2, "0"), l, mark(h))).join("");
    const year = MONTHS.map(([name, sport], i) => {
      const active = pm === name.toLowerCase();
      return link(monthFile(name), String(i + 1).padStart(2, "0"), `${name.slice(0, 3)} · ${sport}`, active);
    }).join("");
    return `<nav aria-label="Site"><div class="nav-label">Playbook</div>${main}</nav><nav aria-label="Months"><div class="nav-label">Year</div>${year}</nav>`;
  }
  function topbar() {
    const cur = currentMonthName();
    return `<header class="topbar">
      <a class="brand" href="index.html">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 4v16M4 12h16M6.6 7.2c3 2.2 7.8 2.2 10.8 0M6.6 16.8c3-2.2 7.8-2.2 10.8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <span><span class="brand-title">SCA PE Playbook</span><span class="brand-sub">Alberta PEW · Grades 1–6 · 4 × 30 min</span></span>
      </a>
    </header>
    <nav class="mobile-nav" aria-label="Mobile">
      ${NAV.map(([h, l]) => `<a href="${h}"${mark(h) ? ' class="active" aria-current="page"' : ""}>${l}</a>`).join("")}
      <a href="${monthFile(cur)}">${cur}</a>
    </nav>`;
  }

  function ensureUpdatedStamp(repo) {
    if (document.querySelector(".site-updated-stamp")) return;
    const el = document.createElement("div");
    el.className = "site-updated-stamp no-print";
    el.setAttribute("aria-label", "Site last updated");
    el.textContent = "Updated …";
    document.body.insertBefore(el, document.body.firstChild);

    function formatStamp(iso) {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "Updated …";
      const formatted = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Edmonton",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(d);
      return `Updated ${formatted} MT`;
    }

    function fallback() {
      el.textContent = formatStamp(document.lastModified || new Date().toISOString());
    }

    fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`)
      .then((r) => {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then((data) => {
        const date = data?.[0]?.commit?.committer?.date;
        if (date) el.textContent = formatStamp(date);
        else fallback();
      })
      .catch(fallback);
  }

  function mount() {
    if (document.body.dataset.chrome === "1") return;
    document.body.dataset.chrome = "1";
    const oldHeader = document.querySelector("header.site, header.topbar");
    const main = document.querySelector("main");
    if (!main) return;
    if (oldHeader) oldHeader.remove();
    const wrap = document.createElement("div");
    wrap.className = "shell";
    const aside = document.createElement("aside");
    aside.className = "sidebar";
    aside.innerHTML = sidebar();
    main.replaceWith(wrap);
    wrap.appendChild(aside);
    wrap.appendChild(main);
    main.classList.add("main");
    document.body.insertAdjacentHTML("afterbegin", topbar());
    ensureUpdatedStamp("scaemrfung/pe-playbook");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
