# CrowRules Podcasting — Experience V2 Implementation Blueprint

## Product direction
Hybrid streaming experience: Netflix-style cinematic show discovery + Spotify-style listening continuity + CrowRules creator tools, community, awards and production. Listener and creator accounts are free. Optional supporter or creator monetization remains separate and must not gate ordinary listening or creator publishing.

## Inspection baseline (2026-11-03)
- GitHub repository: `crowrulesentertainment-oss/crowrulesentertainment`, default branch `main`.
- Website: `/podcasting/`; existing CSS and JavaScript are preserved.
- Existing browser auth bridge: `window.CrowRulesAuth.client`.
- Existing global player: `window.CrowRulesPlayer`.
- Existing podcast catalog tables: `public.podcasts`, `public.podcast_episodes`.
- Existing listener features: `podcast_listener_library`, `podcast_episode_progress`, listener profiles/follows, playlists, activity and achievements.
- Existing creator tools: podcast creator dashboard, analytics, episode creation, publishing pipeline, distribution, RSS, creator intelligence, sponsorships and subscriptions.
- Existing studio infrastructure: `studio_recordings`, private `studio-recordings` bucket, plus guest recording rooms/assets.
- Existing awards infrastructure: `crowrules_award_seasons`, `crowrules_award_nominees`, `crowrules_award_votes`, `crowrules_award_nominations`.
- Existing guest infrastructure: `podcast_guest_profiles`, `podcast_guest_applications`, `podcast_guest_collaborations`, `podcast_guest_recording_rooms`, `podcast_guest_recording_assets`.
- Existing community infrastructure: `podcast_community_circles`, `podcast_community_circle_posts`, and supporting circle membership/event tables.
- Existing Edge Functions already support distribution, RSS, creator workflows, guest booking, and live podcast operations.

## Guardrails
1. Do not replace the existing auth bridge, global player, notification scripts, publishing workflow, or distribution Edge Functions.
2. No new database migration is required for this first UI rollout. Existing tables, buckets and RLS policies are reused.
3. Never expose Supabase service-role or secret keys in browser code.
4. Keep public catalog reads limited to published shows/episodes and existing RLS.
5. Creator-only actions must require an authenticated user and remain subject to RLS.
6. Do not bypass the secure award vote workflow. This UI displays published seasons and nominees only.
7. Guest profiles are displayed only when approved. Applications are submitted as authenticated users.
8. Studio recordings are uploaded under `auth.uid()/...` to the existing private bucket. Metadata is inserted into `studio_recordings` under its existing owner policy.
9. Rankings shown in V2 are transparent catalog sorts using existing published show metrics (plays/listeners/newest). Do not treat user-level creator ranking snapshots as podcast rankings.
10. Keep the legacy homepage backup `index-legacy-20261103.html` until rollout is validated.

## V2 pages
- `index.html`: cinematic streaming home, featured show, show rail, recent episodes, categories and the existing listening continuation block.
- `discover.html`: search and browse published shows.
- `show.html?id=<podcast_id>`: dynamic show page with season selector and episode list.
- `rankings.html`: most played, most listeners and newest catalog views.
- `awards.html`: current/past seasons and published nominees.
- `guest-lounge.html`: approved guest directory and authenticated application form.
- `community.html`: authenticated view of public creator circles.
- `studio.html`: browser audio/video capture, preview, download and private cloud save.
- `creator-dashboard-v2.html`: links existing creator tools in one workspace.

## Rollout stages
### Stage 1 — Experience shell
Deploy the additive CSS/JS and new pages on a feature branch. Verify mobile layout, auth bridge, nav, catalog reads, player integration, and show season switching.

### Stage 2 — Creator workflows
Connect creator-owned shows, episode drafts, upload validation, production checklist, publishing schedule, and creator analytics. Use existing workflows and RPC/Edge Functions.

### Stage 3 — Studio expansion
Add device selectors, track management, remote guest recording with consent, resumable uploads, crash recovery, waveform previews, trim/edit timeline and media processing. The V2 recorder is a single browser capture track, not a full multitrack editor.

### Stage 4 — Community and awards
Connect existing circle membership/posts/events and secure award nomination/voting endpoints. Do not write directly to protected vote tables from the browser.

### Stage 5 — Growth and personalization
Add personalized recommendations, listening streaks, annual recap, podcast clips, premiere/live event discovery, creator collaboration matching, and supporter options.

## Validation checklist
- Public catalog returns only published shows and free published episodes.
- Show pages group episodes by `season_number` and preserve episode order.
- Audio playback uses the existing global player.
- Listener follow uses the existing `podcast_listener_library` unique key.
- Guest application requires a signed-in user.
- Guest directory filters `status = approved`.
- Community page requires sign-in and uses public-circle RLS.
- Studio requires device permission; uploads use private bucket and user-scoped path.
- Cloud recording metadata matches `studio_recordings` columns and owner policy.
- No secret key appears in source.
- Existing legacy pages and sitewide scripts continue to work.

## Known infrastructure observations
The Supabase security advisor currently reports a large project-wide set of RLS-enabled tables without policies (169 findings at inspection time), and performance advisor reports many unindexed foreign keys. These are broader existing project findings, not introduced by this V2 bundle. Audit individual podcast tables before any schema or policy changes.
