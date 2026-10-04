/* CrowRules Podcasting Navigation V1
 * Adds the Podcasting-specific dropdown to the existing universal shell.
 * Safe to load on every page; activates only inside /podcasting/.
 */
(()=>{
'use strict';
if(window.__CrowRulesPodcastingNavV1)return;
window.__CrowRulesPodcastingNavV1=true;

const BASE='https://crowrulesentertainment-oss.github.io/podcasting/';
const LINKS=[
 ['Podcasts','podcasts.html'],
 ['Discover','discover.html'],
 ['Creators','creators.html'],
 ['Create a Podcast','create-podcast.html'],
 ['Studio','admin.html'],
 ['Help','help.html'],
 ['Profile','member-profile.html']
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function current(url){
 try{return new URL(url,location.href).pathname===location.pathname}catch{return false}
}
function position(drop){
 const b=drop.querySelector(':scope>button'),m=drop.querySelector(':scope>.cr-sw-menu');
 if(!b||!m)return;
 const r=b.getBoundingClientRect(),w=Math.min(300,innerWidth-20);
 let left=Math.max(10,Math.min(r.left,innerWidth-w-10));
 let top=r.bottom+7;
 const h=Math.min(m.scrollHeight||220,innerHeight-20);
 if(top+h>innerHeight&&r.top>h)top=Math.max(10,r.top-h-7);
 m.style.left=left+'px';m.style.top=top+'px';
}
function close(except){
 document.querySelectorAll('.cr-sw-podcast-drop.open').forEach(x=>{
  if(x!==except){x.classList.remove('open');x.querySelector(':scope>button')?.setAttribute('aria-expanded','false')}
 });
}
function mount(){
 if(!location.pathname.includes('/podcasting/'))return;
 const nav=document.querySelector('.cr-sw-nav');
 if(!nav||nav.querySelector('.cr-sw-podcast-drop'))return;
 const drop=document.createElement('div');
 drop.className='cr-sw-drop cr-sw-podcast-drop';
 drop.innerHTML='<button type="button" aria-haspopup="true" aria-expanded="false">PODCASTING <span class="chev" aria-hidden="true">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">PODCASTING UNIVERSE</div>'+LINKS.map(([label,path])=>{const url=BASE+path;return '<a role="menuitem" href="'+esc(url)+'"'+(current(url)?' class="cr-sw-current" aria-current="page"':'')+'>'+esc(label)+'</a>'}).join('')+'</div>';
 nav.appendChild(drop);
 const btn=drop.querySelector(':scope>button');
 btn.onclick=e=>{e.stopPropagation();const open=drop.classList.contains('open');close(drop);drop.classList.toggle('open',!open);btn.setAttribute('aria-expanded',String(!open));if(!open)requestAnimationFrame(()=>position(drop))};
 btn.onkeydown=e=>{if(e.key==='Escape'){close();btn.focus()}if(e.key==='ArrowDown'){e.preventDefault();btn.click();setTimeout(()=>drop.querySelector('.cr-sw-menu a')?.focus(),0)}};
 drop.querySelectorAll('.cr-sw-menu a').forEach(a=>a.onkeydown=e=>{if(e.key==='Escape'){close();btn.focus()}});
}

function start(){
 mount();
 const observer=new MutationObserver(()=>mount());
 observer.observe(document.body,{childList:true,subtree:true});
 addEventListener('resize',()=>document.querySelectorAll('.cr-sw-podcast-drop.open').forEach(position),{passive:true});
 addEventListener('scroll',()=>document.querySelectorAll('.cr-sw-podcast-drop.open').forEach(position),{passive:true});
 document.addEventListener('click',e=>{if(!e.target.closest('.cr-sw-podcast-drop'))close()},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
