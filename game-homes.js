/* Where each game lives when its title is on more than one page (Oct 2026 de-duplication).
   The Big-Group Games page shows a short "see this page" card for these games (the #anchor still
   works); the full game is on the home page below. Month pages and the site search link straight
   to the home page. Dodgeball variants live on Dodgeball, warm-ups on Warm Up Games.
   Key = the Big-Group card anchor (lowercase name with dashes). tools/build.js lists any other
   duplicate titles across pages as a warning. */
window.GAME_HOMES = {
  "bench-dodgeball":    { page: "dodgeball.html", label: "Dodgeball", anchor: "bench-dodgeball" },
  "backboard-dodgeball": { page: "dodgeball.html", label: "Dodgeball", anchor: "backboard-dodgeball" },
  "battleball":         { page: "dodgeball.html", label: "Dodgeball", anchor: "battleball" },
  "net-dodgeball":      { page: "dodgeball.html", label: "Dodgeball", anchor: "net-dodgeball" },
  "warzone-dodgeball":  { page: "dodgeball.html", label: "Dodgeball", anchor: "warzone-dodgeball" },
  "standard-dodgeball": { page: "dodgeball.html", label: "Dodgeball", anchor: "standard-dodgeball" },
  "detective-dodgeball": { page: "dodgeball.html", label: "Dodgeball", anchor: "detective-dodgeball" },
  "powerball":          { page: "dodgeball.html", label: "Dodgeball", anchor: "powerball" },
  "three-court-dodgeball": { page: "dodgeball.html", label: "Dodgeball", anchor: "three-court-dodgeball" },
  "tail-tag":           { page: "warmup-nogym.html", label: "Warm Up Games", anchor: "tail-tag" },
  "aces":               { page: "warmup-nogym.html", label: "Warm Up Games", anchor: "aces" },
  "chuck-the-chicken":  { page: "warmup-nogym.html", label: "Warm Up Games", anchor: "chuck-the-chicken" },
  "musical-hoops":      { page: "warmup-nogym.html", label: "Warm Up Games", anchor: "musical-hoops" }
};
