/* CrowRules Podcasting Navigation V2
 * Context-aware Podcasting command center.
 * Listener / Creator / Admin views are selected from the Universal session.
 * Safe to load sitewide; activates only inside /podcasting/.
 */
(()=>{
'use strict';
if(window.__CrowRulesPodcastingNavV2)return;
window.__CrowRulesPodcastingNavV2=true;

const BASE='https://crowrulesentertainment-oss.github.io/podcasting/';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const GROUPS={
 listener:{title:'LISTENER',items:[
  ['Podcasts','podcasts.html'],['Discover','discover.html'],['Following','following.html'],['Favorites','favorites.html'],['Listening History','history.html']
 ]},
 creator:{title:'CREATOR',items:[
  ['My Shows','my-shows.html'],['Episodes','episodes.html'],['Create a Podcast','create-podcast.html'],['Studio','admin.html'],['Analytics','analytics.html'],['Earnings','earnings.html']
 ]},
 admin:{title:'ADMIN',items:[
  ['Admin Center','admin.html'],['Moderation','moderation.html'],['Publishing','publishing.html'],['Health','health.html'],['Analytics','analytics.html']
 ]}
};

function current(url){try{return new URL(url,location.href).pathname===location.pathname}catch{return false}}
function roleFromSession(session){
 const u=session?.user;
 if(!u)return 'listener';
 const m=u.user_metadata||{},app=u.app_metadata||{};
 const roles=[m.role,m.account_role,m.user_role,m.podcast_role,m.podcasting_role,app.role,app.account_role,app.user_role,app.podcast_role,app.podcasting_role].filter(Boolean).map(x=>String(x).toLowerCase());
 if(roles.some(x=>['admin','administrator','super_admin','superadmin','owner'].includes(x)))return 'admin';
 if(roles.some(x=>['creator','podcaster','host','producer','podcasting_creator'].includes(x))||m.podcasting_creator===true)return 'creator';
 return 'listener';
}
function session(){
 try{return window.CrowRulesAuth?.session||window.CrowRulesAuth?.user?{user:window.CrowRulesAuth.user}:null}catch{return null}
}
function getSession(){
 if(window.CrowRulesAuth?.client?.auth?.getSession)return window.CrowRulesAuth.client.auth.getSession().then(r=>r.data?.session||null).catch(()=>session());
 return Promise.resolve(session());
}
function position(drop){
 const b=drop.querySelector(':scope>button'),m=drop.querySelector(':scope>.cr-sw-menu');if(!b||!m)return;
 const r=b.getBoundingClientRect(),w=Math.min(330,innerWidth-20);let left=Math.max(10,Math.min(r.left,innerWidth-w-10));let top=r.bottom+7;
 const h=Math.min(m.scrollHeight||260,innerHeight-20);if(top+h>innerHeight&&r.top>h)top=Math.max(10,r.top-h-7);m.style.left=left+'px';m.style.top=top+'px';
}
function close(except){document.querySelectorAll('.cr-sw-podcast-drop.open').forEach(x=>{if(x!==except){x.classList.remove('open');x.querySelector(':scope>button')?.setAttribute('aria-expanded','false')}})}
function makeMenu(role){
 const g=GROUPS[role]||GROUPS.listener;
 const items=g.items.map(([label,path])=>{const url=BASE+path;return '<a role="menuitem" href="'+esc(url)+'"'+(current(url)?' class="cr-sw-current" aria-current="page"':'')+'>'+esc(label)+'</a>'}).join('');
 return '<div class="cr-sw-heading">'+esc(g.title)+' COMMAND CENTER</div>'+items;
}
function mount(role){
 if(!location.pathname.includes('/podcasting/'))return;
 const nav=document.querySelector('.cr-sw-nav');if(!nav)return;
 let drop=nav.querySelector('.cr-sw-podcast-drop');
 if(!drop){drop=document.createElement('div');drop.className='cr-sw-drop cr-sw-podcast-drop';nav.appendChild(drop)}
 drop.dataset.role=role;drop.innerHTML='<button type="button" aria-haspopup="true" aria-expanded="false">PODCASTING <span class="chev" aria-hidden="true">▾</span></button><div class="cr-sw-menu" role="menu">'+makeMenu(role)+'</div>';
 const btn=drop.querySelector(':scope>button');
 btn.onclick=e=>{e.stopPropagation();const open=drop.classList.contains('open');close(drop);drop.classList.toggle('open',!open);btn.setAttribute('aria-expanded',String(!open));if(!open)requestAnimationFrame(()=>position(drop))};
 btn.onkeydown=e=>{if(e.key==='Escape'){close();btn.focus()}if(e.key==='ArrowDown'){e.preventDefault();btn.click();setTimeout(()=>drop.querySelector('.cr-sw-menu a')?.focus(),0)}};
 drop.querySelectorAll('.cr-sw-menu a').forEach(a=>a.onkeydown=e=>{if(e.key==='Escape'){close();btn.focus()}});
}
async function refresh(){
 if(!location.pathname.includes('/podcasting/'))return;
 const s=await getSession();mount(roleFromSession(s));
}
function start(){
 refresh();
 const observer=new MutationObserver(()=>{const nav=document.querySelector('.cr-sw-nav');if(nav){const drop=nav.querySelector('.cr-sw-podcast-drop');if(!drop)refresh()}});
 observer.observe(document.body,{childList:true,subtree:true});
 addEventListener('resize',()=>document.querySelectorAll('.cr-sw-podcast-drop.open').forEach(position),{passive:true});
 addEventListener('scroll',()=>document.querySelectorAll('.cr-sw-podcast-drop.open').forEach(position),{passive:true});
 document.addEventListener('click',e=>{if(!e.target.closest('.cr-sw-podcast-drop'))close()},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 window.addEventListener('crowrules-auth',refresh);
 window.addEventListener('storage',e=>{if(e.key)refresh()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
