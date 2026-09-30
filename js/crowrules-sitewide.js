/* CrowRules Sitewide Account Bridge V2
 * Universal navigation + membership across CrowRules GitHub Pages.
 * One Account. One Universe.
 */
(function(){
'use strict';
const SUPABASE_URL='https://cevylpnoexugwgygvtgu.supabase.co';
const SUPABASE_KEY='sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-';
const STORAGE_KEY='crowrules-universal-session-v1';

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
const MEMBERSHIP='https://crowrulesentertainment-oss.github.io/members/';

function loadSDK(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 return new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.onload=()=>resolve(window.supabase);s.onerror=reject;document.head.appendChild(s);
 });
}
function css(){
 if(document.getElementById('cr-sitewide-css'))return;
 const s=document.createElement('style');s.id='cr-sitewide-css';s.textContent=`
.cr-sitewide{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(3,4,10,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(120,239,255,.18);font:700 11px Arial,sans-serif}
.cr-sw-in{max-width:1500px;margin:auto;min-height:52px;display:flex;align-items:center;gap:7px;padding:6px 14px}
.cr-sw-brand{font:900 14px Arial;color:#fff;text-decoration:none;white-space:nowrap;margin-right:3px}.cr-sw-brand b{color:#78efff}
.cr-sw-nav{display:flex;align-items:center;gap:4px;overflow:auto;flex:1}
.cr-sw-drop{position:relative;flex:none}.cr-sw-drop>button{color:#cbd5e1;padding:8px 10px;border:1px solid transparent;border-radius:8px;background:transparent;font:800 10px Arial;white-space:nowrap;cursor:pointer}
.cr-sw-drop>button:hover,.cr-sw-drop.open>button{border-color:#78efff33;background:#78efff0d;color:#fff}
.cr-sw-drop>button .chev{font-size:9px;color:#78efff;margin-left:3px}
.cr-sw-menu{position:absolute;top:calc(100% + 7px);left:0;min-width:210px;padding:7px;background:rgba(7,11,22,.99);border:1px solid #78efff33;border-radius:12px;display:none;gap:3px;box-shadow:0 20px 60px #000b}
.cr-sw-drop.open>.cr-sw-menu{display:grid}
.cr-sw-menu .cr-sw-heading{padding:6px 9px 4px;color:#78efff;font-size:8px;letter-spacing:.15em}
.cr-sw-menu a,.cr-sw-menu button{display:block;width:100%;padding:9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer;font:700 10px Arial}
.cr-sw-menu a:hover,.cr-sw-menu button:hover{background:#78efff0d}
.cr-sw-membership{border-color:#78efff44!important;background:linear-gradient(135deg,#087e98aa,#654bb3aa)!important;color:#fff!important}
.cr-sw-account{margin-left:auto;color:#fff;padding:8px 10px;border:1px solid #78efff33;border-radius:8px;background:transparent;font:800 10px Arial;white-space:nowrap;cursor:pointer}
.cr-sw-account:hover{background:#78efff0d}
.cr-sw-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#6affaa;box-shadow:0 0 8px #6affaa;margin-right:6px}.cr-sw-guest .cr-sw-dot{background:#8996ad;box-shadow:none}
.cr-sw-account-menu{position:fixed;right:14px;top:60px;min-width:230px;padding:7px;background:#070b16;border:1px solid #78efff33;border-radius:12px;display:none;gap:3px;box-shadow:0 20px 60px #000b}.cr-sw-account-menu.open{display:grid}
.cr-sw-account-menu a,.cr-sw-account-menu button{padding:9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer;font:700 10px Arial}.cr-sw-account-menu a:hover,.cr-sw-account-menu button:hover{background:#78efff0d}
.cr-sw-account-menu .membership-link{color:#78efff}.cr-sw-divider{height:1px;background:#ffffff12;margin:3px 4px}
@media(max-width:850px){.cr-sw-in{flex-wrap:wrap}.cr-sw-nav{order:3;flex-basis:100%;overflow-x:auto}.cr-sw-account{margin-left:auto}.cr-sw-drop>button{font-size:9px;padding:7px 8px}.cr-sw-brand{font-size:13px}}
@media(max-width:520px){.cr-sw-in{padding:6px 9px}.cr-sw-brand{font-size:12px}.cr-sw-account{font-size:9px;padding:7px 8px}.cr-sw-account-menu{right:9px;top:56px;width:calc(100vw - 18px)}}
`;document.head.appendChild(s);
}
function groupMarkup(g){
 return '<div class="cr-sw-drop"><button type="button" aria-haspopup="true" aria-expanded="false">'+g.label+' <span class="chev">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">'+g.label+'</div>'+g.items.map(d=>'<a href="'+d[1]+'">'+d[0]+'</a>').join('')+'</div></div>';
}
function closeDrops(except){
 document.querySelectorAll('.cr-sw-drop.open').forEach(x=>{if(x!==except){x.classList.remove('open');x.querySelector('button')?.setAttribute('aria-expanded','false')}});
}
function mount(){
 let bar=document.querySelector('.cr-sitewide');
 if(!bar){
  bar=document.createElement('div');bar.className='cr-sitewide';
  bar.innerHTML='<div class="cr-sw-in"><a class="cr-sw-brand" href="'+MEMBERSHIP.replace('/members/','/')+'">CROW<b>RULES</b></a><nav class="cr-sw-nav" aria-label="CrowRules universal navigation"></nav><button class="cr-sw-account" id="cr-sw-account" type="button"><span class="cr-sw-dot"></span><span>CONNECTING</span></button></div>';
  document.body.prepend(bar);
 }
 const nav=bar.querySelector('.cr-sw-nav');
 nav.innerHTML=NAV_GROUPS.map(groupMarkup).join('')+
  '<div class="cr-sw-drop"><button class="cr-sw-membership" type="button" aria-haspopup="true" aria-expanded="false">MEMBERSHIP <span class="chev">▾</span></button><div class="cr-sw-menu" role="menu"><div class="cr-sw-heading">UNIVERSAL MEMBERSHIP</div><a href="'+MEMBERSHIP+'">Membership Home</a><a href="'+MEMBERSHIP+'#plans">Membership Plans</a><a href="'+MEMBERSHIP+'#benefits">Benefits</a><a href="'+MEMBERSHIP+'#faq">FAQ</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/account.html">My Account</a></div></div>';
 nav.querySelectorAll('.cr-sw-drop>button').forEach(btn=>btn.onclick=()=>{const p=btn.parentElement,open=p.classList.contains('open');closeDrops(p);p.classList.toggle('open',!open);btn.setAttribute('aria-expanded',String(!open))});
 const u=window.CrowRulesAuth?.user,btn=bar.querySelector('#cr-sw-account');
 btn.innerHTML='<span class="cr-sw-dot"></span><span>'+(u?'MEMBER':'LOG IN / JOIN')+'</span>';
 let menu=document.querySelector('.cr-sw-account-menu');
 if(!menu){menu=document.createElement('div');menu.className='cr-sw-account-menu';document.body.appendChild(menu)}
 menu.innerHTML=u?
  '<a class="membership-link" href="'+MEMBERSHIP+'">✦ Membership Center</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/profile.html">◉ My Profile</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/account.html">⚙ Account</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/settings.html">◌ Settings</a><div class="cr-sw-divider"></div><button id="cr-sw-out">↪ Sign Out</button>':
  '<a class="membership-link" href="'+MEMBERSHIP+'">✦ Explore Membership</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/login.html">Log In</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/signup.html">Create Universal Account</a>';
 btn.onclick=()=>menu.classList.toggle('open');
 document.getElementById('cr-sw-out')?.addEventListener('click',async()=>{await window.CrowRulesAuth.client.auth.signOut({scope:'global'});location.reload()});
 document.addEventListener('click',e=>{if(!e.target.closest('.cr-sw-drop'))closeDrops();if(!e.target.closest('#cr-sw-account')&&!e.target.closest('.cr-sw-account-menu'))menu.classList.remove('open')},{passive:true});
}
async function boot(){
 css();
 try{
  const sdk=await loadSDK();
  const db=sdk.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true,flowType:'pkce',storageKey:STORAGE_KEY,storage:window.localStorage}});
  window.CrowRulesAuth={client:db,ready:Promise.resolve(db),user:null,session:null};
  const {data}=await db.auth.getSession();
  window.CrowRulesAuth.session=data.session||null;window.CrowRulesAuth.user=data.session?.user||null;
  mount();
  db.auth.onAuthStateChange((event,session)=>{window.CrowRulesAuth.session=session;window.CrowRulesAuth.user=session?.user||null;mount();window.dispatchEvent(new CustomEvent('crowrules-auth',{detail:{event,session,user:session?.user||null}}))});
 }catch(e){console.warn('[CrowRules sitewide]',e);mount()}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();