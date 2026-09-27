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

  // Card layout mirrors the Big-Group Games cards (games.html, app.js):
  // head + type pill, When line, purpose, Equipment, Set-up, How we play,
  // Variations, Video, More details (collapsible), Safety, Source.
  function typeLabel(section) {
    return String(section || "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
  }
  function card(g, data, opts) {
    var U = unitMap(data);
    var u = U[g.unit];
    var li = function (s) { return "<li>" + esc(s) + "</li>"; };
    var also = (g.alsoFits || []).filter(function (m) { return U[m]; }).map(function (m) { return unitLink(U[m]); }).join(", ");
    var when = "<strong>When:</strong> " + (u ? unitLink(u) : "Anytime") + (also ? " (also " + also + ")" : "") +
      " · <strong>Grades:</strong> " + esc(g.grades) + (g.gradesFrom === "doc" ? "" : " (est.)") +
      " · " + (g.stayIn ? "Stay-in" : "<strong>Adapt:</strong> " + esc(g.flag || "see safety"));
    var steps = (g.how || []).map(li).join("");
    var vars = (g.variations || []).map(li).join("");
    var videos = [], sources = [];
    (g.links || []).forEach(function (url) { (linkLabel(url) === "Watch demo" ? videos : sources).push(url); });
    var videoHtml = videos.length
      ? '<p class="yt"><strong>Video.</strong> ' + videos.map(function (url, i) {
          return '<a href="' + esc(url) + '" target="_blank" rel="noopener">Watch demo' + (videos.length > 1 ? " " + (i + 1) : "") + "</a>";
        }).join(" · ") + "</p>"
      : "";
    var notes = (g.notes || []).map(esc).join(" · ");
    var wk = (data.weeks || []).filter(function (w) { return w.key === g.added; })[0];
    var added = g.added === "baseline" ? "In the starting library" : (wk ? "Added " + (wk.addedOnLabel || wk.label) : "");
    var more = [];
    if (g.sports) more.push("<li><strong>Sports:</strong> " + esc(g.sports) + "</li>");
    if (g.section) more.push("<li><strong>Library section:</strong> " + esc(g.section) + "</li>");
    if (g.source) more.push("<li><strong>From:</strong> " + esc(g.source) + "</li>");
    if (notes) more.push("<li><strong>Notes:</strong> " + notes + "</li>");
    if (added) more.push("<li>" + esc(added) + "</li>");
    if (g.siteCard) more.push('<li><a href="' + esc(g.siteCard.href) + '">Also on the ' + esc(g.siteCard.label) + "</a></li>");
    var hay = [g.name, (g.oldNames || []).join(" "), g.desc, g.sports, g.section, g.equipment, (g.how || []).join(" "), (g.variations || []).join(" "), g.unit, u ? u.sport : "", g.source].join(" ").toLowerCase();
    return '<article class="gcard ng-card" id="' + esc(g.id) + '" data-unit="' + esc(g.unit) + '" data-type="' + esc(typeLabel(g.section)) + '" data-hay="' + esc(hay) + '">' +
      (g.aliases || []).map(function (x) { return '<span id="' + esc(x) + '"></span>'; }).join("") +
      '<div class="ghead"><h3>' + esc(g.name) + "</h3>" +
      (g.section ? '<span class="src">' + esc(typeLabel(g.section)) + "</span>" : "") + "</div>" +
      (opts.isNew ? '<p class="meta ng-newtag"><strong>New this week</strong></p>' : "") +
      '<p class="meta">' + when + "</p>" +
      "<p>" + esc(g.desc) + "</p>" +
      '<p class="meta"><strong>Equipment:</strong> ' + esc(g.equipment || "") + "</p>" +
      (g.setup ? '<p class="meta"><strong>Set-up:</strong> ' + esc(g.setup) + "</p>" : "") +
      "<p><strong>How we play</strong></p>" +
      '<ol class="clean">' + steps + "</ol>" +
      (vars ? '<p><strong>Variations</strong></p><ul class="clean">' + vars + "</ul>" : "") +
      videoHtml +
      (g.auto ? '<p class="note">Quick card built from the library line — watch the demo before teaching.</p>' : "") +
      (g.removedFromDoc ? '<p class="note">No longer listed in the PE Games Library (since ' + esc(g.removedFromDoc) + ").</p>" : "") +
      '<details class="peg"><summary><strong>More details</strong> <span class="meta">· from the PE Games Library</span></summary><ul class="clean">' + more.join("") + "</ul></details>" +
      '<p class="note"><strong>Safety.</strong> ' + esc(g.safety || "House rules: soft tags below the shoulders, no elimination.") + "</p>" +
      (sources.length ? '<p class="meta card-source">' + sources.map(function (url, i) {
        return '<a href="' + esc(url) + '" target="_blank" rel="noopener">Source' + (sources.length > 1 ? " " + (i + 1) : "") + "</a>";
      }).join(" · ") + "</p>" : "") +
      "</article>";
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
      if (!sameWeek) out.push('<p class="note">No new games in the latest library update' + (data.dedupe ? ' that aren’t already on the <a href="games.html">Big-Group Games page</a>' : '') + ' — these are the most recent additions.</p>');
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
    var tbox = document.getElementById("ng-type-filters");
    var count = document.getElementById("ng-count");
    if (!tools) return;
    tools.hidden = false;
    var unit = "all", type = "all";
    var used = {};
    (data.games || []).forEach(function (g) { used[g.unit] = (used[g.unit] || 0) + 1; });
    var types = [];
    (data.games || []).forEach(function (g) { var t = typeLabel(g.section); if (t && types.indexOf(t) < 0) types.push(t); });
    if (tbox) tbox.innerHTML = '<button type="button" data-type="all" class="on">All types</button>' +
      types.map(function (t) { return '<button type="button" data-type="' + esc(t) + '">' + esc(t) + "</button>"; }).join("");
    box.innerHTML = '<button type="button" data-unit="all" class="on">All months</button>' +
      (data.units || []).filter(function (u) { return used[u.month]; }).map(function (u) {
        return '<button type="button" data-unit="' + esc(u.month) + '">' + esc(unitLabel(u)) + "</button>";
      }).join("");
    function apply() {
      var term = (q.value || "").toLowerCase().trim();
      var filtering = term || unit !== "all" || type !== "all";
      var shown = 0;
      var seen = {};
      el.querySelectorAll(".ng-card").forEach(function (c) {
        var ok = (!term || c.getAttribute("data-hay").indexOf(term) >= 0) && (unit === "all" || c.getAttribute("data-unit") === unit) && (type === "all" || c.getAttribute("data-type") === type);
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
    if (tbox) tbox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-type]");
      if (!b) return;
      type = b.getAttribute("data-type");
      tbox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
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
