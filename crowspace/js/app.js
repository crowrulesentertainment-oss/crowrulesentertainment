const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
const SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
async function getSession(){return (await db.auth.getSession()).data.session}
async function auth(){
 const s=await getSession();
 if(!s){location.href="../login.html?returnTo="+encodeURIComponent(location.pathname+location.search);return null}
 return s.user;
}
async function membership(user){
 if(!user?.id)return null;
 const r=await db.from("crowspace_memberships").select("user_id,member_id,membership_plan_id,status,membership_plans(plan_key,name,level,description,features)").eq("user_id",user.id).maybeSingle();
 return r.data||null;
}
async function ensureMember(user){
 if(!user?.id)return null;
 let r=await db.from("crowspace_members").select("*").eq("user_id",user.id).maybeSingle();
 if(r.data)return r.data;
 const name=user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split("@")[0]||"Crow";
 const username=(user.user_metadata?.username||"crow-"+user.id.slice(0,8)).toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,40);
 r=await db.from("crowspace_members").insert({user_id:user.id,display_name:name,username,bio:"",is_public:true}).select("*").single();
 return r.data||null;
}
async function profile(user){
 if(!user?.id)return null;
 let r=await db.from("crowspace_profiles").select("*").eq("user_id",user.id).maybeSingle();
 if(r.data)return r.data;
 const name=user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split("@")[0]||"Crow";
 await db.from("crowspace_profiles").insert({user_id:user.id,display_name:name});
 r=await db.from("crowspace_profiles").select("*").eq("user_id",user.id).maybeSingle();
 return r.data||null;
}
function shell(active){
 if(document.querySelector(".top"))return;
 document.body.insertAdjacentHTML("afterbegin",`<header class="top"><div class="wrap nav"><a class="logo" href="index.html">CROW<b>SPACE</b></a><nav class="links">
<a class="${active==="space"?"active":""}" href="my-space.html">My Space</a>
<a class="${active==="feed"?"active":""}" href="feed.html">Feed</a>
<a class="${active==="discover"?"active":""}" href="discover.html">Discover</a>
<a class="${active==="groups"?"active":""}" href="groups.html">Groups</a>
<a class="${active==="friends"?"active":""}" href="friends.html">Friends</a>
<a class="${active==="messages"?"active":""}" href="messages.html">Messages</a>
<a class="${active==="projects"?"active":""}" href="projects.html">Projects</a>
<a class="${active==="notifications"?"active":""}" href="notifications.html">Notifications</a>
<a class="${active==="settings"?"active":""}" href="settings.html">Settings</a>
</nav><div class="spacer"></div><a class="btn small" href="../membership.html">MEMBERSHIP</a><a class="btn red small" href="../login.html">ACCOUNT</a></div></header>`);
}
async function renderMembership(target){
 const el=typeof target==="string"?$(target):target;if(!el)return;
 const u=await auth();if(!u)return;
 const m=await membership(u);
 el.innerHTML=`<div class="membership-badge"><div class="membership-mark">CR</div><div class="membership-info"><strong>UNIVERSAL CROWRULES MEMBER</strong><span>${esc(m?.membership_plans?.name||"CROW")}</span><small>Status: ${esc(m?.status||"active")}</small></div><a class="btn small" href="../membership.html">MANAGE</a></div>`;
}
async function feed(){
 const box=$("#feed-list");if(!box)return;
 const r=await db.from("crowspace_posts").select("id,author_id,body,media_url,media_type,like_count,comment_count,created_at").eq("visibility","public").eq("status","published").order("created_at",{ascending:false}).limit(40);
 if(r.error){box.innerHTML=`<div class="empty">${esc(r.error.message)}</div>`;return}
 const posts=r.data||[];
 const ids=[...new Set(posts.map(x=>x.author_id).filter(Boolean))];
 const ps=ids.length?(await db.from("crowspace_members").select("id,user_id,display_name,username,avatar_url").in("id",ids)).data||[]:[];
 const map=Object.fromEntries(ps.map(x=>[x.id,x]));
 box.innerHTML=posts.map(x=>{const p=map[x.author_id]||{};return `<article class="card post"><div class="profile-head"><img class="avatar" src="${esc(p.avatar_url||"")}" alt=""><div><strong>${esc(p.display_name||p.username||"Crow")}</strong><div class="meta">${new Date(x.created_at).toLocaleString()}</div></div></div><p>${esc(x.body)}</p><div class="post-stats">♥ ${x.like_count||0} · 💬 ${x.comment_count||0}</div></article>`}).join("")||'<div class="empty">No posts yet.</div>';
}
document.addEventListener("DOMContentLoaded",()=>shell(document.body.dataset.active||""));