/* Renamed games (Sep 27 2026, approved by Mr. Fung): old names still find the
   game in search (window.oldNamesFor) and old #anchors jump to the new card. */
(function () {
  var NAMES = {
 "Chinese Wall": "Castle Wall",
 "Hula Hut Knock Down": "Hoop Hut Knock Down",
 "Hula Hut / Hula Stick": "Hoop Hut / Hoop Stick",
 "Hula-hoop ball collect": "Hoop ball collect",
 "Hula Hut": "Hoop Hut",
 "Hula Balance": "Hoop Balance",
 "Hula Stick": "Hoop Stick",
 "Hulahoop Madness": "Hoop Madness",
 "Hula Hoop Madness": "Hoop Madness",
 "Hula hoop madness": "Hoop madness",
 "Hula Hoop Twister": "Hoop Twister",
 "Hula Hoop Bowling": "Hoop Target Bowling",
 "Hula hoop twirl": "Hoop twirl",
 "Gauntlet run": "Dodge Lane",
 "Gauntlet Run": "Dodge Lane",
 "Rikki Tikki": "Mongoose Tag",
 "Ultimate Warriors": "Three-Court Dodgeball",
 "Crazy Ball Soccer": "Wild Ball Soccer",
 "Crazy Beans": "Jumping Beans",
 "Crazy beans": "Jumping beans"
};
  var IDS = {
 "hula-hut-knock-down": "hoop-hut-knock-down",
 "hula-hut": "hoop-hut",
 "hula-balance": "hoop-balance",
 "hula-stick": "hoop-stick",
 "hulahoop-madness": "hoop-madness",
 "hula-hoop-twister": "hoop-twister",
 "hula-hoop-bowling": "hoop-target-bowling",
 "hula-hoop-twirl": "hoop-twirl",
 "hula-hoop-ball-collect": "hoop-ball-collect",
 "ultimate-warriors": "three-court-dodgeball",
 "crazy-ball-soccer": "wild-ball-soccer",
 "crazy-beans": "jumping-beans",
 "rikki-tikki": "mongoose-tag",
 "chinese-wall": "castle-wall",
 "gauntlet-run": "dodge-lane",
 "gauntlet": "dodge-lane"
};
  window.RENAMED_GAMES = NAMES;
  window.oldNamesFor = function (name) {
    return Object.keys(NAMES).filter(function (o) { return NAMES[o] === name; }).join(" ");
  };
  function fix(replace) {
    var h = decodeURIComponent((location.hash || "").slice(1));
    if (!IDS[h]) return;
    if (replace) location.replace("#" + IDS[h]);
    else history.replaceState(null, "", location.pathname + location.search + "#" + IDS[h]);
  }
  fix(false);
  window.addEventListener("hashchange", function () { fix(true); });
})();
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
    ["September", "Soccer and Football"],
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
  /* Top nav: six items. Games, Plans, Outcomes and More each have a short
     section menu (SUBNAV) that shows under them. "Month" opens the current month. */
  const NAV = [
    ["index.html", "This week"],
    ["games-hub.html", "Games"],
    ["weekly-plans.html", "Plans"],
    ["month.html", "Month"],
    ["outcomes.html", "Outcomes"],
    ["more.html", "More"],
  ];
  const SUBNAV = {
    "games-hub.html": [
      ["games.html", "Big-Group Games"],
      ["new-games.html", "New Games"],
      ["warmup-nogym.html", "Warm Up Games"],
      ["dodgeball.html", "Dodgeball"],
    ],
    "outcomes.html": [
      ["outcomes.html", "Outcomes"],
      ["rubric.html", "Sample rubric"],
    ],
    "more.html": [
      ["gymnastics.html", "Gymnastics"],
      ["track-day.html", "Track Day"],
      ["fitness.html", "Fitness"],
      ["how.html", "How to teach"],
      ["indigenous.html", "Indigenous games"],
    ],
  };
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
  /* Which top-nav item a page belongs to (month pages -> Month, section pages -> their menu). */
  function groupKey(f) {
    if (f === "" || f === "index.html" || f === "pe-playbook") return "index.html";
    if (/^month(-[a-z]+)?\.html$/.test(f)) return "month.html";
    if (f === "search.html") return "games-hub.html";
    for (const k of Object.keys(SUBNAV)) if (k === f || SUBNAV[k].some(([h]) => h === f)) return k;
    return NAV.some(([h]) => h === f) ? f : "";
  }
  function navHref(h) {
    return h === "month.html" ? monthFile(currentMonthName()) : h;
  }
  function link(href, ico, label, active) {
    return `<a class="nav-link${active ? " active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}><span class="nav-ico">${ico}</span>${label}</a>`;
  }
  function sidebar() {
    const pm = pageMonth();
    const f = file();
    const g = groupKey(f);
    const main = NAV.map(([h, l], i) => {
      let html = link(navHref(h), String(i + 1).padStart(2, "0"), l, g === h);
      if (g === h && SUBNAV[h]) {
        html += `<div class="nav-sub">${SUBNAV[h].map(([sh, sl]) =>
          `<a class="nav-sublink${f === sh ? " active" : ""}" href="${sh}"${f === sh ? ' aria-current="page"' : ""}>${sl}</a>`).join("")}</div>`;
      }
      return html;
    }).join("");
    const year = MONTHS.map(([name, sport], i) => {
      const active = pm === name.toLowerCase();
      return link(monthFile(name), String(i + 1).padStart(2, "0"), `${name.slice(0, 3)} · ${sport}`, active);
    }).join("");
    return `<nav aria-label="Site"><div class="nav-label">Playbook</div>${main}</nav><nav aria-label="Year map"><div class="nav-label">Year map</div>${year}</nav>`;
  }

  const SEARCH_FORM = "";
  function topbar() {
    const f = file();
    const g = groupKey(f);
    const sub = SUBNAV[g];
    return `<header class="topbar">
      <a class="brand" href="index.html">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 4v16M4 12h16M6.6 7.2c3 2.2 7.8 2.2 10.8 0M6.6 16.8c3-2.2 7.8-2.2 10.8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <span><span class="brand-title">SCA PE Playbook</span><span class="brand-sub">Alberta PEW · Grades 1–6 · 4 × 30 min</span></span>
      </a>
      ${SEARCH_FORM}
    </header>
    <nav class="mobile-nav" aria-label="Mobile">
      ${NAV.map(([h, l]) => `<a href="${navHref(h)}"${g === h ? ' class="active" aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    ${sub ? `<nav class="mobile-nav mobile-subnav" aria-label="${NAV.find(([h]) => h === g)[1]} menu">${sub.map(([h, l]) => `<a href="${h}"${f === h ? ' class="active" aria-current="page"' : ""}>${l}</a>`).join("")}</nav>` : ""}`;
  }

  /* "Updated … MT" stamp: SITE_UPDATED is baked in at commit time (run tools/bake-updated.sh
     before committing), so pages make no GitHub API calls. Empty → page Last-Modified date. */
  const SITE_UPDATED = "2026-10-03T16:06:51Z";
  function ensureUpdatedStamp() {
    if (document.querySelector(".site-updated-stamp")) return;
    const el = document.createElement("div");
    el.className = "site-updated-stamp no-print";
    el.setAttribute("aria-label", "Site last updated");
    const d = new Date(SITE_UPDATED || document.lastModified || Date.now());
    el.textContent = isNaN(d.getTime()) ? "Updated …" : "Updated " + new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    }).format(d) + " MT";
    document.body.insertBefore(el, document.body.firstChild);
  }

  /* Shared "Mr. Fung's sites" footer. Student-facing sites never link to Sub Day Plans. */
  const MF_SITES = [
    ["pe-playbook", "PE Playbook"], ["Grade-1-Music", "Grade 1 Music"], ["music-practice-studio", "Music Practice Studio"],
    ["grade5health", "Grade 5 Health"], ["Grade5-iMovie", "Grade 5 iMovie"], ["Grade-6-Canva", "Grade 6 Canva"], ["Grade-6-Scratch", "Grade 6 Scratch"],
  ];
  function ensureSitesFooter() {
    if (document.querySelector(".mf-sites")) return;
    const nav = document.createElement("nav");
    nav.className = "mf-sites no-print";
    nav.setAttribute("aria-label", "Mr. Fung's sites");
    nav.innerHTML = "<p>Mr. Fung's sites</p><ul>" + MF_SITES.map(([slug, name]) => slug === "pe-playbook"
      ? `<li><span aria-current="page">${name}</span></li>`
      : `<li><a href="https://scaemrfung.github.io/${slug}/">${name}</a></li>`).join("") + "</ul>";
    document.body.appendChild(nav);
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
    ensureUpdatedStamp();
    ensureSitesFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
