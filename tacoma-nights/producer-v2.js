(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s);
const navMap={"Overview":"overview","Guest Booking Desk":"guests","Episode Producer Board":"episodes","Production tasks":"tasks","Community story approvals":"stories","Tacoma Events Calendar":"events","Community partner directory":"partners","Transcripts, clips & episode resources":"assets","Audience topic polls":"polls","Public Episode Archive":"archive"};
function go(label){const b=[...document.querySelectorAll("#nav button")].find(x=>x.textContent.trim()===label);if(b)b.click();else alert("That workspace section is not available in this view.")}
function quickCreate(section){go(section);setTimeout(()=>{const b=$("#newRecord");if(b&&!b.classList.contains("hidden"))b.click()},80)}
function mount(){
 const desk=$("#desk"),layout=$(".layout",desk);if(!desk||!layout||$("#pv2-launch"))return;
 const bar=document.createElement("div");bar.className="pv2-bar";bar.innerHTML='<div><strong>PRODUCER DESK · VERSION 2.0</strong><br><span>One place to plan, assign, follow up and publish Tacoma Nights.</span></div><div class="pv2-tools"><button id="pv2-focus">Focus mode</button><button id="pv2-top">Back to top ↑</button></div>';
 const launch=document.createElement("section");launch.id="pv2-launch";launch.className="pv2-launch";launch.innerHTML=
 '<button data-action="episode"><span class="pv2-icon">🎬</span><span><b>New episode</b><small>Create an episode and build its production pipeline</small></span></button>'+
 '<button data-action="task"><span class="pv2-icon">✓</span><span><b>Assign a task</b><small>Set owner, priority and due date</small></span></button>'+
 '<button data-action="guest"><span class="pv2-icon">🎙</span><span><b>Add a guest</b><small>Track invitations, booking and follow-ups</small></span></button>'+
 '<button data-action="remote"><span class="pv2-icon">↗</span><span><b>Remote host operations</b><small>Manage host coordination and recording readiness</small></span></button>';
 const guide=document.createElement("section");guide.className="pv2-guide";guide.innerHTML=
 '<article><b>01 · PLAN THE SHOW</b><p>Create the episode first. Add its theme, date, description and running order so the team has one source of truth.</p></article>'+
 '<article><b>02 · ASSIGN THE WORK</b><p>Break production into tasks. Give every task an owner, priority and due date; use the dashboard to spot overdue and blocked work.</p></article>'+
 '<article><b>03 · BOOK & PUBLISH</b><p>Track guest outreach and reminders, verify episode assets, then publish the approved episode to the public archive.</p></article>';
 layout.parentNode.insertBefore(bar,layout);
 layout.parentNode.insertBefore(launch,layout);
 layout.parentNode.insertBefore(guide,layout);
 launch.addEventListener("click",e=>{const b=e.target.closest("button[data-action]");if(!b)return;const a=b.dataset.action;if(a==="episode")quickCreate("Episode Producer Board");if(a==="task")quickCreate("Production tasks");if(a==="guest")quickCreate("Guest Booking Desk");if(a==="remote")window.open("remote-host-operations.html","_blank","noopener")});
 $("#pv2-focus").addEventListener("click",()=>{document.body.classList.toggle("pv2-focus");$("#pv2-focus").textContent=document.body.classList.contains("pv2-focus")?"Exit focus mode":"Focus mode"});
 $("#pv2-top").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
 const search=$("#search");if(search){search.placeholder="Search names, episodes, tasks, statuses…";search.title="Search the current section. Shortcut: Ctrl or ⌘ + K."}
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();const s=$("#search");if(s&&!s.closest(".hidden")){s.focus();s.select()}}if(e.key==="Escape"&&document.body.classList.contains("pv2-focus")){document.body.classList.remove("pv2-focus");$("#pv2-focus").textContent="Focus mode"}});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
