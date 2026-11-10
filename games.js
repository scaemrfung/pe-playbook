/* Big-Group Games: the list is pre-rendered. Fetch only the card the teacher opens. */
(function () {
  "use strict";
  const box=document.getElementById("list"), q=document.getElementById("q");
  if (!box) return;
  const entries=[...box.querySelectorAll(".bg-preview")].map(el=>({el, id:el.id, type:el.dataset.type, months:el.dataset.months.split("|"), hay:el.dataset.hay, url:el.dataset.card, pending:null, loaded:false}));
  const types=[...new Map(entries.map(e=>[e.type,e.el.dataset.label])).entries()];
  const months=["September","October","November","December","January","February","March","April","May","June"];
  let month=new URLSearchParams(location.search).get("month") || "all", type="all";
  if (!months.includes(month)) month="all";
  q.value=new URLSearchParams(location.search).get("q") || "";
  function buttons(id, values, key, active, set) {
    const b=document.getElementById(id); if(!b)return;
    b.innerHTML=values.map(([v,l])=>`<button type="button" data-value="${v}" class="${v===active?"on":""}">${l}</button>`).join("");
    b.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;set(t.dataset.value);b.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===t));apply();});
  }
  buttons("month-filters",[["all","All months"],...months.map(m=>[m,m.slice(0,3)])],"month",month,v=>month=v);
  buttons("type-filters",[["all","All types"],...types],"type",type,v=>type=v);
  let searchReady=false, searchPending=null;
  function apply() {
    if(q.value.trim() && !searchReady) {
      if(!searchPending) searchPending=fetch("games-search.json?v="+String(window.SITE_UPDATED || "").replace(/\D/g, "")).then(r=>{if(!r.ok)throw Error("Search index failed");return r.json();}).then(hay=>{entries.forEach(e=>e.hay=hay[e.id] || e.hay);searchReady=true;apply();}).catch(()=>{document.getElementById("bg-count").textContent="Full-text search could not load. Name search and month/type filters still work.";searchPending=null;});
    }
    const term=q.value.trim().toLowerCase();let n=0;
    entries.forEach(e=>{e.el.hidden=!!((type!=="all"&&e.type!==type)||(month!=="all"&&!e.months.includes(month))||(term&&!e.hay.includes(term)));if(!e.el.hidden)n++;});
    document.getElementById("bg-count").textContent=n+" games";
    const ps=document.getElementById("pair-stations");if(ps)ps.hidden=!!term||type!=="all"||month!=="all";
    document.querySelectorAll("#game-index li[data-game]").forEach(li=>{const e=entries.find(e=>e.id===li.dataset.game);li.hidden=e.el.hidden;});
  }
  async function load(e) {
    if(e.loaded)return e.el;
    if(e.pending)return e.pending;
    const button=e.el.querySelector(".load-game");button.disabled=true;button.textContent="Loading card…";
    e.pending=(async()=>{
      try {
        const r=await fetch(e.url);if(!r.ok)throw Error("HTTP "+r.status);
        const temp=document.createElement("template");temp.innerHTML=await r.text();
        const card=temp.content.querySelector("article.gcard");if(!card)throw Error("Missing card");
        card.classList.remove("collapsed");card.querySelectorAll(".gtoggle").forEach(b=>b.setAttribute("aria-expanded","true"));
        card.hidden=e.el.hidden;e.el.replaceWith(card);e.el=card;e.loaded=true;return card;
      }catch(err){button.disabled=false;button.textContent="Try loading card again";let p=e.el.querySelector(".game-load-error");if(!p){p=document.createElement("p");p.className="game-load-error";p.setAttribute("role","status");e.el.append(p);}p.textContent="Card could not load. Check the connection or open All full cards above.";return null;}
      finally {e.pending=null;}
    })();return e.pending;
  }
  box.addEventListener("click",async ev=>{
    const b=ev.target.closest(".load-game");
    if(b){const e=entries.find(e=>e.el.contains(b));if(e)await load(e);return;}
    const t=ev.target.closest(".gtoggle");if(t){const c=t.closest(".gcard");c.classList.toggle("collapsed");t.setAttribute("aria-expanded",String(!c.classList.contains("collapsed")));const ct=t.querySelector(".gsum-cta");if(ct)ct.textContent=c.classList.contains("collapsed")?"Open card":"Close";}
  });
  async function openHash() {
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(err){return;}if(!id)return;
    const target=document.getElementById(id);if(!target)return;
    const e=entries.find(e=>e.el===target||e.el.contains(target));if(!e)return;
    if(e.el.hidden){q.value="";month=type="all";document.querySelectorAll("#month-filters button,#type-filters button").forEach(b=>b.classList.toggle("on",b.dataset.value==="all"));apply();}
    const card=await load(e);if(!card)return;
    card.classList.remove("collapsed");const t=document.getElementById(id);if(t){const d=t.closest("details");if(d)d.open=true;}card.scrollIntoView({block:"start"});
  }
  q.addEventListener("input",apply);window.addEventListener("hashchange",openHash);
  document.getElementById("game-index").addEventListener("click",e=>{if(e.target.closest('a[href^="#"]'))setTimeout(openHash,0);});
  const gi=document.getElementById("gindex");if(matchMedia("(max-width:700px)").matches)gi.open=false;
  apply();openHash();
})();
