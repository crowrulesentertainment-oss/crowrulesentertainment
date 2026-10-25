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
