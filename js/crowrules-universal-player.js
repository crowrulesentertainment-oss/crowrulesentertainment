/* CrowRules Universal Streaming Player v1
 * Shared podcast player UI, queue, playback controls and saved listening progress.
 * Public pages only use published media URLs; never place privileged storage keys here.
 */
(()=>{"use strict";
if(window.__CrowRulesUniversalPlayerV1)return;window.__CrowRulesUniversalPlayerV1=true;
const KEY="cr-universal-player-v1",$=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={queue:[],index:0,expanded:false,sleep:null,sleepTimer:null,rate:1,ready:false};
let audio;
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||"{}");state.queue=Array.isArray(x.queue)?x.queue.filter(valid):[];state.index=Math.max(0,Math.min(Number(x.index)||0,state.queue.length-1));state.rate=Number(x.rate)||1;}catch{}}
function valid(x){return x&&typeof x.url==="string"&&/^https?:/i.test(x.url)&&typeof x.title==="string"}
function save(){try{localStorage.setItem(KEY,JSON.stringify({queue:state.queue,index:state.index,rate:state.rate,position:audio&&!audio.paused?audio.currentTime:0,updated:Date.now()}))}catch{}}
function current(){return state.queue[state.index]||null}
function fmt(n){if(!Number.isFinite(n)||n<0)return"0:00";let s=Math.floor(n);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function style(){if($("#cr-player-style"))return;const s=document.createElement("style");s.id="cr-player-style";s.textContent=`
#cr-player{position:fixed;z-index:99990;left:14px;right:14px;bottom:14px;margin:auto;max-width:1050px;background:rgba(5,8,16,.97);border:1px solid #62efff55;border-radius:16px;box-shadow:0 18px 70px #000b;color:#f7fbff;font:12px Inter,Arial,sans-serif;backdrop-filter:blur(20px);overflow:hidden}
#cr-player[hidden]{display:none}#cr-player .crp-main{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 13px}
#cr-player .crp-info{min-width:0;display:flex;align-items:center;gap:11px}#cr-player .crp-art{width:42px;height:42px;flex:none;border-radius:10px;background:linear-gradient(135deg,#087f9b,#6546a7);display:grid;place-items:center;color:white;font-weight:900;font-size:17px}
#cr-player .crp-meta{min-width:0}#cr-player .crp-title{font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#cr-player .crp-sub{margin-top:4px;color:#8fa1b8;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#cr-player .crp-controls{display:flex;align-items:center;gap:6px}#cr-player button,#cr-player select{border:1px solid #34465f;border-radius:9px;background:#0d1624;color:#fff;padding:8px 10px;font-weight:800;cursor:pointer}#cr-player button:hover{border-color:#62efff;color:#62efff}#cr-player button:focus-visible,#cr-player input:focus-visible{outline:2px solid #62efff;outline-offset:2px}
#cr-player .crp-play{background:linear-gradient(135deg,#087f9b,#6546a7);border-color:#62efff88;min-width:42px}
#cr-player .crp-progress{display:flex;align-items:center;gap:9px;padding:0 13px 10px;color:#8fa1b8;font-size:9px}#cr-player input[type=range]{min-width:0;flex:1;accent-color:#62efff}
#cr-player .crp-tools{display:none;gap:7px;flex-wrap:wrap;padding:0 13px 12px}#cr-player.expanded .crp-tools{display:flex}#cr-player .crp-queue{max-height:180px;overflow:auto;border-top:1px solid #ffffff12;padding:8px 13px;display:none}#cr-player.expanded .crp-queue{display:block}
#cr-player .crp-queue button{display:flex;width:100%;text-align:left;justify-content:space-between;margin:3px 0;background:transparent}#cr-player .crp-queue button.active{color:#62efff;border-color:#62efff55}
#cr-player .crp-tools label{display:flex;align-items:center;gap:6px;color:#9fb1c7;font-size:10px}#cr-player .crp-tools select{padding:7px}
@media(max-width:620px){#cr-player{left:7px;right:7px;bottom:7px;border-radius:13px}#cr-player .crp-main{grid-template-columns:1fr;gap:8px;padding:9px}#cr-player .crp-controls{justify-content:space-between}#cr-player .crp-controls button{padding:8px 11px}#cr-player .crp-progress{padding:0 10px 9px}}
`;document.head.appendChild(s)}
function mount(){if($("#cr-player"))return;style();const p=document.createElement("section");p.id="cr-player";p.hidden=true;p.setAttribute("aria-label","CrowRules Universal Streaming Player");p.innerHTML=`
<div class="crp-main"><div class="crp-info"><div class="crp-art" id="crp-art">CR</div><div class="crp-meta"><div class="crp-title" id="crp-title">Nothing playing</div><div class="crp-sub" id="crp-sub">CrowRules Podcasting</div></div></div><div class="crp-controls"><button id="crp-prev" title="Previous" aria-label="Previous episode">|◀</button><button id="crp-play" class="crp-play" title="Play" aria-label="Play">▶</button><button id="crp-next" title="Next" aria-label="Next episode">▶|</button><button id="crp-expand" title="Show player tools" aria-expanded="false">⌃</button><button id="crp-hide" title="Hide player" aria-label="Hide player">×</button></div></div>
<div class="crp-progress"><span id="crp-current">0:00</span><input id="crp-seek" type="range" min="0" max="1000" value="0" aria-label="Seek playback"><span id="crp-duration">0:00</span></div>
<div class="crp-tools"><label>Speed <select id="crp-speed"><option>0.75</option><option>1</option><option>1.25</option><option>1.5</option><option>1.75</option><option>2</option></select></label><label>Sleep timer <select id="crp-sleep"><option value="0">Off</option><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option><option value="end">End of episode</option></select></label><button id="crp-fullscreen">Full screen</button><button id="crp-clear">Clear queue</button></div><div class="crp-queue" id="crp-queue"></div>`;
document.body.appendChild(p);audio=document.createElement("audio");audio.preload="metadata";audio.crossOrigin="anonymous";audio.id="cr-universal-audio";document.body.appendChild(audio);
$("#crp-play").onclick=()=>audio.paused?audio.play().catch(()=>{}):audio.pause();$("#crp-prev").onclick=()=>move(-1);$("#crp-next").onclick=()=>move(1);$("#crp-hide").onclick=()=>p.hidden=true;$("#crp-expand").onclick=()=>{state.expanded=!state.expanded;p.classList.toggle("expanded",state.expanded);$("#crp-expand").textContent=state.expanded?"⌄":"⌃";$("#crp-expand").setAttribute("aria-expanded",String(state.expanded))};
$("#crp-seek").oninput=()=>{if(audio.duration)audio.currentTime=audio.duration*(Number($("#crp-seek").value)/1000)};$("#crp-speed").value=String(state.rate);$("#crp-speed").onchange=e=>{state.rate=Number(e.target.value);audio.playbackRate=state.rate;save()};
$("#crp-sleep").onchange=e=>setSleep(e.target.value);$("#crp-clear").onclick=()=>{audio.pause();audio.removeAttribute("src");audio.load();state.queue=[];state.index=0;save();render()};
$("#crp-fullscreen").onclick=()=>{if(p.requestFullscreen)p.requestFullscreen().catch(()=>{});else{state.expanded=true;p.classList.add("expanded")}};
audio.onplay=()=>{$("#crp-play").textContent="Ⅱ";$("#crp-play").setAttribute("aria-label","Pause");save()};
audio.onpause=()=>{$("#crp-play").textContent="▶";$("#crp-play").setAttribute("aria-label","Play");save()};
audio.ontimeupdate=()=>{const d=audio.duration||0;$("#crp-current").textContent=fmt(audio.currentTime);$("#crp-duration").textContent=fmt(d);if(d)$("#crp-seek").value=String(Math.round(audio.currentTime/d*1000));if(state.sleep==="end"&&d&&audio.currentTime>=d-1)audio.pause()};
audio.onended=()=>move(1);audio.onerror=()=>{$("#crp-sub").textContent="Unable to play this media source"};
render()}
function render(){const p=$("#cr-player");if(!p)return;const x=current();p.hidden=!x;if(!x)return;$("#crp-title").textContent=x.title;$("#crp-sub").textContent=[x.show||"CrowRules Podcasting",x.creator].filter(Boolean).join(" · ");$("#crp-art").textContent=(x.title||"CR").slice(0,2).toUpperCase();$("#crp-queue").innerHTML=state.queue.map((q,i)=>'<button class="'+(i===state.index?"active":"")+'" data-index="'+i+'"><span>'+esc(q.title)+'</span><span>'+((q.duration&&esc(q.duration))||"")+'</span></button>').join("");$("#crp-queue").querySelectorAll("button").forEach(b=>b.onclick=()=>load(Number(b.dataset.index),true))}
function load(i,autoplay){const x=state.queue[i];if(!x)return;state.index=i;audio.src=x.url;audio.playbackRate=state.rate;render();save();if(autoplay)audio.play().catch(()=>{$("#crp-sub").textContent="Tap play to start this episode"})}
function move(n){if(!state.queue.length)return;const next=state.index+n;if(next<0||next>=state.queue.length)return;load(next,true)}
function setSleep(v){clearTimeout(state.sleepTimer);state.sleep=v==="end"?"end":Number(v)||null;if(state.sleep&&state.sleep!=="end")state.sleepTimer=setTimeout(()=>audio.pause(),state.sleep*60000)}
function add(item,autoplay=true){if(!valid(item))throw new Error("A playable item needs a title and an http(s) media URL.");const idx=state.queue.findIndex(x=>x.id&&x.id===item.id);if(idx>=0){if(autoplay)load(idx,true);return}state.queue.push(item);if(state.queue.length===1||autoplay&&state.queue.length===1)load(state.queue.length-1,autoplay);else{render();save()}}
function play(item){if(item){add(item,true);return}if(!current())return;audio.play().catch(()=>{})}
function setQueue(items,start=0){if(!Array.isArray(items))throw new Error("Queue must be an array.");state.queue=items.filter(valid);state.index=Math.max(0,Math.min(Number(start)||0,state.queue.length-1));if(state.queue.length)load(state.index,true);else render();save()}
read();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.CrowRulesPlayer={play,addToQueue:item=>add(item,false),setQueue,playNext:item=>{if(valid(item)){state.queue.splice(state.index+1,0,item);render();save()}},next:()=>move(1),previous:()=>move(-1),getQueue:()=>state.queue.slice(),getCurrent:current,show:()=>{const p=$("#cr-player");if(p)p.hidden=false},pause:()=>audio?.pause(),setSleep,version:"1.0.0"};
})();