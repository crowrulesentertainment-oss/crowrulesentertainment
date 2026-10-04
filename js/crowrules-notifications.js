/* CrowRules Universal Notifications V4.2 — Intelligence */
(()=>{"use strict";
const wait=()=>window.CrowRulesAuth?.ready?init():setTimeout(wait,50);
const esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const css=()=>{if(document.getElementById("crn-css"))return;const s=document.createElement("style");s.id="crn-css";s.textContent=String.raw\`
#crn{position:fixed;right:18px;top:76px;z-index:100000;font:14px system-ui,sans-serif;color:#fff}#crn button{font:inherit}.crn-trigger{display:flex;align-items:center;gap:8px;border:1px solid #ffffff22;border-radius:13px;background:#090c14ee;color:#fff;padding:9px 12px;cursor:pointer;box-shadow:0 10px 35px #0008}.crn-badge{min-width:18px;padding:2px 6px;border-radius:99px;background:#e14bff;text-align:center;font-size:11px}.crn-panel{display:none;position:absolute;right:0;top:52px;width:min(460px,calc(100vw - 28px));max-height:calc(100vh - 85px);overflow:auto;background:#090c14f8;border:1px solid #ffffff1d;border-radius:17px;box-shadow:0 20px 60px #000b;backdrop-filter:blur(16px)}.crn-panel.open{display:block}.crn-head{padding:14px 16px;border-bottom:1px solid #ffffff12}.crn-head-row{display:flex;justify-content:space-between;align-items:center}.crn-head b{font-size:15px}.crn-summary{font-size:11px;opacity:.6;margin-top:4px}.crn-tabs{display:flex;gap:6px;padding:9px;border-bottom:1px solid #ffffff12;overflow:auto}.crn-tabs button,.crn-actions button{flex:1;white-space:nowrap;border:1px solid #ffffff12;background:#ffffff08;color:#fff;border-radius:8px;padding:7px;cursor:pointer}.crn-list{padding:9px}.crn-group{margin:0 0 9px}.crn-group-title{font-size:10px;text-transform:uppercase;letter-spacing:.12em;opacity:.5;padding:7px 5px}.crn-item{display:block;padding:11px;border-radius:11px;text-decoration:none;color:#fff;border:1px solid transparent}.crn-item:hover{background:#ffffff08;border-color:#ffffff12}.crn-item.unread{background:#ffffff0b}.crn-item.high{border-left:3px solid #e14bff}.crn-title{font-weight:700}.crn-body{font-size:12px;opacity:.72;margin-top:3px}.crn-meta{font-size:10px;opacity:.5;margin-top:5px}.crn-empty{padding:24px;text-align:center;opacity:.6}.crn-actions{padding:10px;border-top:1px solid #ffffff12;display:flex;gap:7px}.crn-actions button{padding:8px}@media(max-width:720px){#crn{left:10px;right:10px;top:66px}.crn-panel{left:0;right:0;width:auto}}
\`;document.head.appendChild(s)};
async function init(){css();const db=window.CrowRulesAuth.client;let session=(await db.auth.getSession()).data.session;let root=document.getElementById("crn");if(!root){root=document.createElement("div");root.id="crn";document.body.appendChild(root)}let rows=[],batches=[],filter="all";
const load=async()=>{if(!session){rows=[];batches=[];draw();return}const [n,b]=await Promise.all([db.from("crowrules_notifications").select("*").eq("user_id",session.user.id).order("priority",{ascending:false}).order("created_at",{ascending:false}).limit(100),db.from("crowrules_notification_batches").select("*").eq("user_id",session.user.id).order("last_created_at",{ascending:false}).limit(50)]);rows=n.data||[];batches=b.data||[];draw()};
const fmt=d=>new Date(d).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
const draw=()=>{const unread=rows.filter(x=>!x.is_read).length;root.innerHTML='<button class="crn-trigger" id="crn-open">🔔 Notifications '+(unread?'<span class="crn-badge">'+unread+'</span>':'')+'</button><section class="crn-panel" id="crn-panel"><header class="crn-head"><div class="crn-head-row"><b>Universal Notifications</b><span>'+unread+' unread</span></div><div class="crn-summary">'+batches.filter(x=>!x.is_read).length+' active groups · intelligent priority</div></header><nav class="crn-tabs"><button data-filter="all">All</button><button data-filter="unread">Unread</button><button data-filter="high">Priority</button><button data-filter="groups">Groups</button></nav><div class="crn-list" id="crn-list"></div><footer class="crn-actions"><button id="crn-read">Mark all read</button><button id="crn-refresh">Refresh</button><button id="crn-settings">Preferences</button></footer></section>';render();
root.querySelector("#crn-open").onclick=()=>root.querySelector("#crn-panel").classList.toggle("open");
root.querySelectorAll(".crn-tabs button").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render()});
root.querySelector("#crn-read").onclick=async()=>{if(!session)return;await db.rpc("cr_mark_notifications_read",{p_ids:null});await load()};
root.querySelector("#crn-refresh").onclick=load;
root.querySelector("#crn-settings").onclick=()=>window.location.href="/members/settings.html"};
const render=()=>{const list=root.querySelector("#crn-list");if(!list)return;
if(filter==="groups"){list.innerHTML=batches.length?batches.map(b=>'<div class="crn-group"><div class="crn-group-title">'+esc(b.division||"CrowRules")+'</div><div class="crn-item '+(b.is_read?"":"unread")+'"><div class="crn-title">'+esc(b.title)+' · '+b.count+'</div><div class="crn-body">'+esc(b.body||"")+'</div><div class="crn-meta">Updated '+esc(fmt(b.last_created_at))+'</div></div></div>').join(""):'<div class="crn-empty">No notification groups yet.</div>';return}
let data=filter==="unread"?rows.filter(x=>!x.is_read):filter==="high"?rows.filter(x=>Number(x.priority)>=70):rows;
const grouped={};data.forEach(x=>{const k=x.division||"CrowRules";(grouped[k]??=[]).push(x)});
list.innerHTML=data.length?Object.entries(grouped).map(([div,items])=>'<div class="crn-group"><div class="crn-group-title">'+esc(div)+'</div>'+items.map(x=>'<a class="crn-item '+(x.is_read?"":"unread ")+(Number(x.priority)>=70?"high":"")+'" href="'+esc(x.action_url||"#")+'" data-id="'+esc(x.id)+'"><div class="crn-title">'+esc(x.title)+(x.batch_key?" · grouped":"")+'</div><div class="crn-body">'+esc(x.body||"")+'</div><div class="crn-meta">'+esc(x.type||"notification")+' · '+esc(fmt(x.created_at))+(Number(x.priority)>=70?" · Priority":"")+'</div></a>').join("")+'</div>').join(""):'<div class="crn-empty">You are all caught up.</div>';
list.querySelectorAll(".crn-item[data-id]").forEach(a=>a.onclick=async()=>{const id=a.dataset.id;if(id&&!rows.find(x=>x.id===id)?.is_read){await db.from("crowrules_notifications").update({is_read:true,read_at:new Date().toISOString()}).eq("id",id).eq("user_id",session.user.id);await load()}});
};
await load();if(session)db.channel("crowrules-notifications-v42-"+session.user.id).on("postgres_changes",{event:"*",schema:"public",table:"crowrules_notifications",filter:"user_id=eq."+session.user.id},()=>load()).subscribe();
window.CrowRulesNotifications={refresh:load,markAllRead:async()=>{if(session)await db.rpc("cr_mark_notifications_read",{p_ids:null});await load()}};
db.auth.onAuthStateChange((_e,s)=>{session=s;load()})}

/* Podcasting pages get a division-specific dropdown inside the universal navigation. */
function loadPodcastingNavigation(){
 if(!location.pathname.includes('/podcasting/'))return;
 if(document.querySelector('script[data-crowrules-podcasting-nav]'))return;
 const s=document.createElement('script');
 s.src='https://crowrulesentertainment-oss.github.io/crowrulesentertainment/js/crowrules-podcasting-nav.js?v=1';
 s.defer=true;
 s.dataset.crowrulesPodcastingNav='true';
 document.head.appendChild(s);
}
loadPodcastingNavigation();
wait();
})();