import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigin = "https://crowrulesentertainment-oss.github.io";
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function response(body: unknown, status = 200, origin = allowedOrigin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
      "Cache-Control": "no-store",
    },
  });
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aa = enc.encode(a);
  const bb = enc.encode(b);
  let diff = aa.length ^ bb.length;
  const n = Math.max(aa.length, bb.length);
  for (let i = 0; i < n; i++) diff |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  if (req.method === "OPTIONS") {
    if (origin !== allowedOrigin) return new Response(null, { status: 403 });
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      },
    });
  }
  if (origin !== allowedOrigin) return response({ error: "Origin not allowed." }, 403);
  if (req.method !== "POST") return response({ error: "Method not allowed." }, 405);

  const accessPassword = Deno.env.get("OPS_ACCESS_PASSWORD");
  const adminEmail = Deno.env.get("OPS_ADMIN_EMAIL");
  const adminPassword = Deno.env.get("OPS_ADMIN_PASSWORD");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!accessPassword || !adminEmail || !adminPassword || !supabaseUrl || !anonKey) {
    return response({ error: "Password sign-in is not configured yet. Add the required Edge Function secrets in Supabase." }, 503);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
    return response({ error: "Too many attempts. Wait 15 minutes and try again." }, 429);
  }
  if (!current || current.resetAt <= now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else current.count += 1;

  let supplied = "";
  try {
    const body = await req.json();
    supplied = typeof body?.password === "string" ? body.password : "";
  } catch {
    return response({ error: "Invalid request." }, 400);
  }

  if (!safeEqual(supplied, accessPassword)) {
    return response({ error: "Incorrect password." }, 401);
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (error || !data.session || data.user?.app_metadata?.role !== "admin") {
    console.error("Operations account authentication failed:", error?.message ?? "administrator role missing");
    return response({ error: "The operations account is not configured as a trusted administrator. Check its credentials and app_metadata role." }, 503);
  }

  attempts.delete(ip);
  return response({ session: data.session });
});
