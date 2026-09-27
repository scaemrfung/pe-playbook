/* ==========================================================================
   SCHOOL-YEAR CONFIG — the ONE file to review each August.
   --------------------------------------------------------------------------
   Every year-specific date on the site lives here. Lesson text in data.js
   uses tokens like {{terryFox}} that are filled in from this file.

   Yearly checklist:
     1. Update label / startYear / firstDay (CONFIG) and the calendar (CAL).
     2. Set terryFox to your school's run date (or null to use the rule:
        last Friday of September).
     3. Check PE_WEEKS (which month week is taught in which school week).
     4. Run:  node tools/build.js   (re-bakes the month pages), then commit.

   Test any date with ?today=YYYY-MM-DD in the page URL.
   ========================================================================== */
(function (root) {
  var CONFIG = {
    label: "2026–2027",
    startYear: 2026,            // the September the school year starts in
    timeZone: "America/Edmonton",
    firstDay: "2026-08-31",     // first day of classes (EIPS Division Calendar 2026-27)
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

  /** The school month to feature today. Follows the PE week plan below, so
      Sept 28–Oct 1 (school Week 5) is still September (plan W4) and
      Mar 30–Apr 2 is March (plan W4). Breaks point at the next school week. Summer → September. */
  function currentMonth(now) {
    var t = today(now);
    var name = MONTH_NAMES[t.m];
    var pw = peWeek(now ? iso(Date.UTC(t.y, t.m, t.d)) : null);
    if (pw && pw.month) return { name: pw.month, summer: false, today: t, week: pw };
    var summer = CONFIG.schoolMonths.indexOf(name) < 0 || (pw && pw.kind === "summer");
    return { name: summer ? CONFIG.schoolMonths[0] : name, summer: summer, today: t, week: pw };
  }


  /* ---- School calendar (EIPS Division Calendar 2026-27) ------------------
     Source: https://www.eips.ca/download/480909  (verified Sept 27, 2026)
     To roll over to a new year: change the dates in CAL below. Everything
     else (school weeks, lesson numbers, short-week notes) is worked out
     from these dates.
     Test any date with ?today=YYYY-MM-DD in the page URL.            */
  var CAL = {
    label: "2026–2027",
    timeZone: "America/Edmonton",
    firstDay: "2026-08-31",        // Classes begin (Mon)
    lastDay: "2027-06-28",         // Last instructional day (Mon)
    semester2: "2027-02-01",
    lessons: 36,
    // Catch-up weeks (Monday of the week). No new lesson; finish or review.
    catchUp: ["2026-12-14", "2027-02-01", "2027-06-21"],
    catchUpWhy: {
      "2026-12-14": "Catch-up week before Christmas (concerts, finish Week 14 or review)",
      "2027-02-01": "Catch-up week (Teachers' Convention Thu–Fri; semester 2 starts)",
      "2027-06-21": "Catch-up week (year-end: finish Week 36 or review)"
    },
    // Weekday non-school days: [first, last, reason]
    closed: [
      ["2026-09-07", "2026-09-07", "Labour Day"],
      ["2026-09-30", "2026-09-30", "Truth and Reconciliation Day"],
      ["2026-10-02", "2026-10-02", "PL day"],
      ["2026-10-12", "2026-10-12", "Thanksgiving"],
      ["2026-11-09", "2026-11-13", "November Break"],
      ["2026-12-21", "2027-01-01", "Christmas Break"],
      ["2027-01-29", "2027-01-29", "PL day"],
      ["2027-02-04", "2027-02-05", "Teachers' Convention"],
      ["2027-02-15", "2027-02-15", "Family Day"],
      ["2027-03-05", "2027-03-05", "PL day"],
      ["2027-03-19", "2027-03-19", "School closure"],
      ["2027-03-22", "2027-03-26", "Spring Break"],
      ["2027-03-29", "2027-03-29", "Easter Monday"],
      ["2027-05-07", "2027-05-07", "PL day"],
      ["2027-05-20", "2027-05-21", "School closure"],
      ["2027-05-24", "2027-05-24", "Victoria Day"],
      ["2027-06-29", "2027-06-29", "Operational day (no students)"]
    ],
    earlyDismissal: 3 // Wednesday: one hour early every week
  };

  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var DAY = 864e5;

  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ""));
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function dow(t) { return new Date(t).getUTCDay(); }
  function mondayOf(t) { var d = dow(t); return t - ((d + 6) % 7) * DAY; }
  function short(t) { var d = new Date(t); return MON[d.getUTCMonth()] + " " + d.getUTCDate(); }
  function dayLabel(t) { return DOW[dow(t)] + " " + short(t); }
  function range(a, b) {
    if (a === b) return dayLabel(a);
    var da = new Date(a), db = new Date(b);
    return short(a) + "–" + (da.getUTCMonth() === db.getUTCMonth() ? db.getUTCDate() : short(b));
  }

  var CLOSED = {};
  CAL.closed.forEach(function (c) {
    for (var t = parse(c[0]); t <= parse(c[1]); t += DAY) CLOSED[iso(t)] = c[2];
  });
  var FIRST = parse(CAL.firstDay), LAST = parse(CAL.lastDay);

  /* Build every week from the first Monday to the last day. */
  var WEEKS = [], BREAKS = [];
  (function build() {
    var lesson = 0, n = 0;
    for (var mon = mondayOf(FIRST); mon <= LAST; mon += 7 * DAY) {
      var days = [], off = [];
      for (var i = 0; i < 5; i++) {
        var t = mon + i * DAY, k = iso(t);
        if (t < FIRST || t > LAST) continue;
        if (CLOSED[k]) off.push({ date: k, why: CLOSED[k], label: dayLabel(t) });
        else days.push(k);
      }
      if (!days.length) {
        var why = off.length ? off[0].why : "No school";
        var prev = BREAKS[BREAKS.length - 1];
        if (prev && prev.name === why && parse(prev.end) + 3 * DAY >= mon) prev.end = iso(mon + 4 * DAY), prev.range = range(parse(prev.start), mon + 4 * DAY);
        else BREAKS.push({ name: why, start: iso(mon), end: iso(mon + 4 * DAY), range: range(mon, mon + 4 * DAY) });
        continue;
      }
      n++;
      var w = { n: n, monday: iso(mon), start: days[0], end: days[days.length - 1], days: days, off: off,
        range: range(parse(days[0]), parse(days[days.length - 1])) };
      if (CAL.catchUp.indexOf(iso(mon)) >= 0) { w.kind = "catchup"; w.lesson = null; w.why = CAL.catchUpWhy[iso(mon)] || "Catch-up week"; }
      else if (lesson >= CAL.lessons) { w.kind = "yearend"; w.lesson = null; w.why = "Last day of school"; }
      else { lesson++; w.kind = "lesson"; w.lesson = lesson; }
      var partialStart = mon < FIRST, partialEnd = mon + 4 * DAY > LAST;
      if (days.length < 5) {
        var bits = off.map(function (o) { return o.label + " off (" + o.why + ")"; });
        if (partialEnd && !off.length) w.note = days.length + "-day week: last day of school " + dayLabel(parse(days[days.length - 1]));
        else if (partialStart && !off.length) w.note = days.length + "-day week: first day of school " + dayLabel(parse(days[0]));
        else w.note = days.length + "-day week: " + bits.join(", ");
      } else w.note = "";
      WEEKS.push(w);
    }
  })();

  function weekOfLesson(n) { for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].lesson === n) return WEEKS[i]; return null; }
  function weekOfDate(k) {
    var mon = iso(mondayOf(parse(k)));
    for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].monday === mon) return WEEKS[i];
    return null;
  }
  function nextWeekAfter(k) { for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].start > k) return WEEKS[i]; return null; }
  function nextLessonWeekFrom(w) {
    for (var i = WEEKS.indexOf(w); i >= 0 && i < WEEKS.length; i++) if (WEEKS[i].lesson) return WEEKS[i];
    return null;
  }
  function breakOf(k) {
    for (var i = 0; i < BREAKS.length; i++) if (BREAKS[i].start <= k && k <= BREAKS[i].end) return BREAKS[i];
    return null;
  }

  /** Today's date (school time zone) as "YYYY-MM-DD". ?today=YYYY-MM-DD wins. */
  function todayISO() {
    try {
      var o = root && (root.SCHOOL_TODAY || root.PE_TODAY);
      if (!o && root && root.location) o = new URLSearchParams(root.location.search).get("today");
      if (o && parse(o) != null) return o;
    } catch (e) { /* ignore */ }
    try {
      var p = new Intl.DateTimeFormat("en-CA", { timeZone: CAL.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
      var g = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return g("year") + "-" + g("month") + "-" + g("day");
    } catch (e) { var d = new Date(); return iso(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }
  }

  /** What to show for a date (default: today).
      kind: lesson | catchup | break | closed | before | summer | yearend
      lesson: the lesson number to feature; week: the school week it belongs to. */
  function status(k) {
    k = k || todayISO();
    var t = parse(k), d = dow(t), out = { date: k };
    if (t < FIRST) {
      var w1 = WEEKS[0];
      return { date: k, kind: "before", label: "First lesson", lesson: 1, week: w1,
        message: "School starts " + DOW_LONG[dow(parse(w1.start))] + " " + short(parse(w1.start)) + ". Week 1 is ready." };
    }
    if (t > LAST) {
      return { date: k, kind: "summer", label: "Start here", lesson: 1, week: null,
        message: "The " + CAL.label + " school year is over. Week 1 is here so you can plan for next year." };
    }
    // Weekend: look at the week that starts next Monday.
    var probe = k;
    if (d === 6 || d === 0) probe = iso(t + (d === 6 ? 2 : 1) * DAY);
    var w = weekOfDate(probe);
    if (!w) {
      var br = breakOf(probe) || { name: "No school", range: "" };
      var nx = nextWeekAfter(probe), nl = nx && nextLessonWeekFrom(nx);
      return { date: k, kind: "break", label: "Next lesson", lesson: nl ? nl.lesson : 36, week: nl,
        message: br.name + (br.range ? " (" + br.range + ")" : "") + " — no school." +
          (nx ? " Back " + DOW_LONG[dow(parse(nx.start))] + " " + short(parse(nx.start)) + (nl ? " with Week " + nl.lesson + "." : ".") : "") };
    }
    out.week = w;
    if (w.kind === "catchup") {
      var prevL = 0; for (var i = 0; i < WEEKS.length && WEEKS[i] !== w; i++) if (WEEKS[i].lesson) prevL = WEEKS[i].lesson;
      var nl2 = nextLessonWeekFrom(w);
      out.kind = "catchup"; out.label = "Catch-up week"; out.lesson = prevL || 1;
      out.message = "Catch-up week (" + w.range + "): no new lesson. Finish Week " + prevL + " or review." +
        (nl2 ? " Week " + nl2.lesson + " starts " + short(parse(nl2.start)) + "." : "") + (w.note ? " " + w.note + "." : "");
      return out;
    }
    if (w.kind === "yearend") {
      out.kind = "yearend"; out.label = "Last day"; out.lesson = CAL.lessons;
      out.message = "Last day of school: " + dayLabel(parse(w.start)) + ". Week " + CAL.lessons + " was the last lesson.";
      return out;
    }
    out.kind = "lesson"; out.label = "This week’s lesson"; out.lesson = w.lesson;
    if (CLOSED[k]) out.message = "No school today (" + CLOSED[k] + "). " + (w.note || "");
    else out.message = w.note || "";
    return out;
  }

  function weekInfo(n) {
    var w = weekOfLesson(n);
    if (!w) return null;
    return { lesson: n, week: w.n, range: w.range, note: w.note, start: w.start, end: w.end, days: w.days, off: w.off };
  }
  /** "Sept 28–Oct 1 · 3-day week: Wed Sept 30 off (...)" */
  function lessonLine(n) {
    var w = weekOfLesson(n);
    return w ? w.range + (w.note ? " · " + w.note : "") : "";
  }
  /** Is a date a school day? Returns null if yes, else the reason. */
  function closedReason(k) {
    var t = parse(k); if (t == null) return "Not a date";
    var d = dow(t);
    if (d === 0 || d === 6) return "Weekend";
    if (t < FIRST) return "Before the first day of school";
    if (t > LAST) return CLOSED[k] || "Summer (after the last day of school)";
    return CLOSED[k] || null;
  }


  /* ---- PE month plan on the real calendar ---------------------------------
     Each school week (1 = Aug 31–Sept 4) teaches one month week (W1–W4).
     Weeks are named by the school-year count (Week 4 = Sept 21–25); the month
     week is the plan section on the month page (month-september.html#week-3).
     [school week, month, month week, note, theme]  (month week 0 = start-up week;
     theme is optional and shown next to the week name, e.g. "Week 4 · Football") */
  var PE_WEEKS = [
    [1, "September", 0, "Start-up week: gym routines, signals and name games. September W1 lessons start Sept 8 (Week 2)."],
    [2, "September", 1, "", "Soccer"], [3, "September", 2, "Terry Fox run Fri Sept 18", "Soccer"],
    [4, "September", 3, "Football intro", "Football"],
    [5, "September", 4, "Football Week 5: the weekly plan teaches October W1 (flag or two-hand touch, routes, end-zone catch)", "Football"],
    [6, "October", 1], [7, "October", 2], [8, "October", 3], [9, "October", 4],
    [10, "November", 1], [11, "November", 2], [12, "November", 3], [13, "November", 4],
    [14, "December", 1], [15, "December", 4, "Last week before Christmas: festival stations and closers (W2–W3 are extra games this year)"],
    [16, "January", 1], [17, "January", 2], [18, "January", 3], [19, "January", 4],
    [20, "February", 1], [21, "February", 2], [22, "February", 3], [23, "February", 4],
    [24, "March", 1], [25, "March", 2], [26, "March", 3], [27, "March", 4, "Right after Spring Break"],
    [28, "April", 1], [29, "April", 2], [30, "April", 3], [31, "April", 4],
    [32, "May", 1], [33, "May", 2], [34, "May", 3], [35, "May", 4],
    [36, "June", 1, "Track and Field Day week"], [37, "June", 2], [38, "June", 3], [39, "June", 4],
    [40, "June", 4, "Last class of the year"]
  ];
  // Month weeks that have no school week this year.
  var PE_EXTRA = { "December": { 2: "Extra games — no school week for these this year. Use them any time.", 3: "Extra games — no school week for these this year. Use them any time." } };

  function peEntry(n) {
    for (var i = 0; i < PE_WEEKS.length; i++) if (PE_WEEKS[i][0] === n) return PE_WEEKS[i];
    return null;
  }
  function peFromWeek(w, kind) {
    var e = w && peEntry(w.n);
    if (!e) return null;
    return { kind: kind || "week", schoolWeek: w.n, month: e[1], w: e[2], range: w.range, start: w.start, end: w.end,
      days: w.days, off: w.off, note: w.note, planNote: e[3] || "", theme: e[4] || "",
      name: "Week " + w.n + (e[4] ? " · " + e[4] : ""), plan: e[2] ? e[1] + " W" + e[2] : e[1] + " start-up" };
  }
  /** PE week for a date (default today): {month, w, range, note, planNote, kind}.
      kind: week | break (next school week) | summer | before */
  function peWeek(k) {
    var st = status(k);
    if (st.kind === "summer") return { kind: "summer" };
    var w;
    if (st.kind === "break") w = nextWeekAfter(st.date);
    else if (st.kind === "before") w = WEEKS[0];
    else w = st.week;
    var out = peFromWeek(w, st.kind === "break" ? "break" : st.kind === "before" ? "before" : "week");
    if (out && st.kind === "break") out.message = st.message.replace(/ with Week \d+\.$/, ".");
    if (out && CLOSED[st.date]) out.today = "No school today (" + CLOSED[st.date] + ")";
    return out;
  }
  /** School weeks for one month: [{w, range, note, planNote, schoolWeek}] plus extras. */
  function peWeeksForMonth(name) {
    var out = [];
    WEEKS.forEach(function (w) { var e = peEntry(w.n); if (e && e[1] === name) out.push(peFromWeek(w)); });
    return out;
  }
  function peWeekLabel(name, wk) {
    var list = peWeeksForMonth(name).filter(function (x) { return x.w === wk; });
    if (!list.length) return { extra: true, text: (PE_EXTRA[name] && PE_EXTRA[name][wk]) || "Not scheduled this year" };
    return { extra: false, weeks: list, text: list.map(function (x) {
      return x.range + (x.note ? " · " + x.note : "") + (x.planNote ? " · " + x.planNote : "");
    }).join(" + ") };
  }

  var API = { config: CONFIG, dates: dates, tokens: tokens, fill: fill, today: today, currentMonth: currentMonth,
    calendar: CAL, weeks: WEEKS, breaks: BREAKS, todayISO: todayISO, status: status, closedReason: closedReason,
    peWeeks: PE_WEEKS, peWeek: peWeek, peWeeksForMonth: peWeeksForMonth, peWeekLabel: peWeekLabel };
  if (root) root.SCHOOL_YEAR = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : null);
