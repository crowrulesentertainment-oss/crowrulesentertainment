# Tacoma Nights Community Hub — Feature Release Notes

## Published files
- Public Community Hub: `community.html`
- Homepage navigation links to the hub from `index.html`
- Existing private submission review desk: `admin.html`
- Existing API: Supabase Edge Function `tacoma-nights-api`

## Live in this first release
- Responsive, keyboard-friendly Community Hub with links for guest pitches, community stories, local events, business spotlights, partners/crew, questions, and topic suggestions.
- Community forms send submissions to the existing `tacoma_nights_submissions` pipeline through `?action=submit`. They appear in the private review desk; they are not auto-published.
- Submission types stay within the API's existing validated set: `topic_suggestion`, `episode_question`, `guest_pitch`, `story_pitch`, and `crew_interest`.
- Episode archive loads from the existing `?action=episodes` API and supports client-side search.
- Sample topic poll stores a single choice in the current browser's local storage. It is explicitly not represented as a global tally.
- Privacy/consent copy, honeypot field, field limits, submission status messages, and links to the existing staff review desk.
- Homepage navigation entry to the Community Hub.

## Included as clearly labelled future extensions (not yet live backend features)
- Site-wide poll tally and anti-abuse voting controls.
- Publicly published and moderated story/event/partner directories.
- Guest prospect CRM, invitation and reply tracking, booking calendar, availability, release forms, and guest prep packets.
- Full Producer Desk: episode production board, assignments, timed run-of-show, research notes, checklists, and publishing workflow.
- Verified transcripts, chapter markers, episode companion pages, curated short clips, cross-device watchlists, and related-episode recommendations.
- Opt-in newsletter list, confirmation, unsubscribe, and delivery workflow.
- Shared audience analytics and community submission metrics.

These features need dedicated database tables/API routes, secure access policies, moderation and retention rules, and live testing before they can be advertised as operational. This first release deliberately does not fabricate a newsletter subscription, public directory, transcript, shared poll result, or private production record.

## Validation checklist
- [ ] Open `https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/community.html`.
- [ ] Confirm the Tacoma Nights homepage includes the Community Hub link.
- [ ] Submit a genuine test form with consent and verify it appears in the authorized private review desk; archive/delete the test record after validation.
- [ ] Verify no-token and non-admin access is denied on private API routes.
- [ ] Confirm `tacoma_nights_submissions` has RLS enabled and no permissive public SELECT/UPDATE policy.
- [ ] Test episode archive load, search, form validation, mobile layout, and keyboard navigation.
- [ ] Confirm local poll persists after refresh and is accurately labelled as device-only.

## Security notes
- The Community Hub uses only the existing public submission endpoint and its validated submission types.
- Never put the Supabase service-role key in GitHub Pages or browser code.
- Private submissions, guest contact details, and internal notes must never be exposed in public lists.
- The existing API's rate limit is best-effort per Edge Function isolate; consider a persistent rate limiter before wider promotion.


## Feature-suite expansion (schema + API deployed)
Migration `tacoma_nights_feature_suite` was applied to Supabase project `cevylpnoexugwgygvtgu`. The following feature tables exist with RLS enabled and direct `anon`/`authenticated` table privileges revoked; browser traffic uses the Edge Function instead:
- `tacoma_nights_guest_prospects`: guest pipeline, public booking routes, follow-up dates, consent status, and private notes.
- `tacoma_nights_production_episodes` and `tacoma_nights_production_tasks`: episode status board, run-of-show JSON, assignments, priorities, deadlines, and task states.
- `tacoma_nights_public_stories`, `tacoma_nights_community_events`, `tacoma_nights_community_partners`: moderation statuses and public-safe fields.
- `tacoma_nights_topic_polls`, `tacoma_nights_topic_poll_options`, `tacoma_nights_topic_poll_votes`: shared polls and vote counts.
- `tacoma_nights_newsletter_subscribers`: opt-in subscriber state/token fields (email confirmation and delivery are not enabled until a trusted sender and verified domain are configured).
- `tacoma_nights_episode_assets`: transcripts, chapters, clips, sources, captions, show notes, verification and publication flags.
- `tacoma_nights_watchlists`: user-scoped watch progress schema; cross-device UI and owner policies/routes still need to be completed.
- `tacoma_nights_analytics_events`: aggregate event schema; ingestion, retention, privacy thresholds, and reporting UI still need to be completed.

Edge Function version 9 adds authenticated admin collection routes (`admin-data-list`, `admin-data-save`, `admin-data-delete`, `admin-poll-save`) with table and field allowlists; public read of published community stories/events/partners/open polls; and public poll voting with one recorded vote per derived network/browser fingerprint when change-votes are disabled. The fingerprint is an anti-abuse signal, not proof of a unique person.

A private Producer Desk is available at `producer.html`. It supports authenticated record management for guest prospects, production episodes, tasks, story approvals, events, partners, and episode assets, plus poll creation. Its interface requires trusted `app_metadata.role = admin`. The Community Hub now reads approved public content and uses the shared poll API when an official poll is open.

## Remaining implementation / verification (do not claim these as finished)
- [ ] Test the Community Hub and Producer Desk in a real browser after GitHub Pages deploys.
- [ ] Confirm admin login with a known admin account; test non-admin, missing, invalid and expired token responses.
- [ ] Confirm the public form still submits and a record appears in the private Submission Review Desk.
- [ ] Create a test guest, episode, task, event/story/partner, asset and poll; edit/delete test records; then clean up test data.
- [ ] Test shared poll voting and duplicate-vote handling. IP/user-agent fingerprints can be evaded and should not be presented as a strict identity system.
- [ ] Verify RLS and table grants using database role/policy inspection and test the public Data API cannot expose private tables.
- [ ] Add transactional email for newsletter confirmation/unsubscribe only after a verified sender/domain and compliant mailing workflow are configured. Do not collect newsletter signups as active without confirmation.
- [ ] Complete owner-scoped watchlist routes/UI, analytics ingestion and dashboard, transcript/clip display, episode companion pages, and actual email delivery.
- [ ] Add persistent rate limiting, retention/deletion rules, audit log for admin changes, and backups for operational data.
