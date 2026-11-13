/* Tacoma Nights Raven Operations shell.
   Presentation-only: retains original Supabase/auth/data modules and existing section nodes. */
(function(){
 const groups=[
  {name:"COMMAND",items:[["visitorAnalyticsPanel","Audience Intelligence","◉"],["topicCenter","Editorial Calendar","▦"]]},
  {name:"EDITORIAL",items:[["episodeFormat","Show Format","▤"],["productionWorkspace","Episode Production","✎"],["aiEpisodeStudio","AI Writing Studio","✧"]]},
  {name:"BROADCAST",items:[["broadcastCenter","Broadcast Operations","◫"],["premierePanel","Premiere Management","▶"]]},
  {name:"PEOPLE & COMMUNITY",items:[["crewPanel","Production Team","♟"],["hostApplicationsPanel","Host Applications","＋"],["inboxPanel","Community Inbox","✉"]]},
  {name:"MEDIA",items:[["clipsPanel","Media Vault","▣"]]}
 ];
 const $=(id)=>document.getElementById(id);
 function build(){
  const dash=$("dashboard");if(!dash||dash.dataset.ravenRebuild==="ready")return;
  const oldMain=dash.querySelector(":scope > .tn-main");
  const original=oldMain?[...oldMain.children]:[...dash.children];
  const contentNodes=original.filter(n=>!(n.classList&&n.classList.contains("tn-command-hero"))&&!(n.matches&&n.matches(".tn-topnav")));
  const all=[...contentNodes];
  const sections=all.filter(n=>n.matches&&n.matches(".panel[id]"));
  const nav=document.createElement("aside");nav.className="tn-raven-sidebar";nav.setAttribute("aria-label","Tacoma Nights operations navigation");
  nav.innerHTML='<div class="tn-raven-brand"><span class="tn-raven-mark" aria-hidden="true">R</span><span><strong>RAVEN OPERATIONS</strong><small>TACOMA NIGHTS · CONTROL ROOM</small></span></div><nav class="tn-raven-nav" aria-label="Production workspaces">'+groups.map((g,gi)=>'<section class="tn-raven-group"><h3>'+g.name+'</h3>'+g.items.map((it,ii)=>'<a href="#'+it[0]+'" data-target="'+it[0]+'"><span class="tn-nav-icon" aria-hidden="true">'+it[2]+'</span><span class="tn-nav-name">'+it[1]+'</span><span class="tn-nav-no">'+String(gi*3+ii+1).padStart(2,"0")+'</span></a>').join("")+'</section>').join("")+'</nav><div class="tn-raven-sidefoot"><b>PRIVATE PRODUCTION NETWORK</b><br>253 · TACOMA, WASHINGTON<br>ONE COMPANY. ONE UNIVERSE.</div>';
  const main=document.createElement("main");main.className="tn-raven-main";
  const hero=document.createElement("section");hero.className="tn-raven-hero";hero.id="ravenCommandHero";
  hero.innerHTML='<div class="tn-raven-hero-copy"><p class="tn-raven-eyebrow">CROWRULES ENTERTAINMENT · TACOMA, WASHINGTON</p><h1>THE RAVEN<span>CONTROL ROOM</span></h1><p>The production headquarters for Tacoma Nights. Shape the stories, bring the voices together and prepare every broadcast — grounded in Tacoma and reaching beyond the South Sound.</p><div class="tn-raven-hero-meta"><span>PRIVATE PRODUCTION NETWORK</span><span>THE CITY · THE PEOPLE · THE STORIES</span><span>253 / PACIFIC NORTHWEST</span></div><div class="tn-raven-actions"><a href="#productionWorkspace">OPEN PRODUCTION DESK ↗</a><a href="#broadcastCenter">PREPARE BROADCAST ↗</a><a href="#visitorAnalyticsPanel">VIEW AUDIENCE INTELLIGENCE ↗</a></div></div>';
  const live=document.createElement("div");live.className="tn-raven-livebar";
  live.innerHTML='<span class="live-dot" aria-hidden="true"></span><small>LIVE AUDIENCE</small><strong id="tnRavenLiveCount">—</strong><small id="tnRavenLiveStatus">Connecting to sitewide presence…</small><span class="tn-live-caption">SUPABASE REALTIME · LIVE PRESENCE</span>';
  main.append(hero,live);
  all.forEach(n=>main.append(n));
  dash.replaceChildren(nav,main);dash.dataset.ravenRebuild="ready";
  const count=$("visitorCount"),status=$("visitorStatus");
  const sync=()=>{const target=$("tnRavenLiveCount");if(target&&count)target.textContent=count.textContent||"—";const s=$("tnRavenLiveStatus");if(s&&status)s.textContent=status.textContent||"Live presence";};
  sync();if(count&&status){new MutationObserver(sync).observe(count,{childList:true,characterData:true,subtree:true});new MutationObserver(sync).observe(status,{childList:true,characterData:true,subtree:true});}
  const links=[...nav.querySelectorAll("[data-target]")];
  const activate=id=>links.forEach(a=>{const on=a.dataset.target===id;a.classList.toggle("active",on);if(on)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});
  links.forEach(a=>a.addEventListener("click",()=>activate(a.dataset.target)));
  if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>{const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)activate(v.target.id);},{rootMargin:"-18% 0px -68% 0px",threshold:[0,.15,.4]});all.forEach(n=>io.observe(n));}
  activate(location.hash.slice(1)||"visitorAnalyticsPanel");
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build,{once:true});else build();
})();
