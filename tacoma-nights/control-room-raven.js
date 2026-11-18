/* Tacoma Nights Raven Operations — complete workspace navigation + consent-based live map */
(function(){
 const $=id=>document.getElementById(id);
 const groupFor=(id,label)=>{
  const s=(id+" "+label).toLowerCase();
  if(/visitor|analytics|insight|audience|traffic/.test(s))return "AUDIENCE & COMMAND";
  if(/topic|calendar|episode|format|studio|script|editor/.test(s))return "EDITORIAL & PRODUCTION";
  if(/broadcast|premiere|featured|stream|youtube|live/.test(s))return "BROADCAST";
  if(/crew|team|host|application|inbox|community|guest|submission/.test(s))return "PEOPLE & COMMUNITY";
  if(/clip|media|upload|credit|asset|vault/.test(s))return "MEDIA & ASSETS";
  return "ADMINISTRATION";
 };
 const iconFor=g=>({"AUDIENCE & COMMAND":"◉","EDITORIAL & PRODUCTION":"▤","BROADCAST":"◫","PEOPLE & COMMUNITY":"♟","MEDIA & ASSETS":"▣","ADMINISTRATION":"⚙"}[g]||"◆");
 const clean=s=>String(s||"").replace(/\s+/g," ").trim();
 function sectionLabel(node){
  const h=node.querySelector("h2,h3,h1");
  return clean(h?.textContent)||clean(node.getAttribute("aria-label"))||node.id.replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/^./,c=>c.toUpperCase());
 }
 function build(){
  const dash=$("dashboard");
  if(!dash||dash.dataset.ravenRebuild==="ready")return;
  const groups=[
   {id:"workspace-editorial",label:"Editorial & Planning",sub:"Topics, calendar and episode direction",icon:"01"},
   {id:"workspace-production",label:"Production Studio",sub:"Scripts, assignments and production tasks",icon:"02"},
   {id:"workspace-broadcast",label:"Broadcast Operations",sub:"Premiere, livestream and show delivery",icon:"03"},
   {id:"workspace-people",label:"People & Community",sub:"Crew, inbox and host applications",icon:"04"},
   {id:"workspace-media",label:"Media & Assets",sub:"Uploads, clips and production library",icon:"05"}
  ].map(g=>({...g,node:$(g.id)})).filter(g=>g.node);
  const original=[...dash.children];
  const content=original.filter(n=>!(n.id==="controlNavShell"));
  const panels=groups.flatMap(g=>[...g.node.children].filter(n=>n.classList&&n.classList.contains("panel")));
  const sidebar=document.createElement("aside");
  sidebar.className="tn-v4-sidebar";
  sidebar.setAttribute("aria-label","Tacoma Nights workspace navigation");
  const brand=document.createElement("div");brand.className="tn-v4-brand";
  brand.innerHTML='<span class="tn-v4-mark" aria-hidden="true">R</span><div><strong>RAVEN OPERATIONS</strong><small>CONTROL ROOM · VERSION 4</small></div>';
  sidebar.append(brand);
  const navLabel=document.createElement("p");navLabel.className="tn-v4-nav-label";navLabel.textContent="WORKSPACES";sidebar.append(navLabel);
  const nav=document.createElement("nav");nav.className="tn-v4-nav";nav.setAttribute("aria-label","Five production workspaces");
  groups.forEach((g,i)=>{
   const link=document.createElement("a");link.href="#"+g.id;link.dataset.target=g.id;link.setAttribute("aria-label",g.icon+" "+g.label+" — "+g.sub);
   const number=document.createElement("span");number.className="tn-v4-nav-number";number.textContent=g.icon;
   const copy=document.createElement("span");copy.className="tn-v4-nav-copy";
   const title=document.createElement("strong");title.textContent=g.label;
   const sub=document.createElement("small");sub.textContent=g.sub;
   copy.append(title,sub);
   const count=document.createElement("span");count.className="tn-v4-nav-count";count.textContent=String(g.node.querySelectorAll(":scope > .panel").length).padStart(2,"0");count.setAttribute("aria-label",count.textContent+" management panels");
   link.append(number,copy,count);nav.append(link);
  });
  sidebar.append(nav);
  const foot=document.createElement("div");foot.className="tn-v4-sidebar-foot";
  foot.innerHTML='<span class="tn-v4-foot-dot"></span><span>PRIVATE PRODUCTION NETWORK</span><small>253 · TACOMA, WASHINGTON</small>';
  sidebar.append(foot);
  const main=document.createElement("div");main.className="tn-v4-main";
  const command=document.createElement("div");command.className="tn-v4-commandline";
  command.innerHTML='<div><span class="tn-v4-command-eyebrow">CROWRULES ENTERTAINMENT</span><strong>THE CITY · THE PEOPLE · THE STORIES</strong></div><span class="tn-v4-version">RAVEN CONTROL ROOM <b>V4</b></span>';
  main.append(command);
  content.forEach(n=>main.append(n));
  const intro=main.querySelector(".tn-workspace-intro");
  if(intro){
   const h=intro.querySelector("h1 span");if(h)h.textContent="Raven Operations · Production Workspace";
   const p=intro.querySelector("p:not(.tn-kicker)");if(p)p.textContent="Your complete production headquarters. Plan the stories, coordinate the people, manage every asset, and prepare each Tacoma Nights broadcast.";
  }
  const stats=main.querySelector(".stats");
  const tools=document.createElement("section");tools.className="tn-v4-workspace-tools";tools.setAttribute("aria-label","Workspace search and navigation");
  tools.innerHTML='<div class="tn-v4-tools-copy"><span>WORKSPACE FINDER</span><strong>Find a tool, task or production record</strong><small>Search across all five workspaces without leaving this page.</small></div><div class="tn-v4-search-wrap"><label class="tn-v4-search-label" for="tnV4Search">SEARCH WORKSPACES</label><div class="tn-v4-search-controls"><input id="tnV4Search" type="search" autocomplete="off" placeholder="Try “episode”, “crew”, “premiere”…"><button type="button" id="tnV4ClearSearch">Clear</button></div><small id="tnV4SearchStatus" role="status" aria-live="polite">Showing all production tools</small></div>';
  if(stats)stats.insertAdjacentElement("afterend",tools);else if(intro)intro.insertAdjacentElement("afterend",tools);else main.prepend(tools);
  const total=document.createElement("div");total.className="tn-v4-system-summary";
  total.innerHTML='<div><strong>'+groups.length+'</strong><span>Workspaces</span></div><div><strong>'+panels.length+'</strong><span>Management panels</span></div><div><strong>LIVE</strong><span>Existing Supabase systems</span></div><div><strong>V4</strong><span>Raven operations interface</span></div>';
  tools.insertAdjacentElement("afterend",total);
  groups.forEach(g=>{
   const heading=g.node.querySelector(".tn-group-heading");
   if(heading&&!heading.querySelector(".tn-v4-section-count")){
    const count=document.createElement("span");count.className="tn-v4-section-count";
    count.textContent=String(g.node.querySelectorAll(":scope > .panel").length).padStart(2,"0")+" TOOLS";
    heading.append(count);
   }
   g.node.dataset.tnV4Workspace="true";
  });
  dash.replaceChildren(sidebar,main);dash.dataset.ravenRebuild="ready";dash.dataset.tnV4Ready="true";
  const search=$("tnV4Search"),clear=$("tnV4ClearSearch"),status=$("tnV4SearchStatus");
  function runSearch(){
   const q=(search.value||"").trim().toLowerCase();let shown=0;
   groups.forEach(g=>{
    const sectionPanels=[...g.node.children].filter(n=>n.classList&&n.classList.contains("panel"));
    let sectionShown=0;
    sectionPanels.forEach(panel=>{
     const match=!q||panel.textContent.toLowerCase().includes(q)||g.label.toLowerCase().includes(q);
     panel.hidden=!match;if(match){shown++;sectionShown++;}
    });
    g.node.hidden=!!q&&sectionShown===0;
   });
   status.textContent=q?(shown+" matching panel"+(shown===1?"":"s")+" across "+groups.filter(g=>!g.node.hidden).length+" workspace"+(groups.filter(g=>!g.node.hidden).length===1?"":"s")):"Showing all "+panels.length+" production panels";
   nav.querySelectorAll("[data-target]").forEach(a=>{const g=groups.find(x=>x.id===a.dataset.target);a.hidden=!!q&&(!g||g.node.hidden);});
  }
  search.addEventListener("input",runSearch);
  clear.addEventListener("click",()=>{search.value="";runSearch();search.focus();});
  search.addEventListener("keydown",e=>{if(e.key==="Escape"){search.value="";runSearch();search.blur();}});
  document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"&&!e.altKey){e.preventDefault();search.focus();search.select();}});
  const links=[...nav.querySelectorAll("[data-target]")];
  const activate=id=>links.forEach(a=>{const on=a.dataset.target===id;a.classList.toggle("active",on);if(on)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});
  links.forEach(a=>a.addEventListener("click",()=>activate(a.dataset.target)));
  if("IntersectionObserver"in window){
   const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)activate(visible.target.id);},{rootMargin:"-12% 0px -72% 0px",threshold:[0,.12,.35]});
   groups.forEach(g=>io.observe(g.node));
  }
  activate(location.hash.slice(1)||groups[0]?.id);
  buildVisitorMap();
 } function buildVisitorMap(){
  const panel=$("visitorAnalyticsPanel");if(!panel||$("tnVisitorMapCard"))return;
  const card=document.createElement("div");card.id="tnVisitorMapCard";card.className="item tn-visitor-map-card";
  card.innerHTML='<div class="itemtop"><div><span class="micro">LIVE GEOGRAPHIC AUDIENCE</span><h3>Where visitors are sharing from</h3><p class="small">Only visitors who actively opt in to approximate location sharing appear as map markers.</p></div><span class="pill">CONSENT ONLY</span></div><div class="tn-map-stats"><div><strong id="tnMapLocated">0</strong><span>Located visitors</span></div><div><strong id="tnMapPrivate">—</strong><span>Location not shared</span></div><div><strong id="tnMapRegions">0</strong><span>Map locations</span></div></div><div id="tnVisitorMap" role="img" aria-label="Map of approximate locations shared by current visitors"><div class="tn-map-placeholder">Waiting for visitors who choose to share an approximate location…</div></div><div class="tn-map-foot"><span id="tnMapStatus">Waiting for live visitor presence.</span><span>Approximate locations are rounded to about 11 km · no IP address stored</span></div>';
  const stats=panel.querySelector(".tn-analytics-stats");if(stats)stats.insertAdjacentElement("afterend",card);else panel.prepend(card);
  const btn=document.createElement("button");btn.type="button";btn.className="tn-map-share-button";btn.id="tnMapShareButton";btn.textContent="Share my approximate location";
  const intro=card.querySelector(".itemtop");intro.append(btn);
  btn.addEventListener("click",shareCurrentLocation);
  const consentKey="tn-share-approx-location-v1";
  try{if(localStorage.getItem(consentKey)==="yes")setTimeout(shareCurrentLocation,900);}catch(_){}
  let map=null,layer=null,leafletLoading=false,lastState=null;
  function loadLeaflet(){
   if(window.L){initMap();return;}if(leafletLoading)return;leafletLoading=true;
   if(!document.querySelector('link[data-tn-leaflet]')){const l=document.createElement("link");l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";l.dataset.tnLeaflet="1";document.head.append(l);}
   const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.onload=initMap;script.onerror=()=>{$("tnMapStatus").textContent="Map library could not load. Check the connection or content blocker.";};document.head.append(script);
  }
  function initMap(){
   if(map||!window.L)return;
   const mapNode=$("tnVisitorMap");if(mapNode)mapNode.innerHTML="";map=L.map("tnVisitorMap",{worldCopyJump:true,scrollWheelZoom:false}).setView([25,0],2);
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:8,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
   layer=L.layerGroup().addTo(map);if(lastState)render(lastState);setTimeout(()=>map.invalidateSize(),200);
  }
  function shareCurrentLocation(){
   const b=$("tnMapShareButton"),ch=window.__tnVisitorChannel,payload=window.__tnVisitorPresencePayload;
   if(payload?.approxLocation&&ch){delete payload.approxLocation;delete payload.locationShared;try{localStorage.removeItem(consentKey);}catch(_){}ch.track(payload).then(()=>{b.textContent="Share my approximate location";$("tnMapStatus").textContent="Location sharing stopped. You remain included in live visitor totals.";}).catch(()=>{$("tnMapStatus").textContent="Could not update location sharing status.";});return;}
   if(!navigator.geolocation){$("tnMapStatus").textContent="This browser does not support location sharing.";return;}
   b.disabled=true;b.textContent="Requesting permission…";
   navigator.geolocation.getCurrentPosition(async pos=>{
    const loc={latitude:Math.round(pos.coords.latitude*10)/10,longitude:Math.round(pos.coords.longitude*10)/10,accuracyKm:Math.max(5,Math.round((pos.coords.accuracy||5000)/1000)),sharedAt:new Date().toISOString()};
    const ch=window.__tnVisitorChannel,payload=window.__tnVisitorPresencePayload;
    if(!ch||!payload){$("tnMapStatus").textContent="Live visitor connection is not ready. Try again shortly.";b.disabled=false;b.textContent="Share my approximate location";return;}
    try{localStorage.setItem(consentKey,"yes");Object.assign(payload,{approxLocation:loc,locationShared:true});await ch.track(payload);b.textContent="Approximate location shared ✓";$("tnMapStatus").textContent="Your location is shared approximately while this page is open. Select again after clearing browser permissions to stop sharing."; }catch(e){$("tnMapStatus").textContent="Could not update live location. Please retry.";b.disabled=false;b.textContent="Share my approximate location";}
   },err=>{b.disabled=false;b.textContent="Share my approximate location";$("tnMapStatus").textContent=err.code===1?"Location permission was declined. You remain included in visitor totals.":"Location unavailable. You remain included in visitor totals.";},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
  }
  function render(state){
   lastState=state;const ch=window.__tnVisitorChannel;if(!ch)return;
   const visitors=new Map(),presence=ch.presenceState();
   Object.values(presence).forEach(arr=>(Array.isArray(arr)?arr:[]).forEach(meta=>{if(!meta?.visitorId)return;const prior=visitors.get(meta.visitorId);if(!prior||(!prior.approxLocation&&meta.approxLocation))visitors.set(meta.visitorId,meta);}));
   const located=[...visitors.values()].filter(v=>v.approxLocation&&Number.isFinite(v.approxLocation.latitude)&&Number.isFinite(v.approxLocation.longitude));
   $("tnMapLocated").textContent=String(located.length);$("tnMapPrivate").textContent=String(Math.max(0,visitors.size-located.length));$("tnMapRegions").textContent=String(new Set(located.map(v=>v.approxLocation.latitude.toFixed(1)+","+v.approxLocation.longitude.toFixed(1))).size);
   if(!window.L){$("tnMapStatus").textContent=visitors.size?located.length+" of "+visitors.size+" active visitors have shared an approximate location.":"Waiting for live visitor presence.";if(located.length)loadLeaflet();return;}
   if(!map)initMap();if(!layer)return;layer.clearLayers();
   const clusters=new Map();located.forEach(v=>{const p=v.approxLocation,key=p.latitude.toFixed(1)+","+p.longitude.toFixed(1);if(!clusters.has(key))clusters.set(key,{p,count:0,accuracy:0,zones:new Set()});const c=clusters.get(key);c.count++;c.accuracy=Math.max(c.accuracy,Number(p.accuracyKm)||5);if(v.timeZone)c.zones.add(v.timeZone);});
   clusters.forEach(c=>{const p=c.p;L.circleMarker([p.latitude,p.longitude],{radius:8+Math.min(c.count,10),color:"#f4c477",weight:2,fillColor:"#a7433e",fillOpacity:.9}).bindPopup('<strong>'+c.count+' visitor'+(c.count===1?'':'s')+' near this area</strong><br>Time zone: '+(Array.from(c.zones).join(', ')||'Not provided')+'<br>Approx. coordinates: '+p.latitude.toFixed(1)+', '+p.longitude.toFixed(1)+'<br><small>Rounded to ~11 km · device accuracy up to '+c.accuracy+' km</small>').addTo(layer);});
   if(located.length){const bounds=L.latLngBounds(located.map(v=>[v.approxLocation.latitude,v.approxLocation.longitude]));map.fitBounds(bounds.pad(.35),{maxZoom:5});}
   $("tnMapStatus").textContent=located.length+" of "+visitors.size+" active visitors have chosen to share an approximate location.";
  }
  const attach=()=>{const ch=window.__tnVisitorChannel;if(!ch)return;const refresh=()=>render(true);if(!card.dataset.attached){card.dataset.attached="yes";window.addEventListener("tn-presence-updated",refresh);}refresh();};
  attach();window.addEventListener("tn-presence-ready",attach);window.addEventListener("tacoma-nights-db-ready",()=>setTimeout(attach,300));
  const dashboard=panel.closest("#dashboard");
  if(dashboard&&"MutationObserver"in window)new MutationObserver(()=>{if(!dashboard.classList.contains("hidden")&&map)setTimeout(()=>map.invalidateSize(),180);}).observe(dashboard,{attributes:true,attributeFilter:["class"]});
  loadLeaflet();
 }
 function shareCurrentLocation(){/* location sharing is initiated by the map's explicit opt-in control */}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build,{once:true});else build();
})();


/* TACOMA NIGHTS CONTROL ROOM V5 — ten focused workspaces */
(function(){
 const start=()=>{
  const dash=document.getElementById("dashboard");
  if(!dash||dash.dataset.tnV5Ready==="true")return;
  const main=dash.querySelector(".tn-v4-main");
  const oldNav=dash.querySelector(".tn-v4-nav");
  if(!main||!oldNav)return;
  const specs=[
   ["media","03 / MEDIA LIBRARY","Media library & clip vault","Review private recordings, episode assets and contributor clips.","Media & Assets","Find, preview and manage production files."],
   ["people","02 / PEOPLE","Crew directory","Manage crew profiles, roles, permissions and public listings.","People","Keep the Tacoma Nights team organized."],
   ["community","04 / COMMUNITY","Submission inbox","Review community ideas, questions, guest nominations and follow-ups.","Community","Keep audience voices moving into the show."],
   ["talent","05 / TALENT & RECRUITMENT","Remote host applications","Review applications, samples, decisions and recruitment notes.","Talent","Discover and coordinate remote contributors."],
   ["editorial","01 · EDITORIAL","Plan the conversations","Explore the editorial calendar and turn ideas into episode plans.","Editorial","Choose the stories and shape each conversation."],
   ["blueprint","00B / SHOW BLUEPRINT","The weekly Tacoma Nights format","Maintain the recurring show structure, segments and weekly rhythm.","Show Blueprint","Keep the recognizable format consistent."],
   ["build","02 · PRODUCTION","Build the episode","Develop the story, rundown, scripts, assignments and publishing package.","Production","Move the episode from idea to finished edit."],
   ["desk","00 / WEEKLY PRODUCTION · PRIVATE","Episode production desk","Coordinate research, recording, tasks, approvals and episode status.","Production Desk","The private command center for each weekly episode."],
   ["broadcast","03 · BROADCAST","Prepare the show","Prepare the broadcast rundown, OBS scenes and readiness checklist.","Broadcast","Get every part of show delivery ready."],
   ["premiere","01 / ON AIR","Premiere settings","Manage the YouTube video, premiere schedule and public on-air status.","On Air","Control what viewers see and when they see it."]
  ];
  const normalize=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  const allPanels=[...main.querySelectorAll(".panel")];
  const used=new Set();
  const destinations=document.createElement("div");
  destinations.className="tn-v5-destinations";
  destinations.id="tnV5Destinations";
  specs.forEach((spec,i)=>{
   const panel=allPanels.find(p=>!used.has(p)&&normalize(p.querySelector("h2")?.textContent)===normalize(spec[2]));
   if(!panel)return;
   used.add(panel);
   const section=document.createElement("section");
   section.className="tn-v5-destination";
   section.id="tn-v5-"+spec[0];
   section.dataset.workspace=spec[0];
   const header=document.createElement("div");
   header.className="tn-v5-destination-head";
   header.innerHTML='<div class="tn-v5-destination-index">'+String(i+1).padStart(2,"0")+'</div><div class="tn-v5-destination-copy"><span>'+spec[1]+'</span><h2>'+spec[2]+'</h2><p>'+spec[3]+'</p></div><div class="tn-v5-destination-tag">'+spec[4]+'</div>';
   section.append(header,panel);
   destinations.append(section);
  });
  if(!destinations.children.length)return;
  const summary=main.querySelector(".tn-v4-system-summary");
  if(summary)summary.insertAdjacentElement("afterend",destinations);
  else main.append(destinations);
  const extras=document.createElement("details");
  extras.className="tn-v5-extras";
  extras.innerHTML='<summary><span><b>Additional production tools</b><small>Supporting tools, credits, homepage features and other existing workspaces</small></span><span class="tn-v5-extras-count">MORE TOOLS</span></summary>';
  const extraBody=document.createElement("div");
  extraBody.className="tn-v5-extras-body";
  [...main.querySelectorAll('[id^="workspace-"]')].forEach(group=>{
   const remaining=[...group.querySelectorAll(":scope > .panel")];
   if(remaining.length){extraBody.append(group);}
   else group.remove();
  });
  if(extraBody.children.length){extras.append(extraBody);destinations.insertAdjacentElement("afterend",extras);}
  const nav=oldNav;
  nav.replaceChildren();
  nav.setAttribute("aria-label","Ten Tacoma Nights workspaces");
  const navLabel=dash.querySelector(".tn-v4-nav-label");
  if(navLabel)navLabel.textContent="PRODUCTION WORKSPACES";
  specs.forEach((spec,i)=>{
   const target=document.getElementById("tn-v5-"+spec[0]);
   if(!target)return;
   const a=document.createElement("a");
   a.href="#"+target.id;
   a.dataset.target=target.id;
   a.className="tn-v5-nav-link";
   a.innerHTML='<span class="tn-v5-nav-number">'+String(i+1).padStart(2,"0")+'</span><span class="tn-v5-nav-copy"><b>'+spec[2]+'</b><small>'+spec[4]+'</small></span>';
   nav.append(a);
  });
  const sidebar=dash.querySelector(".tn-v4-sidebar");
  if(sidebar){
   const foot=sidebar.querySelector(".tn-v4-sidebar-foot");
   if(foot)foot.innerHTML='<span class="tn-v4-foot-dot"></span><span>PRIVATE PRODUCTION NETWORK</span><small>ONE COMPANY · ONE UNIVERSE</small>';
   const brand=sidebar.querySelector(".tn-v4-brand");
   if(brand)brand.innerHTML='<span class="tn-v4-mark" aria-hidden="true">R</span><div><strong>TACOMA NIGHTS</strong><small>PRODUCTION CONTROL ROOM</small></div>';
  }
  const activate=id=>nav.querySelectorAll("a").forEach(a=>{
   const active=a.dataset.target===id;
   a.classList.toggle("active",active);
   if(active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>activate(a.dataset.target)));
  if("IntersectionObserver"in window){
   const observer=new IntersectionObserver(entries=>{
    const top=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(top)activate(top.target.id);
   },{rootMargin:"-18% 0px -68% 0px",threshold:[0,.15,.4]});
   destinations.querySelectorAll(".tn-v5-destination").forEach(s=>observer.observe(s));
  }
  const search=document.getElementById("tnV4Search");
  if(search)search.addEventListener("input",()=>{
   const q=normalize(search.value);
   destinations.querySelectorAll(".tn-v5-destination").forEach(section=>{
    section.hidden=!!q&&!normalize(section.textContent).includes(q);
   });
  });
  const clear=document.getElementById("tnV4ClearSearch");
  if(clear)clear.addEventListener("click",()=>destinations.querySelectorAll(".tn-v5-destination").forEach(s=>s.hidden=false));
  activate(location.hash&&document.getElementById(location.hash.slice(1))?location.hash.slice(1):"tn-v5-media");
  dash.dataset.tnV5Ready="true";
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(start,0),{once:true});
 else setTimeout(start,0);
})();
(function(){
 if(document.getElementById("tn-v5-styles"))return;
 const style=document.createElement("style");style.id="tn-v5-styles";
 style.textContent=`
 #dashboard.tn-v5-ready{display:grid;grid-template-columns:285px minmax(0,1fr);gap:0;align-items:start}
 .tn-v4-sidebar{position:sticky!important;top:18px!important;max-height:calc(100vh - 36px);overflow:auto;border:1px solid #e8b45c35!important;background:linear-gradient(180deg,#121b27,#090e15)!important;padding:18px!important}
 .tn-v4-nav-label{margin:25px 0 10px!important}
 .tn-v5-nav-link{display:flex!important;align-items:center;gap:10px;padding:11px 9px!important;border:1px solid transparent!important;border-radius:7px!important;color:#dfe4eb!important;text-decoration:none!important}
 .tn-v5-nav-link:hover,.tn-v5-nav-link.active{background:#e8b45c12!important;border-color:#e8b45c55!important;color:#f4ca82!important}
 .tn-v5-nav-number{display:grid;place-items:center;flex:0 0 29px;height:29px;border:1px solid #e8b45c55;color:#e8b45c;font:800 .75rem "DM Sans",sans-serif}
 .tn-v5-nav-copy{display:grid;gap:3px;min-width:0}.tn-v5-nav-copy b{font-size:.76rem;line-height:1.2}.tn-v5-nav-copy small{font-size:.62rem;color:#aab2bd}
 .tn-v4-main{min-width:0!important;padding-left:clamp(16px,3vw,38px)!important}
 .tn-v5-destinations{display:grid;gap:22px;margin:25px 0}
 .tn-v5-destination{scroll-margin-top:24px;min-width:0}
 .tn-v5-destination-head{display:flex;align-items:center;gap:15px;padding:18px 20px;margin-bottom:10px;border:1px solid #e8b45c35;background:linear-gradient(100deg,#1a2635,#101721 78%);position:relative;overflow:hidden}
 .tn-v5-destination-head:after{content:"";position:absolute;right:12px;top:-25px;width:120px;height:120px;border:1px solid #e8b45c15;border-radius:50%;box-shadow:0 0 0 18px #e8b45c08,0 0 0 38px #e8b45c05;pointer-events:none}
 .tn-v5-destination-index{font:900 2.4rem/1 "Barlow Condensed",sans-serif;color:#e8b45c;min-width:38px}
 .tn-v5-destination-copy{min-width:0;flex:1}.tn-v5-destination-copy>span{font-size:.62rem;font-weight:800;letter-spacing:.16em;color:#e8b45c}
 .tn-v5-destination-copy h2{font-size:clamp(1.8rem,3vw,2.7rem);margin:5px 0;color:#f3f0e9}
 .tn-v5-destination-copy p{margin:0;color:#aab2bd;font-size:.8rem}
 .tn-v5-destination-tag{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#e8b45c;border:1px solid #e8b45c40;padding:7px 9px;white-space:nowrap}
 .tn-v5-destination>.panel{margin:0!important}
 .tn-v5-extras{border:1px solid #ffffff25;background:#101721;margin:24px 0}
 .tn-v5-extras>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 20px;cursor:pointer;list-style:none}
 .tn-v5-extras>summary::-webkit-details-marker{display:none}
 .tn-v5-extras>summary span:first-child{display:grid;gap:4px}.tn-v5-extras>summary b{font:700 1.45rem "Barlow Condensed";text-transform:uppercase;color:#f3f0e9}
 .tn-v5-extras>summary small{font-size:.74rem;color:#aab2bd}.tn-v5-extras-count{font-size:.62rem;letter-spacing:.13em;color:#e8b45c}
 .tn-v5-extras-body{padding:12px;border-top:1px solid #ffffff1a}
 .tn-v5-extras-body>[id^="workspace-"]{margin:0 0 15px}
 @media(max-width:1000px){#dashboard.tn-v5-ready{grid-template-columns:230px minmax(0,1fr)}.tn-v4-main{padding-left:16px!important}.tn-v5-destination-tag{display:none}}
 @media(max-width:760px){#dashboard.tn-v5-ready{display:block}.tn-v4-sidebar{position:relative!important;top:auto!important;max-height:none;margin-bottom:18px}.tn-v4-sidebar .tn-v4-nav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.tn-v4-main{padding-left:0!important}.tn-v5-destination-head{padding:14px}.tn-v5-destination-index{font-size:1.8rem}}
 @media(max-width:440px){.tn-v4-sidebar .tn-v4-nav{grid-template-columns:1fr}.tn-v5-destination-copy h2{font-size:1.65rem}.tn-v5-destination-head{gap:10px}.tn-v5-destination-copy p{font-size:.72rem}}
 `;
 document.head.append(style);
})();
