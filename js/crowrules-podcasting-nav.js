/* CrowRules Podcasting Navigation — Creator Studio Canonical V3
 * Canonical Podcasting navigation modeled on Creator Studio.
 * One navigation system across every /podcasting/ page.
 * Listener + Creator Studio + Admin destinations remain available from one menu.
 */
(()=>{"use strict";
if(window.__CrowRulesPodcastingNavV3)return;
window.__CrowRulesPodcastingNavV3=true;

const BASE="https://crowrulesentertainment-oss.github.io/podcasting/";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const path=location.pathname.replace(/\\/g,"/");
const onPodcasting=path.includes("/podcasting/");

const CREATOR=[
 ["Studio","creator-dashboard.html","⌂"],
 ["My Podcasts","podcasts.html","◉"],
 ["Create Podcast","create-podcast.html","＋"],
 ["Create Episode","create-episode.html","＋"],
 ["Pipeline","publishing-pipeline.html","▸"],
 ["Intelligence","creator-intelligence.html","✦"],
 ["Analytics","analytics.html","◒"],
 ["Calendar","release-calendar.html","□"],
 ["Distribution","distribution.html","↗"],
 ["Profile","creator-profile.html","◎"],
 ["Payouts","creator-payouts.html","$"],
 ["Account","account.html","⚙"]
];
const LISTENER=[
 ["Podcasts","podcasts.html"],
 ["Discover","discover.html"],
 ["Following","following.html"],
 ["Favorites","favorites.html"],
 ["Listening History","history.html"]
];
const ADMIN=[
 ["Admin Center","admin.html"],
 ["Moderation","moderation.html"],
 ["Publishing","publishing.html"],
 ["Health","health.html"],
 ["Analytics","analytics.html"]
];

function current(url){
 try{
  const a=new URL(url,location.href),b=new URL(location.href);
  return a.origin===b.origin && a.pathname===b.pathname;
 }catch{return false}
}
function item(label,file,icon){
 const url=BASE+file;
 return '<a role="menuitem" href="'+esc(url)+'"'+(current(url)?' class="cr-pod-current" aria-current="page"':'')+'>'+ (icon?'<span class="cr-pod-icon" aria-hidden="true">'+esc(icon)+"</span>":"") +esc(label)+"</a>";
}
function section(title,items){
 return '<div class="cr-pod-heading">'+esc(title)+"</div>"+items.map(x=>item(x[0],x[1],x[2])).join("");
}
function close(except){
 document.querySelectorAll(".cr-pod-drop.open").forEach(d=>{
  if(d!==except){d.classList.remove("open");d.querySelector(":scope>button")?.setAttribute("aria-expanded","false")}
 });
}
function position(drop){
 const b=drop.querySelector(":scope>button"),m=drop.querySelector(":scope>.cr-pod-menu");
 if(!b||!m)return;
 const r=b.getBoundingClientRect(),w=Math.min(360,innerWidth-20);
 let left=Math.max(10,Math.min(r.left,innerWidth-w-10)),top=r.bottom+7;
 const h=Math.min(m.scrollHeight||420,innerHeight-20);
 if(top+h>innerHeight&&r.top>h)top=Math.max(10,r.top-h-7);
 m.style.left=left+"px";m.style.top=top+"px";
}
function css(){
 if(document.getElementById("cr-pod-nav-v3-css"))return;
 const s=document.createElement("style");s.id="cr-pod-nav-v3-css";
 s.textContent=`
.cr-pod-drop{position:relative;flex:none}
.cr-pod-drop>button{display:inline-flex;align-items:center;gap:4px;color:#cbd5e1;padding:8px 10px;border:1px solid transparent;border-radius:8px;background:transparent;font:800 10px Arial,sans-serif;white-space:nowrap;cursor:pointer}
.cr-pod-drop>button:hover,.cr-pod-drop.open>button{border-color:#78efff33;background:#78efff0d;color:#fff}
.cr-pod-drop>button .cr-pod-chevron{font-size:9px;color:#78efff}
.cr-pod-menu{position:fixed;z-index:100004;min-width:230px;max-width:calc(100vw - 20px);padding:8px;background:rgba(7,11,22,.99);border:1px solid #78efff55;border-radius:13px;display:none;gap:2px;box-shadow:0 20px 60px #000b;max-height:calc(100vh - 80px);overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.cr-pod-drop.open>.cr-pod-menu{display:grid}
.cr-pod-heading{padding:8px 10px 5px;color:#78efff;font-size:8px;letter-spacing:.16em;font-weight:900}
.cr-pod-heading:not(:first-child){border-top:1px solid #ffffff10;margin-top:5px;padding-top:10px}
.cr-pod-menu a{display:flex;align-items:center;gap:8px;width:100%;padding:9px 10px;border-radius:8px;color:#fff;background:transparent;text-decoration:none;font:700 10px Arial,sans-serif}
.cr-pod-menu a:hover,.cr-pod-menu a:focus-visible{background:#78efff0d;outline:none}
.cr-pod-menu a.cr-pod-current{background:#78efff14;color:#78efff;box-shadow:inset 2px 0 #78efff}
.cr-pod-icon{width:16px;text-align:center;color:#78efff;font-size:11px}
.cr-pod-badge{display:inline-flex;align-items:center;justify-content:center;margin-left:3px;padding:2px 5px;border-radius:999px;background:#78efff12;color:#78efff;font-size:7px;letter-spacing:.08em}
@media(max-width:850px){
 .cr-pod-drop>button{font-size:9px;padding:7px 8px}
}
@media(max-width:520px){
 .cr-pod-menu{min-width:210px}
}
`;
 document.head.appendChild(s);
}
function mount(){
 if(!onPodcasting)return;
 css();
 const nav=document.querySelector(".cr-sw-nav");
 if(!nav)return;
 let drop=nav.querySelector(".cr-pod-drop");
 if(!drop){
  drop=document.createElement("div");
  drop.className="cr-sw-drop cr-pod-drop";
  nav.appendChild(drop);
 }
 drop.innerHTML='<button type="button" aria-haspopup="true" aria-expanded="false">PODCASTING <span class="cr-pod-chevron" aria-hidden="true">▾</span></button><div class="cr-pod-menu" role="menu">'+
   section("CREATOR STUDIO",CREATOR)+
   section("LISTENER",LISTENER)+
   section("ADMIN",ADMIN)+
   '</div>';
 const btn=drop.querySelector(":scope>button");
 btn.onclick=e=>{
  e.stopPropagation();
  const open=drop.classList.contains("open");
  close(drop);drop.classList.toggle("open",!open);btn.setAttribute("aria-expanded",String(!open));
  if(!open)requestAnimationFrame(()=>position(drop));
 };
 btn.onkeydown=e=>{
  if(e.key==="Escape"){close();btn.focus()}
  if(e.key==="ArrowDown"){e.preventDefault();btn.click();setTimeout(()=>drop.querySelector(".cr-pod-menu a")?.focus(),0)}
 };
 drop.querySelectorAll(".cr-pod-menu a").forEach(a=>a.onkeydown=e=>{
  if(e.key==="Escape"){close();btn.focus()}
 });
}
function start(){
 if(!onPodcasting)return;
 mount();
 const observer=new MutationObserver(()=>{if(document.querySelector(".cr-sw-nav")&&!document.querySelector(".cr-pod-drop"))mount()});
 observer.observe(document.body,{childList:true,subtree:true});
 addEventListener("resize",()=>document.querySelectorAll(".cr-pod-drop.open").forEach(position),{passive:true});
 addEventListener("scroll",()=>document.querySelectorAll(".cr-pod-drop.open").forEach(position),{passive:true});
 addEventListener("orientationchange",()=>setTimeout(()=>document.querySelectorAll(".cr-pod-drop.open").forEach(position),50),{passive:true});
 document.addEventListener("click",e=>{if(!e.target.closest(".cr-pod-drop"))close()},{passive:true});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();