# Tacoma Nights — Website Development Roadmap

## Product direction
Tacoma Nights is a hybrid television network and community platform. Anyone can browse and watch without an account. Public participation remains accessible; optional accounts add submission tracking, favorites and profile preferences. YouTube remains the primary viewing and publishing platform.

## Existing infrastructure to preserve
- GitHub Pages website under `/tacoma-nights/`
- Supabase project `cevylpnoexugwgygvtgu`
- Existing homepage, visitor presence, episode/playlist embeds and premiere settings
- Existing Community Voices and weekly-question workflows
- Existing Control Room, Producer Desk, admin review, remote-host and guest workflows
- Existing database records, Edge Functions, authentication providers and RLS policies

## Navigation and destinations
- Home: `index.html`
- Watch: `watch.html`
- Community Voices: `community-voices.html`
- People's Perspective: `peoples-perspective.html`
- Explore Tacoma & Beyond: `explore.html`
- Existing Community Hub: `community.html`
- Existing remote host application and contributor tools: `remote-host.html`, `upload.html`
- Existing production tools: `production-center.html`, `producer.html`, `control-room.html`, `admin.html`

## Release 1
- Align homepage visual identity to black, red, white and gold.
- Make Watch, Community Voices, People's Perspective and Explore discoverable.
- Provide a YouTube playlist viewing destination.
- Preserve current homepage sections and current live/presence integrations.
- Keep the site responsive and accessible.

## Release 2
- Build data-backed 253 Spotlight profiles, Community Wall, nominations, polls and event listings.
- Reuse existing tables where possible. Inspect schema and RLS before any migration.
- All public content must be approved before publication.

## Release 3
- Optional member authentication and member dashboard.
- Keep public browsing and appropriate public submissions available without registration.
- Add only additive, least-privilege database changes.

## Release 4
- Consolidate production workflows into the existing Control Room without removing specialist workspaces.
- Keep producer, editor, host and administrator permissions distinct.

## Technical rules
- Never put Supabase service-role or secret keys in browser code.
- Keep private submissions and raw video uploads private until approved.
- Enforce authorization with RLS and trusted server-side claims, not UI-only checks.
- Store YouTube video IDs and metadata; use YouTube embeds for primary playback.
- Avoid broad polling, unnecessary realtime subscriptions and unbounded logging.
- Use additive migrations and preserve all existing data.
- Do not publish placeholder people, events, episodes or invented video IDs.

## Acceptance criteria
- Existing URLs and workflows continue to work.
- Homepage and new destinations are usable on mobile and desktop.
- YouTube playlist opens and embeds.
- Community submission routes work as they did before.
- No private submission or upload is exposed publicly.
- All admin operations remain protected by existing authorization and RLS.
