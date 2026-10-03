/* Downloads page: swap the baked "latest plan" for the plan of the current school week
   (same date logic as the homepage; ?today=YYYY-MM-DD previews another date). */
(function () {
  var SY = window.SCHOOL_YEAR, box = document.getElementById("dl-this");
  if (!SY || !SY.status || !box) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var today = SY.todayISO(), st = SY.status(today), week = st.week;
  if (st.kind === "break" || st.kind === "before") week = (SY.weeks || []).find(function (w) { return w.start > today; }) || null;
  if (!week) { box.innerHTML = '<p class="meta">No school this week.</p>'; return; }
  var plan = (window.WEEKLY_PLANS || []).find(function (p) { return p.week === week.monday; });
  if (plan) {
    var name = (plan.file || "").split("/").pop();
    box.innerHTML = '<ul class="dl-list clean"><li class="dl-row"><div class="dl-text"><strong>' + esc(plan.title) + '</strong><span class="meta">' + esc(plan.note || "") +
      '</span></div><a class="btn" href="' + esc(plan.file) + '" download="' + esc(name) + '">Download <span class="dl-fmt">Word</span></a></li></ul>';
  } else {
    box.innerHTML = '<p class="tw-warn" role="status">No weekly plan is listed for the week of ' + esc(week.range) + ' yet. Newer plans appear here as soon as they are posted; the newest ones are in the list below.</p>';
  }
})();
