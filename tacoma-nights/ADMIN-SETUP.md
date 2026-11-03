# Tacoma Nights v3.3 — Private Submission Review Desk

## What shipped

- Private staff page: `admin.html` (marked `noindex, nofollow, noarchive`; deliberately not linked from public navigation).
- Supabase Edge Function `tacoma-nights-api`, version 8:
  - `GET ?action=admin-submissions` supports optional `status` and `type` filters and returns up to 250 newest matching records.
  - `POST ?action=admin-update` saves a valid review status, private notes, and `reviewed_at`.
  - Both admin routes require a valid Supabase Auth access token and the trusted `app_metadata.role = admin` claim.
- UI includes status/type filters, local search, queue counts, refresh, save, accept/decline shortcuts, and sign-out.
- The browser uses only the project's publishable key. The service-role key must remain server-side in Supabase secrets.


## Tacoma Nights Producer Desk

Private show-operations workspace:
https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/producer.html

The unified weekly production tracker is available at `production-tracker.html`. It reads the existing `episodes` and `tasks` collections through the secured admin API, calculates six production milestones from the saved episode status and YouTube video ID, and allows admins to update episode/task statuses. Tasks appear under an episode when `tasks.episode_id` matches that episode's record ID. It does not create tables, infer a YouTube upload from a schedule, or mark an episode archived automatically.

The Producer Desk uses the same Supabase Auth sign-in and trusted `app_metadata.role = admin` check as the other private production tools. It provides the production overview, episode records, archive curation, tasks, guest booking, and verified episode assets through the secured `tacoma-nights-api` admin data endpoints.

The left-side **Show operations** shortcuts connect the existing specialist workspaces:
- `episode-planner.html` — rundown, segment timing, and episode preparation.
- `control-room.html` — premiere settings and crew directory controls.
- `remote-host-admin.html` — private remote-host submission review.
- `remote-host-operations.html` — remote-host assignment and delivery operations.
- `team.html` — public crew directory preview.
- `upload.html` — remote-host clip upload portal.
- `admin.html` — general Tacoma Nights public submission review.

The Producer Desk is an authenticated navigation and coordination hub; linked specialist pages retain their own authorization checks. A link being visible does not grant access. The public site does not link to this private page, and the page is marked noindex.

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

### Producer Desk command-centre enhancement

The Producer Desk overview now loads episode, task, guest, asset, story, event, and partner collections together and presents operational KPIs, overdue and blocked work, upcoming dated tasks, guest follow-ups due within seven days, episode pipeline status, and collection health. Collection failures are shown instead of silently appearing as zero. The record browser uses readable summaries and metadata while retaining the existing JSON editor and secured save/delete API. Quick links are available for the weekly tracker and specialist production tools.


### Guest relationship management enhancement

The Guest Booking Desk in `producer.html` now supports outreach-history entries, a reusable eight-step guest preparation checklist, quick episode assignment, and visible follow-up/checklist summaries on guest cards. The history and checklist are serialized into the existing `guests.private_notes` field with a version marker; legacy plain-text private notes are preserved as the notes portion when the CRM format is first saved. Episode assignment uses the existing `guests.episode_id` field and resolves against current episode records. No new tables or API routes are introduced. Outreach notes and guest preparation details remain private and should not be copied into public episode descriptions.

Live Supabase sign-in, save permissions, and database persistence still require an authorized browser-session test.


### Guest communications & follow-up centre

The Producer Desk overview now includes a guest action queue split into overdue/due-today reminders, reminders due in the next seven days, and currently booked guests. Each guest can be opened from the queue. A message-template builder creates editable invitation, booking-confirmation, recording-reminder, and post-show thank-you drafts, with guest and assigned-episode details filled in where available. Templates are copied only when an administrator chooses the copy action; no email or message is sent automatically. The queue uses existing guest follow-up and booking fields and does not add database tables or API routes.
