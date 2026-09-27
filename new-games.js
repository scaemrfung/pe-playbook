/* New Games This Week — renderer.
   Used twice: in the browser (renders #ng-root from new-games-data.js and adds
   search + unit filters) and by the update script (node) to bake the no-JS copy
   into new-games.html. Keep it dependency-free. */
(function (root) {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function unitMap(data) {
    var m = {};
    (data.units || []).forEach(function (u) { m[u.month] = u; });
    return m;
  }
  function unitLabel(u) { return u ? u.month.slice(0, 3) + " · " + u.sport : ""; }
  function unitLink(u) { return u ? '<a href="' + esc(u.href) + '">' + esc(unitLabel(u)) + "</a>" : ""; }
  function linkLabel(url) {
    if (/youtube\.com\/shorts|youtu\.be|youtube\.com/.test(url)) return "Watch demo";
    if (/physedgames\.com/.test(url)) return "PhysEdGames write-up";
    return "Source";
  }

  function card(g, data, opts) {
    var U = unitMap(data);
    var u = U[g.unit];
    var chips = [];
    if (opts.isNew) chips.push('<span class="ng-chip ng-new">New this week</span>');
    chips.push('<span class="ng-chip ng-unit">Unit: ' + unitLink(u) + "</span>");
    chips.push('<span class="ng-chip">Grades ' + esc(g.grades) + (g.gradesFrom === "doc" ? "" : " (est.)") + "</span>");
    chips.push(g.stayIn ? '<span class="ng-chip ng-ok">Stay-in</span>' : '<span class="ng-chip ng-warn">Adapt: ' + esc(g.flag || "see note") + "</span>");
    if (g.section) chips.push('<span class="ng-chip ng-sec">' + esc(g.section) + "</span>");
    var steps = (g.how || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    var vars = (g.variations || []).length
      ? '<h4>Variations</h4><ul class="clean">' + g.variations.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>"
      : "";
    var notes = (g.notes || []).map(function (n) { return esc(n); }).join(" · ");
    var safety = g.safety || notes
      ? '<p class="game-note"><strong>Safety / house rules:</strong> ' + esc(g.safety || "") + (notes ? " " + notes + "." : "") + "</p>"
      : "";
    var also = (g.alsoFits || []).filter(function (m) { return U[m]; }).map(function (m) { return unitLink(U[m]); }).join(", ");
    var nLab = {};
    (g.links || []).forEach(function (url) { nLab[linkLabel(url)] = (nLab[linkLabel(url)] || 0) + 1; });
    var seenLab = {};
    var links = (g.links || []).map(function (url) {
      var lab = linkLabel(url);
      seenLab[lab] = (seenLab[lab] || 0) + 1;
      return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + lab + (nLab[lab] > 1 ? " " + seenLab[lab] : "") + "</a>";
    });
    if (g.siteCard) links.push('<a href="' + esc(g.siteCard.href) + '">Full card on ' + esc(g.siteCard.label) + "</a>");
    var wk = (data.weeks || []).filter(function (w) { return w.key === g.added; })[0];
    var added = g.added === "baseline" ? "In the starting library" : (wk ? "Added " + (wk.addedOnLabel || wk.label) : "");
    var hay = [g.name, g.desc, g.sports, g.section, g.equipment, (g.how || []).join(" "), g.unit, u ? u.sport : "", g.source].join(" ").toLowerCase();
    return '<article class="panel ng-card" id="' + esc(g.id) + '" data-unit="' + esc(g.unit) + '" data-hay="' + esc(hay) + '">' +
      '<h3 class="ng-title">' + esc(g.name) + "</h3>" +
      '<div class="ng-chips">' + chips.join("") + "</div>" +
      '<p class="ng-desc">' + esc(g.desc) + "</p>" +
      '<p><strong>Equipment:</strong> ' + esc(g.equipment) + "</p>" +
      (g.setup ? '<p><strong>Set-up:</strong> ' + esc(g.setup) + "</p>" : "") +
      "<h4>How to play</h4>" +
      '<ol class="how-list">' + steps + "</ol>" +
      vars + safety +
      (g.auto ? '<p class="note">Quick card built from the library line — watch the source clip before teaching.</p>' : "") +
      (g.removedFromDoc ? '<p class="note">No longer listed in the PE Games Library (since ' + esc(g.removedFromDoc) + ").</p>" : "") +
      '<p class="meta ng-foot">' +
      (also ? "<strong>Also fits:</strong> " + also + "<br>" : "") +
      "<strong>Sports:</strong> " + esc(g.sports) +
      (g.source ? " · <strong>Source:</strong> " + esc(g.source) : "") +
      (added ? " · " + esc(added) : "") +
      (links.length ? '<br><span class="ng-links">' + links.join(" · ") + "</span>" : "") +
      "</p></article>";
  }

  function render(data) {
    var games = data.games || [];
    var weeks = data.weeks || [];
    var latest = weeks[0];
    var sd = data.sourceDoc || {};
    var U = unitMap(data);
    var out = [];
    var latestGames = latest ? games.filter(function (g) { return g.added === latest.key; }) : [];
    var sameWeek = latest && latest.key === data.docWeek;

    out.push('<section class="panel ng-this-week" id="this-week" aria-labelledby="ng-this-week-h">');
    out.push('<p class="ng-kicker">Added this week</p>');
    out.push('<h2 id="ng-this-week-h">' + esc(latest ? latest.label : "No games yet") + "</h2>");
    if (latest) {
      out.push('<p class="meta">' + (latest.addedOnLabel ? "Added " + esc(latest.addedOnLabel) + " · " : "") +
        esc(latestGames.length) + " new game" + (latestGames.length === 1 ? "" : "s") +
        " · PE Games Library last updated " + esc(sd.lastUpdatedLabel || sd.lastUpdated || "") + "</p>");
      if (!sameWeek) out.push('<p class="note">No new games in the latest library update — these are the most recent additions.</p>');
      out.push('<ul class="ng-new-list">' + latestGames.map(function (g) {
        return '<li><a href="#' + esc(g.id) + '"><strong>' + esc(g.name) + "</strong></a> — " + esc(g.desc) +
          ' <span class="ng-mini">' + esc(unitLabel(U[g.unit])) + " · Gr " + esc(g.grades) + "</span></li>";
      }).join("") + "</ul>");
    }
    out.push('<p class="meta ng-jump"><a href="#this-weeks-games">This week’s game cards</a> · <a href="#archive">Archive by week</a> · ' + esc(games.length) + " games in total</p>");
    out.push("</section>");

    out.push('<section class="ng-week-block" id="this-weeks-games" data-week="' + esc(latest ? latest.key : "") + '">');
    out.push('<h2 class="ng-h">This week’s games <span class="ng-count">' + esc(latestGames.length) + "</span></h2>");
    out.push(latestGames.map(function (g) { return card(g, data, { isNew: true }); }).join(""));
    out.push("</section>");

    out.push('<h2 class="ng-h" id="archive">Archive — earlier weeks</h2>');
    out.push('<p class="meta ng-archive-note">Every game from earlier weeks, newest week first. Tap a week to open it.</p>');
    weeks.slice(1).forEach(function (w) {
      var list = games.filter(function (g) { return g.added === w.key; });
      out.push('<details class="ng-week ng-week-block" id="week-' + esc(w.key) + '" data-week="' + esc(w.key) + '">' +
        "<summary><span>" + esc(w.label) + '</span> <span class="ng-count">' + esc(list.length) + " game" + (list.length === 1 ? "" : "s") + "</span>" +
        (w.addedOnLabel ? ' <span class="ng-mini">added ' + esc(w.addedOnLabel) + "</span>" : "") + "</summary>" +
        (w.note ? '<p class="note">' + esc(w.note) + "</p>" : "") +
        '<ul class="ng-toc">' + list.map(function (g) { return '<li><a href="#' + esc(g.id) + '">' + esc(g.name) + "</a></li>"; }).join("") + "</ul>" +
        list.map(function (g) { return card(g, data, { isNew: false }); }).join("") +
        "</details>");
    });
    return out.join("\n");
  }

  root.NewGamesRender = { render: render, card: card };

  // ------------------------------------------------------------ browser
  if (typeof document === "undefined" || !document.getElementById) return;
  function boot() {
    var data = root.NEW_GAMES;
    var el = document.getElementById("ng-root");
    if (!data || !el) return;
    el.innerHTML = render(data);
    var tools = document.getElementById("ng-tools");
    var q = document.getElementById("ng-q");
    var box = document.getElementById("ng-unit-filters");
    var count = document.getElementById("ng-count");
    if (!tools) return;
    tools.hidden = false;
    var unit = "all";
    var used = {};
    (data.games || []).forEach(function (g) { used[g.unit] = (used[g.unit] || 0) + 1; });
    box.innerHTML = '<button type="button" data-unit="all" class="on">All units</button>' +
      (data.units || []).filter(function (u) { return used[u.month]; }).map(function (u) {
        return '<button type="button" data-unit="' + esc(u.month) + '">' + esc(unitLabel(u)) + "</button>";
      }).join("");
    function apply() {
      var term = (q.value || "").toLowerCase().trim();
      var filtering = term || unit !== "all";
      var shown = 0;
      var seen = {};
      el.querySelectorAll(".ng-card").forEach(function (c) {
        var ok = (!term || c.getAttribute("data-hay").indexOf(term) >= 0) && (unit === "all" || c.getAttribute("data-unit") === unit);
        c.hidden = !ok;
        if (ok && !seen[c.id]) { seen[c.id] = 1; shown++; }
      });
      el.querySelectorAll(".ng-week-block").forEach(function (b) {
        var any = b.querySelector(".ng-card:not([hidden])");
        b.hidden = filtering && !any;
        if (b.tagName === "DETAILS" && filtering && any) b.open = true;
        var toc = b.querySelector(".ng-toc");
        if (toc) toc.hidden = !!filtering;
      });
      var arch = document.getElementById("archive");
      count.textContent = filtering ? shown + " matching game" + (shown === 1 ? "" : "s") : "";
      if (arch) arch.hidden = false;
    }
    q.addEventListener("input", apply);
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-unit]");
      if (!b) return;
      unit = b.getAttribute("data-unit");
      box.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      apply();
    });
    // open the archive week that holds a linked game
    function openHash() {
      var id = decodeURIComponent((location.hash || "").slice(1));
      if (!id) return;
      var t = document.getElementById(id);
      if (!t) return;
      var d = t.closest("details");
      if (d && !d.open) { d.open = true; t.scrollIntoView(); }
    }
    window.addEventListener("hashchange", openHash);
    openHash();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
