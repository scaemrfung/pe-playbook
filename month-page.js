/* Month page grade picker. The month content is pre-rendered by tools/build.js;
   this only filters the Grade 1–2 / 3–4 / 5–6 differentiation.
   ?grade=1…6 (or ?grade=all) in the URL wins; otherwise the last choice
   saved in localStorage ("pe-grade") is used. */
(function () {
  var KEY = "pe-grade";
  var BAND = { 1: "g12", 2: "g12", 3: "g34", 4: "g34", 5: "g56", 6: "g56" };
  var LABEL = { g12: "Grades 1–2", g34: "Grades 3–4", g56: "Grades 5–6" };
  var picker = document.getElementById("grade-picker");
  if (!picker) return;
  picker.hidden = false;

  function norm(v) {
    v = String(v == null ? "" : v).toLowerCase().replace(/^g(rade)?/, "");
    return BAND[v] ? v : v === "all" ? "all" : "";
  }
  function fromUrl() {
    var q = new URLSearchParams(location.search).get("grade");
    if (!q) { var h = /grade=?(\w+)/i.exec(location.hash); if (h) q = h[1]; }
    return norm(q);
  }
  function stored() { try { return norm(localStorage.getItem(KEY)); } catch (e) { return ""; } }
  function save(g) { try { localStorage.setItem(KEY, g); } catch (e) { /* private mode */ } }

  function withGrade(href, g) {
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin || !/\/month(-[a-z]+)?\.html$/.test(u.pathname)) return href;
      if (g && g !== "all") u.searchParams.set("grade", g); else u.searchParams.delete("grade");
      var today = new URLSearchParams(location.search).get("today");
      if (today) u.searchParams.set("today", today);
      return u.pathname.split("/").pop() + u.search + u.hash;
    } catch (e) { return href; }
  }

  function apply(g, push) {
    var band = BAND[g] || "";
    if (band) document.body.setAttribute("data-band", band);
    else document.body.removeAttribute("data-band");
    picker.querySelectorAll("[data-grade]").forEach(function (a) {
      a.setAttribute("aria-pressed", String(a.getAttribute("data-grade") === (g || "all")));
      a.classList.toggle("on", a.getAttribute("data-grade") === (g || "all"));
    });
    var status = document.getElementById("grade-status");
    if (status) status.textContent = band
      ? "Showing Grade " + g + " — the " + LABEL[band] + " differentiation for every game and lesson."
      : "Showing all grade bands (1–2 / 3–4 / 5–6).";
    var th = document.getElementById("grade-th");
    if (th) th.textContent = band ? "(" + LABEL[band] + ")" : "(1–2 / 3–4 / 5–6)";
    var h1 = document.querySelector(".month-head h1");
    if (h1) {
      var tag = h1.querySelector(".grade-tag");
      if (!tag) { tag = document.createElement("span"); tag.className = "grade-tag"; h1.appendChild(tag); }
      tag.textContent = band ? " · Grade " + g : "";
    }
    // keep the choice when moving between months
    document.querySelectorAll('a[href^="month"]').forEach(function (a) {
      if (a.closest("#grade-picker")) return;
      a.setAttribute("href", withGrade(a.getAttribute("href"), g));
    });
    if (push !== false) {
      var u = new URL(location.href);
      if (band) u.searchParams.set("grade", g); else u.searchParams.delete("grade");
      if (/grade/i.test(u.hash)) u.hash = "";
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
  }

  picker.addEventListener("click", function (e) {
    var a = e.target.closest("[data-grade]");
    if (!a) return;
    e.preventDefault();
    var g = norm(a.getAttribute("data-grade")) || "all";
    save(g);
    apply(g);
  });

  var initial = fromUrl();
  if (initial) save(initial);
  else initial = stored() || "all";
  apply(initial);
})();

/* "This week" marker: highlight the school week that matches today's date
   (school-year.js). Test another date with ?today=YYYY-MM-DD. */
(function () {
  var SY = window.SCHOOL_YEAR;
  if (!SY || !SY.peWeek) return;
  var h1 = document.querySelector(".month-head h1");
  if (!h1) return;
  var month = (h1.firstChild && h1.firstChild.nodeValue || "").trim();
  var pw = SY.peWeek();
  if (!pw || pw.kind === "summer" || pw.month !== month) return;
  document.querySelectorAll("#school-weeks li[data-school-week]").forEach(function (li) {
    if (+li.getAttribute("data-school-week") === pw.schoolWeek) li.classList.add("current");
  });
  var head = document.getElementById("week-" + pw.w);
  if (head && head.classList.contains("anchor-alias")) head = head.parentNode; // merged weeks (e.g. June W3–4)
  if (head && !head.querySelector(".this-week-pill")) {
    var pill = document.createElement("span");
    pill.className = "this-week-pill";
    pill.textContent = pw.kind === "break" ? "Next week back" : "This week";
    var dates = head.querySelector(".week-dates");
    head.insertBefore(pill, dates);
  }
  if (!head) return;
  head.classList.add("cw-current");
  /* "Week N · dates" banner under the month heading, with a jump link */
  var mh = document.querySelector(".month-head");
  if (mh && !document.getElementById("cw-banner")) {
    var b = document.createElement("p");
    b.className = "cw-banner";
    b.id = "cw-banner";
    var lab = pw.kind === "break" ? "Next week back" : "This week";
    var strong = document.createElement("strong");
    strong.textContent = lab + ": Week " + pw.schoolWeek + " \u00b7 " + (pw.range || "");
    var a = document.createElement("a");
    a.href = "#" + head.id;
    a.textContent = "Jump to it \u2193";
    b.appendChild(strong);
    b.appendChild(document.createTextNode(" "));
    b.appendChild(a);
    mh.parentNode.insertBefore(b, mh.nextSibling);
  }
  /* open the page on the current week (unless the link already points somewhere, e.g. #week-3 or #w2-c1) */
  if (!location.hash) {
    var go = function () { head.scrollIntoView({ block: "start" }); };
    var y0;
    go(); y0 = window.pageYOffset;
    if (document.readyState !== "complete") window.addEventListener("load", function () {
      if (Math.abs(window.pageYOffset - y0) < 40) go();   // layout shifted while loading; the reader hasn't scrolled yet
    });
  }
})();
