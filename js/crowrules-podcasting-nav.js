/* CrowRules Podcasting Navigation — Role-Aware Configuration-Driven V5 */
(()=>{"use strict";
if(window.__CrowRulesPodcastingNavV5)return;
window.__CrowRulesPodcastingNavV5=true;
const CONFIG_URL="https://crowrulesentertainment-oss.github.io/crowrulesentertainment/js/crowrules-podcasting-nav-config.js?v=5";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const onPodcasting=location.pathname.replace(/\\/g,"/").includes("/podcasting/");
const state={config:null,drop:null};
function loadConfig(){
 if(window.CROWRULES_PODCAST_NAV_CONFIG)return Promise.resolve(window.CROWRULES_PODCAST_NAV_CONFIG);
 return new Promise((resolve,reject)=>{
  const s=document.createElement("script");s.src=CONFIG_URL;s.async=true;s.dataset.crowrulesPodcastNavConfig="true";
  s.onload=()=>window.CROWRULES_PODCAST_NAV_CONFIG?resolve(window.CROWRULES_PODCAST_NAV_CONFIG):reject(new Error("Podcast navigation configuration missing"));
  s.onerror=()=>reject(new Error("Podcast navigation configuration failed to load"));
  document.head.appendChild(s);
 });
}
function css(){if(document.getElementById("cr-pod-nav-v5-css"))return;const s=document.createElement("style");s.id="cr-pod-nav-v5-css";s.textContent=`
.cr-pod-drop{position:relative;flex:none}.cr-pod-drop>button{display:inline-flex;align-items:center;gap:4px;color:#cbd5e1;padding:8px 10px;border:1px solid transparent;border-radius:8px;background:transparent;font:800 10px Arial,sans-serif;white-space:nowrap;cursor:pointer}.cr-pod-drop>button:hover,.cr-pod-drop.open>button{border-color:#78efff33;background:#78efff0d;color:#fff}.cr-pod-chevron{font-size:9px;color:#78efff}
.cr-pod-menu{position:fixed;z-index:100004;min-width:250px;max-width:calc(100vw - 20px);padding:8px;background:rgba(7,11,22,.99);border:1px solid #78efff55;border-radius:13px;display:none;gap:2px;box-shadow:0 20px 60px #000b;max-height:calc(100vh - 80px);overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.cr-pod-drop.open>.cr-pod-menu{display:grid}
.cr-pod-heading{padding:8px 10px 5px;color:#78efff;font-size:8px;letter-spacing:.16em;font-weight:900}.cr-pod-heading:not(:first-child){border-top:1px solid #ffffff10;margin-top:5px;padding-top:10px}
.cr-pod-item{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;padding:8px 10px;border-radius:8px;color:#fff;background:transparent;text-decoration:none;font:700 10px Arial,sans-serif}.cr-pod-item:hover,.cr-pod-item:focus-visible{background:#78efff0d;outline:none}.cr-pod-item.current{background:#78efff14;color:#78efff;box-shadow:inset 2px 0 #78efff}.cr-pod-item.disabled{opacity:.48;cursor:not-allowed}.cr-pod-icon{width:16px;text-align:center;color:#78efff;font-size:11px;flex:none}.cr-pod-label{min-width:0;flex:1}.cr-pod-badge{display:inline-flex;align-items:center;justify-content:center;margin-left:auto;padding:3px 6px;border-radius:999px;background:#78efff12;color:#78efff;font-size:7px;letter-spacing:.08em;font-weight:900;white-space:nowrap}.cr-pod-badge.soon{color:#ffd479;background:#ffd47912}.cr-pod-badge.off{color:#ff8798;background:#ff526812}
.cr-pod-mobile-label{display:none}
@media(max-width:850px){.cr-pod-drop>button{font-size:9px;padding:7px 8px}.cr-pod-mobile-label{display:inline}}
@media(max-width:520px){.cr-pod-menu{min-width:calc(100vw - 18px);max-width:calc(100vw - 18px);left:9px!important}.cr-pod-item{min-height:42px;padding:10px}.cr-pod-drop>button{font-size:8px;padding:7px}}
`;document.head.appendChild(s)}
function getRoles(){
 const u=window.CrowRulesAuth?.user||null,m=u?.user_metadata||{},a=window.CrowRulesAuth||{};
 const roles=new Set(["public"]);
 if(u)roles.add("member");
 const add=v=>{if(Array.isArray(v))v.forEach(add);else if(typeof v==="string")v.split(/[,\\s]+/).forEach(x=>{x=x.trim().toLowerCase();if(x)roles.add(x)})};
 add(a.role);add(a.roles);add(m.role);add(m.roles);add(m.user_role);add(m.account_role);
 if(a.is_admin===true||m.is_admin===true||m.admin===true)roles.add("admin");
 if(a.is_creator===true||m.is_creator===true||m.creator===true)roles.add("creator");
 return roles;
}
function visible(item){const roles=getRoles(),required=item.roles||["public","member","creator","admin"];return required.some(r=>roles.has(String(r).toLowerCase()));}
function urlFor(item){return new URL(item.file,state.config.base).href}
function isCurrent(url){try{const a=new URL(url),b=new URL(location.href);return a.origin===b.origin&&a.pathname===b.pathname}catch{return false}}
function itemHtml(item){
 const url=urlFor(item),status=item.status||"live",disabled=status!=="live",badge=item.badge||(status==="soon"?"SOON":status==="development"?"IN DEVELOPMENT":status==="offline"?"UNAVAILABLE":status==="new"?"NEW":"");
 return '<a role="menuitem" class="cr-pod-item'+(isCurrent(url)?" current":"")+(disabled?" disabled":"")+'" href="'+(disabled?"#":esc(url))+'"'+(isCurrent(url)?' aria-current="page"':"")+(disabled?' aria-disabled="true" tabindex="-1"':"")+'>'+ (item.icon?'<span class="cr-pod-icon" aria-hidden="true">'+esc(item.icon)+"</span>":"<span class=\"cr-pod-icon\" aria-hidden=\"true\">•</span>")+ '<span class="cr-pod-label">'+esc(item.label)+'</span>'+ (badge?'<span class="cr-pod-badge '+(status==="soon"||status==="development"?"soon":status==="offline"?"off":"")+'">'+esc(badge)+"</span>":"")+"</a>"
}
function section(g){const items=g.items.filter(visible);return items.length?'<div class="cr-pod-heading">'+esc(g.title)+'</div>'+items.map(itemHtml).join(""):""}
function close(except){document.querySelectorAll(".cr-pod-drop.open").forEach(d=>{if(d!==except){d.classList.remove("open");d.querySelector(":scope>button")?.setAttribute("aria-expanded","false")}})}
function position(drop){const b=drop.querySelector(":scope>button"),m=drop.querySelector(":scope>.cr-pod-menu");if(!b||!m)return;const r=b.getBoundingClientRect(),w=Math.min(360,innerWidth-20);let left=Math.max(10,Math.min(r.left,innerWidth-w-10)),top=r.bottom+7;if(innerWidth<=520)left=9;const h=Math.min(m.scrollHeight||420,innerHeight-20);if(top+h>innerHeight&&r.top>h)top=Math.max(10,r.top-h-7);m.style.left=left+"px";m.style.top=top+"px"}
function mount(){
 if(!onPodcasting||!state.config)return;
 css();const nav=document.querySelector(".cr-sw-nav");if(!nav)return;
 let drop=nav.querySelector(".cr-pod-drop");if(!drop){drop=document.createElement("div");drop.className="cr-sw-drop cr-pod-drop";nav.appendChild(drop)}
 state.drop=drop;
 drop.innerHTML='<button type="button" aria-haspopup="true" aria-expanded="false">PODCASTING <span class="cr-pod-chevron" aria-hidden="true">▾</span></button><div class="cr-pod-menu" role="menu">'+state.config.groups.map(section).join("")+'</div>';
 const btn=drop.querySelector(":scope>button");
 btn.onclick=e=>{e.stopPropagation();const open=drop.classList.contains("open");close(drop);drop.classList.toggle("open",!open);btn.setAttribute("aria-expanded",String(!open));if(!open)requestAnimationFrame(()=>position(drop))};
 btn.onkeydown=e=>{if(e.key==="Escape"){close();btn.focus()}if(e.key==="ArrowDown"){e.preventDefault();btn.click();setTimeout(()=>drop.querySelector(".cr-pod-menu a:not(.disabled)")?.focus(),0)}};
 drop.querySelectorAll(".cr-pod-item").forEach(a=>{a.onkeydown=e=>{if(e.key==="Escape"){close();btn.focus()}};a.onclick=e=>{if(a.classList.contains("disabled"))e.preventDefault()}});
}
function start(){
 if(!onPodcasting)return;
 loadConfig().then(c=>{state.config=c;mount();window.addEventListener("crowrules-auth",()=>mount());}).catch(e=>console.warn("[CrowRules Podcasting Nav V5]",e));
 const observer=new MutationObserver(()=>{if(state.config&&document.querySelector(".cr-sw-nav")&&!document.querySelector(".cr-pod-drop"))mount()});
 observer.observe(document.body,{childList:true,subtree:true});
 addEventListener("resize",()=>document.querySelectorAll(".cr-pod-drop.open").forEach(position),{passive:true});
 addEventListener("scroll",()=>document.querySelectorAll(".cr-pod-drop.open").forEach(position),{passive:true});
 addEventListener("orientationchange",()=>setTimeout(()=>document.querySelectorAll(".cr-pod-drop.open").forEach(position),50),{passive:true});
 document.addEventListener("click",e=>{if(!e.target.closest(".cr-pod-drop"))close()},{passive:true});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();