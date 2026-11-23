(()=>{"use strict";
const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
const KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
const labels={active:"Active",testing:"Testing",in_development:"In development",planned:"Planned",coming_soon:"Coming soon"};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function safeUrl(value){try{const u=new URL(value);return ["http:","https:"].includes(u.protocol)?u.href:"#"}catch(_){return "#"}}
document.addEventListener("DOMContentLoaded",()=>{
 const grid=document.querySelector("#divisionGrid");
 const syncStatus=document.querySelector("#divisionSyncStatus");
 if(!grid||!window.supabase?.createClient)return;
 const db=window.supabase.createClient(SUPABASE_URL,KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 let requestInFlight=false;
 async function refreshDirectory(){
  if(requestInFlight||document.visibilityState==="hidden")return;
  requestInFlight=true;
  if(syncStatus)syncStatus.textContent="Checking for the latest division updates…";
  try{
   const {data,error}=await db.from("corporate_divisions_public")
    .select("division_number,name,description,status,public_url,launch_target,sort_order")
    .order("sort_order").order("division_number");
   if(error)throw error;
   if(!Array.isArray(data))throw new Error("The division directory returned an unexpected response.");
   if(!data.length){
    grid.innerHTML='<p class="muted">No divisions are currently published.</p>';
   }else{
    grid.innerHTML=data.map(d=>{
     const url=safeUrl(d.public_url);
     const inner='<div><span class="division-no">DIVISION '+String(d.division_number).padStart(2,"0")+'</span><h3>'+esc(d.name)+'</h3><p>'+esc(d.description)+'</p></div><div class="division-meta"><span>'+esc(labels[d.status]||d.status||"Status not set")+'</span>'+(url!=="#"?'<span>Explore ↗</span>':'<span>Coming later</span>')+'</div>';
     return url!=="#"?'<a class="division-card" href="'+esc(url)+'">'+inner+'</a>':'<article class="division-card">'+inner+'</article>';
    }).join("");
   }
   if(syncStatus)syncStatus.textContent="Portfolio synced with Division Management · Updated "+new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
  }catch(error){
   console.warn("Could not refresh the live CrowRules division directory.",error);
   if(syncStatus)syncStatus.textContent="Live updates are temporarily unavailable. The last displayed directory is being retained.";
  }finally{requestInFlight=false}
 }
 refreshDirectory();
 window.setInterval(refreshDirectory,60000);
 window.addEventListener("focus",refreshDirectory);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refreshDirectory()});
});
})();