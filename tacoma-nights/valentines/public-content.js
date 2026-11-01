(() => {
 const cfg=window.CROWRULES_SUPABASE;const create=window.supabase?.createClient;
 const $=id=>document.getElementById(id);
 const add=(parent,tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;parent.appendChild(n);return n;};
 const link=(parent,url,label)=>{if(!url||!/^https?:\/\//i.test(url))return;const a=add(parent,"a","feed-link",label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label+" ↗";};
 const date=value=>{if(!value)return "";const d=new Date(value);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"short",timeZone:"America/Los_Angeles"}).format(d)+" Pacific";};
 const empty=(node,message)=>{node.replaceChildren();add(node,"p","feed-empty",message);};
 const client=cfg&&create?create(cfg.url,cfg.publishableKey):null;
 if(!client){["featuredListings","communityFeed"].forEach(id=>{const n=$(id);if(n)empty(n,"Community listings will appear here as the project goes live.");});return;}
 async function load(){
  const featured=$("featuredListings"),feed=$("communityFeed");
  const [businesses,content]=await Promise.all([
   client.from("valentines_featured_listings").select("id,name,description,category,website_url,address,image_url,display_label").eq("is_published",true).order("sort_order").limit(6),
   client.from("valentines_public_content").select("id,submission_type,title,body,submitter_name,organization,category,website_url,address,event_start,event_end,registration_url,created_at").order("created_at",{ascending:false}).limit(60)
  ]);
  if(featured){featured.replaceChildren();if(businesses.error||!businesses.data?.length)empty(featured,"Featured businesses will appear here as verified listings are approved.");else{businesses.data.forEach(x=>{const card=add(featured,"article","feed-card");if(x.image_url&&/^https?:\/\//i.test(x.image_url)){const img=add(card,"img","feed-image");img.src=x.image_url;img.alt="";img.loading="lazy";}add(card,"small","feed-kicker",x.display_label||x.category||"TACOMA BUSINESS");add(card,"h3","",x.name);add(card,"p","",x.description);if(x.address)add(card,"p","feed-meta",x.address);link(card,x.website_url,"Visit website");});}}
  if(feed){feed.replaceChildren();if(content.error||!content.data?.length)empty(feed,"Approved community messages, stories, and events will appear here.");else{const selected=content.data.filter(x=>["event","love_message","story"].includes(x.submission_type));if(!selected.length){empty(feed,"No community stories or event submissions have been published yet.");return;}selected.slice(0,12).forEach(x=>{const card=add(feed,"article","feed-card");const type=x.submission_type==="love_message"?"LOVE WALL":x.submission_type==="story"?"TACOMA LOVE STORY":"COMMUNITY EVENT";add(card,"small","feed-kicker",type);add(card,"h3","",x.title);add(card,"p","",x.body);const details=[x.submitter_name,x.organization,date(x.event_start)].filter(Boolean).join(" · ");if(details)add(card,"p","feed-meta",details);link(card,x.registration_url||x.website_url,"More information");});}}
 }
 load();
})();