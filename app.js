const SUPABASE_URL='https://zauxdqyssratvzmomozf.supabase.co';
const SUPABASE_KEY='sb_publishable_-Z6wecSOxwOk6IBut2zLn_8DfRxnE9';
const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const dt=v=>v?new Date(v).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'';
const money=(n,c='USD')=>new Intl.NumberFormat('en-US',{style:'currency',currency:c}).format(Number(n)||0);
async function rows(t){if(!sb)return [];const r=await sb.from(t).select('*');return r.error?[]:(r.data||[])}
function nav(active){return `<header class="top"><div class="wrap nav"><a class="brand" href="index.html">CROW<span>RULES</span> <b>ENT.</b></a><nav><a href="index.html">Hub</a><a href="divisions.html">Divisions</a><a href="projects.html">Projects</a><a href="roadmap.html">Roadmap</a><a href="news.html">News</a><a href="updates.html">Updates</a><a href="partners.html">Partners</a><a href="support.html">Support</a><a href="admin.html">Admin</a></nav></div></header>`}
function foot(){return `<footer><div class="wrap foot"><div><b style="color:#fff;font-family:Orbitron">CROWRULES ENTERTAINMENT</b><br>One Company. One Universe.</div><div>Business Hub · ${new Date().getFullYear()}</div></div></footer>`}
