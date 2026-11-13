/* CrowRules Universal Admin shared Supabase session.
 * Uses the Supabase project's standard browser storage key so every same-origin
 * CrowRules workspace can restore the same session. Public key only.
 */
(() => {
  "use strict";
  const URL = "https://cevylpnoexugwgygvtgu.supabase.co";
  const KEY = "sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
  const STORAGE_KEY = "sb-cevylpnoexugwgygvtgu-auth-token";
  if (!window.supabase?.createClient) throw new Error("Supabase client library did not load.");
  const client = window.supabase.createClient(URL, KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: STORAGE_KEY
    }
  });
  async function authorize() {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    if (!data?.user) return { ok: false, message: "Please sign in to continue." };
    const { data: admin, error: accessError } = await client
      .from("cr_admins")
      .select("role,is_active")
      .eq("user_id", data.user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (accessError) throw accessError;
    if (!admin) return { ok: false, message: "This account is not listed as an active CrowRules administrator." };
    return { ok: true, user: data.user, role: admin.role || "Administrator" };
  }
  window.CrowRulesAdminAuth = Object.freeze({
    client,
    storageKey: STORAGE_KEY,
    signIn(email, password) {
      return client.auth.signInWithPassword({ email: String(email || "").trim(), password: String(password || "") });
    },
    authorize,
    signOut() { return client.auth.signOut({ scope: "local" }); }
  });
})();
