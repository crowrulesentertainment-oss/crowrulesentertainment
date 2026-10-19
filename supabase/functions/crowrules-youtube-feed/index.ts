import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY") ?? "";
const CHANNEL_HANDLE_URL = "https://www.youtube.com/@CrowRulesEntertainment";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

function reply(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

async function db(path: string, init: RequestInit = {}) {
  if (!SERVICE_KEY) throw new Error("Supabase server key is not configured");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Database request failed (${response.status}): ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : null;
}

function textByLocalName(parent: Element, name: string): string {
  for (const node of Array.from(parent.getElementsByTagName("*"))) {
    if (node.localName === name) return (node.textContent || "").trim();
  }
  return "";
}

async function discoverChannelId(): Promise<string> {
  // Stable channel ID supplied for the official CrowRules Entertainment channel.
  return "UC03D_GFGP1NqtnXwt1uXusA";
}

function decodeXml(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function xmlTag(block: string, localName: string) {
  const pattern = new RegExp("<(?:[\\\\w-]+:)?" + localName + "\\\\b[^>]*>([\\\\s\\\\S]*?)<\\\\/(?:[\\\\w-]+:)?" + localName + "\\\\s*>", "i");
  const match = block.match(pattern);
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, "").trim()) : "";
}

async function fetchLatest(channelId: string) {
  const sources = [
    "https://www.youtube.com/feeds/videos.xml?channel_id=" + encodeURIComponent(channelId),
    "https://rsshub.app/youtube/handle/CrowRulesEntertainment",
  ];
  const failures: string[] = [];
  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CrowRulesVideoFeed/1.0)" },
        redirect: "follow",
      });
      if (!response.ok) throw new Error("Feed returned " + response.status);
      const xml = await response.text();
      const entries = Array.from(xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi));
      const videos = entries.map((match) => {
        const entry = match[1];
        const id = xmlTag(entry, "videoId");
        const title = xmlTag(entry, "title") || "CrowRules Entertainment video";
        const published = xmlTag(entry, "published") || xmlTag(entry, "updated");
        return {
          video_id: id,
          title,
          published_at: published,
          video_url: "https://www.youtube.com/watch?v=" + id,
          thumbnail_url: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg",
          updated_at: new Date().toISOString(),
        };
      }).filter((video) => /^[\w-]{11}$/.test(video.video_id) && Number.isFinite(Date.parse(video.published_at)))
        .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
        .slice(0, 12);
      if (!videos.length) throw new Error("Feed returned no valid public videos");
      return videos;
    } catch (error) {
      failures.push((error instanceof Error ? error.message : "Unknown feed error") + " [" + url + "]");
    }
  }
  throw new Error("All YouTube feed sources failed: " + failures.join("; "));
}

async function refresh() {
  const states = await db("cr_youtube_feed_state?select=id,channel_id,last_checked_at,latest_video_id,last_error&id=eq.1");
  const state = states?.[0];
  const lastChecked = state?.last_checked_at ? Date.parse(state.last_checked_at) : 0;
  if (lastChecked && Date.now() - lastChecked < 4 * 60 * 1000) {
    return { skipped: true, reason: "Recently checked", last_checked_at: state.last_checked_at, latest_video_id: state.latest_video_id };
  }

  await db("cr_youtube_feed_state?id=eq.1", {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ last_checked_at: new Date().toISOString(), last_error: null }),
  });

  try {
    const channelId = state?.channel_id || await discoverChannelId();
    const videos = await fetchLatest(channelId);
    await db("cr_youtube_video_feed?on_conflict=video_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(videos),
    });
    const latest = videos[0];
    await db("cr_youtube_feed_state?id=eq.1", {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        channel_id: channelId,
        latest_video_id: latest.video_id,
        last_error: null,
        updated_at: new Date().toISOString(),
      }),
    });
    return { ok: true, checked_at: new Date().toISOString(), channel_id: channelId, latest_video_id: latest.video_id, count: videos.length, videos };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown feed refresh error";
    await db("cr_youtube_feed_state?id=eq.1", {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ last_error: message, updated_at: new Date().toISOString() }),
    });
    throw error;
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      if (body?.action !== "refresh") return reply({ error: "Use POST with action=refresh" }, 400);
      return reply(await refresh());
    }
    if (request.method !== "GET") return reply({ error: "Method not allowed" }, 405);

    const [videos, states] = await Promise.all([
      db("cr_youtube_video_feed?select=video_id,title,published_at,video_url,thumbnail_url&order=published_at.desc&limit=12"),
      db("cr_youtube_feed_state?select=last_checked_at,latest_video_id,last_error&id=eq.1"),
    ]);
    return reply({ videos: videos || [], status: states?.[0] || null });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "YouTube feed error" }, 502);
  }
});
