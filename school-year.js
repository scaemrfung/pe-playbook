/* ==========================================================================
   SCHOOL-YEAR CONFIG — the ONE file to review each August.
   --------------------------------------------------------------------------
   Every year-specific date on the site lives here. Lesson text in data.js
   uses tokens like {{terryFox}} that are filled in from this file.

   Yearly checklist:
     1. Update label / startYear / firstDay.
     2. Set terryFox to your school's run date (or null to use the rule:
        last Friday of September).
     3. Update the other dates below if your school calendar changes.
     4. Run:  node tools/build.js   (re-bakes the month pages), then commit.
   ========================================================================== */
(function (root) {
  var CONFIG = {
    label: "2026–2027",
    startYear: 2026,            // the September the school year starts in
    timeZone: "America/Edmonton",
    firstDay: "2026-09-01",     // first day of classes (confirm with the district calendar)
    terryFox: "2026-09-18",     // Terry Fox School Run day; null = last Friday of September
    truthAndReconciliation: "2026-09-30", // National Day for Truth and Reconciliation (Sept 30 every year)
    trackDay: null,             // Grade 4–6 Track and Field Day; null = "first week of June"
    // School months shown on the site, in order. Jul/Aug fall back to September.
    schoolMonths: ["September", "October", "November", "December", "January", "February", "March", "April", "May", "June"]
  };

  var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ""));
    return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
  }
  function lastWeekdayOfMonth(year, monthIdx, weekday) {
    var d = new Date(Date.UTC(year, monthIdx + 1, 0));
    while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() - 1);
    return d;
  }
  function firstWeekdayOfMonth(year, monthIdx, weekday) {
    var d = new Date(Date.UTC(year, monthIdx, 1));
    while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() + 1);
    return d;
  }
  /** "Fri Sept 18" */
  function fmtLong(d) { return d ? DOW[d.getUTCDay()] + " " + MON_SHORT[d.getUTCMonth()] + " " + d.getUTCDate() : ""; }
  /** "Sept 18" */
  function fmtShort(d) { return d ? MON_SHORT[d.getUTCMonth()] + " " + d.getUTCDate() : ""; }

  function dates() {
    var y = CONFIG.startYear;
    var terry = parseISO(CONFIG.terryFox) || lastWeekdayOfMonth(y, 8, 5);
    var trc = parseISO(CONFIG.truthAndReconciliation) || new Date(Date.UTC(y, 8, 30));
    var labour = firstWeekdayOfMonth(y, 8, 1); // first Monday of September
    var track = parseISO(CONFIG.trackDay);
    return { terryFox: terry, truthAndReconciliation: trc, labourDay: labour, trackDay: track, firstDay: parseISO(CONFIG.firstDay) };
  }

  /** Replacement values for {{tokens}} used in data.js text. */
  function tokens() {
    var d = dates();
    return {
      terryFox: fmtLong(d.terryFox),            // "Fri Sept 18"
      terryFoxShort: fmtShort(d.terryFox),      // "Sept 18"
      truthAndReconciliation: fmtLong(d.truthAndReconciliation),
      labourDay: fmtLong(d.labourDay),
      trackDay: d.trackDay ? fmtLong(d.trackDay) : "first week of June",
      schoolYear: CONFIG.label
    };
  }
  function fill(text) {
    if (typeof text !== "string" || text.indexOf("{{") < 0) return text;
    var t = tokens();
    return text.replace(/\{\{(\w+)\}\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(t, k) ? t[k] : m; });
  }

  /** Today's date in the school's time zone as {y, m (0-11), d}.
      For testing, ?today=YYYY-MM-DD in the URL or window.PE_TODAY overrides it. */
  function today(now) {
    var override = null;
    try {
      if (root && root.PE_TODAY) override = String(root.PE_TODAY);
      if (!override && root && root.location) override = new URLSearchParams(root.location.search).get("today");
    } catch (e) { /* ignore */ }
    var o = parseISO(override);
    if (o) return { y: o.getUTCFullYear(), m: o.getUTCMonth(), d: o.getUTCDate() };
    var date = now || new Date();
    try {
      var parts = new Intl.DateTimeFormat("en-CA", { timeZone: CONFIG.timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
      var get = function (t) { return +parts.find(function (p) { return p.type === t; }).value; };
      return { y: get("year"), m: get("month") - 1, d: get("day") };
    } catch (e) {
      return { y: date.getFullYear(), m: date.getMonth(), d: date.getDate() };
    }
  }

  /** The school month to feature today. Jul/Aug → September with summer: true. */
  function currentMonth(now) {
    var t = today(now);
    var name = MONTH_NAMES[t.m];
    var summer = CONFIG.schoolMonths.indexOf(name) < 0;
    return { name: summer ? CONFIG.schoolMonths[0] : name, summer: summer, today: t };
  }

  var API = { config: CONFIG, dates: dates, tokens: tokens, fill: fill, today: today, currentMonth: currentMonth };
  if (root) root.SCHOOL_YEAR = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : null);
