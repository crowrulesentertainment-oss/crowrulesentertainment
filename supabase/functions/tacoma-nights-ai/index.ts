import { createClient } from "npm:@supabase/supabase-js@2";

const PROJECT_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";
const ALLOWED_ORIGINS = new Set([
  "https://crowrulesentertainment-oss.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
]);
const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://crowrulesentertainment-oss.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const packageSchema = {
  type: "object",
  properties: {
    research_outline: { type: "string" },
    guest_questions: { type: "string" },
    segment_talking_points: { type: "string" },
    host_script: { type: "string" },
    youtube_package: { type: "string" },
    thumbnail_concepts: { type: "string" },
  },
  required: ["research_outline", "guest_questions", "segment_talking_points", "host_script", "youtube_package", "thumbnail_concepts"],
  additionalProperties: false,
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (!SERVICE_KEY) return json({ error: "Supabase server configuration is incomplete." }, 503, origin);

  const authorization = req.headers.get("authorization") ?? "";
  const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1] ?? "";
  if (!bearer || bearer.length > 5000) return json({ error: "Sign in with an authorized admin account." }, 401, origin);
  const db = createClient(PROJECT_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await db.auth.getUser(bearer);
  const user = authData?.user;
  if (authError || !user) return json({ error: "Your session is invalid or expired. Please sign in again." }, 401, origin);
  if (user.app_metadata?.role !== "admin") return json({ error: "Admin access is required." }, 403, origin);
  if (!OPENAI_API_KEY) return json({ error: "OpenAI is not connected yet. Add OPENAI_API_KEY to Supabase Edge Function secrets, then try again." }, 503, origin);

  const now = Date.now();
  const recent = (attempts.get(user.id) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return json({ error: "AI generation limit reached for this session. Please wait before trying again." }, 429, origin);
  const body = await req.json().catch(() => null);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > 18000) return json({ error: "A valid episode prompt (under 18,000 characters) is required." }, 400, origin);
  recent.push(now);
  attempts.set(user.id, recent);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: "You are the editorial development producer for Tacoma Nights. Return a complete, useful, specific production package. Never invent facts, statistics, quotes, citations, source findings, current news, guest biographies, guest confirmations or real guest answers. Mark all unverified claims and research leads clearly. Use placeholders where facts or guest answers must be supplied. Thumbnail concepts must be photorealistic/cinematic, 16:9 1280x720, with short readable text and no fake logos or fabricated real people. All content is draft material for human review.",
        input: prompt,
        max_output_tokens: 10000,
        text: { format: { type: "json_schema", name: "tacoma_nights_episode_package", strict: true, schema: packageSchema } }
      }),
      signal: AbortSignal.timeout(110000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("OpenAI API error:", response.status, result?.error?.type ?? "unknown");
      return json({ error: response.status === 429 ? "The AI provider is busy or its usage limit was reached. Try again later." : "The AI provider could not complete the request. Check the OpenAI API project and model settings." }, 502, origin);
    }
    if (result.status === "incomplete" || result.status === "failed") return json({ error: "The AI provider could not complete the full episode package. Try again with a shorter runtime or simpler direction." }, 502, origin);
    const outputText = (result.output ?? []).flatMap((item: any) => item.content ?? []).filter((item: any) => item.type === "output_text").map((item: any) => item.text).join("");
    if (!outputText) return json({ error: "The AI provider returned no episode package. Try again." }, 502, origin);
    const pack = JSON.parse(outputText);
    for (const key of Object.keys(packageSchema.properties)) {
      if (typeof pack[key] !== "string" || !pack[key].trim()) return json({ error: "The AI provider returned an incomplete episode package." }, 502, origin);
    }
    return json({ ok: true, model: OPENAI_MODEL, package: pack }, 200, origin);
  } catch (error) {
    console.error("Tacoma Nights AI generation error:", error);
    return json({ error: "AI generation failed unexpectedly. Please try again." }, 502, origin);
  }
});
