(() => {
  "use strict";
  const SUPABASE_URL = "https://cevylpnoexugwgygvtgu.supabase.co";
  const SUPABASE_KEY = "sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
  let db = null;
  let sessionHash = "";
  try {
    sessionHash = sessionStorage.getItem("tn-growth-session") || "";
    if (!/^[0-9a-f-]{36}$/i.test(sessionHash)) {
      sessionHash = crypto.randomUUID();
      sessionStorage.setItem("tn-growth-session", sessionHash);
    }
  } catch (_) {}
  function client() {
    if (!db && window.supabase?.createClient) {
      db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
    }
    return db;
  }
  function track(eventType, details = {}) {
    try {
      const supabase = client();
      if (!supabase) return;
      const metadata = {};
      Object.entries(details).forEach(([key, value]) => {
        if (typeof value === "string") metadata[key] = value.slice(0, 180);
      });
      let referrerHost = "";
      try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ""; } catch (_) {}
      metadata.referrer_host = referrerHost;
      supabase.from("tacoma_nights_analytics_events").insert({
        event_type: eventType,
        youtube_video_id: details.videoId || null,
        page_path: location.pathname.slice(0, 240),
        session_hash: sessionHash || null,
        metadata
      }).then(({ error }) => {
        if (error) console.debug("Tacoma Nights analytics unavailable:", error.message);
      });
    } catch (_) {}
  }
  function videoIdFromUrl(url) {
    try {
      const parsed = new URL(url, location.href);
      return parsed.searchParams.get("v") || parsed.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/)?.[1] || parsed.pathname.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)?.[1] || "";
    } catch (_) { return ""; }
  }
  function setMeta(selector, content) {
    let node = document.querySelector(selector);
    if (!node) {
      const match = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (!match) return;
      node = document.createElement("meta");
      node.setAttribute(match[1], match[2]);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }
  function syncVideoSeo() {
    const title = document.getElementById("featuredTitle")?.textContent?.trim();
    const description = document.getElementById("featuredDescription")?.textContent?.trim();
    const frame = document.querySelector("#featuredVideo iframe");
    const videoId = frame ? videoIdFromUrl(frame.src) : "";
    if (!title || !videoId) return;
    setMeta('meta[property="og:title"]', title + " | Tacoma Nights");
    setMeta('meta[property="og:description"]', description || "A Tacoma Nights episode from CrowRules Entertainment.");
    setMeta('meta[property="og:type"]', "video.other");
    setMeta('meta[property="og:video"]', "https://www.youtube-nocookie.com/embed/" + videoId);
    setMeta('meta[name="twitter:card"]', "player");
    setMeta('meta[name="twitter:title"]', title + " | Tacoma Nights");
    let schema = document.getElementById("tacoma-nights-video-jsonld");
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "tacoma-nights-video-jsonld";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    const data = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": title,
      "description": description || "A Tacoma Nights episode from CrowRules Entertainment.",
      "thumbnailUrl": ["https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg"],
      "embedUrl": "https://www.youtube-nocookie.com/embed/" + videoId,
      "url": location.origin + location.pathname + "?episode=" + videoId,
      "publisher": {
        "@type": "Organization",
        "name": "CrowRules Entertainment",
        "url": "https://crowrulesentertainment-oss.github.io/crowrulesentertainment/"
      }
    };
    const dateText = document.getElementById("featuredDate")?.textContent?.trim();
    if (dateText && !Number.isNaN(Date.parse(dateText))) data.uploadDate = new Date(dateText).toISOString();
    schema.textContent = JSON.stringify(data);
  }
  document.addEventListener("DOMContentLoaded", () => {
    track("event_click", { action: "page_view" });
    document.addEventListener("click", event => {
      const link = event.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (/remote-host\.html/i.test(href)) {
        track("guest_pitch", { action: "remote_host_application_click", label: link.textContent.trim() });
      }
      if (/youtube\.com\/(watch|playlist)/i.test(href)) {
        track("episode_outbound_click", { target: href.includes("watch") ? "video" : "playlist", label: link.textContent.trim(), videoId: videoIdFromUrl(href) });
      }
    });
    const archive = document.getElementById("episodeGrid");
    if (archive) archive.addEventListener("click", event => {
      const link = event.target.closest("a");
      if (link) track("episode_open", { videoId: videoIdFromUrl(link.href), label: link.textContent.trim() });
    });
    const form = document.getElementById("communityForm");
    if (form) form.addEventListener("submit", () => track("community_submission", { form: "community_idea" }));
    const featured = document.getElementById("featuredVideo");
    const title = document.getElementById("featuredTitle");
    if (featured) new MutationObserver(syncVideoSeo).observe(featured, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    if (title) new MutationObserver(syncVideoSeo).observe(title, { childList: true, subtree: true, characterData: true });
    window.setTimeout(syncVideoSeo, 2500);
  });
})();