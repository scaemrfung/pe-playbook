/* Indigenous games page: renders the cards from indigenous-data.js (window.INDIGENOUS_GAMES).
   (The renderer used to live in app.js and was lost in an Aug 2026 upload; restored here.) */
(function () {
  var q = document.getElementById("q");
  var box = document.getElementById("list");
  var games = window.INDIGENOUS_GAMES || [];
  if (!box) return;
  function videoHtml(name) {
    var clips = window.VIDEOS || [];
    var hit = clips.filter(function (v) { return (v.games || []).some(function (g) { return String(g).toLowerCase() === String(name).toLowerCase(); }); });
    if (!hit.length) return "";
    return '<p class="yt"><strong>Video.</strong> ' + hit.map(function (v) {
      return '<a href="' + v.url + '" target="_blank" rel="noopener">' + v.title + '</a> <span class="meta">(' + v.channel + ')</span>';
    }).join(" · ") + '</p>';
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-"); }
  function render() {
    var term = ((q && q.value) || "").toLowerCase();
    var cards = games.filter(function (g) {
      var hay = [g.name, g.nation, g.purpose, g.when, g.note].join(" ").toLowerCase();
      return !term || hay.indexOf(term) >= 0;
    }).map(function (g) {
      return '<article class="gcard" id="' + slug(g.name) + '">' +
        '<div class="ghead"><h2>' + g.name + '</h2></div>' +
        '<p class="meta"><strong>Nation / origin:</strong> ' + g.nation + ' · <strong>Try in:</strong> ' + g.when + '</p>' +
        '<p>' + g.purpose + '</p>' +
        '<p class="meta"><strong>Equipment:</strong> ' + g.equipment + '</p>' +
        '<p class="meta"><strong>Setup:</strong> ' + g.setup + '</p>' +
        '<p><strong>How we play</strong></p>' +
        '<ol class="clean">' + (g.play || []).map(function (s) { return "<li>" + s + "</li>"; }).join("") + '</ol>' +
        '<div class="bands-block"><div><strong>1–2:</strong> ' + g.g12 + '</div><div><strong>3–4:</strong> ' + g.g34 + '</div><div><strong>5–6:</strong> ' + g.g56 + '</div></div>' +
        '<p class="meta"><strong>Safety:</strong> ' + g.safety + '</p>' +
        '<p class="note">' + (g.note || "") + '</p>' + videoHtml(g.name) +
        '</article>';
    }).join("");
    box.innerHTML = cards || "<p>No matches.</p>";
  }
  if (q) q.addEventListener("input", render);
  render();
  if (location.hash) {
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) t.scrollIntoView();
  }
})();
