(() => {
 const cfg=window.CROWRULES_SUPABASE,create=window.supabase?.createClient;
 const $=id=>document.getElementById(id);
 const add=(parent,tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;parent.appendChild(n);return n;};
 const link=(parent,url,label)=>{if(!url||!/^https?:\/\//i.test(url))return;const a=add(parent,"a","feed-link",label+" ↗");a.href=url;a.target="_blank";a.rel="noopener noreferrer";};
 const date=value=>{if(!value)return "";const d=new Date(value);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"short",timeZone:"America/Los_Angeles"}).format(d)+" Pacific";};
 const empty=(node,message)=>{if(!node)return;node.replaceChildren();add(node,"p","feed-empty",message);};
 const currentSeason=()=>{const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",year:"numeric",month:"numeric",day:"numeric"}).formatToParts(new Date());const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));const y=Number(p.year);return Number(p.month)>2||(Number(p.month)===2&&Number(p.day)>14)?y+1:y;};
 let year=currentSeason();
 let seasonsCache=[];
 const client=cfg&&create?create(cfg.url,cfg.publishableKey):null;
 const setLive=msg=>{const n=$("liveStatus");if(n){n.replaceChildren();const dot=add(n,"span","live-dot");dot.setAttribute("aria-hidden","true");add(n,"span","",msg);}};
 const makeContentCard=(parent,x,label)=>{const card=add(parent,"article","feed-card");add(card,"small","feed-kicker",label);add(card,"h3","",x.title);add(card,"p","",x.body);const meta=[x.submitter_name,x.organization,date(x.event_start)].filter(Boolean).join(" · ");if(meta)add(card,"p","feed-meta",meta);link(card,x.registration_url||x.website_url,"More information");};
 const renderArchive=rows=>{const host=$("seasonArchive");if(!host)return;host.replaceChildren();if(!rows?.length){empty(host,"Annual season archives will appear here as each celebration is completed.");return;}rows.sort((a,b)=>b.season_year-a.season_year).forEach(s=>{const card=add(host,"article","archive-card");add(card,"div","archive-year",String(s.season_year));add(card,"small","",s.display_name||("LOVE IS LOCAL "+s.season_year).toUpperCase());add(card,"h3","",s.theme||"Celebrating Tacoma, together.");add(card,"p","",s.highlights||"A year of local connections, stories and community.");add(card,"span","archive-status",String(s.status||"PLANNING").toUpperCase());const choose=add(card,"button","archive-choose","Explore "+s.season_year+" season ↗");choose.type="button";choose.dataset.seasonYear=String(s.season_year);});};
 const renderSeasonPicker=rows=>{const select=$("publicSeasonSelect");if(!select)return;const years=[...new Set([year,...(rows||[]).map(s=>Number(s.season_year))])].sort((a,b)=>b-a);select.replaceChildren();years.forEach(y=>{const option=document.createElement("option");option.value=String(y);option.textContent=y===currentSeason()?y+" · Upcoming season":String(y);select.appendChild(option);});select.value=String(year);updateSeasonNote();};
 const updateSeasonNote=()=>{const n=$("seasonViewNote");if(!n)return;const s=seasonsCache.find(x=>Number(x.season_year)===year);n.textContent="Showing "+(s?.display_name||("Love Is Local "+year))+" — "+(s?.status==="archived"?"past celebration archive":s?.status==="live"?"live celebration":s?.status==="planning"?"season planning":"community listings and stories")+". Choose another year to explore its approved content.";};
 const selectSeason=next=>{const n=Number(next);if(!Number.isInteger(n)||n<2027||n>2100||n===year)return;year=n;const picker=$("publicSeasonSelect");if(picker)picker.value=String(year);updateSeasonNote();setLive("LOADING "+year+" SEASON");load();};
 async function load(){
  const featured=$("featuredListings"),feed=$("communityFeed"),eventsHost=$("approvedEvents"),gallery=$("photoGallery");
  const [businesses,content,seasons,contentCount,listingCount]=await Promise.all([
   client.from("valentines_featured_listings").select("id,name,description,category,website_url,address,image_url,display_label,season_year").eq("is_published",true).eq("season_year",year).order("sort_order").limit(12),
   client.from("valentines_public_content").select("id,submission_type,title,body,submitter_name,organization,category,website_url,address,event_start,event_end,registration_url,created_at,season_year").eq("season_year",year).order("created_at",{ascending:false}).limit(100),
   client.from("valentines_seasons").select("season_year,display_name,event_date,theme,status,highlights").order("season_year",{ascending:false}).limit(30),
   client.from("valentines_public_content").select("id",{count:"exact",head:true}).eq("season_year",year),
   client.from("valentines_featured_listings").select("id",{count:"exact",head:true}).eq("is_published",true).eq("season_year",year)
  ]);
  if(featured){featured.replaceChildren();if(businesses.error||!businesses.data?.length)empty(featured,"Featured businesses will appear here as listings are approved for the "+year+" season.");else businesses.data.slice(0,6).forEach(x=>{const card=add(featured,"article","feed-card");if(x.image_url&&/^https?:\/\//i.test(x.image_url)){const img=add(card,"img","feed-image");img.src=x.image_url;img.alt=x.name+" — Tacoma community partner";img.loading="lazy";}add(card,"small","feed-kicker",x.display_label||x.category||"TACOMA BUSINESS");add(card,"h3","",x.name);add(card,"p","",x.description);if(x.address)add(card,"p","feed-meta",x.address);link(card,x.website_url,"Visit website");});}
  const rows=content.data||[];
  if(content.error){empty(feed,"Approved community stories will appear here.");empty(eventsHost,"Approved community events will appear here.");setLive("COMMUNITY FEED TEMPORARILY UNAVAILABLE");}
  else {
   const events=rows.filter(x=>x.submission_type==="event"),stories=rows.filter(x=>["love_message","story"].includes(x.submission_type));
   if(eventsHost){eventsHost.replaceChildren();if(!events.length)empty(eventsHost,"Community events will appear here as organizers submit details and the team approves them.");else events.slice(0,9).forEach(x=>makeContentCard(eventsHost,x,"COMMUNITY EVENT"));}
   if(feed){feed.replaceChildren();if(!stories.length)empty(feed,"Approved Love Wall messages and Tacoma stories will appear here.");else stories.slice(0,9).forEach(x=>makeContentCard(feed,x,x.submission_type==="love_message"?"LOVE WALL":"TACOMA LOVE STORY"));}
   const counter=$("communityCounter");if(counter)counter.textContent=String((contentCount.count||rows.length)+(listingCount.count||(businesses.data||[]).length));
  }
  const images=(businesses.data||[]).filter(x=>x.image_url&&/^https?:\/\//i.test(x.image_url));
  if(gallery){gallery.replaceChildren();if(!images.length)empty(gallery,"Approved community photographs will appear here as local partners add images to their featured listings.");else images.forEach(x=>{const card=add(gallery,"article","photo-card"),img=add(card,"img");img.src=x.image_url;img.alt=x.name+" — approved Tacoma community gallery photograph";img.loading="lazy";const info=add(card,"div");add(info,"small","",x.category||"LOCAL LOVE");add(info,"h3","",x.name);add(info,"p","",x.description);link(info,x.website_url,"Visit local partner");});}
  if(seasons.error){renderArchive([{season_year:year,display_name:"Love Is Local "+year,status:"open",theme:"Celebrating Tacoma. Connecting Neighbors. Sharing Love."}]);}else{seasonsCache=seasons.data||[];renderArchive(seasonsCache);renderSeasonPicker(seasonsCache);}
  setLive("LIVE COMMUNITY UPDATES · "+year+" SEASON");
 }
 if(!client){["featuredListings","communityFeed","approvedEvents","photoGallery"].forEach(id=>empty($(id),"Community listings will appear here as approved submissions are published."));renderArchive([]);setLive("COMMUNITY CONNECTION UNAVAILABLE");return;}
 load();
 $("publicSeasonSelect")?.addEventListener("change",e=>selectSeason(e.target.value));
 $("seasonArchive")?.addEventListener("click",e=>{const b=e.target.closest("[data-season-year]");if(b)selectSeason(b.dataset.seasonYear);});
 const channel=client.channel("love-is-local-live")
  .on("postgres_changes",{event:"*",schema:"public",table:"valentines_submissions"},load)
  .on("postgres_changes",{event:"*",schema:"public",table:"valentines_featured_listings"},load)
  .on("postgres_changes",{event:"*",schema:"public",table:"valentines_seasons"},load)
  .subscribe(status=>{if(status==="SUBSCRIBED")setLive("LIVE COMMUNITY UPDATES · "+year+" SEASON");});
 window.addEventListener("beforeunload",()=>client.removeChannel(channel),{once:true});
})();