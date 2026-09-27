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
  function file() {
    return (location.pathname.split("/").pop() || "index.html") || "index.html";
  }
  function qs(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }
  function mark(href, extra) {
    const f = file();
    if (extra) return extra;
    if (href === "index.html") return f === "index.html" || f === "" || f === "pe-playbook";
    if (href === "month.html") return f === "month.html";
    return f === href;
  }
  function link(href, ico, label, active) {
    return `<a class="nav-link${active ? " active" : ""}" href="${href}"><span class="nav-ico">${ico}</span>${label}</a>`;
  }
  function sidebar() {
    const f = file();
    const month = qs("m");
    const classroom = [
      ["index.html", "01", "Year map"],
      ["how.html", "02", "How to teach"],
      ["games.html", "03", "Games"],
      ["dodgeball.html", "04", "Dodgeball"],
      ["outcomes.html", "05", "Alberta PEW"],
      ["fitness.html", "06", "Fitness"],
      ["videos.html", "07", "Videos"],
    ]
      .map(([h, n, l]) => link(h, n, l, mark(h)))
      .join("");
    const events = [
      ["gymnastics.html", "08", "Gymnastics"],
      ["track-day.html", "09", "Track Day"],
    ]
      .map(([h, n, l]) => link(h, n, l, mark(h)))
      .join("");
    const year = MONTHS.map(([name, sport], i) => {
      const href = `month.html?m=${encodeURIComponent(name)}`;
      const active = f === "month.html" && month.toLowerCase() === name.toLowerCase();
      return link(href, String(i + 1).padStart(2, "0"), `${name.slice(0, 3)} · ${sport}`, active);
    }).join("");
    return `<div class="nav-label">Classroom</div>${classroom}<div class="nav-label">Events</div>${events}<div class="nav-label">Year</div>${year}`;
  }
  function topbar() {
    return `<header class="topbar">
      <a class="brand" href="index.html">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 4v16M4 12h16M6.6 7.2c3 2.2 7.8 2.2 10.8 0M6.6 16.8c3-2.2 7.8-2.2 10.8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <span><span class="brand-title">SCA PE Playbook</span><span class="brand-sub">Alberta PEW · Grades 1–6 · 4 × 30 min</span></span>
      </a>
    </header>
    <nav class="mobile-nav" aria-label="Mobile">
      <a href="index.html">Year map</a>
      <a href="how.html">How to teach</a>
      <a href="games.html">Games</a>
      <a href="dodgeball.html">Dodgeball</a>
      <a href="month.html?m=September">September</a>
    </nav>`;
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
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
