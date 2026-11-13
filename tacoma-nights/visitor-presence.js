/* Tacoma Nights shared live visitor presence for secondary show pages.
   Location is opt-in only; coordinates are rounded before they enter Realtime Presence. */
(function(){
 if(window.__tnSharedPresenceStarted)return;window.__tnSharedPresenceStarted=true;
 const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
 const SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
 const visitorId=(()=>{try{let id=localStorage.getItem("tn-sitewide-visitor-id");if(!id){id=(crypto.randomUUID?crypto.randomUUID():"tn-"+Date.now()+"-"+Math.random().toString(36).slice(2));localStorage.setItem("tn-sitewide-visitor-id",id);}return id;}catch(_){return "tn-"+Date.now()+"-"+Math.random().toString(36).slice(2);}})();
 const sessionId=crypto.randomUUID?crypto.randomUUID():"session-"+Date.now()+"-"+Math.random().toString(36).slice(2);
 let client=null,channel=null,locationData=null;
 const button=document.createElement("button");button.type="button";button.textContent="Share approximate location";
 button.setAttribute("aria-label","Choose whether to share your approximate location with the Tacoma Nights live visitor map");
 button.style.cssText="position:fixed;z-index:99990;left:14px;bottom:14px;padding:9px 12px;border:1px solid #d7ad70aa;border-radius:3px;background:#0b111bf0;color:#f0d7ac;font:700 11px Arial,sans-serif;letter-spacing:.04em;box-shadow:0 6px 24px #0008;cursor:pointer";
 document.body.appendChild(button);
 const payload=()=>({visitorId,pagePath:location.pathname,pageTitle:document.title,page:"tacoma-nights",onlineAt:new Date().toISOString(),...(locationData?{approxLocation:locationData,locationShared:true}:{})});
 async function track(){if(channel)await channel.track(payload());}
 button.addEventListener("click",()=>{
  if(locationData){locationData=null;button.textContent="Share approximate location";track().catch(()=>{});return;}
  if(!navigator.geolocation){button.textContent="Location unavailable";return;}
  button.disabled=true;button.textContent="Requesting permission…";
  navigator.geolocation.getCurrentPosition(async p=>{
   locationData={latitude:Math.round(p.coords.latitude*10)/10,longitude:Math.round(p.coords.longitude*10)/10,accuracyKm:Math.max(5,Math.round((p.coords.accuracy||5000)/1000)),sharedAt:new Date().toISOString()};
   try{await track();button.textContent="Location shared · click to stop";}catch(e){locationData=null;button.textContent="Share approximate location";}
   button.disabled=false;
  },e=>{button.disabled=false;button.textContent=e.code===1?"Location not shared":"Share approximate location";},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
 });
 function resumeSharedLocation(){
  let optedIn=false;try{optedIn=localStorage.getItem("tn-share-approx-location-v1")==="yes";}catch(_){}
  if(!optedIn||!navigator.geolocation||!navigator.permissions?.query)return;
  navigator.permissions.query({name:"geolocation"}).then(permission=>{
   if(permission.state!=="granted")return;
   navigator.geolocation.getCurrentPosition(async p=>{
    locationData={latitude:Math.round(p.coords.latitude*10)/10,longitude:Math.round(p.coords.longitude*10)/10,accuracyKm:Math.max(5,Math.round((p.coords.accuracy||5000)/1000)),sharedAt:new Date().toISOString()};
    try{await track();button.textContent="Location shared · click to stop";}catch(_){locationData=null;}
   },()=>{}, {enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  }).catch(()=>{});
 }
 function start(){
  if(!window.supabase?.createClient){const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=start;s.onerror=()=>{button.title="Live visitor tracking could not load";};document.head.appendChild(s);return;}
  try{
   client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
   channel=client.channel("tacoma-nights-sitewide-live-visitors",{config:{presence:{key:sessionId}}});
   channel.subscribe(async state=>{if(state==="SUBSCRIBED"){try{await track();button.title="You are included in live visitor totals. Location sharing is optional.";resumeSharedLocation();}catch(e){button.title="Live visitor connection unavailable";}}});
   window.addEventListener("pagehide",()=>{if(channel&&client)client.removeChannel(channel);},{once:true});
  }catch(e){button.title="Live visitor connection unavailable";}
 }
 if(window.supabase?.createClient)start();else{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=start;s.onerror=()=>{button.title="Live visitor tracking could not load";};document.head.appendChild(s);}
})();
