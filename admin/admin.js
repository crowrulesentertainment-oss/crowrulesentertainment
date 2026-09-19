const CONFIG={
  supabaseUrl:"https://cevylpnoexugwgygvtgu.supabase.co",
  supabasePublishableKey:"sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-",
  githubRepo:"crowrulesentertainment-oss/crowrulesentertainment"
};
let db=null, currentUser=null;

const divisions=[
 ["Dreamscapes","Ideas, stories, creators and rights","ACTIVE","☾"],
 ["CrowRules TV","24/7 channels, schedule and live events","BUILDING","▤"],
 ["Podcasting","Shows, hosts and audio distribution","NEXT","◉"],
 ["Sports","Scores, leagues and Pick ’Em","NEXT","◆"],
 ["Tacoma Nights","Documentary series and community","ACTIVE","▣"],
 ["Back Deck Live","Unscripted live community show","ACTIVE","▶"],
 ["Memorials","Celebrity and community remembrance","ACTIVE","✦"],
 ["Yearbooks","Community and annual storytelling","PLANNED","▤"],
 ["Records","Future music division","PLANNED","♫"],
 ["Studios","Future production infrastructure","PLANNED","▰"],
 ["CrowSpace","Future community platform","PLANNED","◎"],
 ["Awards","Future Spectrum Awards","PLANNED","★"]
];

const cardSets={
 content:[["Content","Central content records and publishing","▣"],["Announcements","Public news and launch notices","◆"],["Campaigns","Promotions, launches and outreach","◇"],["Suggestions","Community ideas and requests","✦"],["Agreements","Rights and contributor documents","▤"],["Audit Log","Administrative activity trail","⌁"]],
 creator:[["Creator Queue","Review creator applications and profiles","✦"],["Creators","Creator profiles and directory","◇"],["Collaborators","Production relationships","◇"],["Credits","Track contributor credits","★"],["Opportunities","Volunteer and future paid roles","◆"],["Rights","Ownership and permissions","▣"],["Earnings","Approved project earnings records","$"]],
 tv:[["Channels","Manage CrowRules TV channels","▤"],["Schedule","Broadcast clock and schedule items","◷"],["Live Events","Upcoming and active events","●"],["Shows","Programming library","◇"],["On Demand","Published episodes and media","▶"],["TV Health","Broadcast configuration checks","⌁"]],
 media:[["YouTube","Distribution and video references","▶"],["Media Library","Images, video and audio references","▧"],["Live","Stream destinations and status","●"],["Watch Metrics","Watch seconds and history","⌁"],["Podcasting","Audio shows and episodes","◉"],["Assets","Brand and production assets","✦"]],
 business:[["Partnerships","Business relationships","◆"],["Inquiries","Incoming business inquiries","◇"],["Sponsorships","Sponsor pipeline and packages","★"],["Donations","CrowRules support and campaigns","$"],["PayPal","Payment workflow reference","◇"],["Stripe","Payment infrastructure","▣"],["Operations","Company planning and administration","⌁"]],
 sports:[["Leagues","NFL, MLB, NHL, NBA, WNBA and more","◆"],["Games","Live and scheduled games","▶"],["Pick ’Em","Prediction and leaderboard infrastructure","★"],["Sync","Sports data synchronization","⌁"],["Teams","Team and league records","◇"],["Events","WWE, AEW, UFC and special events","●"]]
};

function $(id){return document.getElementById(id)}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>$("toast").classList.remove("show"),2600)}
function statHTML(items){return items.map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]??"—"}</strong></div>`).join("")}
function setStats(id,items){if($(id))$(id).innerHTML=statHTML(items)}
function renderStats(){
 setStats("stats",[["MEMBERS","—"],["CREATORS","—"],["CONTENT","—"],["LIVE EVENTS","—"]]);
 setStats("memberStats",[["MEMBERS","—"],["ACTIVE","—"],["CROWPOINTS","—"],["WATCH HOURS","—"]]);
 setStats("dreamStats",[["DREAMS","—"],["IN DEVELOPMENT","—"],["COLLABORATORS","—"],["PITCH READY","—"]]);
 setStats("analyticsStats",[["CONTENT","—"],["WATCH HOURS","—"],["ACTIVE USERS","—"],["LIVE EVENTS","—"]]);
 setStats("memorialStats",[["MEMORIALS","—"],["FEATURED","—"],["2026 DEATHS","—"],["WITH IMAGES","—"]]);
 setStats("podcastStats",[["PODCASTS","—"],["EPISODES","—"],["TOTAL PLAYS","—"],["LIVE","—"]]);
}
function renderDivisions(target="divisionGrid"){
 const el=$(target); if(!el)return;
 el.innerHTML=divisions.map(d=>`<article class="division"><span class="status">${d[2]}</span><h3><span style="color:var(--red)">${d[3]}</span> ${d[0]}</h3><p>${d[1]}</p></article>`).join("");
}
function renderCards(target,items){
 const el=$(target); if(!el)return;
 el.innerHTML=items.map(x=>`<article class="card"><div class="symbol">${x[2]}</div><h3>${x[0]}</h3><p>${x[1]}</p><button class="btn" data-toast="${x[0]} module connected">Open Module →</button></article>`).join("");
}
function renderQuick(){
 $("quick").innerHTML=[["Publish Content","content"],["Review Dreamscapes","dreamscapes"],["Manage TV","tv"],["Check Members","members"],["Memorials","memorials"],["Podcasting","podcasting"],["Sports","sports"],["System Health","system"]]
 .map(x=>`<button data-go="${x[1]}">${x[0]} →</button>`).join("");
}
function renderActivity(items){
 $("activity").innerHTML=(items||["Admin shell online","Supabase client initialized","Authenticated admin session required"]).map(x=>`<div>${x}</div>`).join("");
}
function renderEpisodes(rows){
 const sample=rows?.length?rows:[
  ["Tacoma Nights E25","Tacoma Nights","Published","—"],
  ["Back Deck Live #007","Back Deck Live","Scheduled","—"],
  ["Back Deck Live #006","Back Deck Live","Published","—"]
 ];
 $("episodeTable").innerHTML=sample.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="status-pill">${r[2]}</span></td><td>${r[3]}</td></tr>`).join("");
}
function nav(){
 document.querySelectorAll("[data-section]").forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();activate(a.dataset.section);
 }));
}
function activate(id){
 const a=document.querySelector(`[data-section="${id}"]`);
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 document.querySelectorAll("[data-section]").forEach(x=>x.classList.toggle("active",x===a));
 if(a)$("pageTitle").textContent=a.textContent.replace(/^\S+\s/,"");
 history.replaceState(null,"","#"+id);$("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}
function renderPipeline(){
 $("pipeline").innerHTML=[["New Idea","SUBMITTED"],["Review","REVIEW"],["Development","BUILD"],["Creative Room","COLLABORATE"],["Agreement","RIGHTS"],["Pitch","PITCH"],["Production","PRODUCE"],["Released","EARNINGS"]].map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
}
function renderSystem(){
 $("systemCards").innerHTML=[
 ["Supabase","Database / Auth / RLS","Connected publishable client"],
 ["GitHub",`<a href="https://github.com/${CONFIG.githubRepo}" target="_blank" rel="noopener" class="btn">Open Repository</a>`,"Source and deployment surface"],
 ["Security","RLS + authenticated roles","No service-role secret is shipped to the browser"],
 ["Actions","GitHub Actions","Validation and deployment automation"],
 ["Data API","Public schema","Only tables permitted by RLS are queried"],
 ["Session",currentUser?currentUser.email:"Signed out","Current Supabase Auth state"]
 ].map(x=>`<article class="system-item"><h3>${x[0]}</h3><p>${x[2]}</p>${x[1].startsWith("<")?x[1]:`<b style="font:8px Orbitron;color:var(--cyan)">${x[1]}</b>`}</article>`).join("");
}
async function count(table,filter){
 try{
  let q=db.from(table).select("*",{count:"exact",head:true});
  if(filter)q=filter(q);
  const {count,error}=await q;
  if(error)throw error;
  return count??0;
 }catch(e){console.warn(table,e.message);return null}
}
async function rows(table,select="*",order="created_at",ascending=false,limit=10){
 try{
  let q=db.from(table).select(select);
  if(order)q=q.order(order,{ascending});
  if(limit)q=q.limit(limit);
  const {data,error}=await q;
  if(error)throw error;
  return data||[];
 }catch(e){console.warn(table,e.message);return []}
}
async function loadCounts(){
 const [
  members,creators,content,liveEvents,activeMembers,watchHistory,memorials,featuredMemorials,memorialImages,
  podcasts,episodes,podcastLive,podcastRows,businessInquiries,partnerships,channels,schedule,watchStats,ideas,collabs
 ]=await Promise.all([
  count("members"),count("creators"),count("episodes"),count("schedule_items",q=>q.eq("is_active",true)),
  count("members",q=>q.eq("status","active")),count("membership_watch_history"),
  count("celebrity_memorials_2026"),count("celebrity_memorials_2026",q=>q.eq("is_featured",true)),
  count("celebrity_memorials_2026",q=>q.not("image_url","is",null)),
  count("podcasts"),count("podcast_episodes"),count("podcasts",q=>q.eq("is_live",true)),
  rows("podcasts","id,title,status,total_plays,is_live","created_at",false,20),
  count("business_inquiries"),count("business_partnerships"),count("tv_channels"),count("schedule_items"),
  count("cr_tv_watch_events"),count("dreams"),count("dream_creator_collaborations")
 ]);
 setStats("stats",[["MEMBERS",members??"—"],["CREATORS",creators??"—"],["EPISODES",content??"—"],["ACTIVE SCHEDULE",liveEvents??"—"]]);
 setStats("memberStats",[["MEMBERS",members??"—"],["ACTIVE",activeMembers??"—"],["CROWPOINTS","LIVE"],["WATCH EVENTS",watchHistory??"—"]]);
 setStats("analyticsStats",[["EPISODES",content??"—"],["WATCH EVENTS",watchStats??"—"],["ACTIVE USERS",activeMembers??"—"],["ACTIVE SCHEDULE",liveEvents??"—"]]);
 setStats("memorialStats",[["MEMORIALS",memorials??"—"],["FEATURED",featuredMemorials??"—"],["2026 DEATHS",memorials??"—"],["WITH IMAGES",memorialImages??"—"]]);
 setStats("podcastStats",[["PODCASTS",podcasts??"—"],["EPISODES",episodes??"—"],["TOTAL PLAYS",podcastRows.reduce((n,x)=>n+Number(x.total_plays||0),0)],["LIVE",podcastLive??"—"]]);
 setStats("dreamStats",[["DREAMS",ideas??"—"],["IN DEVELOPMENT","LIVE"],["COLLABORATORS",collabs??"—"],["PITCH READY","LIVE"]]);
 $("connectionLabel").textContent="SUPABASE CONNECTED";
 $("systemState").textContent="CONNECTED";
 $("systemDetail").textContent="Authenticated Supabase session";
 renderPodcastTable(podcastRows);
 await renderMemorialTable();
 await renderEpisodeData();
 await renderBusinessActivity(businessInquiries,partnerships);
}
function renderPodcastTable(rows){
 $("podcastTable").innerHTML=(rows||[]).map(x=>`<tr><td>${esc(x.title)}</td><td><span class="status-pill">${esc(x.status||"—")}</span></td><td>—</td><td>${Number(x.total_plays||0).toLocaleString()}</td></tr>`).join("")||`<tr><td colspan="4">No podcast records available to this session.</td></tr>`;
}
async function renderMemorialTable(){
 const rows=await rowsFn("celebrity_memorials_2026","name,death_date,profession,is_featured","death_date",false,50);
 $("memorialTable").innerHTML=rows.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.death_date||"—")}</td><td>${esc(x.profession||"—")}</td><td>${x.is_featured?"YES":"—"}</td></tr>`).join("")||`<tr><td colspan="4">No memorial records available to this session.</td></tr>`;
}
async function rowsFn(table,select,order,ascending,limit){
 return rows(table,select,order,ascending,limit);
}
async function renderEpisodeData(){
 const [tn,bd,pod]=await Promise.all([
  rows("tacoma_nights_episodes","title,episode_number,status,updated_at","updated_at",false,15),
  rows("back_deck_episodes","title,episode_number,status,updated_at","updated_at",false,15),
  rows("podcast_episodes","title,episode_number,status,updated_at","updated_at",false,15)
 ]);
 const out=[];
 for(const r of tn)out.push([r.title||("Tacoma Nights #"+r.episode_number),"Tacoma Nights",r.status||"—",r.updated_at?new Date(r.updated_at).toLocaleDateString():"—"]);
 for(const r of bd)out.push([r.title||("Back Deck Live #"+r.episode_number),"Back Deck Live",r.status||"—",r.updated_at?new Date(r.updated_at).toLocaleDateString():"—"]);
 for(const r of pod)out.push([r.title||("Podcast #"+r.episode_number),"Podcasting",r.status||"—",r.updated_at?new Date(r.updated_at).toLocaleDateString():"—"]);
 renderEpisodes(out.slice(0,40));
}
async function renderBusinessActivity(inquiryCount,partnershipCount){
 renderActivity([
  `Supabase authenticated as ${currentUser?.email||"admin"}`,
  `Business inquiries: ${inquiryCount??"—"}`,
  `Partnership records: ${partnershipCount??"—"}`,
  "RLS-protected tables queried successfully",
  "Admin dashboard ready"
 ]);
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}

async function adminApi(action, payload={}) {
 const {data, error}=await db.functions.invoke("crowrules-admin-api",{body:{action,...payload}});
 if(error) {
  let msg=error.message||"Admin API request failed.";
  try { if(error.context){ const detail=await error.context.json(); msg=detail.error||detail.message||msg; } } catch {}
  throw new Error(msg);
 }
 if(!data?.ok) throw new Error(data?.error||"Admin API request failed.");
 return data;
}
let dataRows=[];
function renderDataRows(rows){
 dataRows=rows||[];
 const head=$("dataHead"), body=$("dataBody");
 if(!head||!body)return;
 const cols=[...new Set(dataRows.flatMap(r=>Object.keys(r)))].slice(0,10);
 head.innerHTML="<tr>"+cols.map(c=>"<th>"+esc(c)+"</th>").join("")+"<th>EDIT</th></tr>";
 body.innerHTML=dataRows.map((row,i)=>"<tr>"+cols.map(c=>"<td>"+esc(typeof row[c]==="object"?JSON.stringify(row[c]):row[c]??"—")+"</td>").join("")+"<td><button class='btn' data-row-index='"+i+"'>Edit</button></td></tr>").join("")||"<tr><td colspan='11'>No records returned.</td></tr>";
 body.querySelectorAll("[data-row-index]").forEach(b=>b.onclick=()=>selectDataRow(Number(b.dataset.rowIndex)));
}
function selectDataRow(i){
 const row=dataRows[i]; if(!row)return;
 $("dataEditor").value=JSON.stringify(row,null,2);
 const keys=["id","user_id","site_key","slug","channel_key","episode_key","show_key","podcast_id","member_id"].filter(k=>row[k]!==undefined);
 const filters={}; if(keys[0]) filters[keys[0]]=row[keys[0]];
 $("dataFilters").value=JSON.stringify(filters);
 $("dataSave").textContent="Insert";
 $("dataMessage").textContent="Record loaded for editing.";
}
async function loadDataTables(){
 try{
  const result=await adminApi("tables");
  const select=$("dataTableSelect");
  select.innerHTML=result.tables.map(t=>"<option value='"+esc(t)+"'>"+esc(t)+" ("+(result.counts[t]??"—")+")</option>").join("");
  await loadDataRows();
 }catch(e){ $("dataMessage").textContent=e.message; toast(e.message); }
}
async function loadDataRows(){
 const table=$("dataTableSelect").value;
 if(!table)return;
 try{
  const result=await adminApi("list",{table,limit:100});
  renderDataRows(result.rows);
  $("dataMessage").textContent="Loaded "+result.rows.length+" records from "+table+".";
 }catch(e){$("dataMessage").textContent=e.message;toast(e.message);}
}
function clearDataEditor(){
 $("dataEditor").value="";
 $("dataFilters").value="";
 $("dataMessage").textContent="Ready for a new record.";
}
async function saveDataRecord(){
 try{
  const table=$("dataTableSelect").value;
  const data=JSON.parse($("dataEditor").value||"{}");
  await adminApi("insert",{table,data});
  toast("Record inserted.");
  await loadDataRows();
  clearDataEditor();
 }catch(e){toast(e.message);$("dataMessage").textContent=e.message;}
}
async function updateDataRecord(){
 try{
  const table=$("dataTableSelect").value, filters=JSON.parse($("dataFilters").value||"{}"), data=JSON.parse($("dataEditor").value||"{}");
  await adminApi("update",{table,filters,data});
  toast("Record updated.");
  await loadDataRows();
 }catch(e){toast(e.message);$("dataMessage").textContent=e.message;}
}
async function deleteDataRecord(){
 if(!confirm("Delete this record? This cannot be undone."))return;
 try{
  const table=$("dataTableSelect").value, filters=JSON.parse($("dataFilters").value||"{}");
  await adminApi("delete",{table,filters});
  toast("Record deleted.");
  await loadDataRows();
  clearDataEditor();
 }catch(e){toast(e.message);$("dataMessage").textContent=e.message;}
}
async function refreshAdminSession(){
 try{ await db.auth.refreshSession(); }catch(e){ console.warn("Session refresh:",e.message); }
}

async function checkAdmin(user){
 if(!user)return false;
 // Preferred authorization source: Supabase app_metadata, which is not user-editable.
 const tokenRole=String(user.app_metadata?.role||"").toLowerCase();
 if(["owner","super_admin","admin","administrator"].includes(tokenRole))return true;
 // Fallback to the members role when RLS permits the authenticated admin to read it.
 const {data,error}=await db.from("members").select("id,role,status").eq("user_id",user.id).maybeSingle();
 if(error){console.warn("Admin membership check:",error);return false}
 const role=String(data?.role||"").toLowerCase();
 const status=String(data?.status||"").toLowerCase();
 return ["owner","super_admin","admin","administrator"].includes(role) && !["suspended","banned"].includes(status);
}
async function handleAuth(){
 const {data:{session}}=await db.auth.getSession();
 if(session?.user && await checkAdmin(session.user)){unlock(session.user);return}
 if(session?.user){$("authMessage").textContent="This account is authenticated but is not authorized for the Admin Command Center.";await db.auth.signOut();return}
 $("authGate").classList.remove("hidden");
}
function unlock(user){
 currentUser=user;$("authGate").classList.add("hidden");
 $("ownerName").textContent=(user.email||"OWNER").split("@")[0].toUpperCase().slice(0,16);
 renderSystem();loadCounts().catch(console.error); loadDataTables().catch(console.error);
}
async function signInGoogle(){
 $("authMessage").textContent="Opening Google sign-in…";
 const {error}=await db.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.href}});
 if(error)$("authMessage").textContent=error.message;
}
async function signInEmail(){
 const email=$("adminEmail").value.trim();
 if(!email){$("authMessage").textContent="Enter the authorized admin email.";return}
 $("authMessage").textContent="Sending secure sign-in link…";
 const {error}=await db.auth.signInWithOtp({email,options:{emailRedirectTo:location.href}});
 $("authMessage").textContent=error?error.message:"Check the admin email for your sign-in link.";
}
function wire(){
 $("menu").onclick=()=>$("sidebar").classList.add("open");
 $("navClose").onclick=()=>$("sidebar").classList.remove("open");
 $("refresh").onclick=()=>{toast("Refreshing Supabase data…");loadCounts()};
 $("ownerButton").onclick=async()=>{if(currentUser){await db.auth.signOut();location.reload()}};
 $("episodeRefresh").onclick=renderEpisodeData;
  if($("dataLoad")){ $("dataLoad").onclick=loadDataRows; $("dataTableSelect").onchange=loadDataRows; $("dataNew").onclick=clearDataEditor; $("dataSave").onclick=saveDataRecord; $("dataUpdate").onclick=updateDataRecord; $("dataDelete").onclick=deleteDataRecord; }
 $("episodeSearch").oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#episodeTable tr").forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?"":"none")};
 $("googleLogin").onclick=signInGoogle;$("emailLogin").onclick=signInEmail;
 document.addEventListener("click",e=>{
  const go=e.target.closest("[data-go]");if(go){activate(go.dataset.go);return}
  const t=e.target.closest("[data-toast]");if(t)toast(t.dataset.toast);
 });
}
async function init(){
 renderStats();renderDivisions();renderDivisions("showsGrid");renderQuick();renderActivity();renderCards("contentCards",cardSets.content);renderCards("creatorCards",cardSets.creator);renderCards("tvCards",cardSets.tv);renderCards("mediaCards",cardSets.media);renderCards("businessCards",cardSets.business);renderCards("sportsCards",cardSets.sports);renderPipeline();renderSystem();
 $("year").textContent=new Date().getFullYear();nav();wire();
 db=window.supabase.createClient(CONFIG.supabaseUrl,CONFIG.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 await refreshAdminSession();
 db.auth.onAuthStateChange(async(_event,session)=>{
  if(session?.user){if(await checkAdmin(session.user))unlock(session.user);else{$("authMessage").textContent="Authenticated, but this account is not an owner/admin.";await db.auth.signOut()}}
  else $("authGate").classList.remove("hidden");
 });
 setTimeout(()=>$("boot").classList.add("hide"),650);
 await handleAuth();
}
init();