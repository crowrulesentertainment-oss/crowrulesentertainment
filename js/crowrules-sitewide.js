/* CrowRules Sitewide Account Bridge V1
 * Shared across CrowRules GitHub Pages divisions.
 * One Account. One Universe.
 */
(function(){
'use strict';
const SUPABASE_URL='https://cevylpnoexugwgygvtgu.supabase.co';
const SUPABASE_KEY='sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-';
const STORAGE_KEY='crowrules-universal-session-v1';
const DIVISIONS=[
 ['CrowSpace','https://crowrulesentertainment-oss.github.io/crowspace/home.html'],
 ['CrowRules Home','https://crowrulesentertainment-oss.github.io/crowrulesentertainment/'],
 ['CrowRules TV','https://crowrulesentertainment-oss.github.io/crowrulestv/'],
 ['Sports','https://crowrulesentertainment-oss.github.io/sports/'],
 ['Podcasting','https://crowrulesentertainment-oss.github.io/podcasting/'],
 ['Dreamscapes','https://crowrulesentertainment-oss.github.io/dreamscapes/'],
 ['Memorials','https://crowrulesentertainment-oss.github.io/memorials/'],
 ['Spectrum Awards','https://crowrulesentertainment-oss.github.io/spectrum/'],
 ['Yearbooks','https://crowrulesentertainment-oss.github.io/yearbooks/'],
 ['Records','https://crowrulesentertainment-oss.github.io/records/'],
 ['Membership','https://crowrulesentertainment-oss.github.io/members/']
];
function loadSDK(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 return new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=()=>resolve(window.supabase);s.onerror=reject;document.head.appendChild(s);
 });
}
function css(){
 if(document.getElementById('cr-sitewide-css'))return;
 const s=document.createElement('style');s.id='cr-sitewide-css';s.textContent='.cr-sitewide{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(3,4,10,.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(120,239,255,.18);font:700 11px Arial,sans-serif}.cr-sw-in{max-width:1400px;margin:auto;min-height:48px;display:flex;align-items:center;gap:10px;padding:6px 14px}.cr-sw-brand{font:900 13px Arial;color:#fff;text-decoration:none;white-space:nowrap}.cr-sw-brand b{color:#78efff}.cr-sw-divs{display:flex;gap:4px;overflow:auto;flex:1}.cr-sw-divs a,.cr-sw-account{color:#cbd5e1;text-decoration:none;padding:7px 9px;border:1px solid transparent;border-radius:8px;white-space:nowrap;background:transparent}.cr-sw-divs a:hover,.cr-sw-account:hover{border-color:#78efff33;background:#78efff0d;color:#fff}.cr-sw-account{margin-left:auto;border-color:#78efff33;cursor:pointer}.cr-sw-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#6affaa;box-shadow:0 0 8px #6affaa;margin-right:6px}.cr-sw-guest .cr-sw-dot{background:#8996ad;box-shadow:none}.cr-sw-menu{position:fixed;right:14px;top:55px;width:220px;padding:8px;background:#070b16;border:1px solid #78efff33;border-radius:12px;display:none;box-shadow:0 20px 60px #000b}.cr-sw-menu.open{display:grid;gap:3px}.cr-sw-menu a,.cr-sw-menu button{padding:9px;border:0;border-radius:8px;background:transparent;color:#fff;text-align:left;text-decoration:none;cursor:pointer}.cr-sw-menu a:hover,.cr-sw-menu button:hover{background:#78efff0d}@media(max-width:850px){.cr-sw-divs a:nth-child(n+5){display:none}}';
 document.head.appendChild(s);
}
async function boot(){
 css();
 const sdk=await loadSDK();
 const db=sdk.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true,flowType:'pkce',storageKey:STORAGE_KEY,storage:window.localStorage}});
 window.CrowRulesAuth={client:db,ready:Promise.resolve(db),user:null,session:null};
 const {data}=await db.auth.getSession();window.CrowRulesAuth.session=data.session||null;window.CrowRulesAuth.user=data.session?.user||null;
 mount();
 db.auth.onAuthStateChange((event,session)=>{window.CrowRulesAuth.session=session;window.CrowRulesAuth.user=session?.user||null;mount();window.dispatchEvent(new CustomEvent('crowrules-auth',{detail:{event,session,user:session?.user||null}}));});
}
function mount(){
 let bar=document.querySelector('.cr-sitewide');
 if(!bar){bar=document.createElement('div');bar.className='cr-sitewide';bar.innerHTML='<div class="cr-sw-in"><a class="cr-sw-brand" href="https://crowrulesentertainment-oss.github.io/crowrulesentertainment/">CROW<b>RULES</b></a><nav class="cr-sw-divs"></nav><button class="cr-sw-account" id="cr-sw-account"><span class="cr-sw-dot"></span><span>CONNECTING</span></button></div>';document.body.prepend(bar);}
 const nav=bar.querySelector('.cr-sw-divs');nav.innerHTML=DIVISIONS.map(d=>'<a href="'+d[1]+'">'+d[0]+'</a>').join('');
 const u=window.CrowRulesAuth?.user,btn=bar.querySelector('#cr-sw-account');btn.innerHTML='<span class="cr-sw-dot"></span><span>'+(u?'SIGNED IN':'LOG IN')+'</span>';
 let menu=document.querySelector('.cr-sw-menu');if(!menu){menu=document.createElement('div');menu.className='cr-sw-menu';document.body.appendChild(menu);}
 menu.innerHTML=u?'<a href="https://crowrulesentertainment-oss.github.io/crowspace/profile.html">◉ My Profile</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/account.html">⚙ Account</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/settings.html">◌ Settings</a><button id="cr-sw-out">↪ Sign out</button>':'<a href="https://crowrulesentertainment-oss.github.io/crowspace/login.html">Log In</a><a href="https://crowrulesentertainment-oss.github.io/crowspace/signup.html">Create Account</a>';
 btn.onclick=()=>menu.classList.toggle('open');
 document.getElementById('cr-sw-out')?.addEventListener('click',async()=>{await window.CrowRulesAuth.client.auth.signOut({scope:'global'});location.reload();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();