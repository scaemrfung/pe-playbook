/* Games of the Week printable: ?week=N shows only that week (its Grades 1–3 page and its Grades 4–6 page), ?print=1 opens the print dialog.
   Each page is checked against one Letter page (7.5 × 10 in inside the margins) and steps down in size if needed. */
(function () {
  var q = new URLSearchParams(location.search), one = q.get("week"), PAGE_H = 10 * 96;
  var sheets = [].slice.call(document.querySelectorAll(".gp-sheet"));
  if (one) {
    var n = String(parseInt(one, 10)), hit = document.getElementById("week-" + n);
    var mine = sheets.filter(function (s) { return s.getAttribute("data-week") === n; });
    if (hit && mine.length) {
      sheets.forEach(function (s) { s.hidden = mine.indexOf(s) < 0; });
      var lab = document.getElementById("gp-showing"), all = document.getElementById("gp-all");
      if (lab) lab.textContent = "Showing one week. Print makes " + (mine.length === 2 ? "two pages: Grades 1–3 and Grades 4–6." : mine.length + " pages.");
      if (all) all.hidden = false;
      document.title = "Week " + n + " · Games of the Week · Mr. Fung";
    }
  }
  function contentHeight(s) {
    var kids = s.children; if (!kids.length) return 0;
    return kids[kids.length - 1].getBoundingClientRect().bottom - kids[0].getBoundingClientRect().top;
  }
  function fit() {
    document.body.classList.add("gp-measure"); // measure at paper width, even on a phone
    sheets.forEach(function (s) {
      if (s.hidden) return;
      for (var i = 1; i <= 4 && contentHeight(s) > PAGE_H - 4; i++) { s.classList.remove("gp-fit" + (i - 1)); s.classList.add("gp-fit" + i); }
      if (contentHeight(s) > PAGE_H) s.setAttribute("data-overflow", "1");
    });
    document.body.classList.remove("gp-measure");
    document.documentElement.setAttribute("data-fitted", "1");
  }
  var btn = document.getElementById("gp-print");
  if (btn) btn.addEventListener("click", function () { window.print(); });
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () {
    fit();
    if (q.get("print") === "1") setTimeout(function () { window.print(); }, 150);
  });
})();
