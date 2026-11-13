/* Workspace identity and cinematic scene selector. No auth, data, or feature code. */
(()=> {
 const p=location.pathname.toLowerCase();
 const entries=[
  ["partner-network",/tacoma-community-partner-network/,"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85"],
  ["podcasting",/\/podcasting\/admin\.html$/,"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2200&q=85"],
  ["tacoma-nights",/tacoma-nights\/control-room/,"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85"],
  ["broadcast",/broadcast-studio/,"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2200&q=85"],
  ["community-hub",/\/tacoma\/admin\.html$/,"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=2200&q=85"],
  ["back-deck",/back-deck-live\/admin/,"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85"],
  ["holiday-hub",/holidays\/admin/,"https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=2200&q=85"],
  ["dreamscapes",/dreamscapes\/admin\.html$/,"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2200&q=85"],
  ["corporate",/\/admin\.html$/,"https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=2200&q=85"]
 ];
 const hit=entries.find(x=>x[1].test(p)); if(!hit)return;
 const [id,,scene]=hit;
 document.documentElement.dataset.crWorkspace=id;
 const apply=()=>{if(!document.body)return;document.body.dataset.crWorkspace=id;document.documentElement.style.setProperty("--cr-scene",'url("'+scene+'")');};
 if(document.body)apply();else document.addEventListener("DOMContentLoaded",apply,{once:true});
})();