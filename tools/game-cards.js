/* Build-time Big-Group card renderer. No DOM and no browser data dependencies.
   The generated HTML fragments are fetched only when a card is opened. */
module.exports = function ({ W, BG_LIST, oldNames }) {
  const window = W;
  function pegFor(name) {
    const P = window.PEG_HANDBOOK;
    return P ? P.games.filter((h) => h.card === name) : [];
  }
  function pegHtml(name) {
    const list = pegFor(name);
    if (!list.length) return "";
    return list.map((h) => `<details class="peg" id="peg-${h.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}"><summary><strong>More details${h.name !== name ? ": " + h.name : ""}</strong> <span class="meta">· Grades ${h.grades}</span></summary>
      <p class="meta"><strong>Equipment:</strong> ${h.equipment}</p>
      <p>${h.overview}</p>
      <ol class="clean">${h.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <p class="meta"><a href="${h.page}" target="_blank" rel="noopener">Source</a> · <a href="${h.video}" target="_blank" rel="noopener">Video</a></p></details>`).join("");
  }

  function videoHtml(name) {
    const clips = window.VIDEOS || [];
    if (!name) return "";
    const hit = clips.filter((v) => (v.games || []).some((g) => g.toLowerCase() === String(name).toLowerCase()));
    if (!hit.length) return "";
    return `<p class="yt"><strong>Video.</strong> ${hit.map((v) => `<a href="${v.url}" target="_blank" rel="noopener">${v.title}</a> <span class="meta">(${v.channel})</span>`).join(" · ")}</p>
      <p class="meta">Clips are demos. Our house rules still apply (no elimination, soft tag; dodgeballs stay on the Dodgeball page).</p>`;
  }

    const TYPES = [
      { id: "tag", label: "Tag & chase" },
      { id: "invasion", label: "Invasion & team" },
      { id: "target", label: "Target & send" },
      { id: "strike", label: "Strike & field" },
      { id: "relay", label: "Relays & stations" },
      { id: "loco", label: "Locomotor & listen" },
      { id: "coop", label: "Cooperative & circus" },
      { id: "fitness", label: "Fitness & landings" },
    ];
    const TYPE_WORDS = {
      tag: ["hospital tag","hot dog tag","line tag","sharks and dolphins","frozen tag","clothespin","blob tag","tripod tag","bug tag","chicken checkers","octopus","shadow tag","waspital","icebergs","tail tag","survivor tag","ten-second","wake-up","wolf","tunnel freeze","everybody","duck duck","squirrel","mr. clean","buzz off","slap rover","kangaroos"],
      invasion: ["switch","wall soccer","team tag","end zone","booger","four corner flags","stones","fruit salad","traffic lights","through the gates","rob the nest","captain ball","collect the treasure","numbers hockey","go for goal","reverse soccer","end ball","hurley","guard the gates","crab football","heist","perfect pass","capture the egg","cornerball","protect the king","steal the bacon"],
      target: ["robin","skittles","card sharks","fly back","bucket ball","tidy the bedroom","protect the castle","skittle ball","team bowling","battleships","poison ball","slide sling","flying saucers","survivor dodgeball","frisbee","low-ball","guard the cone","tunnel kick","hockey pin","punt to the line","overarm"],
      strike: ["chuck the chicken","continuous kick","beat ball","thunderball","aces","rps rounders","barkball","quick baseball","jailbreakers","diamond strike","kick it","hit and run","striking"],
      relay: ["rescue relay","hungry snake","pip, squeak","around the bases","cone relay","memory relay","attention relay","dash and dribble","jungle run","speed run","zig-zag","crab-bear","hop-the-hoops","soccer weave","toe-tap","wall chest","throw-clap","hoop underhand","dribble the gates","hockey hurdle","circle run"],
      loco: ["captain’s deck","captain's deck","mongoose tag","buffalo","laps and lines","european rhythmic","human bop","video game","rubber band","signals","daytime","volcanoes","jumping beans","group numbers","land and sea","here, there","follow the leader","silly bananas","back to base","dash for safety","four corners stay","elements","simon says","moving","bouncing"],
      coop: ["elves","invent-a-game","helicopter","sharks and dolphins (chute)","object toss","parachute","slippery snakes","balloon keep-up","birthday","circle hoop","cross the river","human knot","pulse race","caterpillar","bucket carry","voice path"],
      fitness: ["mass challenges","magic numbers","body-part","frogs on the lily","safe to shore","beanbag head","knee-ball","racquet waiter","balloon keep-up station","floor rope","spot-jump","throwing and catching","kicking"],
    };
    function gslug(name) {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    function typeOf(g) {
      if (g && typeof g === "object" && g.type) return g.type;
      const low = String((g && g.name) || g || "").toLowerCase();
      for (const t of TYPES) {
        for (const w of TYPE_WORDS[t.id] || []) {
          if (low.includes(w)) return t.id;
        }
      }
      return "loco";
    }
    function typeLabel(id) {
      const hit = TYPES.find((t) => t.id === id);
      return hit ? hit.label : id;
    }
    function summaryOf(g) {
      const raw = String(g.purpose || (g.play || [])[0] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const first = (raw.match(/^.*?[.!?](?=\s|$)/) || [raw])[0];
      const t = first.length > 140 ? raw.slice(0, 137).replace(/\s+\S*$/, "") + "…" : first;
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    }

  const unique = BG_LIST.slice().sort((a,b) => TYPES.findIndex(t=>t.id===typeOf(a))-TYPES.findIndex(t=>t.id===typeOf(b)) || a.name.localeCompare(b.name, "en"));
  const numbers = {}; unique.forEach((g,i) => numbers[g.name]=i+1);
  const EX = W.GAME_EXTRAS || {}, HOMES = W.GAME_HOMES || {}, expanded = new Set();
  const cardIds = new Set(unique.map(g=>gslug(g.name)));
  const entries = unique.map(g => {
    const group = {label: typeLabel(typeOf(g))};
    const html = (() => {
          const x = EX[g.name] || {};
          const pegNames = pegFor(g.name).map((h) => h.name).filter((n) => gslug(n) !== gslug(g.name) && !(g.aka || x.aka || []).some((a) => gslug(a) === gslug(n)));
          const ownId = gslug(g.name);
          // "also called" anchors; skipped when another card already owns that id (no duplicate ids on the page)
          const akaAnchors = [...new Set((g.aka || x.aka || []).concat(pegNames).map(gslug))].filter((id) => id !== ownId && !cardIds.has(id)).map((id) => `<span id="${id}"></span>`).join("");
          const home = HOMES[gslug(g.name)];
          if (home) {
            // Same title lives on another page: short "see this page" card (the #anchor still works)
            return `
          <article class="gcard gcard-link" id="${gslug(g.name)}">
            ${akaAnchors}
            <div class="ghead">
              <h2>${numbers[g.name]}. ${g.name}</h2>
              <span class="src">${group.label}</span>
            </div>
            <p class="meta">This game lives on the <strong>${home.label}</strong> page.</p>
            <p>${summaryOf(g)}</p>
            <p><a class="btn" href="${home.page}#${home.anchor}">Open on ${home.label} →</a></p>
          </article>`;
          }
          const more = (x.more || []).filter((s) => !/^If this happens|^How a round ends|^Grouping:/.test(s)).map((s) => `<li>${s}</li>`).join("");
          const cues = (x.cues || []).map((s) => `<li>${s}</li>`).join("");
          const skins = (g.skins || x.skins || []).map((s) => `<li>${s}</li>`).join("");
          const vars = skins ? "" : (x.variations || []).filter((s) => !/^source:|^credit:/i.test(s)).map((s) => `<li>${s}</li>`).join("");
          const ifThis = (g.ifThis || x.ifThis || []).map((s) => `<li>${s}</li>`).join("");
          const akaLine = (g.aka || x.aka || []).length ? `<p class="meta"><strong>Also called:</strong> ${(g.aka || x.aka).join(" · ")}</p>` : "";
          return `
          <article class="gcard${expanded.has(gslug(g.name)) ? "" : " collapsed"}" id="${gslug(g.name)}">
            ${akaAnchors}
            <div class="ghead">
              <h2>${numbers[g.name]}. ${g.name}</h2>
              <span class="src">${group.label}</span>
            </div>
            <div class="gsum"><button type="button" class="gtoggle" aria-expanded="${expanded.has(gslug(g.name))}"><span class="gsum-text">${summaryOf(g)}</span><span class="gsum-cta">${expanded.has(gslug(g.name)) ? "Close" : "Open card"}</span></button></div>
            <p class="meta"><strong>When:</strong> ${(g.months || []).join(", ") || "Anytime"} · <strong>Slot:</strong> ${g.slot || "—"}${x.numbers ? ` · ${x.numbers}` : ""}</p>
            <p>${g.purpose || ""}</p>
            ${akaLine}
            <p class="meta"><strong>Equipment:</strong> ${g.equipment || ""}</p>
            <p class="meta"><strong>Set-up:</strong> ${g.setup || ""}</p>
            <p><strong>How we play</strong></p>
            <ol class="clean">${(g.play || []).map((s) => `<li>${s}</li>`).join("")}</ol>
            ${ifThis ? `<p><strong>If this happens</strong></p><ul class="clean">${ifThis}</ul>` : ""}
            ${g.roundEnds || x.roundEnds ? `<p><strong>How a round ends.</strong> ${g.roundEnds || x.roundEnds}</p>` : ""}
            ${cues ? `<p><strong>Cues</strong></p><ul class="clean">${cues}</ul>` : ""}
            ${skins ? `<p><strong>Skins — same game, different wrapper</strong></p><ul class="clean">${skins}</ul>` : ""}
            ${vars ? `<p><strong>Variations</strong></p><ul class="clean">${vars}</ul>` : ""}
            ${more ? `<p><strong>Teaching tips</strong></p><ul class="clean">${more}</ul>` : ""}
            ${videoHtml(g.name)}
            ${pegHtml(g.name)}
            ${(() => {
              const outs = (x.outcomes && x.outcomes.length) ? x.outcomes : (x.look ? [{ code: "Look-for", look: x.look }] : []);
              if (!outs.length) return x.look ? `<p class="note"><strong>Look-for.</strong> ${x.look}</p>` : "";
              return `<div class="outcomes-box"><h3>Alberta PEW outcomes</h3><p class="note" style="margin:0 0 8px;font-style:normal">Pick one or two look-fors per class.</p><ul class="clean out-list">${outs.map((it) => `<li><strong>${it.code}.</strong> ${it.look}</li>`).join("")}</ul></div>`;
            })()}
            <div class="bands-block">
              ${[["g12", "1–2"], ["g34", "3–4"], ["g56", "5–6"]].filter(([k]) => g[k]).map(([k, l]) => `<div><strong>Grades ${l}.</strong> ${g[k]}</div>`).join("")}
            </div>
            <p class="note"><strong>Safety.</strong> ${g.safety || ""}</p>
            <div class="card-actions"><button type="button" class="btn-ghost print-card" aria-label="Print this card: ${String(g.name).replace(/"/g, "&quot;")}">Print this card</button></div>
            ${(() => { const src = x.source || (pegFor(g.name)[0] || {}).page; return src ? `<p class="meta card-source"><a href="${src}" target="_blank" rel="noopener">Source</a></p>` : ""; })()}
          </article>`;

    })();
    const x=EX[g.name] || {};
      const hay = [g.name, window.oldNamesFor ? window.oldNamesFor(g.name) : "", g.source, g.purpose, (g.play || []).join(" "), (g.months || []).join(" "),
          (x.more || []).join(" "), (x.variations || []).join(" "), (x.skins || []).join(" "),
          (x.ifThis || []).join(" "), (x.aka || []).join(" "), (g.aka || []).join(" "), x.look || "", typeLabel(typeOf(g)),
          pegFor(g.name).map((h) => h.name + " " + h.category).join(" ")].join(" ").toLowerCase();

    return { id:gslug(g.name), name:g.name, number:numbers[g.name], type:typeOf(g), label:group.label,
      months:g.months || [], summary:summaryOf(g), equipment:g.equipment || "", hay:hay+" "+oldNames(g.name).join(" "), html };
  });
  const ps=W.PAIR_STATIONS;
  const stations=ps ? `<div class="panel" id="pair-stations"><h2>${ps.title}</h2><p>${ps.intro}</p>` + ps.groups.map(g=>`<h3>${g.name}</h3><table class="games"><thead><tr><th>Station</th><th>How we run it (60–90 s)</th></tr></thead><tbody>${g.items.map(i=>`<tr><td><strong>${i[0]}</strong></td><td>${i[1]}</td></tr>`).join("")}</tbody></table>`).join("")+"</div>" : "";
  return { entries, stations, types:TYPES };
};
