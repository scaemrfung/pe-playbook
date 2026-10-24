/* Assessment builder (assessment-builder.html). Runs only in the browser.
   Student names are never saved or sent: they live in this page until you close or clear it. */
(function () {
  "use strict";
  var R = window.REPORTING_PE;
  var DEFAULTS = [
 {
  "p": "Sept–Oct",
  "o": 1,
  "name": "Safe use of space",
  "ev": "Observation",
  "k2": "Freezes on the stop signal; moves in general space without bumping; keeps a bubble of personal space.",
  "g36": "Moves to open space safely; keeps spacing and stays in the boundaries without reminders."
 },
 {
  "p": "Sept–Oct",
  "o": 3,
  "name": "Fair play",
  "ev": "Observation",
  "k2": "Takes turns, accepts a tag or a miss, and plays by the rules.",
  "g36": "Plays fair, encourages others, and accepts results calmly."
 },
 {
  "p": "Sept–Oct",
  "o": 0,
  "name": "Joins in and keeps going",
  "ev": "Observation + conversation",
  "k2": "Joins in with effort; names one way moving makes them feel good.",
  "g36": "Keeps going when an activity is hard; explains how activity helps well-being."
 },
 {
  "p": "Sept–Oct",
  "o": 2,
  "name": "Travelling skills",
  "ev": "Observation",
  "k2": "Runs, hops, jumps, and gallops with control and stops on the signal.",
  "g36": "Changes speed, direction, and pathway smoothly while travelling."
 },
 {
  "p": "Nov–Dec",
  "o": 2,
  "name": "Sending and receiving",
  "ev": "Observation",
  "k2": "Throws, catches, or kicks with ready hands or feet and eyes on the object.",
  "g36": "Sends and receives with control while moving; uses the right cue (step, follow-through)."
 },
 {
  "p": "Nov–Dec",
  "o": 1,
  "name": "Game choices",
  "ev": "Observation",
  "k2": "Looks up and moves away from a tagger or to an open spot.",
  "g36": "Picks a tactic or strategy (pass, cut, defend space) that fits the game."
 },
 {
  "p": "Nov–Dec",
  "o": 3,
  "name": "Working with a partner",
  "ev": "Observation",
  "k2": "Shares equipment and helps a partner finish a task.",
  "g36": "Includes everyone, shares roles, and helps the group succeed."
 },
 {
  "p": "Nov–Dec",
  "o": 0,
  "name": "Activity and rest",
  "ev": "Conversation",
  "k2": "Tells how the body feels after activity (heart, breath) and why rest helps.",
  "g36": "Explains how the body changes during activity and why rest and recovery matter."
 },
 {
  "p": "Jan–Feb",
  "o": 2,
  "name": "Body control and balance",
  "ev": "Observation",
  "k2": "Shows balance and control in jumps, landings, rolls, or shapes.",
  "g36": "Links movements smoothly; changes speed, level, or direction with control."
 },
 {
  "p": "Jan–Feb",
  "o": 1,
  "name": "Rules and structure",
  "ev": "Observation + conversation",
  "k2": "Follows the rules of a simple game and stays in the right area.",
  "g36": "Explains the rules or structure of a game and makes good decisions in it."
 },
 {
  "p": "Jan–Feb",
  "o": 3,
  "name": "Teamwork",
  "ev": "Observation",
  "k2": "Works with a group to finish a shared task.",
  "g36": "Communicates with teammates and works out a plan together."
 },
 {
  "p": "Jan–Feb",
  "o": 0,
  "name": "Trying a challenge",
  "ev": "Observation + conversation",
  "k2": "Tries a new or hard activity and keeps trying.",
  "g36": "Sets a small goal in a challenging activity and talks about effort or motivation."
 },
 {
  "p": "Mar–Apr",
  "o": 2,
  "name": "Movement patterns and rhythm",
  "ev": "Observation",
  "k2": "Skips, hops, or gallops to a beat; repeats a simple movement pattern.",
  "g36": "Combines skills in a pattern or sequence; adapts it to a beat or partner."
 },
 {
  "p": "Mar–Apr",
  "o": 1,
  "name": "Space in a new activity",
  "ev": "Observation",
  "k2": "Finds open space in a new game or station.",
  "g36": "Uses space and tactics on purpose in a new activity and explains the choice."
 },
 {
  "p": "Mar–Apr",
  "o": 3,
  "name": "Solving problems in play",
  "ev": "Observation + conversation",
  "k2": "Uses kind words and asks for help when there is a problem in a game.",
  "g36": "Solves a game disagreement calmly (talk, rock-paper-scissors, replay) without adult help."
 },
 {
  "p": "Mar–Apr",
  "o": 0,
  "name": "Active choices",
  "ev": "Conversation",
  "k2": "Names a way to be active at recess or at home.",
  "g36": "Explains how their choices about activity affect being active and feeling well."
 },
 {
  "p": "May–Jun",
  "o": 2,
  "name": "Skills outdoors",
  "ev": "Observation",
  "k2": "Strikes, throws, or kicks toward a target with control.",
  "g36": "Adapts a skill to a moving target or a game situation."
 },
 {
  "p": "May–Jun",
  "o": 1,
  "name": "Tactics in games",
  "ev": "Observation",
  "k2": "Moves to help the team (gets open, guards space) in a simple game.",
  "g36": "Reads the game and changes a tactic or strategy when it is not working."
 },
 {
  "p": "May–Jun",
  "o": 3,
  "name": "Fair play in games",
  "ev": "Observation",
  "k2": "Accepts the result of a game; says \"good game\" to others.",
  "g36": "Shows fair play and leadership; supports teammates of all skill levels."
 },
 {
  "p": "May–Jun",
  "o": 0,
  "name": "Year reflection",
  "ev": "Conversation or product",
  "k2": "Names a favourite activity and a way to be active at home.",
  "g36": "Sets a simple goal to stay active and explains why it matters."
 }
];
  var PERIODS = ["Sept–Oct", "Nov–Dec", "Jan–Feb", "Mar–Apr", "May–Jun", "Any time"];
  var LABEL = ["AL (active living)", "ST (space, tactics, structure)", "MV (movement skills)", "TW (fair play, teamwork, conflict)"];
  var $ = function (s) { return document.querySelector(s); };
  var state = { grade: "3", checks: [] };

  function g() { return R.grades.filter(function (x) { return x.id === state.grade; })[0]; }
  function isK2() { return ["K", "1", "2"].indexOf(state.grade) >= 0; }
  function levels() { return isK2() ? ["NY", "ME", "MA", "INS", "ISP", "N/A"] : ["NY", "MIN", "S", "MA", "INS", "ISP", "N/A"]; }
  function levelNames() { return isK2() ? "Not Yet Meeting / Meeting / Mastering Expectations" : "Not Yet Meeting / Minimally Meeting / Solidifying / Mastering Expectations"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function defaultCheck(i) {
    var d = DEFAULTS[i % DEFAULTS.length];
    return { period: d.p, o: d.o, custom: "", name: d.name, look: isK2() ? d.k2 : d.g36, ev: d.ev };
  }
  function resetChecks(n) {
    state.checks = [];
    for (var i = 0; i < n; i++) state.checks.push(defaultCheck(i));
  }
  function outcomeText(c) { return c.o === "custom" ? (c.custom || "(custom outcome)") : g().outcomes[c.o]; }
  function outcomeLabel(c) { return c.o === "custom" ? "Custom" : LABEL[c.o]; }

  function renderGrades() {
    $("#ab-grades").innerHTML = R.grades.map(function (x) {
      return '<button type="button" data-g="' + x.id + '"' + (x.id === state.grade ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(x.label) + "</button>";
    }).join("");
    $("#ab-levels").textContent = "Levels for " + g().label + ": " + levels().join(" · ") + " (no percentages).";
  }

  function renderChecks() {
    var opts = function (c) {
      return g().outcomes.map(function (o, i) {
        return '<option value="' + i + '"' + (c.o === i ? " selected" : "") + ">" + esc(LABEL[i].split(" ")[0] + " · " + o) + "</option>";
      }).join("") + '<option value="custom"' + (c.o === "custom" ? " selected" : "") + ">Custom outcome (type your own)</option>";
    };
    $("#ab-checks").innerHTML = state.checks.map(function (c, i) {
      return '<fieldset class="ab-check" data-i="' + i + '"><legend>Check ' + (i + 1) + "</legend>" +
        '<label>Period <select data-f="period">' + PERIODS.map(function (p) { return "<option" + (p === c.period ? " selected" : "") + ">" + p + "</option>"; }).join("") + "</select></label>" +
        '<label class="ab-wide">Outcome <select data-f="o">' + opts(c) + "</select></label>" +
        '<label class="ab-wide ab-custom"' + (c.o === "custom" ? "" : " hidden") + '>Custom outcome <input type="text" data-f="custom" value="' + esc(c.custom) + '" placeholder="Type the outcome word for word" /></label>' +
        '<label>Check name <input type="text" data-f="name" value="' + esc(c.name) + '" /></label>' +
        '<label class="ab-wide">Look-for (what meeting looks like) <textarea rows="2" data-f="look">' + esc(c.look) + "</textarea></label>" +
        "</fieldset>";
    }).join("");
  }

  function names() {
    return $("#ab-names").value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function rowsOrBlank() { var n = names(); if (!n.length) for (var i = 1; i <= 30; i++) n.push(""); return n; }

  function generate() {
    var L = levels(), N = rowsOrBlank();
    var head = "<tr><th>#</th><th>Student</th>" + state.checks.map(function (c, i) {
      return '<th scope="col"><span class="ab-th-name">' + (i + 1) + ". " + esc(c.name) + '</span><span class="ab-th-meta">' + esc(c.period) + " · " + esc(outcomeLabel(c)) + "</span></th>";
    }).join("") + "<th>Comments</th></tr>";
    var sel = '<select aria-label="Level"><option value=""></option>' + L.map(function (l) { return "<option>" + l + "</option>"; }).join("") + "</select>";
    var body = N.map(function (n, r) {
      return "<tr><td>" + (r + 1) + '</td><td class="ab-name">' + esc(n) + "</td>" + state.checks.map(function () { return "<td>" + sel + "</td>"; }).join("") + '<td><input type="text" aria-label="Comment" /></td></tr>';
    }).join("");
    $("#ab-table").innerHTML = "<thead>" + head + "</thead><tbody>" + body + "</tbody>";
    $("#ab-title").textContent = "PE assessment – " + g().label + " – " + state.checks.length + " checks";
    $("#ab-key").textContent = "Levels: " + L.join(" · ") + ". NY = Not Yet Meeting · " + (isK2() ? "ME = Meeting · " : "MIN = Minimally Meeting · S = Solidifying · ") + "MA = Mastering · INS = Insufficient evidence · ISP = follow the student's ISP · N/A = not assessed.";
    $("#ab-lookfors").innerHTML = state.checks.map(function (c, i) {
      return "<li><strong>" + (i + 1) + ". " + esc(c.name) + "</strong> (" + esc(c.period) + ") – " + esc(c.look) + ' <span class="meta">Outcome: “' + esc(outcomeText(c)) + "”</span></li>";
    }).join("");
    $("#ab-ptp").innerHTML = state.checks.map(function (c, i) {
      return "<tr><td>" + esc(ptpName(c, i)) + "</td><td>“" + esc(outcomeText(c)) + "”</td><td>" + esc(g().label) + " Physical Education: “" + esc(g().reporting) + "” (check the name in your list)</td><td>Standards column on the Scoresheet: " + levelNames() + ", or INS / ISP / N/A.</td></tr>";
    }).join("");
    $("#ab-output").hidden = false;
    $("#ab-output").scrollIntoView({ behavior: "smooth" });
  }
  function ptpName(c, i) { return "PE " + pad(i + 1) + " " + c.name; }

  function current() {
    var trs = document.querySelectorAll("#ab-table tbody tr"), out = [];
    trs.forEach(function (tr) {
      var v = [tr.children[1].textContent];
      tr.querySelectorAll("select").forEach(function (s) { v.push(s.value); });
      v.push(tr.querySelector("input").value);
      out.push(v);
    });
    return out;
  }
  function headers() { return ["Student"].concat(state.checks.map(function (c, i) { return (i + 1) + ". " + c.name + " (" + c.period + ")"; }), ["Comments"]); }
  function fileBase() { return "PE-assessment-" + (state.grade === "K" ? "K" : "Grade-" + state.grade); }
  function download(blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csvCell(s) { s = String(s == null ? "" : s); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function downloadCsv() {
    var rows = [headers(), ["Outcome"].concat(state.checks.map(outcomeText), [""]), ["Look-for"].concat(state.checks.map(function (c) { return c.look; }), [""])].concat(current());
    download(new Blob(["\ufeff" + rows.map(function (r) { return r.map(csvCell).join(","); }).join("\r\n")], { type: "text/csv" }), fileBase() + ".csv");
  }

  /* ---- tiny .xlsx writer (stored zip, inline strings, level dropdowns, frozen header) ---- */
  var CRC = (function () { var t = [], c; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xffffffff; for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function zip(files) {
    var enc = new TextEncoder(), parts = [], central = [], off = 0;
    files.forEach(function (f) {
      var name = enc.encode(f[0]), data = enc.encode(f[1]), crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(8, 0, true);
      h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
      parts.push(h.buffer, name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      central.push(c.buffer, name);
      off += 30 + name.length + data.length;
    });
    var size = central.reduce(function (s, b) { return s + b.byteLength; }, 0);
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, off, true);
    return new Blob(parts.concat(central, [e.buffer]), { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  function col(n) { var s = ""; n++; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function x(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ""); }
  function sheet(rows, opt) {
    var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    if (opt.freeze) xml += '<sheetViews><sheetView workbookViewId="0"><pane xSplit="' + opt.freeze[0] + '" ySplit="' + opt.freeze[1] + '" topLeftCell="' + col(opt.freeze[0]) + (opt.freeze[1] + 1) + '" activePane="bottomRight" state="frozen"/></sheetView></sheetViews>';
    xml += "<cols>" + opt.widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join("") + "</cols><sheetData>";
    rows.forEach(function (r, ri) {
      xml += '<row r="' + (ri + 1) + '">' + r.map(function (v, ci) {
        if (v === "" || v == null) return "";
        var st = ri < (opt.headRows || 1) ? ' s="1"' : ' s="2"';
        if (typeof v === "number") return '<c r="' + col(ci) + (ri + 1) + '"' + st + '><v>' + v + "</v></c>";
        return '<c r="' + col(ci) + (ri + 1) + '" t="inlineStr"' + st + "><is><t xml:space=\"preserve\">" + x(v) + "</t></is></c>";
      }).join("") + "</row>";
    });
    xml += "</sheetData>";
    if (opt.dv) xml += '<dataValidations count="1"><dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="' + opt.dv[0] + '"><formula1>"' + opt.dv[1] + '"</formula1></dataValidation></dataValidations>';
    return xml + "</worksheet>";
  }
  function downloadXlsx() {
    var data = current(), n = state.checks.length;
    var rows = [["#"].concat(headers()), ["", "Outcome"].concat(state.checks.map(outcomeText), [""]), ["", "Look-for"].concat(state.checks.map(function (c) { return c.look; }), [""])];
    data.forEach(function (r, i) { rows.push([i + 1].concat(r)); });
    var first = 4, last = 3 + data.length;
    var s1 = sheet(rows, { freeze: [2, 3], headRows: 3, widths: [5, 26].concat(state.checks.map(function () { return 22; }), [40]), dv: [col(2) + first + ":" + col(1 + n) + last, levels().join(",")] });
    var p = [["#", "Period", "Check", "PowerTeacher Pro assignment name", "Linked outcome (word for word)", "Standard to link", "How to enter the level"]];
    state.checks.forEach(function (c, i) { p.push([i + 1, c.period, c.name, ptpName(c, i), outcomeText(c), g().label + ' Physical Education: "' + g().reporting + '" (check the name in your list)', "Standards column on the Scoresheet: " + levelNames() + ", or INS / ISP / N/A."]); });
    var s2 = sheet(p, { freeze: [0, 1], widths: [5, 12, 26, 30, 60, 50, 50] });
    var files = [
      ["[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
      ["_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
      ["xl/workbook.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Checklist" sheetId="1" r:id="rId1"/><sheet name="PowerTeacher Pro" sheetId="2" r:id="rId2"/></sheets></workbook>'],
      ["xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
      ["xl/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="3"><xf/><xf fontId="1" applyFont="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf applyAlignment="1"><alignment vertical="top"/></xf></cellXfs></styleSheet>'],
      ["xl/worksheets/sheet1.xml", s1],
      ["xl/worksheets/sheet2.xml", s2]
    ];
    download(zip(files), fileBase() + ".xlsx");
  }

  function setCount(n) {
    n = Math.max(1, Math.min(30, parseInt(n, 10) || 20));
    $("#ab-count").value = n;
    while (state.checks.length < n) state.checks.push(defaultCheck(state.checks.length));
    state.checks.length = n;
    renderChecks();
  }

  function init() {
    if (!R || !$("#ab-grades")) return;
    resetChecks(20); renderGrades(); renderChecks();
    $("#ab-grades").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-g]"); if (!b) return;
      var wasK2 = isK2(); state.grade = b.getAttribute("data-g");
      if (wasK2 !== isK2()) state.checks.forEach(function (c, i) { var d = DEFAULTS[i % DEFAULTS.length]; if (c.look === (wasK2 ? d.k2 : d.g36)) c.look = isK2() ? d.k2 : d.g36; });
      renderGrades(); renderChecks(); $("#ab-output").hidden = true;
    });
    $("#ab-count").addEventListener("change", function () { setCount(this.value); });
    $("#ab-reset").addEventListener("click", function () { resetChecks(parseInt($("#ab-count").value, 10) || 20); renderChecks(); });
    $("#ab-checks").addEventListener("input", function (e) {
      var f = e.target.getAttribute("data-f"); if (!f) return;
      var c = state.checks[+e.target.closest(".ab-check").getAttribute("data-i")];
      if (f === "o") { c.o = e.target.value === "custom" ? "custom" : +e.target.value; e.target.closest(".ab-check").querySelector(".ab-custom").hidden = c.o !== "custom"; }
      else c[f] = e.target.value;
    });
    $("#ab-generate").addEventListener("click", generate);
    $("#ab-print").addEventListener("click", function () { window.print(); });
    $("#ab-csv").addEventListener("click", downloadCsv);
    $("#ab-xlsx").addEventListener("click", downloadXlsx);
    $("#ab-clear").addEventListener("click", function () { $("#ab-names").value = ""; $("#ab-output").hidden = true; $("#ab-table").innerHTML = ""; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
