(()=>{"use strict";
const URL="https://cevylpnoexugwgygvtgu.supabase.co";
const KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
let db=null;
const $=s=>document.querySelector(s);
const divisions=[
["01","CrowRules Podcasting","Active · testing","Testing open; official launch planned for January 1, 2027.","active"],
["02","CrowRules TV","Active","Original video programming and digital entertainment.","active"],
["03","Tacoma Nights","Active","Tacoma and South Sound conversations, community and stories.","active"],
["04","Back Deck Live","Active","Independent live conversation and community programming.","active"],
["05","CrowRules Memorials","Active","A place to remember, honor and celebrate lives.","active"],
["06","CrowRules Dreamscapes","In development","A creative pathway from submitted dreams and ideas to screen projects.","development"],
["07","Tacoma Community Hub","In development","Free Tacoma and Pierce County community resources and events.","development"],
["08","CrowRules Studios","Planned","Future production and studio operations.","planned"],
["09","CrowRules+","Planned","Future streaming and digital entertainment destination.","planned"],
["10","CrowRules Records","Planned","Future music and audio label division.","planned"],
["11","Spectrum Awards","Planned","Digital-first recognition of voices and talent across the spectrum.","planned"],
["12","CrowRules Sports","Planned","Future sports content and community division.","planned"],
["13","CrowRules Yearbooks","Planned","Future community and memory publishing projects.","planned"]
];
function client(){if(!window.supabase?.createClient)throw Error("Supabase client did not load.");if(!db)db=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});return db}
function renderDivisions(){$("#divisions").innerHTML=divisions.map(d=>'<article class="division"><div class="division-top"><small>DIVISION '+d[0]+'</small><span class="status '+d[4]+'">'+d[2]+'</span></div><h3>'+d[1]+'</h3><p>'+d[3]+'</p></article>').join("")}
function showDashboard(user){$("#login").classList.add("hidden");$("#dashboard").classList.remove("hidden");$("#logout").classList.remove("hidden");$("#signedIn").textContent="Administrator access verified · "+(user.email||"CrowRules administrator")}
async function verifySession(){const {data,error}=await client().auth.getSession();if(error||!data.session)return;const {data:u,error:ue}=await client().auth.getUser();if(ue||!u.user)return;const {data:ok,error:ae}=await client().rpc("recruitment_admin_access_check");if(ae||ok!==true){await client().auth.signOut();return}showDashboard(u.user)}
async function login(e){e.preventDefault();const f=e.currentTarget,b=f.querySelector("button"),status=$("#status"),v=Object.fromEntries(new FormData(f));b.disabled=true;b.textContent="Verifying…";status.textContent="";try{const {error}=await client().auth.signInWithPassword({email:v.email,password:v.password});if(error)throw error;const {data:u,error:ue}=await client().auth.getUser();if(ue||!u.user)throw Error("Could not verify this sign-in.");const {data:ok,error:ae}=await client().rpc("recruitment_admin_access_check");if(ae||ok!==true)throw Error("This account is not authorized for CrowRules administration.");showDashboard(u.user)}catch(err){try{await client().auth.signOut()}catch(_){}status.textContent=err.message||"Sign-in failed."}finally{b.disabled=false;b.textContent="Verify administrator access ↗"}}
async function logout(){await client().auth.signOut();$("#dashboard").classList.add("hidden");$("#login").classList.remove("hidden");$("#logout").classList.add("hidden");$("#loginForm").reset();$("#status").textContent="You have signed out."}
document.addEventListener("DOMContentLoaded",()=>{$("#year").textContent=new Date().getFullYear();renderDivisions();$("#loginForm").addEventListener("submit",login);$("#logout").addEventListener("click",logout);verifySession().catch(e=>console.error("Command Center session check:",e))});
})();