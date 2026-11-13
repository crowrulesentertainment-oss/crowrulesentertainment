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
  const dash=$("dashboard");if(!dash||dash.dataset.ravenRebuild==="ready")return;
  const oldMain=dash.querySelector(":scope > .tn-main");
  const original=oldMain?[...oldMain.children]:[...dash.children];
  const content=original.filter(n=>!(n.classList&&n.classList.contains("tn-command-hero"))&&!(n.matches&&n.matches(".tn-topnav")));
  const panels=content.filter(n=>n.matches&&n.matches(".panel[id]"));
  const groups={};
  panels.forEach(n=>{const g=groupFor(n.id,sectionLabel(n));(groups[g]||(groups[g]=[])).push({id:n.id,label:sectionLabel(n)});});
  const order=["AUDIENCE & COMMAND","EDITORIAL & PRODUCTION","BROADCAST","PEOPLE & COMMUNITY","MEDIA & ASSETS","ADMINISTRATION"];
  const nav=document.createElement("aside");nav.className="tn-raven-sidebar";nav.setAttribute("aria-label","Tacoma Nights operations navigation");
  nav.innerHTML='<div class="tn-raven-brand"><span class="tn-raven-mark" aria-hidden="true">R</span><span><strong>RAVEN OPERATIONS</strong><small>TACOMA NIGHTS · CONTROL ROOM</small></span></div><a class="tn-raven-overview" href="#ravenCommandHero"><span>⌂</span> COMMAND OVERVIEW</a><label class="tn-raven-search"><span aria-hidden="true">⌕</span><input id="tnRavenNavSearch" type="search" placeholder="Find a workspace…" aria-label="Find a workspace"></label><nav class="tn-raven-nav" aria-label="Production workspaces">'+order.filter(g=>groups[g]?.length).map((g,gi)=>'<details class="tn-raven-group" '+(gi<2?'open':'')+'><summary><span class="tn-group-icon">'+iconFor(g)+'</span><span>'+g+'</span><small>'+groups[g].length+'</small></summary><div class="tn-raven-group-links">'+groups[g].map((it,ii)=>'<a href="#'+it.id+'" data-target="'+it.id+'" data-search="'+(it.label+" "+it.id+" "+g).toLowerCase().replace(/"/g,"&quot;")+'"><span class="tn-nav-name">'+it.label+'</span><span class="tn-nav-no">'+String(ii+1).padStart(2,"0")+'</span></a>').join("")+'</div></details>').join("")+'</nav><div class="tn-raven-sidefoot"><b>PRIVATE PRODUCTION NETWORK</b><br>253 · TACOMA, WASHINGTON<br>ONE COMPANY. ONE UNIVERSE.</div>';
  const main=document.createElement("main");main.className="tn-raven-main";
  const hero=document.createElement("section");hero.className="tn-raven-hero";hero.id="ravenCommandHero";
  hero.innerHTML='<div class="tn-raven-hero-copy"><p class="tn-raven-eyebrow">CROWRULES ENTERTAINMENT · TACOMA, WASHINGTON</p><h1>THE RAVEN<span>CONTROL ROOM</span></h1><p>The production headquarters for Tacoma Nights. Shape the stories, bring the voices together and prepare every broadcast — grounded in Tacoma and reaching beyond the South Sound.</p><div class="tn-raven-hero-meta"><span>PRIVATE PRODUCTION NETWORK</span><span>THE CITY · THE PEOPLE · THE STORIES</span><span>253 / PACIFIC NORTHWEST</span></div><div class="tn-raven-actions"><a href="#productionWorkspace">OPEN PRODUCTION DESK ↗</a><a href="#broadcastCenter">PREPARE BROADCAST ↗</a><a href="#visitorAnalyticsPanel">AUDIENCE INTELLIGENCE ↗</a></div></div>';
  const live=document.createElement("div");live.className="tn-raven-livebar";
  live.innerHTML='<span class="live-dot" aria-hidden="true"></span><small>LIVE AUDIENCE</small><strong id="tnRavenLiveCount">—</strong><small id="tnRavenLiveStatus">Connecting to sitewide presence…</small><span class="tn-live-caption">SUPABASE REALTIME · LIVE PRESENCE</span>';
  main.append(hero,live);content.forEach(n=>main.append(n));dash.replaceChildren(nav,main);dash.dataset.ravenRebuild="ready";
  const count=$("visitorCount"),status=$("visitorStatus");
  const sync=()=>{if($("tnRavenLiveCount")&&count)$("tnRavenLiveCount").textContent=count.textContent||"—";if($("tnRavenLiveStatus")&&status)$("tnRavenLiveStatus").textContent=status.textContent||"Live presence";};
  if(count&&status){sync();new MutationObserver(sync).observe(count,{childList:true,characterData:true,subtree:true});new MutationObserver(sync).observe(status,{childList:true,characterData:true,subtree:true});}
  const links=[...nav.querySelectorAll("[data-target]")];
  const activate=id=>links.forEach(a=>{const on=a.dataset.target===id;a.classList.toggle("active",on);if(on)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});
  links.forEach(a=>a.addEventListener("click",()=>activate(a.dataset.target)));
  const search=$("tnRavenNavSearch");search?.addEventListener("input",()=>{const q=search.value.toLowerCase().trim();nav.querySelectorAll(".tn-raven-group").forEach(group=>{let visible=0;group.querySelectorAll("a[data-target]").forEach(a=>{const show=!q||a.dataset.search.includes(q);a.hidden=!show;if(show)visible++;});group.hidden=visible===0;if(q&&visible)group.open=true;});});
  if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>{const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)activate(v.target.id);},{rootMargin:"-18% 0px -68% 0px",threshold:[0,.15,.4]});panels.forEach(n=>io.observe(n));}
  activate(location.hash.slice(1)||"visitorAnalyticsPanel");
  buildVisitorMap();
 }
 function buildVisitorMap(){
  const panel=$("visitorAnalyticsPanel");if(!panel||$("tnVisitorMapCard"))return;
  const card=document.createElement("div");card.id="tnVisitorMapCard";card.className="item tn-visitor-map-card";
  card.innerHTML='<div class="itemtop"><div><span class="micro">LIVE GEOGRAPHIC AUDIENCE</span><h3>Where visitors are sharing from</h3><p class="small">Only visitors who actively opt in to approximate location sharing appear as map markers.</p></div><span class="pill">CONSENT ONLY</span></div><div class="tn-map-stats"><div><strong id="tnMapLocated">0</strong><span>Located visitors</span></div><div><strong id="tnMapPrivate">—</strong><span>Location not shared</span></div><div><strong id="tnMapRegions">0</strong><span>Map locations</span></div></div><div id="tnVisitorMap" role="img" aria-label="Map of approximate locations shared by current visitors"><div class="tn-map-placeholder">Waiting for visitors who choose to share an approximate location…</div></div><div class="tn-map-foot"><span id="tnMapStatus">Waiting for live visitor presence.</span><span>Approximate locations are rounded to about 11 km · no IP address stored</span></div>';
  const stats=panel.querySelector(".tn-analytics-stats");if(stats)stats.insertAdjacentElement("afterend",card);else panel.prepend(card);
  const btn=document.createElement("button");btn.type="button";btn.className="tn-map-share-button";btn.id="tnMapShareButton";btn.textContent="Share my approximate location";
  const intro=card.querySelector(".itemtop");intro.append(btn);
  btn.addEventListener("click",shareCurrentLocation);
  const consentKey="tn-share-approx-location-v1";
  if(localStorage.getItem(consentKey)==="yes")setTimeout(shareCurrentLocation,900);
  let map=null,layer=null,leafletLoading=false,lastState=null;
  function loadLeaflet(){
   if(window.L){initMap();return;}if(leafletLoading)return;leafletLoading=true;
   if(!document.querySelector('link[data-tn-leaflet]')){const l=document.createElement("link");l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";l.dataset.tnLeaflet="1";document.head.append(l);}
   const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.onload=initMap;script.onerror=()=>{$("tnMapStatus").textContent="Map library could not load. Check the connection or content blocker.";};document.head.append(script);
  }
  function initMap(){
   if(map||!window.L)return;
   map=L.map("tnVisitorMap",{worldCopyJump:true,scrollWheelZoom:false}).setView([25,0],2);
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:8,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
   layer=L.layerGroup().addTo(map);if(lastState)render(lastState);setTimeout(()=>map.invalidateSize(),200);
  }
  function shareCurrentLocation(){
   const b=$("tnMapShareButton");if(!navigator.geolocation){$("tnMapStatus").textContent="This browser does not support location sharing.";return;}
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
   Object.values(presence).forEach(arr=>(Array.isArray(arr)?arr:[]).forEach(meta=>{if(meta?.visitorId)visitors.set(meta.visitorId,meta);}));
   const located=[...visitors.values()].filter(v=>v.approxLocation&&Number.isFinite(v.approxLocation.latitude)&&Number.isFinite(v.approxLocation.longitude));
   $("tnMapLocated").textContent=String(located.length);$("tnMapPrivate").textContent=String(Math.max(0,visitors.size-located.length));$("tnMapRegions").textContent=String(new Set(located.map(v=>v.approxLocation.latitude.toFixed(1)+","+v.approxLocation.longitude.toFixed(1))).size);
   if(!window.L){$("tnMapStatus").textContent=visitors.size?located.length+" of "+visitors.size+" active visitors have shared an approximate location.":"Waiting for live visitor presence.";if(located.length)loadLeaflet();return;}
   if(!map)initMap();if(!layer)return;layer.clearLayers();
   located.forEach(v=>{const p=v.approxLocation;L.circleMarker([p.latitude,p.longitude],{radius:9,color:"#f4c477",weight:2,fillColor:"#a7433e",fillOpacity:.9}).bindPopup('<strong>Approximate visitor location</strong><br>Rounded coordinates: '+p.latitude.toFixed(1)+', '+p.longitude.toFixed(1)+'<br><small>Accuracy radius at least 5 km</small>').addTo(layer);});
   if(located.length){const bounds=L.latLngBounds(located.map(v=>[v.approxLocation.latitude,v.approxLocation.longitude]));map.fitBounds(bounds.pad(.35),{maxZoom:5});}
   $("tnMapStatus").textContent=located.length+" of "+visitors.size+" active visitors have chosen to share an approximate location.";
  }
  const attach=()=>{const ch=window.__tnVisitorChannel;if(!ch||card.dataset.attached)return;card.dataset.attached="yes";const refresh=()=>render(true);ch.on("presence",{event:"sync"},refresh).on("presence",{event:"join"},refresh).on("presence",{event:"leave"},refresh);refresh();};
  attach();window.addEventListener("tn-presence-ready",attach);window.addEventListener("tacoma-nights-db-ready",()=>setTimeout(attach,300));
 }
 function shareCurrentLocation(){/* location sharing is initiated by the map's explicit opt-in control */}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build,{once:true});else build();
})();
