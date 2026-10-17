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
    // Same elements, order and classes as a Big-Group Games card (app.js):
    // head + type pill, When/Slot/grouping, purpose, Also called, Equipment,
    // Set-up, How we play, If this happens, How a round ends, Cues, Variations,
    // Teaching tips, Video + note, More details, Alberta PEW outcomes,
    // Grades 1–2 / 3–4 / 5–6, Safety, Source.
    var U = unitMap(data);
    var li = function (s) { return "<li>" + esc(s) + "</li>"; };
    var list = function (title, arr, ordered) {
      return (arr && arr.length) ? "<p><strong>" + title + "</strong></p><" + (ordered ? "ol" : "ul") + ' class="clean">' + arr.map(li).join("") + "</" + (ordered ? "ol" : "ul") + ">" : "";
    };
    var months = [g.suggestedMonth || g.unit].concat(g.alsoFits || []).filter(function (m, i, a) { return m && U[m] && a.indexOf(m) === i; });
    var when = "<strong>Suggested month:</strong> " + (months.length ? months.map(function (m, i) { return (i === 1 ? " · also fits " : i > 1 ? ", " : "") + '<a href="' + esc(U[m].href) + '">' + esc(m) + "</a>"; }).join("") : "Anytime") +
      " · <strong>Slot:</strong> " + esc(g.slot || "—") + (g.grouping ? " · " + esc(g.grouping) : "");
    var vids = g.videos || [];
    var videoHtml = vids.length
      ? '<p class="yt"><strong>Video.</strong> ' + vids.map(function (v) {
          return '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.title) + "</a>" + (v.channel ? ' <span class="meta">(' + esc(v.channel) + ")</span>" : "");
        }).join(" · ") + '</p>\n      <p class="meta">' + esc(g.videoNote || "Clips are demos. Our house rules still apply.") + "</p>"
      : "";
    var srcs = g.sources || [];
    var wk = (data.weeks || []).filter(function (w) { return w.key === g.added; })[0];
    var added = g.added === "baseline" ? "In the starting library" : (wk ? "Added " + (wk.addedOnLabel || wk.label) : "");
    var grades = esc(g.grades) + (g.gradesFrom === "doc" ? "" : " (est.)");
    var overview = [g.sports ? "Sports: " + g.sports : "", g.section ? "Library section: " + g.section : "", g.source ? "From: " + g.source : "", added].filter(Boolean).join(" · ");
    var notes = (g.notes || []).map(esc).join(" · ");
    var moreLinks = [];
    srcs.forEach(function (u) { moreLinks.push('<a href="' + esc(u) + '" target="_blank" rel="noopener">Source</a>'); });
    vids.forEach(function (v) { moreLinks.push('<a href="' + esc(v.url) + '" target="_blank" rel="noopener">Video</a>'); });
    if (g.siteCard) moreLinks.push('<a href="' + esc(g.siteCard.href) + '">Also on the ' + esc(g.siteCard.label) + "</a>");
    var more = '<details class="peg"><summary><strong>More details</strong> <span class="meta">· Grades ' + grades + "</span></summary>\n      " +
      '<p class="meta"><strong>Equipment:</strong> ' + esc(g.equipment || "") + "</p>" +
      "<p>" + esc(g.desc) + (notes ? " " + notes + "." : "") + "</p>" +
      (g.bandWhy ? '<p class="meta"><strong>Why Grades ' + esc(g.bestBand) + ":</strong> " + esc(g.bandWhy) + "</p>" : "") +
      (overview ? '<p class="meta">' + esc(overview) + "</p>" : "") +
      (moreLinks.length ? '<p class="meta">' + moreLinks.join(" · ") + "</p>" : "") + "</details>";
    var outs = g.outcomes || [];
    var outBox = outs.length
      ? '<div class="outcomes-box"><h3>Alberta PEW outcomes</h3><p class="note" style="margin:0 0 8px;font-style:normal">Pick one or two look-fors per class.</p><ul class="clean out-list">' +
        outs.map(function (o) { return "<li><strong>" + esc(o.code) + ".</strong> " + esc(o.look) + "</li>"; }).join("") + "</ul></div>"
      : "";
    var bands = (g.g12 || g.g34 || g.g56)
      ? '<div class="bands-block">' + [["g12", "1–2"], ["g34", "3–4"], ["g56", "5–6"]].filter(function (b) { return g[b[0]]; }).map(function (b) {
          return "<div><strong>Grades " + b[1] + ".</strong> " + esc(g[b[0]]) + "</div>"; }).join("") + "</div>"
      : "";
    var safety = (g.stayIn ? "" : "Adapt: " + (g.flag || "see the notes") + ". ") + (g.safety || "") + (g.safetyTail ? " " + g.safetyTail : "");
    var hay = [g.name, (g.oldNames || []).join(" "), (g.aka || []).join(" "), g.desc, g.sports, g.section, g.typeLabel, g.equipment, (g.how || []).join(" "), (g.variations || []).join(" "), (g.cues || []).join(" "), g.unit, g.source].join(" ").toLowerCase();
    // Compact card: name, grades + best fit, equipment, one-line purpose. "Show details" opens the rest.
    // opts.compact (browser only): details start closed unless opts.open; the no-JS baked copy shows everything.
    var open = !opts.compact || !!opts.open;
    var moreId = esc(g.id) + "-details";
    var details =
      '<p class="meta">' + when + "</p>" +
      ((g.aka || []).length ? '<p class="meta"><strong>Also called:</strong> ' + g.aka.map(esc).join(" · ") + "</p>" : "") +
      '<p class="meta"><strong>Set-up:</strong> ' + esc(g.setup || "") + "</p>" +
      "<p><strong>How we play</strong></p>" +
      '<ol class="clean">' + (g.how || []).map(li).join("") + "</ol>" +
      list("If this happens", g.ifThis) +
      (g.roundEnds ? "<p><strong>How a round ends.</strong> " + esc(g.roundEnds) + "</p>" : "") +
      list("Cues", g.cues) +
      list("Variations", g.variations) +
      list("Teaching tips", g.tips) +
      videoHtml +
      (g.auto ? '<p class="note">Quick card built from the library line — watch the demo before teaching.</p>' : "") +
      (g.removedFromDoc ? '<p class="note">No longer listed in the PE Games Library (since ' + esc(g.removedFromDoc) + ").</p>" : "") +
      more + outBox + bands +
      '<p class="note"><strong>Safety.</strong> ' + esc(safety) + "</p>" +
      (srcs.length ? '<p class="meta card-source">' + srcs.map(function (u, i) {
        return '<a href="' + esc(u) + '" target="_blank" rel="noopener">Source' + (srcs.length > 1 ? " " + (i + 1) : "") + "</a>";
      }).join(" · ") + "</p>" : "");
    var gradeLine = '<p class="meta ng-fit"><strong>Grades:</strong> ' + esc(g.grades) + (g.gradesFrom === "doc" ? "" : " (est.)") +
      (g.bestBand ? " · <strong>Best fit:</strong> " + esc(bestFitText(g)) : "") + "</p>";
    return '<article class="gcard ng-card' + (open ? " ng-open" : "") + '" id="' + esc(g.id) + '" data-unit="' + esc(g.suggestedMonth || g.unit) + '" data-type="' + esc(g.typeLabel || typeLabel(g.section)) + '" data-band="' + esc(g.bestBand || "") + '" data-bands="' + esc(bandsOf(g).join(" ")) + '" data-hay="' + esc(hay) + '">' +
      (g.aliases || []).map(function (x) { return '<span id="' + esc(x) + '"></span>'; }).join("") +
      '<div class="ng-top">' +
      '<div class="ghead"><h3>' + (opts.num ? esc(opts.num) + ". " : "") + esc(g.name) + "</h3>" +
      '<span class="src">' + esc(g.typeLabel || typeLabel(g.section)) + "</span></div>" +
      (opts.isNew ? '<p class="meta ng-newtag"><strong>New this week</strong></p>' : "") +
      gradeLine +
      '<p class="meta"><strong>Equipment:</strong> ' + esc(g.equipment || "") + "</p>" +
      '<p class="ng-purpose">' + esc(g.desc) + "</p>" +
      "</div>" +
      (opts.compact ? '<div class="card-actions ng-actions">' +
        '<button type="button" class="btn-primary ng-toggle" aria-expanded="' + open + '" aria-controls="' + moreId + '">' + (open ? "Hide details" : "Show details") + '<span class="sr-only"> for ' + esc(g.name) + "</span></button>" +
        '<button type="button" class="btn-ghost print-card" aria-label="Print this card: ' + esc(g.name) + '">Print this card</button></div>' : "") +
      '<div class="ng-more" id="' + moreId + '"' + (open ? "" : " hidden") + ">" + details + "</div>" +
      "</article>";
  }

  function fmtLongDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return iso || "";
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    var dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
    var mon = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"][d.getUTCMonth()];
    return dow + " " + mon + " " + d.getUTCDate() + ", " + d.getUTCFullYear();
  }
  // "Last updated" = the most recent day games were added to this page.
  function lastUpdatedLine(data) {
    var iso = data.lastUpdated || "";
    var label = data.lastUpdatedLabel || fmtLongDate(iso) || "";
    return '<strong>Last updated: ' + esc(label) + "</strong>";
  }
  // Short history: games grouped by the day they were added, newest first.
  function addedHistory(data) {
    var by = {}, order = [];
    (data.games || []).forEach(function (g) {
      if (!g.addedOn) return;
      if (!by[g.addedOn]) { by[g.addedOn] = []; order.push(g.addedOn); }
      by[g.addedOn].push(g);
    });
    order.sort().reverse();
    return order.map(function (d) { return { date: d, label: fmtLongDate(d), games: by[d] }; });
  }
  var BANDS = ["1–2", "3–4", "5–6"];
  function bandsOf(g) { return [g.bestBand].concat(g.alsoBand ? [g.alsoBand] : []).filter(Boolean); }
  function bestFitText(g) {
    if (!g.bestBand) return "";
    return "Grades " + g.bestBand + (g.bandEst ? " (est.)" : "") + (g.alsoBand ? ", also good for " + g.alsoBand : "");
  }
  function monthOrder(data) { return (data.units || []).map(function (u) { return u.month; }); }
  function suggested(g) { return g.suggestedMonth || g.unit || ""; }

  function render(data, view, ro) {
    ro = ro || {};
    var C = function (g, o) { o.compact = !!ro.compact; o.open = !!(ro.open && ro.open[g.id]); return card(g, data, o); };
    view = view === "type" || view === "month" || view === "grade" ? view : "week";
    var games = data.games || [];
    var weeks = data.weeks || [];
    var latest = weeks[0];
    var sd = data.sourceDoc || {};
    var U = unitMap(data);
    var out = [];
    var latestGames = latest ? games.filter(function (g) { return g.added === latest.key; }) : [];
    var sameWeek = latest && latest.key === data.docWeek;
    var num = {}, n = 0;
    latestGames.forEach(function (g) { num[g.id] = ++n; });
    weeks.slice(1).forEach(function (w) { games.forEach(function (g) { if (g.added === w.key && !num[g.id]) num[g.id] = ++n; }); });

    out.push('<section class="panel ng-this-week" id="this-week" aria-labelledby="ng-this-week-h">');
    out.push('<p class="ng-kicker">Newly added</p>');
    out.push('<h2 id="ng-this-week-h">' + esc(latest ? latest.label : "No games yet") + "</h2>");
    if (latest) {
      out.push('<p class="meta ng-updated-line">' + lastUpdatedLine(data) + " · " +
        esc(latestGames.length) + " new game" + (latestGames.length === 1 ? "" : "s") +
        " · PE Games Library last updated " + esc(sd.lastUpdatedLabel || sd.lastUpdated || "") + "</p>");
      if (!sameWeek) out.push('<p class="note">No new games in the latest library update' + (data.dedupe ? ' that aren’t already on the <a href="games.html">Big-Group Games page</a>' : '') + ' — these are the most recent additions.</p>');
    }
    var hist = addedHistory(data).filter(function (h) { return !latest || !latestGames.some(function (g) { return g.addedOn === h.date; }); }).slice(0, 6);
    if (hist.length) {
      out.push('<div class="ng-history"><p class="ng-kicker" style="margin-top:14px">Earlier additions</p><ul class="ng-hist-list">' + hist.map(function (h) {
        return "<li><strong>" + esc(h.label) + "</strong> — " + h.games.map(function (g) { return '<a href="#' + esc(g.id) + '">' + esc(g.name) + "</a>"; }).join(", ") + "</li>";
      }).join("") + "</ul></div>");
    }
    out.push('<p class="meta ng-jump"><a href="#ng-cards">Game cards</a> · ' + (view === "week" ? '<a href="#archive">Archive by week</a> · ' : "") + esc(games.length) + " games in total</p>");
    out.push("</section>");

    out.push('<div id="ng-cards" data-view="' + view + '">');
    if (view === "week") {
      out.push('<section class="ng-week-block" id="this-weeks-games" data-week="' + esc(latest ? latest.key : "") + '">');
      out.push('<h2 class="ng-h">This week’s games <span class="ng-count">' + esc(latestGames.length) + "</span></h2>");
      out.push(latestGames.map(function (g) { return C(g, { isNew: true, num: num[g.id] }); }).join(""));
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
          list.map(function (g) { return C(g, { isNew: false, num: num[g.id] }); }).join("") +
          "</details>");
      });
    } else if (view === "grade") {
      // by best-fit grade: every game once, under the band it suits best; games whose second band is this one are linked under the list
      var isNew = {};
      latestGames.forEach(function (g) { isNew[g.id] = 1; });
      var mo = monthOrder(data);
      out.push('<p class="meta ng-grade-note">Each game is listed once, under the grades it suits best. The card still shows its full grade range. Games that also work well for a grade are linked under that list.</p>');
      BANDS.forEach(function (b) {
        var list = games.filter(function (g) { return g.bestBand === b; });
        list.sort(function (x, y) {
          var tx = x.typeLabel || "", ty = y.typeLabel || "";
          if (tx !== ty) return tx < ty ? -1 : 1;
          var i = mo.indexOf(suggested(x)), j = mo.indexOf(suggested(y));
          if (i !== j) return i - j;
          return (x.order || 0) - (y.order || 0);
        });
        var also = games.filter(function (g) { return g.alsoBand === b; });
        out.push('<section class="ng-week-block ng-group" id="grade-' + b.replace(/\D+/g, "-") + '" data-group="' + esc(b) + '">');
        out.push('<h2 class="ng-h">Grades ' + esc(b) + ' <span class="ng-count">' + list.length + "</span></h2>");
        out.push('<ul class="ng-toc">' + list.map(function (g) { return '<li><a href="#' + esc(g.id) + '">' + esc(g.name) + "</a></li>"; }).join("") + "</ul>");
        if (also.length) out.push('<p class="meta ng-also"><strong>Also good for Grades ' + esc(b) + ":</strong> " + also.map(function (g) {
          return '<a href="#' + esc(g.id) + '">' + esc(g.name) + "</a> (best fit " + esc(g.bestBand) + ")"; }).join(" · ") + "</p>");
        out.push(list.map(function (g) { return C(g, { isNew: !!isNew[g.id], num: "" }); }).join(""));
        out.push("</section>");
      });
    } else {
      // grouped views: every game once, under a type heading or a month heading
      var isLatest = {};
      latestGames.forEach(function (g) { isLatest[g.id] = 1; });
      var groups = [], idx = {};
      var months = monthOrder(data);
      var key = view === "type" ? function (g) { return g.typeLabel || typeLabel(g.section) || "Other"; } : suggested;
      var head = view === "type" ? function (k) { return k; } : function (k) { return U[k] ? U[k].month + " — " + U[k].sport : k; };
      games.forEach(function (g) {
        var k = key(g) || "Other";
        if (!idx[k]) { idx[k] = { key: k, list: [] }; groups.push(idx[k]); }
        idx[k].list.push(g);
      });
      if (view === "type") groups.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
      else groups.sort(function (a, b) { var i = months.indexOf(a.key), j = months.indexOf(b.key); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j); });
      groups.forEach(function (gr) {
        // inside a group: the other axis (month inside a type, type inside a month), then library order
        gr.list.sort(function (a, b) {
          if (view === "type") { var i = months.indexOf(suggested(a)), j = months.indexOf(suggested(b)); if (i !== j) return i - j; }
          else { var ta = a.typeLabel || "", tb = b.typeLabel || ""; if (ta !== tb) return ta < tb ? -1 : 1; }
          return (a.order || 0) - (b.order || 0);
        });
        var slugk = String(gr.key).toLowerCase().replace(/[^a-z0-9]+/g, "-");
        out.push('<section class="ng-week-block ng-group" id="' + view + "-" + esc(slugk) + '" data-group="' + esc(gr.key) + '">');
        out.push('<h2 class="ng-h">' + esc(head(gr.key)) + ' <span class="ng-count">' + gr.list.length + "</span></h2>");
        out.push('<ul class="ng-toc">' + gr.list.map(function (g) { return '<li><a href="#' + esc(g.id) + '">' + esc(g.name) + "</a></li>"; }).join("") + "</ul>");
        out.push(gr.list.map(function (g) {
          return C(g, { isNew: !!isLatest[g.id], num: "" });
        }).join(""));
        out.push("</section>");
      });
    }
    out.push("</div>");
    return out.join("\n");
  }

  root.NewGamesRender = { render: render, card: card, updatedLine: lastUpdatedLine };

  // ------------------------------------------------------------ browser
  if (typeof document === "undefined" || !document.getElementById) return;
  function boot() {
    var data = root.NEW_GAMES;
    var el = document.getElementById("ng-root");
    if (!data || !el) return;
    var view = "week";
    try { var qv = new URLSearchParams(location.search).get("view"); if (qv === "type" || qv === "month" || qv === "grade") view = qv; } catch (e) {}
    var upd = document.getElementById("ng-updated");
    if (upd) upd.innerHTML = lastUpdatedLine(data);
    var openIds = {};   // cards opened with "Show details" (kept when the view changes)
    var draw = function () { el.innerHTML = render(data, view, { compact: true, open: openIds }); };
    draw();
    function setOpen(c, on) {
      if (!c) return;
      var m = c.querySelector(".ng-more"), b = c.querySelector(".ng-toggle");
      if (m) m.hidden = !on;
      c.classList.toggle("ng-open", on);
      if (b) { b.setAttribute("aria-expanded", String(on)); b.firstChild.nodeValue = on ? "Hide details" : "Show details"; }
      if (on) openIds[c.id] = 1; else delete openIds[c.id];
    }
    // the button, or a tap on the compact part of the card (not on a link), opens the details
    el.addEventListener("click", function (e) {
      var t = e.target;
      var b = t.closest(".ng-toggle");
      if (b) { var c = b.closest(".ng-card"); setOpen(c, !c.classList.contains("ng-open")); return; }
      var top = t.closest(".ng-top");
      if (top && !t.closest("a, button, input, summary")) {
        var c2 = top.closest(".ng-card");
        if (window.getSelection && String(window.getSelection())) return;   // selecting text, not tapping
        setOpen(c2, !c2.classList.contains("ng-open"));
      }
    });
    var tools = document.getElementById("ng-tools");
    var q = document.getElementById("ng-q");
    var box = document.getElementById("ng-unit-filters");
    var tbox = document.getElementById("ng-type-filters");
    var count = document.getElementById("ng-count");
    if (!tools) return;
    tools.hidden = false;
    var unit = "all", type = "all", band = "all";
    var gbox = document.getElementById("ng-grade-filters");
    if (gbox) gbox.innerHTML = '<button type="button" data-band="all" class="on">All grades</button>' +
      BANDS.map(function (b) { return '<button type="button" data-band="' + esc(b) + '">Gr ' + esc(b) + "</button>"; }).join("");
    var used = {};
    (data.games || []).forEach(function (g) { var m = g.suggestedMonth || g.unit; used[m] = (used[m] || 0) + 1; });
    var types = [];
    (data.games || []).forEach(function (g) { var t = g.typeLabel || typeLabel(g.section); if (t && types.indexOf(t) < 0) types.push(t); });
    if (tbox) tbox.innerHTML = '<button type="button" data-type="all" class="on">All types</button>' +
      types.map(function (t) { return '<button type="button" data-type="' + esc(t) + '">' + esc(t) + "</button>"; }).join("");
    box.innerHTML = '<button type="button" data-unit="all" class="on">All months</button>' +
      (data.units || []).filter(function (u) { return used[u.month]; }).map(function (u) {
        return '<button type="button" data-unit="' + esc(u.month) + '">' + esc(unitLabel(u)) + "</button>";
      }).join("");
    function apply() {
      var term = (q.value || "").toLowerCase().trim();
      var filtering = term || unit !== "all" || type !== "all" || band !== "all";
      var shown = 0;
      var seen = {};
      el.querySelectorAll(".ng-card").forEach(function (c) {
        var ok = (!term || c.getAttribute("data-hay").indexOf(term) >= 0) && (unit === "all" || c.getAttribute("data-unit") === unit) && (type === "all" || c.getAttribute("data-type") === type) &&
          (band === "all" || (" " + (c.getAttribute("data-bands") || "") + " ").indexOf(" " + band + " ") >= 0);
        c.hidden = !ok;
        if (ok && !seen[c.id]) { seen[c.id] = 1; shown++; }
      });
      el.querySelectorAll(".ng-week-block").forEach(function (b) {
        var any = b.querySelector(".ng-card:not([hidden])");
        b.hidden = filtering && !any;
        // search or a filter shows matches from every batch; folded weeks fold again when it is cleared
        if (b.tagName === "DETAILS") {
          if (filtering && any && !b.open) { b.open = true; b.setAttribute("data-auto-open", "1"); }
          if (!filtering && b.getAttribute("data-auto-open")) { b.open = false; b.removeAttribute("data-auto-open"); }
        }
        var toc = b.querySelector(".ng-toc");
        if (toc) toc.hidden = !!filtering;
        var al = b.querySelector(".ng-also");
        if (al) al.hidden = !!filtering;
      });
      var arch = document.getElementById("archive");
      count.textContent = filtering ? shown + " matching game" + (shown === 1 ? "" : "s") : "";
      if (arch) arch.hidden = false;
    }
    var vbox = document.getElementById("ng-view-filters");
    if (vbox) {
      vbox.innerHTML = [["week", "By week added"], ["type", "By type"], ["month", "By month"], ["grade", "By grade"]].map(function (v) {
        return '<button type="button" data-view="' + v[0] + '"' + (v[0] === view ? ' class="on"' : "") + ">" + v[1] + "</button>";
      }).join("");
      vbox.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-view]");
        if (!b) return;
        view = b.getAttribute("data-view");
        vbox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
        draw();
        apply();
        try { history.replaceState(null, "", view === "week" ? location.pathname + location.hash : location.pathname + "?view=" + view + location.hash); } catch (e2) {}
      });
    }
    q.addEventListener("input", apply);
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-unit]");
      if (!b) return;
      unit = b.getAttribute("data-unit");
      box.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      apply();
    });
    if (gbox) gbox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-band]");
      if (!b) return;
      band = b.getAttribute("data-band");
      gbox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      apply();
    });
    if (tbox) tbox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-type]");
      if (!b) return;
      type = b.getAttribute("data-type");
      tbox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      apply();
    });
    // a link to #game (or an old-name anchor) opens that card, its folded week, and scrolls to it
    function openHash() {
      var id = "";
      try { id = decodeURIComponent((location.hash || "").slice(1)); } catch (e) { return; }
      if (!id) return;
      var t = document.getElementById(id);
      if (!t) return;
      var c = t.classList.contains("ng-card") ? t : t.closest(".ng-card");
      if (!c) return;
      if (c.hidden) { q.value = ""; unit = type = band = "all"; [box, tbox, gbox].forEach(function (x) { if (x) x.querySelectorAll("button").forEach(function (y, i) { y.classList.toggle("on", i === 0); }); }); apply(); }
      setOpen(c, true);
      for (var d = c.parentElement; d; d = d.parentElement) if (d.tagName === "DETAILS") d.open = true;
      var pd = t.closest("details.peg");
      if (pd) pd.open = true;
      c.scrollIntoView({ block: "start" });
    }
    window.addEventListener("hashchange", openHash);
    // a same-page link to the hash already in the address bar does not fire hashchange
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a && a.getAttribute("href") === location.hash) setTimeout(openHash, 0);
    });
    apply();
    openHash();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
