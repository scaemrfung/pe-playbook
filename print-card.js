/* Print this card — shared by games.html (Big-Group Games) and new-games.html.
   A "Print this card" button (class "print-card") inside an article.gcard prints a
   clean one-page copy of just that game: every detail open, no site menu or filters.
   How: the card is copied into #print-card-box (a direct child of <body>), the page gets
   the class "printing-card", and the print CSS in styles.css shows only that box,
   in two columns, shrunk to fit one page when the game is long.
   Works with Chrome and Safari (Mac and iPad): the class stays on until the print dialog
   is done, then clears; a page-wide print started later from the browser menu prints the
   whole page as before. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var CLS = "printing-card", startedAt = 0;
  function box() {
    var b = document.getElementById("print-card-box");
    if (!b) { b = document.createElement("div"); b.id = "print-card-box"; b.setAttribute("aria-hidden", "true"); document.body.appendChild(b); }
    return b;
  }
  function clear() { document.documentElement.classList.remove(CLS); var b = document.getElementById("print-card-box"); if (b) { b.innerHTML = ""; b.style.zoom = ""; } }
  function printCard(card) {
    if (!card) return;
    var c = card.cloneNode(true);
    c.removeAttribute("id");
    c.classList.remove("collapsed");
    c.querySelectorAll("[id]").forEach(function (x) { x.removeAttribute("id"); });
    c.querySelectorAll("[hidden]").forEach(function (x) { x.hidden = false; });
    c.querySelectorAll("details").forEach(function (x) { x.open = true; });
    c.querySelectorAll(".print-card, .card-actions, .gsum, .ng-actions, script").forEach(function (x) { x.remove(); });
    var page = (document.querySelector("h1") || {}).textContent || document.title;
    var url = location.origin + location.pathname + (card.id ? "#" + card.id : "");
    var head = document.createElement("p");
    head.className = "print-card-head";
    head.textContent = "SCA PE Playbook · " + page.trim() + " · " + url;
    var b = box();
    b.innerHTML = "";
    b.appendChild(head);
    b.appendChild(c);
    // shrink to one page: the box is laid out off-screen at page width (styles.css)
    b.style.zoom = "";
    var h = b.getBoundingClientRect().height;
    var maxH = 9.6 * 96;   // printable height of a Letter or A4 page at the browser's default margins, in CSS px
    if (h > maxH) b.style.zoom = String(Math.max(0.5, Math.floor(maxH / h * 100) / 100));
    document.documentElement.classList.add(CLS);
    startedAt = Date.now();
    window.print();
  }
  // Safari on iPad can return from print() before the dialog closes, so clear on afterprint
  // (a little later) and never on a timer alone.
  window.addEventListener("afterprint", function () { setTimeout(clear, 500); });
  // a page-wide print long after a card print: print the whole page
  window.addEventListener("beforeprint", function () { if (Date.now() - startedAt > 60000) clear(); });
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("button.print-card");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    printCard(btn.closest("article.gcard"));
  }, true);
  window.PrintCard = { print: printCard };
})();
