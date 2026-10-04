/* CrowRules Podcasting Navigation Configuration V6
 * Single source of truth for Podcasting navigation destinations.
 * Add/edit destinations here; the renderer does not need to change.
 */
window.CROWRULES_PODCAST_NAV_CONFIG={
 version:7,
 base:"https://crowrulesentertainment-oss.github.io/crowrulesentertainment/podcasting/",
 groups:[
  {id:"creator",title:"CREATOR STUDIO",items:[
   {label:"Studio",file:"creator-dashboard.html",icon:"⌂",roles:["creator","admin"]},
   {label:"My Podcasts",file:"podcasts.html",icon:"◉",roles:["creator","admin"]},
   {label:"Create Podcast",file:"create-podcast.html",icon:"＋",roles:["creator","admin"]},
   {label:"Create Episode",file:"create-episode.html",icon:"＋",roles:["creator","admin"]},
   {label:"Pipeline",file:"publishing-pipeline.html",icon:"▸",roles:["creator","admin"]},
   {label:"Intelligence",file:"creator-intelligence.html",icon:"✦",roles:["creator","admin"]},
   {label:"Analytics",file:"analytics.html",icon:"◒",roles:["creator","admin"]},
   {label:"Calendar",file:"release-calendar.html",icon:"□",roles:["creator","admin"]},
   {label:"Distribution",file:"distribution.html",icon:"↗",roles:["creator","admin"]},
   {label:"Profile",file:"creator-profile.html",icon:"◎",roles:["creator","admin"]},
   {label:"Payouts",file:"creator-payouts.html",icon:"$",roles:["creator","admin"]},
   {label:"Account",file:"account.html",icon:"⚙",roles:["member","creator","admin"]}
  ]},
  {id:"listener",title:"LISTENER",items:[
   {label:"Join Podcasting",file:"signup.html",icon:"✦",roles:["public"]},
   {label:"Podcasts",file:"podcasts.html",roles:["public","member","creator","admin"]},
   {label:"Discover",file:"discover.html",roles:["public","member","creator","admin"]},
   {label:"Following",file:"following.html",roles:["member","creator","admin"]},
   {label:"Favorites",file:"favorites.html",roles:["member","creator","admin"]},
   {label:"Listening History",file:"history.html",roles:["member","creator","admin"]}
  ]},
  {id:"admin",title:"ADMIN",items:[
   {label:"Admin Center",file:"admin.html",roles:["admin"]},
   {label:"Moderation",file:"moderation.html",roles:["admin"]},
   {label:"Publishing",file:"publishing.html",roles:["admin"]},
   {label:"Health",file:"health.html",roles:["admin"]},
   {label:"Analytics",file:"analytics.html",roles:["admin"]}
  ]}
 ]
};
