/* CrowRules Sitewide Universal Shell V5
 * One Account. One Universe.
 * Universal navigation + membership + resilient Supabase auth bridge.
 * Browser-safe, duplicate-loader resistant, bounded startup, accessible menus.
 */
(function(){
'use strict';

if(window.__CrowRulesSitewideV5Booted)return;
window.__CrowRulesSitewideV5Booted=true;

const CONFIG={
  supabaseUrl:'https://cevylpnoexugwgygvtgu.supabase.co',
  supabaseKey:'sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-',
  storageKey:'crowrules-universal-session-v1',
  membership:'https://crowrulesentertainment-oss.github.io/members/',
  home:'https://crowrulesentertainment-oss.github.io/crowrulesentertainment/',
  crowspace:'https://crowrulesentertainment-oss.github.io/crowspace/'
};

const NAV_GROUPS=[
 {label:'UNIVERSE',items:[
  ['CrowRules Home',CONFIG.home],
  ['CrowSpace',CONFIG.crowspace+'home.html'],
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

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const withTimeout=(promise,ms,label)=>{
 let timer;
 return Promise.race([
   Promise.resolve(promise),
   new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(label||'Timed out')),ms)})
 ]).finally(()=>clearTimeout(timer));
};

function loadSDK(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 const existing=document.querySelector('script[data-crowrules-supabase-sdk]');
 if(existing){
  return withTimeout(new Promise((resolve,reject)=>{
   if(window.supabase?.createClient)return resolve(window.supabase);
   const ok=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error('Supabase SDK loaded without client'));
   existing.addEventListener('load',ok,{once:true});
   existing.addEventListener('error',()=>reject(new Error('Supabase SDK failed')), {once:true});
  }),10000,'Supabase SDK load timed out');
 }
 return withTimeout(new Promise((resolve,reject)=>{
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.async=true;
  s.dataset.crowrulesSupabaseSdk='true';
  s.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error('Supabase SDK loaded without client'));
  s.onerror=()=>reject(new Error('Supabase SDK failed to load'));
  document.head.appendChild(s);
 }),10000,'Supabase SDK load timed out');
}

function css(){
 if(document.getElementById('cr-sitewide-css'))return;
 const s=document.createElement('style');
 s.id='cr-sitewide-css';
 s.textContent=`
.cr-sitewide{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(3,4,10,.97);backdrop-filter:blur(18px);border-bottom:1px solid rgba(120,239,255,.18);font:700 11px Arial,sans-serif}
.cr-sw-in{max-width:1500px;margin:auto;min-height:52px;display:flex;align-items:center;gap:7px;padding:6px 14px}
.cr-sw-brand{font:900 14px Arial;color:#fff;text-decoration:none;white-space:nowrap;margin-right:3px}.cr-sw-brand b{color:#78efff}
.cr-sw-nav{display:flex;align-items:center;gap:4px;overflow:visible;flex:1;min-width:0}
.cr-sw-drop{position:relative;flex:none}.cr-sw-drop>button{color:#cbd5e1;padding:8px 10px;border:1px solid transparent;border-radius:8px;background:transparent;font:800 10px Arial;white-space:nowrap;cursor:pointer}
.cr-sw-drop>button:hover,.cr-sw-drop.open>button{border-color:#78efff33;background:#78efff0d;color:#fff}
.cr-sw-drop>button .chev{font-size:9px;color:#78efff;margin-left:3px}
.cr-sw-menu{position:fixed;z-index:100002;min-width:210px;max-width:calc(100vw - 20px);padding:7px;background:rgba(7,11,22,.99);border:1px solid #78efff55;border-radius:12px;display:none;gap:3px;box-shadow:0 20px 60px #000b;max-height:calc(100vh - 80px);overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.cr-sw-drop.open>.cr-sw-menu{display:grid}
.cr-sw-menu .cr-sw-heading{padding:6px 9px 4px;color:#78efff;font-size:8px;letter-spacing:.15em}
.cr-sw-menu a,.cr-sw-menu button{display:block;width:100%;padding:10px 9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer;font:700 10px Arial}
.cr-sw-menu a:hover,.cr-sw-menu button:hover,.cr-sw-menu a:focus-visible,.cr-sw-menu button:focus-visible{background:#78efff0d;outline:none}
.cr-sw-menu a.cr-sw-current{background:#78efff12;color:#78efff}
.cr-sw-membership{border-color:#78efff44!important;background:linear-gradient(135deg,#087e98aa,#654bb3aa)!important;color:#fff!important}
.cr-sw-close{color:#cbd5e1;padding:8px 9px;border:1px solid #78efff22;border-radius:8px;background:transparent;font:900 13px Arial;line-height:1;cursor:pointer;flex:none}.cr-sw-close:hover,.cr-sw-close:focus-visible{color:#fff;border-color:#78efff55;background:#78efff0d;outline:none}
.cr-sw-account{margin-left:auto;color:#fff;padding:8px 10px;border:1px solid #78efff33;border-radius:8px;background:transparent;font:800 10px Arial;white-space:nowrap;cursor:pointer}
.cr-sw-account:hover,.cr-sw-account:focus-visible{background:#78efff0d;outline:none}
.cr-sw-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#6affaa;box-shadow:0 0 8px #6affaa;margin-right:6px}
.cr-sw-dot.offline{background:#ffb86b;box-shadow:0 0 8px #ffb86b}
.cr-sw-account-menu{position:fixed;right:14px;top:60px;z-index:100003;min-width:230px;padding:7px;background:#070b16;border:1px solid #78efff33;border-radius:12px;display:none;gap:3px;box-shadow:0 20px 60px #000b}
.cr-sw-account-menu.open{display:grid}
.cr-sw-account-menu a,.cr-sw-account-menu button{padding:10px 9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer;font:700 10px Arial}
.cr-sw-account-menu a:hover,.cr-sw-account-menu button:hover{background:#78efff0d}
.cr-sw-account-menu .membership-link{color:#78efff}.cr-sw-divider{height:1px;background:#ffffff12;margin:3px 4px}
.cr-sw-status{padding:8px 9px 5px;color:#8fa2b8;font:700 9px Arial;line-height:1.4}
body{scroll-padding-top:70px}.cr-sitewide.cr-sw-hidden{display:none}.cr-sw-reopen{position:fixed;top:10px;right:10px;z-index:99998;display:none;padding:8px 11px;border:1px solid #78efff44;border-radius:9px;background:rgba(3,4,10,.96);color:#78efff;font:800 10px Arial;cursor:pointer;box-shadow:0 10px 30px #0008}.cr-sw-reopen:hover,.cr-sw-reopen:focus-visible{background:#78efff12;color:#fff;outline:none}.cr-sw-nav-closed{scroll-padding-top:20px}
@media(max-width:850px){.cr-sw-in{flex-wrap:wrap}.cr-sw-nav{order:3;flex-basis:100%;overflow-x:auto;overflow-y:visible;padding-bottom:2px;scrollbar-width:none}.cr-sw-nav::-webkit-scrollbar{display:none}.cr-sw-account{margin-left:auto}.cr-sw-drop>button{font-size:9px;padding:7px 8px}.cr-sw-brand{font-size:13px}}
@media(max-width:520px){.cr-sw-in{padding:6px 9px}.cr-sw-brand{font-size:12px}.cr-sw-account{font-size:9px;padding:7px 8px}.cr-sw-account-menu{right:9px;top:56px;width:calc(100vw - 18px)}}
`;
 document.head.appendChild(s);
}

function loadPodcastingNavigation(){
 if(!location.pathname.includes('/podcasting/'))return;
 if(window.__CrowRulesPodcastingNavV3)return;
 if(document.querySelector('script[data-crowrules-podcasting-nav]'))return;
 const s=document.createElement('script');
 s.src='https://crowrulesentertainment-oss.github.io/crowrulesentertainment/js/crowrules-podcasting-nav.js?v=3';
 s.defer=true;
 s.dataset.crowrulesPodcastingNav='true';
 s.onload=()=>window.dispatchEvent(new CustomEvent('crowrules-podcasting-nav-ready'));
 s.onerror=()=>console.warn('[CrowRules sitewide] Podcasting navigation failed to load');
 document.head.appendChild(s);
}

function closeDrops(except){
 document.querySelectorAll('.cr-sw-drop.open').forEach(x=>{
  if(x!==except){x.classList.remove('open');x.querySelector(':scope>button')?.setAttribute('aria-expanded','false')}
 });
}

function positionDrop(drop){
 const btn=drop.querySelector(':scope>button'),menu=drop.querySelector(':scope>.cr-sw-menu');
 if(!btn||!menu)return;
 const r=btn.getBoundingClientRect(),w=Math.min(320,window.innerWidth-20);
 let left=Math.max(10,Math.min(r.left,window.innerWidth-w-10));
 let top=r.bottom+7;
 const h=Math.min(menu.scrollHeight||180,window.innerHeight-20);
 if(top+h>window.innerHeight&&r.top>h)top=Math.max(10,r.top-h-7);
 menu.style.left=left+'px';menu.style.top=top+'px';
}

function wireDropdowns(nav){
 nav.querySelectorAll('.cr-sw-drop>button').forEach(btn=>{
  btn.onclick=e=>{
   e.stopPropagation();
   const p=btn.parentElement,open=p.classList.contains('open');
   closeDrops(p);p.classList.toggle('open',!open);btn.setAttribute('aria-expanded',String(!open));
   if(!open){requestAnimationFrame(()=>positionDrop(p));}
  };
  btn.onkeydown=e=>{
   if(e.key==='Escape'){closeDrops();btn.focus()}
   if(e.key==='ArrowDown'){e.preventDefault();btn.click();setTimeout(()=>btn.parentElement.querySelector('.cr-sw-menu a,.cr-sw-menu button')?.focus(),0)}
  };
 });
 nav.querySelectorAll('.cr-sw-menu a,.cr-sw-menu button').forEach(i=>i.onkeydown=e=>{
  if(e.key==='Escape'){const p=i.closest('.cr-sw-drop');closeDrops();p?.querySelector(':scope>button')?.focus()}
 });
}

function isCurrent(url){
 try{
  const a=new URL(url,location.href),b=new URL(location.href);
  return a.origin===b.origin && (a.pathname==='/'?b.pathname==='/':b.pathname.startsWith(a.pathname));
 }catch{return false}
}

function menuLink(label,url){
 return '<a role="menuitem" href="'+esc(url)+'"'+(isCurrent(url)?' class="cr-sw-current" aria-current="page"':'')+'>'+esc(label)+'</a>';
}

function renderAccount(menu,u,status){
 const signed=!!u && !!u.id;
 const onPodcasting=location.pathname.includes('/podcasting/');
 const profileBase=onPodcasting?'https://crowrulesentertainment-oss.github.io/podcasting/member-profile.html':CONFIG.crowspace+'profile.html';
 const profileUrl=signed?profileBase+'?user='+encodeURIComponent(u.id):profileBase;
 const accountUrl=onPodcasting?'https://crowrulesentertainment-oss.github.io/podcasting/account.html':CONFIG.crowspace+'account.html';
 menu.innerHTML=signed
  ? '<a class="membership-link" href="'+CONFIG.membership+'">✦ Membership Center</a><a href="'+profileUrl+'">◉ My Profile</a><a href="'+accountUrl+'">⚙ Account</a><a href="'+CONFIG.crowspace+'settings.html">◌ Settings</a><div class="cr-sw-status">Signed in as '+esc(u.email||u.user_metadata?.display_name||'CrowRules member')+'</div><div class="cr-sw-divider"></div><button id="cr-sw-out" type="button">↪ Sign Out</button>'
  : '<a class="membership-link" href="'+CONFIG.membership+'">✦ Explore Membership</a><a href="'+CONFIG.crowspace+'login.html">Log In</a><a href="'+CONFIG.crowspace+'signup.html">Create Universal Account</a><div class="cr-sw-status">'+esc(status||'Universal account ready')+'</div>';
}

function mount(state){
 css();
 let bar=document.querySelector('.cr-sitewide');
 if(!bar){
  bar=document.createElement('div');
  bar.className='cr-sitewide';
  bar.innerHTML='<div class="cr-sw-in"><a class="cr-sw-brand" href="'+CONFIG.home+'">CROW<b>RULES</b></a><nav class="cr-sw-nav" aria-label="CrowRules universal navigation"></nav><button class="cr-sw-close" id="cr-sw-close" type="button" aria-label="Close Universal CrowRules Membership navigation" title="Close navigation">×</button><button class="cr-sw-account" id="cr-sw-account" type="button" aria-haspopup="true" aria-expanded="false"><span class="cr-sw-dot"></span><span>CONNECTING</span></button></div>';
  document.body.prepend(bar);
 }
 const nav=bar.querySelector('.cr-sw-nav');
 const reopen=(()=>{let r=document.querySelector('.cr-sw-reopen');if(!r){r=document.createElement('button');r.className='cr-sw-reopen';r.id='cr-sw-reopen';r.type='button';r.textContent='CROWRULES MENU';r.setAttribute('aria-label','Reopen Universal CrowRules Membership navigation');document.body.appendChild(r)}return r})();
 const closed=localStorage.getItem('crowrules-sitewide-nav-closed')==='1';
 bar.classList.toggle('cr-sw-hidden',closed);document.body.classList.toggle('cr-sw-nav-closed',closed);reopen.style.display=closed?'block':'none';
 reopen.onclick=()=>{localStorage.removeItem('crowrules-sitewide-nav-closed');bar.classList.remove('cr-sw-hidden');document.body.classList.remove('cr-sw-nav-closed');reopen.style.display='none';};
 nav.innerHTML=NAV_GROUPS.map(g=>'<div class="cr-sw-drop"><button type="button" aria-haspopup="true" aria-expanded="false">'+esc(g.label)+' <span class="chev" aria-hidden="true">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">'+esc(g.label)+'</div>'+g.items.map(x=>menuLink(x[0],x[1])).join('')+'</div></div>').join('')
  +'<div class="cr-sw-drop"><button class="cr-sw-membership" type="button" aria-haspopup="true" aria-expanded="false">MEMBERSHIP <span class="chev" aria-hidden="true">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">UNIVERSAL MEMBERSHIP</div>'+menuLink('Membership Home',CONFIG.membership)+menuLink('Membership Plans',CONFIG.membership+'#plans')+menuLink('Benefits',CONFIG.membership+'#benefits')+menuLink('FAQ',CONFIG.membership+'#faq')+menuLink('My Account',CONFIG.crowspace+'account.html')+'</div></div>';
 wireDropdowns(nav);

 const closeBtn=bar.querySelector('#cr-sw-close');
 closeBtn.onclick=()=>{bar.classList.add('cr-sw-hidden');document.body.classList.add('cr-sw-nav-closed');localStorage.setItem('crowrules-sitewide-nav-closed','1');document.querySelector('.cr-sw-account-menu')?.classList.remove('open')};
 const btn=bar.querySelector('#cr-sw-account');
 const signed=!!state.user;
 btn.innerHTML='<span class="cr-sw-dot'+(state.error?' offline':'')+'"></span><span>'+esc(signed?'MEMBER':state.error?'OFFLINE':'LOG IN / JOIN')+'</span>';
 btn.setAttribute('aria-label',signed?'Open CrowRules account menu':'Open CrowRules login menu');

 let menu=document.querySelector('.cr-sw-account-menu');
 if(!menu){menu=document.createElement('div');menu.className='cr-sw-account-menu';document.body.appendChild(menu)}
 renderAccount(menu,state.user,state.error?'Connection unavailable — navigation remains available.':'One Account. One Universe.');
 btn.onclick=e=>{e.stopPropagation();const open=menu.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));if(open)closeDrops()};
 menu.querySelector('#cr-sw-out')?.addEventListener('click',async()=>{
  btn.disabled=true;
  try{await withTimeout(state.client?.auth.signOut({scope:'global'}),10000,'Sign out timed out')}catch(err){console.warn('[CrowRules sitewide] sign out',err)}finally{location.reload()}
 });
}

function installGlobalEvents(){
 if(window.__crowRulesGlobalNavEvents)return;
 window.__crowRulesGlobalNavEvents=true;
 document.addEventListener('click',e=>{
  if(!e.target.closest('.cr-sw-drop'))closeDrops();
  if(!e.target.closest('#cr-sw-account')&&!e.target.closest('.cr-sw-account-menu'))document.querySelector('.cr-sw-account-menu')?.classList.remove('open');
 },{passive:true});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeDrops();const m=document.querySelector('.cr-sw-account-menu');m?.classList.remove('open');document.querySelector('#cr-sw-account')?.setAttribute('aria-expanded','false')}
 });
 const reposition=()=>document.querySelectorAll('.cr-sw-drop.open').forEach(positionDrop);
 window.addEventListener('resize',reposition,{passive:true});
 window.addEventListener('scroll',reposition,{passive:true});
 window.addEventListener('orientationchange',()=>setTimeout(reposition,50),{passive:true});
}

async function boot(){
 css();installGlobalEvents();mount({user:null,session:null,client:null});\n loadPodcastingNavigation();
 try{
  let db=null,session=null,user=null;

  if(window.CrowSpaceAuth?.ready){
   try{
    await withTimeout(window.CrowSpaceAuth.ready,12000,'CrowSpace auth timed out');
    db=window.CrowSpaceAuth.client||null;
    session=window.CrowSpaceAuth.session||null;
    user=window.CrowSpaceAuth.user||session?.user||null;
   }catch(e){console.warn('[CrowRules sitewide] shared auth unavailable',e)}
  }

  if(!db){
   const sdk=await loadSDK();
   db=sdk.createClient(CONFIG.supabaseUrl,CONFIG.supabaseKey,{
    auth:{
     autoRefreshToken:true,
     persistSession:true,
     detectSessionInUrl:true,
     flowType:'pkce',
     storageKey:CONFIG.storageKey,
     storage:window.localStorage
    }
   });
   const result=await withTimeout(db.auth.getSession(),12000,'Auth session lookup timed out');
   session=result.data?.session||null;
   user=session?.user||null;
  }

  window.CrowRulesAuth=window.CrowRulesAuth||{};
  Object.assign(window.CrowRulesAuth,{client:db,session,user,ready:Promise.resolve(db)});
  mount({client:db,session,user});

  if(!window.__CrowRulesSitewideAuthBound){
   window.__CrowRulesSitewideAuthBound=true;
   const {data}=db.auth.onAuthStateChange((event,nextSession)=>{
    const nextUser=nextSession?.user||null;
    window.CrowRulesAuth.session=nextSession||null;
    window.CrowRulesAuth.user=nextUser;
    mount({client:db,session:nextSession||null,user:nextUser});
    window.dispatchEvent(new CustomEvent('crowrules-auth',{detail:{event,session:nextSession||null,user:nextUser}}));
   });
   window.CrowRulesAuth.subscription=data?.subscription||null;
  }
 }catch(e){
  console.warn('[CrowRules sitewide]',e);
  window.CrowRulesAuth=window.CrowRulesAuth||{client:null,session:null,user:null,ready:Promise.resolve(null)};
  mount({client:null,session:null,user:null,error:e?.message||'Connection unavailable'});
 }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();