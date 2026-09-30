/* CrowRules Sitewide Account Bridge V3
 * Universal navigation + membership across CrowRules GitHub Pages.
 * One Account. One Universe.
 * Fixed dropdowns for desktop/mobile + safer global event handling.
 */
(function(){
'use strict';
const SUPABASE_URL='https://cevylpnoexugwgygvtgu.supabase.co';
const SUPABASE_KEY='sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-';
const STORAGE_KEY='crowrules-universal-session-v1';
const MEMBERSHIP='https://crowrulesentertainment-oss.github.io/members/';
const NAV_GROUPS=[
 {label:'UNIVERSE',items:[
  ['CrowRules Home','https://crowrulesentertainment-oss.github.io/crowrulesentertainment/'],
  ['CrowSpace','https://crowrulesentertainment-oss.github.io/crowspace/home.html'],
  ['CrowRules TV','https://crowrulesentertainment-oss.github.io/crowrulestv/'],
  ['Sports','https://crowrulesentertainment-oss.github.io/sports/']
 ]},
 {label:'STORIES',items:[
  ['Dreamscapes','https://crowrulesentertainment-oss.github.io/dreamscapes/'],
  ['Podcasting','https://crowrulesentertainment-oss.github.io/podcasting/'],
  ['Memorials','https://crowrulesentertainment-oss.github.io/memorials/']
 ]},
 {label:'COMMUNITY',items:[
  ['Spectrum Awards','https://crowrulesentertainment-oss.github.io/spectrum/'],
  ['Yearbooks','https://crowrulesentertainment-oss.github.io/yearbooks/'],
  ['Records','https://crowrulesentertainment-oss.github.io/records/']
 ]}
];
function loadSDK(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=()=>resolve(window.supabase);s.onerror=reject;document.head.appendChild(s)});
}
function css(){
 if(document.getElementById('cr-sitewide-css'))return;
 const s=document.createElement('style');s.id='cr-sitewide-css';s.textContent=`
.cr-sitewide{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(3,4,10,.96);backdrop-filter:blur(18px);border-bottom:1px solid rgba(120,239,255,.18);font:700 11px Arial,sans-serif}
.cr-sw-in{max-width:1500px;margin:auto;min-height:52px;display:flex;align-items:center;gap:7px;padding:6px 14px}
.cr-sw-brand{font:900 14px Arial;color:#fff;text-decoration:none;white-space:nowrap;margin-right:3px}.cr-sw-brand b{color:#78efff}
.cr-sw-nav{display:flex;align-items:center;gap:4px;overflow:visible;flex:1;min-width:0}
.cr-sw-drop{position:relative;flex:none}.cr-sw-drop>button{color:#cbd5e1;padding:8px 10px;border:1px solid transparent;border-radius:8px;background:transparent;font:800 10px Arial;white-space:nowrap;cursor:pointer}
.cr-sw-drop>button:hover,.cr-sw-drop.open>button{border-color:#78efff33;background:#78efff0d;color:#fff}
.cr-sw-drop>button .chev{font-size:9px;color:#78efff;margin-left:3px}
.cr-sw-menu{position:fixed;z-index:100002;min-width:210px;max-width:calc(100vw - 20px);padding:7px;background:rgba(7,11,22,.99);border:1px solid #78efff55;border-radius:12px;display:none;gap:3px;box-shadow:0 20px 60px #000b;max-height:calc(100vh - 80px);overflow:auto}
.cr-sw-drop.open>.cr-sw-menu{display:grid}
.cr-sw-menu .cr-sw-heading{padding:6px 9px 4px;color:#78efff;font-size:8px;letter-spacing:.15em}
.cr-sw-menu a,.cr-sw-menu button{display:block;width:100%;padding:10px 9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer;font:700 10px Arial}
.cr-sw-menu a:hover,.cr-sw-menu button:hover,.cr-sw-menu a:focus-visible,.cr-sw-menu button:focus-visible{background:#78efff0d;outline:none}
.cr-sw-membership{border-color:#78efff44!important;background:linear-gradient(135deg,#087e98aa,#654bb3aa)!important;color:#fff!important}
.cr-sw-account{margin-left:auto;color:#fff;padding:8px 10px;border:1px solid #78efff33;border-radius:8px;background:transparent;font:800 10px Arial;white-space:nowrap;cursor:pointer}
.cr-sw-account:hover,.cr-sw-account:focus-visible{background:#78efff0d;outline:none}
.cr-sw-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#6affaa;box-shadow:0 0 8px #6affaa;margin-right:6px}
.cr-sw-account-menu{position:fixed;right:14px;top:60px;z-index:100003;min-width:230px;padding:7px;background:#070b16;border:1px solid #78efff33;border-radius:12px;display:none;gap:3px;box-shadow:0 20px 60px #000b}
.cr-sw-account-menu.open{display:grid}
.cr-sw-account-menu a,.cr-sw-account-menu button{padding:10px 9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer;font:700 10px Arial}.cr-sw-account-menu a:hover,.cr-sw-account-menu button:hover{background:#78efff0d}
.cr-sw-account-menu .membership-link{color:#78efff}.cr-sw-divider{height:1px;background:#ffffff12;margin:3px 4px}
@media(max-width:850px){.cr-sw-in{flex-wrap:wrap}.cr-sw-nav{order:3;flex-basis:100%;overflow-x:auto;overflow-y:visible;padding-bottom:2px;scrollbar-width:none}.cr-sw-nav::-webkit-scrollbar{display:none}.cr-sw-account{margin-left:auto}.cr-sw-drop>button{font-size:9px;padding:7px 8px}.cr-sw-brand{font-size:13px}}
@media(max-width:520px){.cr-sw-in{padding:6px 9px}.cr-sw-brand{font-size:12px}.cr-sw-account{font-size:9px;padding:7px 8px}.cr-sw-account-menu{right:9px;top:56px;width:calc(100vw - 18px)}}
`;
 document.head.appendChild(s);
}
function groupMarkup(g){return '<div class="cr-sw-drop"><button type="button" aria-haspopup="true" aria-expanded="false">'+g.label+' <span class="chev" aria-hidden="true">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">'+g.label+'</div>'+g.items.map(d=>'<a role="menuitem" href="'+d[1]+'">'+d[0]+'</a>').join('')+'</div></div>'}
function closeDrops(except){document.querySelectorAll('.cr-sw-drop.open').forEach(x=>{if(x!==except){x.classList.remove('open');x.querySelector(':scope>button')?.setAttribute('aria-expanded','false')}})}
function positionDrop(drop){
 const btn=drop.querySelector(':scope>button'),menu=drop.querySelector(':scope>.cr-sw-menu');if(!btn||!menu)return;
 const r=btn.getBoundingClientRect(),w=Math.min(320,window.innerWidth-20);let left=r.left;if(left+w>window.innerWidth-10)left=window.innerWidth-w-10;if(left<10)left=10;
 let top=r.bottom+7;if(top+180>window.innerHeight&&r.top>180)top=Math.max(10,r.top-180);
 menu.style.left=left+'px';menu.style.top=top+'px';
}
function wireDropdowns(nav){
 nav.querySelectorAll('.cr-sw-drop>button').forEach(btn=>{btn.onclick=e=>{e.stopPropagation();const p=btn.parentElement,open=p.classList.contains('open');closeDrops(p);p.classList.toggle('open',!open);btn.setAttribute('aria-expanded',String(!open));if(!open)positionDrop(p)};btn.onkeydown=e=>{if(e.key==='Escape'){closeDrops();btn.focus()}if(e.key==='ArrowDown'){e.preventDefault();btn.click();setTimeout(()=>btn.parentElement.querySelector('.cr-sw-menu a')?.focus(),0)}}});
 nav.querySelectorAll('.cr-sw-menu a,.cr-sw-menu button').forEach(i=>i.onkeydown=e=>{if(e.key==='Escape'){const p=i.closest('.cr-sw-drop');closeDrops();p?.querySelector(':scope>button')?.focus()}});
}
function mount(){
 let bar=document.querySelector('.cr-sitewide');
 if(!bar){bar=document.createElement('div');bar.className='cr-sitewide';bar.innerHTML='<div class="cr-sw-in"><a class="cr-sw-brand" href="'+MEMBERSHIP.replace('/members/','/')+'">CROW<b>RULES</b></a><nav class="cr-sw-nav" aria-label="CrowRules universal navigation"></nav><button class="cr-sw-account" id="cr-sw-account" type="button"><span class="cr-sw-dot"></span><span>CONNECTING</span></button></div>';document.body.prepend(bar)}
 const nav=bar.querySelector('.cr-sw-nav');
 nav.innerHTML=NAV_GROUPS.map(groupMarkup).join('')+'<div class="cr-sw-drop"><button class="cr-sw-membership" type="button" aria-haspopup="true" aria-expanded="false">MEMBERSHIP <span class="chev" aria-hidden="true">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">UNIVERSAL MEMBERSHIP</div><a role="menuitem" href="'+MEMBERSHIP+'">Membership Home</a><a role="menuitem" href="'+MEMBERSHIP+'#plans">Membership Plans</a><a role="menuitem" href="'+MEMBERSHIP+'#benefits">Benefits</a><a role="menuitem" href="'+MEMBERSHIP+'#faq">FAQ</a><a role="menuitem" href="https://crowrulesentertainment-oss.github.io/crowspace/account.html">My Account</a></div></div>';
 wireDropdowns(nav);
 const u=window.CrowRulesAuth?.user,btn=bar.querySelector('#cr-sw-account');btn.innerHTML='<span class="cr-sw-dot"></span><span>'+(u?'MEMBER':'LOG IN / JOIN')+'</span>';
 let menu=document.querySelector('.cr-sw-account-menu');if(!menu){menu=document.createElement('div');menu.className='cr-sw-account-menu';document.body.appendChild(menu)}
 menu.innerHTML=u?'<a class="membership-link" href="'+MEMBERSHIP+'">✦ Membership Center</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/profile.html">◉ My Profile</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/account.html">⚙ Account</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/settings.html">◌ Settings</a><div class="cr-sw-divider"></div><button id="cr-sw-out" type="button">↪ Sign Out</button>':'<a class="membership-link" href="'+MEMBERSHIP+'">✦ Explore Membership</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/login.html">Log In</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/signup.html">Create Universal Account</a>';
 btn.onclick=e=>{e.stopPropagation();menu.classList.toggle('open')};btn.onkeydown=e=>{if(e.key==='Escape'){menu.classList.remove('open');btn.focus()}};
 menu.querySelector('#cr-sw-out')?.addEventListener('click',async()=>{await window.CrowRulesAuth.client.auth.signOut({scope:'global'});location.reload()});
 if(!window.__crowRulesGlobalNavEvents){window.__crowRulesGlobalNavEvents=true;
  document.addEventListener('click',e=>{if(!e.target.closest('.cr-sw-drop'))closeDrops();if(!e.target.closest('#cr-sw-account')&&!e.target.closest('.cr-sw-account-menu'))document.querySelector('.cr-sw-account-menu')?.classList.remove('open')},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrops();document.querySelector('.cr-sw-account-menu')?.classList.remove('open')}});
  window.addEventListener('resize',()=>document.querySelectorAll('.cr-sw-drop.open').forEach(positionDrop),{passive:true});
  window.addEventListener('scroll',()=>document.querySelectorAll('.cr-sw-drop.open').forEach(positionDrop),{passive:true});
 }
}
async function boot(){css();try{let db=null,session=null,user=null;const existing=window.CrowSpaceAuth?.ready?await window.CrowSpaceAuth.ready:null;if(existing&&window.CrowSpaceAuth?.client){db=window.CrowSpaceAuth.client;session=window.CrowSpaceAuth.session||null;user=window.CrowSpaceAuth.user||session?.user||null}else{const sdk=await loadSDK();db=sdk.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true,flowType:'pkce',storageKey:STORAGE_KEY,storage:window.localStorage}});const result=await db.auth.getSession();session=result.data?.session||null;user=session?.user||null}window.CrowRulesAuth={client:db,ready:Promise.resolve(db),user,session};mount();db.auth.onAuthStateChange((event,nextSession)=>{window.CrowRulesAuth.session=nextSession||null;window.CrowRulesAuth.user=nextSession?.user||null;mount();window.dispatchEvent(new CustomEvent('crowrules-auth',{detail:{event,session:nextSession||null,user:nextSession?.user||null}}))})}catch(e){console.warn('[CrowRules sitewide]',e);mount()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();