/* CrowRules Podcasting Navigation Configuration V4
 * Single source of truth for Podcasting navigation destinations.
 * Add/edit destinations here; the renderer does not need to change.
 */
window.CROWRULES_PODCAST_NAV_CONFIG={
 version:4,
 base:"https://crowrulesentertainment-oss.github.io/podcasting/",
 groups:[
  {id:"creator",title:"CREATOR STUDIO",items:[
   {label:"Studio",file:"creator-dashboard.html",icon:"⌂"},
   {label:"My Podcasts",file:"podcasts.html",icon:"◉"},
   {label:"Create Podcast",file:"create-podcast.html",icon:"＋"},
   {label:"Create Episode",file:"create-episode.html",icon:"＋"},
   {label:"Pipeline",file:"publishing-pipeline.html",icon:"▸"},
   {label:"Intelligence",file:"creator-intelligence.html",icon:"✦"},
   {label:"Analytics",file:"analytics.html",icon:"◒"},
   {label:"Calendar",file:"release-calendar.html",icon:"□"},
   {label:"Distribution",file:"distribution.html",icon:"↗"},
   {label:"Profile",file:"creator-profile.html",icon:"◎"},
   {label:"Payouts",file:"creator-payouts.html",icon:"$"},
   {label:"Account",file:"account.html",icon:"⚙"}
  ]},
  {id:"listener",title:"LISTENER",items:[
   {label:"Podcasts",file:"podcasts.html"},
   {label:"Discover",file:"discover.html"},
   {label:"Following",file:"following.html"},
   {label:"Favorites",file:"favorites.html"},
   {label:"Listening History",file:"history.html"}
  ]},
  {id:"admin",title:"ADMIN",items:[
   {label:"Admin Center",file:"admin.html"},
   {label:"Moderation",file:"moderation.html"},
   {label:"Publishing",file:"publishing.html"},
   {label:"Health",file:"health.html"},
   {label:"Analytics",file:"analytics.html"}
  ]}
 ]
};
