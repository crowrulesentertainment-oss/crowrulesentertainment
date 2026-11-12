(() => {
"use strict";
const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
const SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const STATUS_LABELS={new:"New",reviewing:"Reviewing",intro_requested:"Intro requested",conversation_scheduled:"Conversation scheduled",follow_up:"Follow-up",funding_pipeline:"Future funding pipeline",closed:"Closed",spam:"Spam"};
const MEETING_LABELS={scheduled:"Scheduled",completed:"Completed",cancelled:"Cancelled",no_show:"No show"};
let db=null,currentUser=null,applications=[],interviews=[],positions=[],team=[],assignments=[],selectedApplication=null,editingTeamId=null;
function client(){if(!window.supabase?.createClient)throw Error("Supabase library did not load.");if(!db)db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});return db}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function date(v,withTime=true){if(!v)return "—";const d=new Date(v);return Number.isNaN(d.getTime())?"—":new Intl.DateTimeFormat(undefined,withTime?{dateStyle:"medium",timeStyle:"short"}:{dateStyle:"medium"}).format(d)}
function notify(msg,error=false){const el=$("#globalStatus");el.textContent=msg;el.className="global-status show"+(error?" error":"");}
function clearNotify(){const el=$("#globalStatus");el.textContent="";el.className="global-status"}
function setBusy(form,busy){const b=form.querySelector('[type="submit"]');if(b){b.disabled=busy;b.dataset.original??=b.textContent;b.textContent=busy?"Saving…":b.dataset.original}}
function formObject(form){return Object.fromEntries(new FormData(form).entries())}
function isChecked(form,name){return !!form.querySelector('[name="'+name+'"]')?.checked}
async function loadAll(){
 clearNotify();
 const results=await Promise.all([
  client().from("recruitment_applications").select("*").order("created_at",{ascending:false}).limit(500),
  client().from("recruitment_interviews").select("*").order("scheduled_at",{ascending:true}).limit(500),
  client().from("recruitment_positions").select("*").order("sort_order",{ascending:true}).order("title"),
  client().from("recruitment_team_members").select("*").order("sort_order",{ascending:true}).order("full_name"),
  client().from("recruitment_assignments").select("*").order("created_at",{ascending:false}).limit(500)
 ]);
 const labels=["applications","interviews","positions","team profiles","assignments"];
 for(let i=0;i<results.length;i++){if(results[i].error)throw Error("Could not load "+labels[i]+": "+results[i].error.message)}
 [applications,interviews,positions,team,assignments]=results.map(r=>r.data||[]);
 renderAll();
}
function renderAll(){renderMetrics();renderRecent();renderApplications();renderInterviews();renderPositions();renderTeam();renderAssignments();renderOrgChart();populateSelects()}
function renderMetrics(){
 $("#metricTotal").textContent=applications.length;
 $("#metricNew").textContent=applications.filter(a=>a.status==="new").length;
 $("#metricConversations").textContent=applications.filter(a=>["intro_requested","conversation_scheduled","follow_up"].includes(a.status)).length;
 $("#metricTeam").textContent=team.length;
 $("#applicantCount").textContent=applications.length;
}
function renderRecent(){
 const list=$("#recentApplicants");
 list.innerHTML=applications.slice(0,6).map(a=>'<button class="compact-item" data-open-app="'+esc(a.id)+'"><span class="mini-avatar">'+esc(initials(a.name))+'</span><span class="item-main"><strong>'+esc(a.name)+'</strong><small>'+esc(a.role_title)+' · '+date(a.created_at,false)+'</small></span><span class="pill '+esc(a.status)+'">'+esc(STATUS_LABELS[a.status]||a.status)+'</span></button>').join("")||'<div class="empty">No applications received yet.</div>';
 list.querySelectorAll("[data-open-app]").forEach(b=>b.addEventListener("click",()=>{openApplication(b.dataset.openApp);showTab("applications")}));
}
function initials(name){return String(name||"CR").trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("")}
function renderApplications(){
 const q=$("#appSearch").value.trim().toLowerCase(),st=$("#appStatusFilter").value;
 const rows=applications.filter(a=>(!st||a.status===st)&&(!q||[a.name,a.email,a.role_title,a.role_slug,a.location].join(" ").toLowerCase().includes(q)));
 $("#applicationList").innerHTML=rows.map(a=>'<button class="app-row '+(selectedApplication===a.id?"selected":"")+'" data-app-id="'+esc(a.id)+'"><span class="mini-avatar">'+esc(initials(a.name))+'</span><span class="item-main"><strong>'+esc(a.name)+'</strong><small>'+esc(a.role_title)+'<br>'+esc(a.email)+'</small></span><span class="app-row-meta"><span class="pill '+esc(a.status)+'">'+esc(STATUS_LABELS[a.status]||a.status)+'</span><small>'+date(a.created_at,false)+'</small></span></button>').join("")||'<div class="empty">No applicants match these filters.</div>';
 $$("#applicationList [data-app-id]").forEach(b=>b.addEventListener("click",()=>openApplication(b.dataset.appId)));
}
async function openApplication(id){
 selectedApplication=id;renderApplications();
 const a=applications.find(x=>x.id===id);if(!a)return;
 const detail=$("#applicationDetail");
 detail.innerHTML='<div class="detail-top"><div><p class="eyebrow">CANDIDATE RECORD</p><h3>'+esc(a.name)+'</h3><a href="mailto:'+esc(a.email)+'">'+esc(a.email)+'</a></div><span class="pill '+esc(a.status)+'">'+esc(STATUS_LABELS[a.status]||a.status)+'</span></div>'+
 '<div class="detail-facts"><div><small>Position interest</small><strong>'+esc(a.role_title)+'</strong></div><div><small>Location</small><strong>'+esc(a.location)+'</strong></div><div><small>Submitted</small><strong>'+date(a.created_at)+'</strong></div><div><small>Last contacted</small><strong>'+date(a.last_contacted_at)+'</strong></div></div>'+
 '<div class="detail-block"><small>Skills & experience</small><p>'+esc(a.skills).replace(/\n/g,"<br>")+'</p></div>'+
 (a.portfolio_url?'<div class="detail-block"><small>Portfolio</small><p><a href="'+esc(a.portfolio_url)+'" target="_blank" rel="noopener noreferrer">'+esc(a.portfolio_url)+'</a></p></div>':'')+
 (a.message?'<div class="detail-block"><small>Additional information</small><p>'+esc(a.message).replace(/\n/g,"<br>")+'</p></div>':'')+
 '<form id="candidateUpdateForm" class="detail-edit"><h4>Candidate management</h4><label>Pipeline status<select name="status">'+Object.entries(STATUS_LABELS).map(([v,l])=>'<option value="'+v+'" '+(a.status===v?"selected":"")+'>'+l+'</option>').join("")+'</select></label><label>Private admin notes<textarea name="admin_notes" rows="4" maxlength="5000">'+esc(a.admin_notes||"")+'</textarea></label><label class="check-label"><input type="checkbox" name="mark_contacted"> Mark as contacted now</label><button class="btn btn-primary full" type="submit">Save candidate record</button></form>'+
 '<div class="detail-edit"><h4>Private communication log</h4><form id="messageForm"><label>Type<select name="channel"><option value="internal">Internal note</option><option value="email">Email (log only)</option><option value="phone">Phone call</option><option value="meeting">Meeting</option></select></label><label>Direction<select name="direction"><option value="internal">Internal</option><option value="outbound">Outbound</option><option value="inbound">Inbound</option></select></label><label>Subject<input name="subject" maxlength="180"></label><label>Summary / notes<textarea name="body" rows="3" required maxlength="4000"></textarea></label><button class="btn btn-outline full" type="submit">Add to communication history</button></form><div id="messageHistory" class="message-history">Loading history…</div></div>'+
 '<div class="detail-edit email-composer"><h4>Send candidate email</h4><p class="muted small">Sends directly to the email address on this application through Brevo. The sent message is added to the private communication history.</p><form id="candidateEmailForm"><label>Subject<input name="subject" maxlength="180" required placeholder="CrowRules Entertainment — application update"></label><label>Message<textarea name="body" rows="5" maxlength="8000" required placeholder="Write your message to the candidate…"></textarea></label><button class="btn btn-primary full" type="submit">Send email to candidate</button></form><p class="muted small">Sender: crowrulesentertainment@gmail.com · Replies go to this address.</p></div><div class="detail-actions"><button class="btn btn-outline" id="createInterviewFromDetail">Schedule conversation</button></div>';
 $("#candidateUpdateForm").addEventListener("submit",saveCandidate);
 $("#messageForm").addEventListener("submit",saveMessage);
 $("#candidateEmailForm").addEventListener("submit",sendCandidateEmail);
 $("#createInterviewFromDetail").addEventListener("click",()=>{showTab("interviews");$("#interviewApplicant").value=id;$("#interviewForm").scrollIntoView({behavior:"smooth",block:"center"})});
 loadMessages(id);
}
async function loadMessages(id){
 const box=$("#messageHistory");if(!box)return;
 const {data,error}=await client().from("recruitment_internal_messages").select("*").eq("application_id",id).order("occurred_at",{ascending:false});
 if(error){box.textContent="Could not load private history.";return}
 box.innerHTML=(data||[]).map(m=>'<div class="message-entry"><div><strong>'+esc(m.subject||m.channel)+'</strong><small>'+esc(m.direction)+' · '+date(m.occurred_at)+'</small></div><p>'+esc(m.body).replace(/\n/g,"<br>")+'</p></div>').join("")||'<div class="empty">No communication notes recorded.</div>';
}
async function saveCandidate(e){
 e.preventDefault();const f=e.currentTarget,a=applications.find(x=>x.id===selectedApplication);if(!a)return;setBusy(f,true);
 const v=formObject(f),payload={status:v.status,admin_notes:v.admin_notes||null,updated_at:new Date().toISOString()};
 if(isChecked(f,"mark_contacted"))payload.last_contacted_at=new Date().toISOString();
 const {error}=await client().from("recruitment_applications").update(payload).eq("id",a.id);
 setBusy(f,false);if(error){notify("Could not update applicant: "+error.message,true);return}
 notify("Candidate record updated.");await loadAll();await openApplication(a.id);
}
async function sendCandidateEmail(e){
 e.preventDefault();
 const f=e.currentTarget,a=applications.find(x=>x.id===selectedApplication);if(!a)return;
 const v=formObject(f);setBusy(f,true);
 try{
  const {data,error}=await client().functions.invoke("recruitment-send-email",{body:{application_id:a.id,subject:v.subject,body:v.body}});
  if(error)throw error;
  if(!data?.sent)throw Error(data?.error||"Brevo did not confirm the email.");
  f.reset();
  notify(data.logged===false?"Email sent, but the history log needs attention.":"Email sent through Brevo and saved to candidate history.");
  await loadMessages(a.id);
 }catch(err){
  const message=err?.context?.json?.error||err?.message||"Email delivery failed.";
  notify(message,true);
 }finally{setBusy(f,false)}
}
async function saveMessage(e){
 e.preventDefault();const f=e.currentTarget,a=applications.find(x=>x.id===selectedApplication);if(!a)return;const v=formObject(f);setBusy(f,true);
 const {error}=await client().from("recruitment_internal_messages").insert({application_id:a.id,channel:v.channel,direction:v.direction,subject:v.subject||null,body:v.body,created_by:currentUser.id});
 setBusy(f,false);if(error){notify("Could not save communication note: "+error.message,true);return}
 f.reset();notify("Private communication entry saved.");loadMessages(a.id);
}
function populateSelects(){
 const app=$("#interviewApplicant"),mem=$("#assignmentMember"),reports=$("#reportsTo");
 const appVal=app.value,memVal=mem.value,repVal=reports.value;
 app.innerHTML='<option value="">Select an applicant</option>'+applications.map(a=>'<option value="'+esc(a.id)+'">'+esc(a.name)+' — '+esc(a.role_title)+'</option>').join("");
 mem.innerHTML='<option value="">Select a team member</option>'+team.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.full_name)+' — '+esc(m.title)+'</option>').join("");
 reports.innerHTML='<option value="">No reporting parent / owner</option>'+team.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.full_name)+' — '+esc(m.title)+'</option>').join("");
 if(appVal)app.value=appVal;if(memVal)mem.value=memVal;if(repVal)reports.value=repVal;
}
function renderInterviews(){
 $("#interviewList").innerHTML=interviews.map(i=>{const a=applications.find(x=>x.id===i.application_id);return '<article class="list-card"><div class="list-card-head"><strong>'+esc(a?.name||"Applicant record")+'</strong><span class="pill '+esc(i.status)+'">'+esc(MEETING_LABELS[i.status]||i.status)+'</span></div><p>'+date(i.scheduled_at)+' · '+esc(i.duration_minutes)+' min · '+esc(i.meeting_type.replace("_"," "))+'</p>'+(i.location_or_link?'<p>'+esc(i.location_or_link)+'</p>':'')+(i.notes?'<small>'+esc(i.notes)+'</small>':'')+'<div class="inline-actions"><select data-interview-status="'+esc(i.id)+'">'+Object.entries(MEETING_LABELS).map(([v,l])=>'<option value="'+v+'" '+(i.status===v?"selected":"")+'>'+l+'</option>').join("")+'</select><button class="text-button" data-delete-interview="'+esc(i.id)+'">Delete</button></div></article>'}).join("")||'<div class="empty">No conversations scheduled yet.</div>';
 $$("[data-interview-status]").forEach(s=>s.addEventListener("change",()=>updateRow("recruitment_interviews",s.dataset.interviewStatus,{status:s.value,updated_at:new Date().toISOString()},"Interview status updated.")));
 $$("[data-delete-interview]").forEach(b=>b.addEventListener("click",()=>deleteRow("recruitment_interviews",b.dataset.deleteInterview,"Delete this scheduled conversation?")));
}
function renderPositions(){
 $("#positionCount").textContent=positions.length;
 $("#positionList").innerHTML=positions.map(p=>'<article class="list-card"><div class="list-card-head"><strong>'+esc(p.title)+'</strong><span class="pill">'+esc(p.compensation_status.replace("_"," "))+'</span></div><small>'+esc(p.department)+' · '+esc(p.division||"Company-wide")+'</small><p>'+esc(p.description||"No description yet.")+'</p><div class="inline-actions"><label class="compact-label">Funding<select data-position-funding="'+esc(p.id)+'"><option value="unfunded">Unfunded</option><option value="funding_planned">Funding explored</option><option value="funded">Funding identified</option><option value="paid">Paid approved</option></select></label><label class="compact-label">Listing<select data-position-active="'+esc(p.id)+'"><option value="true">Active plan</option><option value="false">Archived</option></select></label></div><small class="muted">Planning record only · not an open vacancy</small></article>').join("")||'<div class="empty">No future positions in the planner.</div>';
 $$("[data-position-funding]").forEach(s=>{const p=positions.find(x=>x.id===s.dataset.positionFunding);s.value=p?.compensation_status||"unfunded";s.addEventListener("change",()=>updateRow("recruitment_positions",s.dataset.positionFunding,{compensation_status:s.value,updated_at:new Date().toISOString()},"Funding status updated."))});
 $$("[data-position-active]").forEach(s=>{const p=positions.find(x=>x.id===s.dataset.positionActive);s.value=String(p?.is_active??true);s.addEventListener("change",()=>updateRow("recruitment_positions",s.dataset.positionActive,{is_active:s.value==="true",updated_at:new Date().toISOString()},"Position plan updated."))});
}
function renderTeam(){
 $("#teamCount").textContent=team.length;
 $("#teamList").innerHTML=team.map(m=>'<article class="list-card team-member-card"><div class="list-card-head"><strong>'+esc(m.full_name)+'</strong><span class="pill">'+esc(m.status)+'</span></div><small>'+esc(m.title)+' · '+esc(m.division||m.department||"Company-wide")+'</small><p>'+esc(m.bio||"No bio added.")+'</p><div class="team-record-meta"><span>'+esc(m.department||"No department")+'</span><span>Order: '+esc(m.sort_order??0)+'</span><span>'+(m.is_public?"Public profile approved":"Private profile")+'</span></div><div class="inline-actions"><button class="btn btn-outline btn-small" type="button" data-edit-team="'+esc(m.id)+'">Edit profile</button><label class="compact-label">Status<select data-team-status="'+esc(m.id)+'"><option value="planned">Planned</option><option value="active">Active</option><option value="paused">Paused</option><option value="former">Former</option></select></label><label class="check-label"><input type="checkbox" data-team-public="'+esc(m.id)+'" '+(m.is_public?"checked":"")+'> Public profile</label></div></article>').join("")||'<div class="empty">No team profiles yet. Create initial leadership profiles to begin the chart.</div>';
 $$("[data-edit-team]").forEach(b=>b.addEventListener("click",()=>startTeamEdit(b.dataset.editTeam)));
 $$("[data-team-status]").forEach(s=>{const m=team.find(x=>x.id===s.dataset.teamStatus);s.value=m?.status||"planned";s.addEventListener("change",()=>updateRow("recruitment_team_members",s.dataset.teamStatus,{status:s.value,updated_at:new Date().toISOString()},"Team status updated."))});
 $$("[data-team-public]").forEach(c=>c.addEventListener("change",()=>updateRow("recruitment_team_members",c.dataset.teamPublic,{is_public:c.checked,updated_at:new Date().toISOString()},"Profile visibility updated.")));
}
function startTeamEdit(id){
 const m=team.find(x=>x.id===id);if(!m)return;
 editingTeamId=id;
 const f=$("#teamForm");
 f.elements.full_name.value=m.full_name||"";
 f.elements.title.value=m.title||"";
 f.elements.department.value=m.department||"";
 f.elements.division.value=m.division||"";
 f.elements.bio.value=m.bio||"";
 f.elements.profile_url.value=m.profile_url||"";
 f.elements.avatar_url.value=m.avatar_url||"";
 f.elements.status.value=m.status||"planned";
 f.elements.is_public.checked=!!m.is_public;
 f.elements.sort_order.value=m.sort_order??0;
 const reports=$("#reportsTo");
 reports.innerHTML='<option value="">No reporting parent / owner</option>'+team.filter(x=>x.id!==id).map(x=>'<option value="'+esc(x.id)+'">'+esc(x.full_name)+' — '+esc(x.title)+'</option>').join("");
 reports.value=m.reports_to_member_id||"";
 $("#teamFormHeading").textContent="Edit team profile";
 $("#teamSubmitButton").textContent="Save team changes";
 $("#cancelTeamEdit").classList.remove("hidden");
 f.scrollIntoView({behavior:"smooth",block:"start"});
}
function cancelTeamEdit(){
 editingTeamId=null;
 const f=$("#teamForm");f.reset();
 $("#teamFormHeading").textContent="Add a team profile";
 $("#teamSubmitButton").textContent="Create team profile";
 $("#cancelTeamEdit").classList.add("hidden");
 populateSelects();
}
function renderAssignments(){
 $("#assignmentList").innerHTML=assignments.map(a=>{const m=team.find(x=>x.id===a.team_member_id);return '<article class="list-card"><div class="list-card-head"><strong>'+esc(a.title)+'</strong><span class="pill">'+esc(a.status.replace("_"," "))+'</span></div><small>'+esc(m?.full_name||"Team member")+' · '+esc(a.division||"Company-wide")+'</small><p>'+esc(a.description||"No description.")+'</p><div class="inline-actions"><select data-assignment-status="'+esc(a.id)+'"><option value="planned">Planned</option><option value="active">Active</option><option value="on_hold">On hold</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><button class="text-button" data-delete-assignment="'+esc(a.id)+'">Delete</button></div></article>'}).join("")||'<div class="empty">No assignment plans yet.</div>';
 $$("[data-assignment-status]").forEach(s=>{const a=assignments.find(x=>x.id===s.dataset.assignmentStatus);s.value=a?.status||"planned";s.addEventListener("change",()=>updateRow("recruitment_assignments",s.dataset.assignmentStatus,{status:s.value,updated_at:new Date().toISOString()},"Assignment plan updated."))});
 $$("[data-delete-assignment]").forEach(b=>b.addEventListener("click",()=>deleteRow("recruitment_assignments",b.dataset.deleteAssignment,"Delete this assignment plan?")));
}
function renderOrgChart(){
 const owner=team.find(m=>m.title==="Founder & Owner"&&m.full_name==="Jonathan Riehle");
 const roots=team.filter(m=>m.id!==owner?.id&&(!m.reports_to_member_id||m.reports_to_member_id===owner?.id));
 function node(m,depth=0,seen=new Set()){
  if(seen.has(m.id))return "";const next=new Set(seen);next.add(m.id);
  const children=team.filter(x=>x.reports_to_member_id===m.id);
  return '<div class="org-node"><div class="org-person"><div class="avatar">'+esc(initials(m.full_name))+'</div><div><strong>'+esc(m.full_name)+'</strong><small>'+esc(m.title)+' · '+esc(m.status)+'</small></div></div>'+(children.length?'<div class="org-children">'+children.map(c=>node(c,depth+1,next)).join("")+'</div>':'')+'</div>';
 }
 $("#orgChart").innerHTML=roots.map(m=>node(m)).join("")||'<div class="empty">No team profiles created yet. Add a team profile and set its reporting relationship.</div>';
}
async function updateRow(table,id,patch,msg){const {error}=await client().from(table).update(patch).eq("id",id);if(error){notify("Update failed: "+error.message,true);return}notify(msg);await loadAll();if(selectedApplication)renderApplications()}
async function deleteRow(table,id,confirmText){if(!window.confirm(confirmText))return;const {error}=await client().from(table).delete().eq("id",id);if(error){notify("Delete failed: "+error.message,true);return}notify("Record deleted.");await loadAll()}
function showTab(name){$$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===name));$$(".panel-section").forEach(p=>p.classList.toggle("active",p.id==="panel-"+name));if(name==="applications")renderApplications()}
async function handleLogin(e){
 e.preventDefault();const f=e.currentTarget,v=formObject(f);const status=$("#loginStatus"),button=f.querySelector("button");button.disabled=true;button.textContent="Checking access…";status.textContent="";
 try{
  const {data,error}=await client().auth.signInWithPassword({email:v.email,password:v.password});
  if(error)throw error;
  const {data:userData,error:userError}=await client().auth.getUser();
  if(userError||!userData.user)throw Error("Could not verify this sign-in.");
  currentUser=userData.user;
  // The admin-only RLS policies are the actual gate. A successful signed-in session
  // alone is not enough to read or modify any recruitment records.
  const {data:isAdmin,error:accessError}=await client().rpc("recruitment_admin_access_check");
  if(accessError||isAdmin!==true)throw Error("This account is signed in but is not authorized for CrowRules recruitment administration.");
  $("#loginView").classList.add("hidden");$("#adminView").classList.remove("hidden");$("#logoutButton").classList.remove("hidden");
  $("#signedInLabel").textContent="Signed in as "+(currentUser.email||"verified administrator");
  await loadAll();
 }catch(err){
  try{await client().auth.signOut()}catch(_){}
  status.textContent=err.message||"Sign-in failed. Check your credentials and administrator access.";
 }finally{button.disabled=false;button.textContent="Sign in securely ↗"}
}
async function handleLogout(){await client().auth.signOut();currentUser=null;applications=[];interviews=[];positions=[];team=[];assignments=[];selectedApplication=null;$("#adminView").classList.add("hidden");$("#loginView").classList.remove("hidden");$("#logoutButton").classList.add("hidden");$("#loginForm").reset();$("#loginStatus").textContent="You have signed out."}
function wireForms(){
 $("#loginForm").addEventListener("submit",handleLogin);$("#logoutButton").addEventListener("click",handleLogout);$("#cancelTeamEdit").addEventListener("click",cancelTeamEdit);
 $$(".tab").forEach(t=>t.addEventListener("click",()=>showTab(t.dataset.tab)));
 $$("[data-go]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.go)));
 $("#appSearch").addEventListener("input",renderApplications);$("#appStatusFilter").addEventListener("change",renderApplications);
 $("#refreshApplications").addEventListener("click",()=>loadAll().then(()=>notify("Recruitment data refreshed.")).catch(e=>notify(e.message,true)));
 $("#interviewForm").addEventListener("submit",async e=>{
  e.preventDefault();const f=e.currentTarget,v=formObject(f);setBusy(f,true);
  const {error}=await client().from("recruitment_interviews").insert({application_id:v.application_id,scheduled_at:new Date(v.scheduled_at).toISOString(),duration_minutes:Number(v.duration_minutes),meeting_type:v.meeting_type,location_or_link:v.location_or_link||null,notes:v.notes||null,created_by:currentUser.id});
  setBusy(f,false);if(error){notify("Could not schedule conversation: "+error.message,true);return}f.reset();notify("Conversation scheduled.");await loadAll();
 });
 $("#positionForm").addEventListener("submit",async e=>{
  e.preventDefault();const f=e.currentTarget,v=formObject(f);setBusy(f,true);
  const {error}=await client().from("recruitment_positions").insert({...v,created_by:currentUser.id,compensation_notes:v.compensation_notes||null,description:v.description||null,division:v.division||null});
  setBusy(f,false);if(error){notify("Could not add position: "+error.message,true);return}f.reset();notify("Future position added to the planner.");await loadAll();
 });
 $("#teamForm").addEventListener("submit",async e=>{
  e.preventDefault();const f=e.currentTarget,v=formObject(f);setBusy(f,true);
  const patch={full_name:v.full_name.trim(),title:v.title.trim(),department:v.department||null,division:v.division||null,bio:v.bio||null,profile_url:v.profile_url||null,avatar_url:v.avatar_url||null,reports_to_member_id:v.reports_to_member_id||null,status:v.status,is_public:isChecked(f,"is_public"),sort_order:Number(v.sort_order)||0,updated_at:new Date().toISOString()};
  const result=editingTeamId
   ? await client().from("recruitment_team_members").update(patch).eq("id",editingTeamId)
   : await client().from("recruitment_team_members").insert({...patch,created_by:currentUser.id});
  setBusy(f,false);
  if(result.error){notify("Could not "+(editingTeamId?"update":"create")+" team profile: "+result.error.message,true);return}
  const wasEditing=!!editingTeamId;cancelTeamEdit();notify(wasEditing?"Team profile updated.":"Team profile created.");await loadAll();
 });
 $("#assignmentForm").addEventListener("submit",async e=>{
  e.preventDefault();const f=e.currentTarget,v=formObject(f);setBusy(f,true);
  const {error}=await client().from("recruitment_assignments").insert({team_member_id:v.team_member_id,title:v.title,description:v.description||null,division:v.division||null,status:v.status,start_date:v.start_date||null,end_date:v.end_date||null,created_by:currentUser.id});
  setBusy(f,false);if(error){notify("Could not save assignment plan: "+error.message,true);return}f.reset();notify("Assignment plan saved.");await loadAll();
 });
}
async function init(){
 wireForms();
 try{
  const {data,error}=await client().auth.getSession();if(error)throw error;
  if(data.session){
   const {data:userData,error:userError}=await client().auth.getUser();
   if(!userError&&userData.user){
    currentUser=userData.user;
    const {data:isAdmin,error:accessError}=await client().rpc("recruitment_admin_access_check");
    if(!accessError&&isAdmin===true){$("#loginView").classList.add("hidden");$("#adminView").classList.remove("hidden");$("#logoutButton").classList.remove("hidden");$("#signedInLabel").textContent="Signed in as "+(currentUser.email||"verified administrator");await loadAll();}
    else await client().auth.signOut();
   }
  }
 }catch(err){console.error("Recruitment admin initialization:",err)}
}
document.addEventListener("DOMContentLoaded",init);
})();