# Tacoma Nights v3.3 — Private Submission Review Desk

## What shipped

- Private staff page: `admin.html` (marked `noindex, nofollow, noarchive`; deliberately not linked from public navigation).
- Supabase Edge Function `tacoma-nights-api`, version 8:
  - `GET ?action=admin-submissions` supports optional `status` and `type` filters and returns up to 250 newest matching records.
  - `POST ?action=admin-update` saves a valid review status, private notes, and `reviewed_at`.
  - Both admin routes require a valid Supabase Auth access token and the trusted `app_metadata.role = admin` claim.
- UI includes status/type filters, local search, queue counts, refresh, save, accept/decline shortcuts, and sign-out.
- The browser uses only the project's publishable key. The service-role key must remain server-side in Supabase secrets.

## Access prerequisites

1. In Supabase Dashboard, open **Authentication → Users** and confirm the intended staff member has an account.
2. Assign the trusted admin role only to the intended staff user using a server-side/owner-authorized process that writes `role: "admin"` to **app metadata**. Do not put the role in user-editable metadata. Never share service-role credentials.
3. Confirm the account can sign in and has a verified email/password if your Auth settings require it.
4. Open the private desk URL and sign in: `https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/admin.html`.

The page URL is not a security boundary. Authorization is enforced by the API on each private request. The Edge Function currently has `verify_jwt: false` for compatibility with existing public routes, so the two admin routes explicitly validate the bearer token with Supabase Auth and verify app metadata before touching submissions.

## Release validation checklist

- [ ] Sign in as an authorized admin and load the inbox.
- [ ] Sign in as an ordinary authenticated user and confirm both admin routes return 403.
- [ ] Request the admin routes with no token, a malformed token, and an expired token; each should be rejected.
- [ ] Filter by every supported submission type and status.
- [ ] Save a private note and confirm it persists after refresh.
- [ ] Mark a record accepted, then declined, and verify the status and review timestamp update.
- [ ] Sign out and confirm the desk is hidden and records are cleared from the page.
- [ ] Submit a genuine test through the public form with consent, verify it appears, then delete or archive the test record according to the team's retention practice.
- [ ] Verify a non-admin cannot access submission rows directly through the public Supabase Data API.

## Known limits / pending live validation

- End-to-end browser sign-in and save have not yet been confirmed in a live session.
- Each list request returns at most 250 records; filters are applied server-side before that limit.
- The public submission API's earlier per-IP limit is in-memory per Edge Function isolate, not a persistent global rate limiter.
- Review actions currently update status, notes, and review timestamp; they do not send emails or publish submissions.
- Keep the submissions table protected by RLS and ensure no permissive `anon` or `authenticated` SELECT/UPDATE policy exposes submitter contact details or internal notes. The service-role key bypasses RLS, which is why the API's admin check is essential.

## URLs

- Public Tacoma Nights: `https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/`
- Private review desk: `https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/admin.html`
- Supabase project: `https://supabase.com/dashboard/project/cevylpnoexugwgygvtgu`
