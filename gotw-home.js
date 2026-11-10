/* Homepage: Games of the Week inside the red What's New This Week box (Mr. Fung, Nov 1 2026: "can you put this
   Games of the Week page to the what's new this week box on the main page?").
   Same data and week logic as games-of-the-week.html (gotw.js): games-of-the-week-data.js, the week whose Monday
   matches today in America/Edmonton (school-year.js todayISO, so ?today=YYYY-MM-DD previews a date).
   From Saturday it switches to the coming week: its picks, a link to the week and a Print button
   (games-of-the-week-print.html?week=N). Breaks show the games for the week back; summer shows a short note. Without JavaScript the static line stays. */
(function () {
  function run() {
    var D = window.GAMES_OF_THE_WEEK, SY = window.SCHOOL_YEAR, box = document.getElementById("whats-new-gotw");
    if (!D || !box || !D.weeks || !D.weeks.length) return;
    var DAY = 864e5, W = D.weeks;
    function parse(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null; }
    function iso(t) { return new Date(t).toISOString().slice(0, 10); }
    // Mr. Fung, Nov 1 2026 ("yes, change it on Saturdays"): from Saturday the coming week shows, so Sat/Sun roll forward to next Monday.
    function mondayOf(k) { var t = parse(k), d = new Date(t).getUTCDay(); return iso(d === 6 || d === 0 ? t + (d === 6 ? 2 : 1) * DAY : t - (d - 1) * DAY); }
    function isWeekend(k) { var d = new Date(parse(k)).getUTCDay(); return d === 6 || d === 0; }
    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    var today = SY && SY.todayISO ? SY.todayISO() : iso(Date.now()), mon = mondayOf(today);
    var w = null, lead = "", brk = null;
    for (var i = 0; i < W.length; i++) if (W[i].monday === mon) w = W[i];
    if (!w) {
      if (today > W[W.length - 1].end) {
        box.innerHTML = '<p class="whats-new-gotw-head"><strong>Games of the Week:</strong> the ' + esc(D.year) +
          ' school year is over. <a class="whats-new-link" href="games-of-the-week.html">Browse every week’s games</a> to plan ahead.</p>';
        return;
      }
      (D.breaks || []).forEach(function (b) { if (b.start <= mon && mon <= b.end) brk = b; });
      for (var j = 0; j < W.length; j++) if (W[j].monday > mon) { w = W[j]; break; }
      if (!w) return;
      lead = brk ? "No school this week (" + esc(/christmas/i.test(brk.name) ? "School break" : brk.name) + "). Back on " + esc(w.range) + ":" : "First week of school, " + esc(w.range) + ":";
    }
    var head = '<p class="whats-new-gotw-head"><strong>Games of the Week</strong> · ' +
      (lead || (isWeekend(today) ? "Coming up: " : "") + '<span class="nowrap">Week ' + w.n + " · " + esc(w.range) + "</span>") + ' <span class="whats-new-gotw-unit">' + esc(w.month) + ": " + esc(w.unit) + "</span></p>";
    var bands = '<div class="whats-new-gotw-bands">' + (w.bands || []).map(function (b) {
      return '<div class="whats-new-gotw-band"><p class="whats-new-gotw-label">' + esc(b.label) + '</p><ol>' + b.picks.map(function (p) {
        return '<li><a href="' + esc(p.href) + '">' + esc(p.name) + "</a></li>";
      }).join("") + "</ol></div>";
    }).join("") + "</div>";
    // Mr. Fung, Nov 1 2026: "when it's a new week, put the week's Games of the Week link and print button in the What's New This Week box"
    box.innerHTML = head + bands + '<p class="whats-new-actions whats-new-gotw-actions">' +
      '<a class="whats-new-btn" href="games-of-the-week-print.html?week=' + w.n + '&amp;print=1">Print Week ' + w.n + ' games</a>' +
      '<a class="whats-new-link" href="games-of-the-week.html#week-' + w.n + '">Week ' + w.n + ' Games of the Week</a>' +
      '<a class="whats-new-link" href="games-of-the-week.html">All Games of the Week</a></p>';
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
