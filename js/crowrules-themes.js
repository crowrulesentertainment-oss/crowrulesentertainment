/* CrowRules Sitewide Theme Switcher v1
 * Add new entries to THEMES and matching CSS rules to extend themes in future.
 * The original page styling is the default; selected themes persist across CrowRules pages.
 */
(function(){
'use strict';
if(window.__CrowRulesThemeSwitcherLoaded)return;
window.__CrowRulesThemeSwitcherLoaded=true;
const STORAGE_KEY='crowrules-sitewide-theme-v1';
const THEMES=[
 {id:'default',label:'Tacoma Nights · Default',icon:'✦',description:'Original site design'},
 {id:'halloween',label:'Halloween Cinematic',icon:'🎃',description:'Moonlit scenes, fog, bats and autumn leaves'}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function addStyles(){
 if(document.getElementById('cr-theme-system-css'))return;
 const s=document.createElement('style');s.id='cr-theme-system-css';s.textContent=`
.cr-theme-picker{position:fixed;right:14px;bottom:14px;z-index:99990;font:600 12px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;color:#fff}
.cr-theme-toggle{display:flex;align-items:center;gap:9px;min-height:46px;padding:10px 14px;border:1px solid #b9c9d944;border-radius:13px;background:rgba(8,12,20,.94);color:#f4f7fb;box-shadow:0 12px 38px #0008;backdrop-filter:blur(18px);cursor:pointer;font-weight:800}
.cr-theme-toggle:hover,.cr-theme-toggle:focus-visible{border-color:#ffb26b;outline:2px solid #ffb26b30;outline-offset:2px}
.cr-theme-toggle .cr-theme-icon{font-size:17px}.cr-theme-toggle small{display:block;color:#b9c5d2;font-size:9px;font-weight:700;letter-spacing:.1em;text-align:left}
.cr-theme-menu{position:absolute;right:0;bottom:calc(100% + 9px);width:min(300px,calc(100vw - 28px));padding:8px;border:1px solid #ffffff26;border-radius:16px;background:rgba(8,10,15,.97);box-shadow:0 20px 60px #000b;backdrop-filter:blur(20px);display:none;gap:5px}
.cr-theme-picker.open .cr-theme-menu{display:grid}
.cr-theme-menu-title{padding:8px 10px 6px;color:#aebbc9;font-size:9px;font-weight:900;letter-spacing:.17em}
.cr-theme-option{display:flex;align-items:center;gap:11px;width:100%;padding:11px;border:1px solid transparent;border-radius:11px;background:transparent;color:#fff;text-align:left;cursor:pointer}
.cr-theme-option:hover,.cr-theme-option:focus-visible{background:#ffffff0b;border-color:#ffffff18;outline:none}
.cr-theme-option[aria-pressed="true"]{background:#ff9b3d12;border-color:#ff9b3d70}
.cr-theme-option-icon{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:10px;background:#ffffff0c;font-size:17px}
.cr-theme-option-copy{min-width:0;flex:1}.cr-theme-option-copy strong{display:block;font-size:12px}.cr-theme-option-copy small{display:block;margin-top:3px;color:#aebbc9;font-size:10px}
.cr-theme-check{color:#ffb26b;font-size:15px}
.cr-theme-atmosphere{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0;contain:strict}
.cr-theme-atmosphere .cr-moon{position:absolute;top:12vh;right:9vw;width:clamp(65px,9vw,125px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 36% 34%,#fff1d6,#ffc079 42%,#df743b 69%,#6a2a1b 100%);box-shadow:0 0 45px #ff8a3633,0 0 120px #b94d2524;opacity:.68;animation:crMoonGlow 8s ease-in-out infinite}
.cr-theme-atmosphere .cr-fog{position:absolute;left:-25%;width:150%;height:170px;filter:blur(28px);opacity:.18;background:linear-gradient(90deg,transparent,#9d503b,#d39b6b,#65425e,transparent);animation:crFogDrift 25s ease-in-out infinite alternate}
.cr-theme-atmosphere .cr-fog.f2{top:67%;opacity:.12;animation-duration:32s;animation-direction:alternate-reverse}
.cr-theme-atmosphere .cr-bat{position:absolute;left:-12%;top:13%;font-size:24px;color:#050406;text-shadow:0 0 8px #ff9b3d22;animation:crBatFlight 24s linear infinite}
.cr-theme-atmosphere .cr-bat.b2{top:25%;font-size:16px;animation-duration:31s;animation-delay:-13s;opacity:.8}
.cr-theme-atmosphere .cr-leaf{position:absolute;top:-8%;left:17%;font-size:18px;opacity:.65;animation:crLeafFall 18s linear infinite}
.cr-theme-atmosphere .cr-leaf.l2{left:43%;animation-delay:-7s;animation-duration:23s}.cr-theme-atmosphere .cr-leaf.l3{left:78%;animation-delay:-12s;animation-duration:20s}
.cr-theme-atmosphere .cr-jack{position:absolute;bottom:5%;left:2%;font-size:clamp(24px,3vw,42px);filter:drop-shadow(0 0 16px #ff7c2b66);animation:crJackGlow 4s ease-in-out infinite}
.cr-theme-atmosphere .cr-jack.j2{left:auto;right:3%;bottom:10%;font-size:clamp(19px,2.4vw,32px);animation-delay:-2s}

/* Cross-page theme tokens and generic components: lets the selected theme follow users beyond one specific page layout. */
:root{--cr-theme-accent:#78efff;--cr-theme-accent-soft:rgba(120,239,255,.14);--cr-theme-panel:rgba(8,12,20,.88);--cr-theme-border:rgba(120,239,255,.24);--cr-theme-ink:#eef6ff;--cr-theme-muted:#a9b8ca;--cr-theme-glow:rgba(120,239,255,.12)}
body.cr-theme-default{--cr-theme-accent:#78efff;--cr-theme-accent-soft:rgba(120,239,255,.14);--cr-theme-panel:rgba(8,12,20,.88);--cr-theme-border:rgba(120,239,255,.24);--cr-theme-ink:#eef6ff;--cr-theme-muted:#a9b8ca;--cr-theme-glow:rgba(120,239,255,.12)}
body.cr-theme-halloween{--cr-theme-accent:#ffad55;--cr-theme-accent-soft:rgba(255,155,61,.14);--cr-theme-panel:rgba(22,12,12,.92);--cr-theme-border:rgba(255,155,61,.28);--cr-theme-ink:#fff2e6;--cr-theme-muted:#c5ad9e;--cr-theme-glow:rgba(255,119,46,.15)}
body.cr-theme-halloween :is(header,nav,aside,footer,.header,.navbar,.navigation,.site-nav,.site-header,.site-footer,.topbar,.top-bar,.sidebar,.panel,.card,.tile,.modal,.dialog,.dropdown-menu,.menu-panel,.content-card,.section-card,.feature-card,.widget,.chat-panel,.chat-sidebar,.composer,.chat-composer,.messages,.message-bubble,.hero-card,.info-card,.form-card,.form-panel){border-color:var(--cr-theme-border)}
body.cr-theme-halloween :is(header,.header,.navbar,.navigation,.site-nav,.site-header,.topbar,.top-bar,.sidebar,nav[aria-label]){background-color:rgba(12,7,8,.92)}
body.cr-theme-halloween :is(.panel,.card,.tile,.modal,.dialog,.dropdown-menu,.menu-panel,.content-card,.section-card,.feature-card,.widget,.chat-panel,.chat-sidebar,.composer,.chat-composer,.hero-card,.info-card,.form-card,.form-panel){background-color:var(--cr-theme-panel);box-shadow:0 16px 48px rgba(0,0,0,.28)}
body.cr-theme-halloween :is(h1,h2,h3,h4,.eyebrow,.section-label,.kicker,.accent,.highlight,.brand-accent){text-shadow:0 0 25px rgba(255,119,46,.15)}
body.cr-theme-halloween :is(a:not(.button):not(.btn),.accent,.highlight,.eyebrow,.section-label,.kicker){text-decoration-color:#ffad5570}
body.cr-theme-halloween :is(button,.button,.btn,input[type=submit],input[type=button]){--button-accent:#ffad55}
body.cr-theme-halloween :is(input,textarea,select){color:#fff2e6;background-color:rgba(10,7,8,.92);border-color:#70452f}
body.cr-theme-halloween :is(input,textarea,select):focus{outline-color:#ffad55;box-shadow:0 0 0 3px rgba(255,155,61,.12)}
body.cr-theme-halloween ::selection{background:#ff9b3d55;color:#fff}
body.cr-theme-halloween :is(.cr-sitewide,.cr-sw-menu,.cr-sw-account-menu){--theme-accent:#ffad55}
body.cr-theme-halloween :is(.cr-sw-brand b,.cr-sw-menu .cr-sw-heading,.cr-sw-menu a.cr-sw-current,.cr-sw-menu .chev){color:#ffad55}
body.cr-theme-halloween :is(.cr-sw-drop>button:hover,.cr-sw-drop.open>button,.cr-sw-menu a:hover,.cr-sw-menu button:hover){background:#ff9b3d12;border-color:#ff9b3d33}
body.cr-theme-halloween .cr-theme-toggle{border-color:#ff9b3d70;background:rgba(18,9,9,.96)}
body.cr-theme-halloween .cr-theme-option[aria-pressed="true"]{background:#ff9b3d16;border-color:#ff9b3d70}

body.cr-theme-halloween{background-color:#090608!important;background-image:linear-gradient(180deg,rgba(7,5,7,.62),rgba(7,5,7,.9)),url('https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=2200&q=85')!important;background-position:center,center 30%!important;background-size:cover!important;background-attachment:fixed!important;--bg:#090608;--panel:rgba(24,14,13,.94);--panel-light:rgba(43,24,19,.9);--text:#fff2e6;--muted:#c5ad9e;--green:#ff9b3d;--green-bright:#ffc17b;--gold:#ffd18a;--border:rgba(255,157,76,.22);--danger:#ff8a72;--shadow:0 24px 70px rgba(0,0,0,.55)}
body.cr-theme-halloween .cr-theme-atmosphere{z-index:0}
body.cr-theme-halloween .site-header,body.cr-theme-halloween .site-visitor-strip,body.cr-theme-halloween .cr-sitewide,body.cr-theme-halloween .cr-sw-reopen,body.cr-theme-halloween .site-footer,body.cr-theme-halloween footer{border-color:#ff9b3d36}
body.cr-theme-halloween .site-header{background:rgba(13,7,8,.88)}
body.cr-theme-halloween .site-visitor-strip,body.cr-theme-halloween .feature-strip{background:rgba(15,8,8,.92)}
body.cr-theme-halloween .hero{background-color:#160b0b;border-color:#ff9b3d3a}
body.cr-theme-halloween .hero-image{background-image:linear-gradient(90deg,rgba(9,4,6,.88) 0%,rgba(9,4,6,.58) 43%,rgba(9,4,6,.14) 100%),linear-gradient(0deg,rgba(9,4,6,.9),rgba(9,4,6,.05) 65%),url('https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=2400&q=88')!important}
body.cr-theme-halloween .hero-image:before{background-image:linear-gradient(90deg,rgba(9,4,6,.85),rgba(9,4,6,.2)),linear-gradient(0deg,rgba(9,4,6,.8),transparent 65%),url('https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=2200&q=85')!important;animation:crSceneFadeA 24s ease-in-out infinite!important}
body.cr-theme-halloween .hero-image:after{background-image:linear-gradient(90deg,rgba(9,4,6,.85),rgba(9,4,6,.22)),linear-gradient(0deg,rgba(9,4,6,.8),transparent 65%),url('https://images.unsplash.com/photo-1475738198235-4b30fcf6a3b9?auto=format&fit=crop&w=2200&q=85')!important;animation:crSceneFadeB 24s ease-in-out infinite!important}
body.cr-theme-halloween .hero h1 span,body.cr-theme-halloween .eyebrow,body.cr-theme-halloween .brand-mark,body.cr-theme-halloween .nav-links a:hover,body.cr-theme-halloween .hero-condition-value,body.cr-theme-halloween .site-visitor-inner strong{color:#ffc17b}
body.cr-theme-halloween .button-primary,body.cr-theme-halloween .nav-subscribe{color:#1a0a04;background:linear-gradient(135deg,#ffc17b,#e76c2c);border-color:#ffb66d55}
body.cr-theme-halloween .button-secondary,body.cr-theme-halloween .panel,body.cr-theme-halloween .card,body.cr-theme-halloween .hero-condition-card,body.cr-theme-halloween .hero-subscriber-goal{border-color:#ff9b3d3c}
body.cr-theme-halloween .panel,body.cr-theme-halloween .card{background:linear-gradient(145deg,rgba(32,18,17,.94),rgba(11,8,10,.96))}
body.cr-theme-halloween .panel-inner,body.cr-theme-halloween .episode-card,body.cr-theme-halloween .strip-item{border-color:#ff9b3d26}
body.cr-theme-halloween .live-label{background:#2b100f9c;border-color:#ff9b3d55}
body.cr-theme-halloween .live-dot{background:#ff8a43;box-shadow:0 0 15px #ff8a43aa}
body.cr-theme-halloween .particle{background:#ffb05e;box-shadow:0 0 12px 2px #ff7c2b77}
body.cr-theme-halloween .play-icon,body.cr-theme-halloween .hero-condition-icon{color:#ffc17b;background:#ff9b3d18;border-color:#ff9b3d55}
body.cr-theme-halloween .episode-kicker,body.cr-theme-halloween .hero-goal-badge{color:#ffc17b}
body.cr-theme-halloween .hero-goal-bar{background:linear-gradient(90deg,#a54a22,#ffc17b)}
body.cr-theme-halloween .nav-more-menu,body.cr-theme-halloween .nav-more-menu a:hover{background:rgba(16,8,8,.98)}
body.cr-theme-halloween .hero-glow{background:rgba(255,119,46,.16)}
body.cr-theme-halloween .hero h1{text-shadow:0 6px 45px #000a}
@keyframes crMoonGlow{0%,100%{filter:brightness(.88)}50%{filter:brightness(1.13)}}
@keyframes crFogDrift{from{transform:translateX(-5%) translateY(0)}to{transform:translateX(5%) translateY(-24px)}}
@keyframes crBatFlight{0%{transform:translate(-5vw,0) rotate(4deg)}25%{transform:translate(30vw,42px) rotate(-8deg)}50%{transform:translate(60vw,-20px) rotate(6deg)}75%{transform:translate(90vw,35px) rotate(-5deg)}100%{transform:translate(120vw,-10px) rotate(4deg)}}
@keyframes crLeafFall{0%{transform:translate3d(0,-8vh,0) rotate(0);opacity:0}10%{opacity:.7}50%{transform:translate3d(10vw,55vh,0) rotate(280deg)}90%{opacity:.5}100%{transform:translate3d(-4vw,112vh,0) rotate(620deg);opacity:0}}
@keyframes crJackGlow{0%,100%{filter:drop-shadow(0 0 8px #ff7c2b44);transform:translateY(0)}50%{filter:drop-shadow(0 0 22px #ff7c2baa);transform:translateY(-4px)}}
@keyframes crSceneFadeA{0%,28%{opacity:0}38%,62%{opacity:1}72%,100%{opacity:0}}
@keyframes crSceneFadeB{0%,60%{opacity:0}70%,91%{opacity:1}100%{opacity:0}}
@media(max-width:520px){.cr-theme-picker{right:9px;bottom:9px}.cr-theme-toggle{min-height:43px;padding:9px 11px}.cr-theme-toggle .cr-theme-word{display:none}}
@media(prefers-reduced-motion:reduce){.cr-theme-atmosphere *{animation:none!important}.cr-theme-atmosphere{display:none!important}body.cr-theme-halloween .hero-image,body.cr-theme-halloween .hero-image:before,body.cr-theme-halloween .hero-image:after{animation:none!important}}
`;
 document.head.appendChild(s);
}
function safeGet(){try{return localStorage.getItem(STORAGE_KEY)||'default'}catch{return'default'}}
function safeSet(id){try{localStorage.setItem(STORAGE_KEY,id)}catch{}}
function setTheme(id){
 const theme=THEMES.find(t=>t.id===id)||THEMES[0];
 document.body.classList.toggle('cr-theme-halloween',theme.id==='halloween');
 document.body.classList.toggle('cr-theme-default',theme.id==='default');
 document.documentElement.dataset.crowrulesTheme=theme.id;
 document.querySelectorAll('.cr-theme-option').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme.id)));
 const label=document.querySelector('.cr-theme-current');if(label)label.textContent=theme.id==='default'?'CURRENT · DEFAULT':'CURRENT · HALLOWEEN';
 safeSet(theme.id);
 let layer=document.querySelector('.cr-theme-atmosphere');
 if(theme.id==='halloween'&&!layer){
  layer=document.createElement('div');layer.className='cr-theme-atmosphere';layer.setAttribute('aria-hidden','true');
  layer.innerHTML='<div class="cr-moon"></div><div class="cr-fog" style="top:34%"></div><div class="cr-fog f2"></div><div class="cr-bat">🦇</div><div class="cr-bat b2">🦇</div><div class="cr-leaf">🍂</div><div class="cr-leaf l2">🍁</div><div class="cr-leaf l3">🍂</div><div class="cr-jack">🎃</div><div class="cr-jack j2">🕯️</div>';
  document.body.appendChild(layer);
 }else if(theme.id!=='halloween'&&layer)layer.remove();
 const picker=document.querySelector('.cr-theme-picker');if(picker){picker.classList.remove('open');picker.querySelector('.cr-theme-toggle')?.setAttribute('aria-expanded','false')}
}
function mount(){
 addStyles();
 if(!document.querySelector('.cr-theme-picker')){
  const picker=document.createElement('div');picker.className='cr-theme-picker';
  picker.innerHTML='<div class="cr-theme-menu" role="menu" aria-label="Choose a site theme"><div class="cr-theme-menu-title">SITEWIDE APPEARANCE</div>'+THEMES.map(t=>'<button class="cr-theme-option" type="button" role="menuitemradio" aria-pressed="false" data-theme="'+esc(t.id)+'"><span class="cr-theme-option-icon">'+t.icon+'</span><span class="cr-theme-option-copy"><strong>'+esc(t.label)+'</strong><small>'+esc(t.description)+'</small></span><span class="cr-theme-check" aria-hidden="true">✓</span></button>').join('')+'<div class="cr-theme-menu-title cr-theme-current">CURRENT · DEFAULT</div></div><button class="cr-theme-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Choose sitewide theme"><span class="cr-theme-icon">🎨</span><span class="cr-theme-word"><small>APPEARANCE</small>Choose theme ▾</span></button>';
  document.body.appendChild(picker);
  const toggle=picker.querySelector('.cr-theme-toggle');
  toggle.addEventListener('click',()=>{const open=picker.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
  picker.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>setTheme(btn.dataset.theme)));
  document.addEventListener('click',e=>{if(!picker.contains(e.target)){picker.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){picker.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
 }
 setTheme(safeGet());
}
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY&&event.newValue){setTheme(event.newValue)}});
try{if('BroadcastChannel'in window){const channel=new BroadcastChannel('crowrules-sitewide-themes');window.__CrowRulesThemeChannel=channel;channel.addEventListener('message',event=>{if(event.data&&event.data.type==='theme'&&event.data.id){setTheme(event.data.id)}})}}catch{}
const originalSetTheme=setTheme;
setTheme=function(id){originalSetTheme(id);try{window.__CrowRulesThemeChannel?.postMessage({type:'theme',id})}catch{}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();