# Love Is Local — Tacoma Valentine's Day 2027

A photorealistic, animated, mobile-responsive Valentine's Day community experience for Tacoma Community Hub and Tacoma Nights, presented by CrowRules Entertainment.

## Public page

After GitHub Pages publishes the main branch:

https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/valentines/

## Files

- `index.html` — complete landing page and community experience
- `styles.css` — responsive cinematic styling, image treatments, animation and reduced-motion support
- `app.js` — mobile navigation, Tacoma-local countdown and decorative falling petals

## Included

- Love Is Local hero and February 14, 2027 countdown
- Date-night, friends, family and community discovery cards
- Local business participation invitation
- Love Comes in Many Forms community section
- Love Letters / community story submission invitation
- Valentine's Day event submission invitation
- Tacoma Nights special-programming feature
- Responsive layout and reduced-motion accessibility support

## Important launch notes

- Business and event listings are intentionally not fabricated. Add only confirmed, verified details with permission.
- Story and message links currently open an email draft to the project contact. There is no public submission database or automatic publishing in this first release.
- The countdown is set to February 14, 2027, midnight Pacific time.
- The page does not expose Supabase credentials or claim a backend workflow that has not been connected.
- Hero and card photography is loaded from Wikimedia Commons / Unsplash remote image URLs. Replace with licensed, optimized CrowRules-hosted assets when available.

## Related Tacoma Nights pages

- Tacoma Nights home: ../index.html
- Community Hub: ../community.html

## Validation checklist

- [ ] Confirm GitHub Pages publishes the new path.
- [ ] Check hero and card photography on desktop and mobile.
- [ ] Check countdown in Pacific time.
- [ ] Test mobile navigation and reduced-motion setting.
- [ ] Confirm contact links open a correctly addressed email draft.
- [ ] Replace any image URL that is unavailable or unsuitable before promotion.


## Supabase-backed moderation (connected)

Project: `cevylpnoexugwgygvtgu` (CrowRules Entertainment Supabase project)

- `admin.html` — administrator sign-in and Control Room
- `admin.js` / `admin.css` — moderation queue, private contact lookup, and featured listing management
- `submit.html` — public business, event, Love Wall, and story intake
- `submit.js` — inserts pending submissions and writes contact email separately
- `public-content.js` — reads only approved content and published featured listings for the public homepage
- `supabase-config.js` — browser URL and publishable key only; no service-role key
- `supabase-setup.sql` — reproducible database schema, grants, and RLS policies

### Admin access

The dashboard accepts the CrowRules administrator session whose trusted Supabase `app_metadata.role` is `admin`. The project administrator account was checked and already has this role. Password and Google OAuth sign-in are available; Google OAuth must have the GitHub Pages callback URL allowed in Supabase Auth settings.

### Security model

- All submissions begin as `pending`; public visitors cannot approve or edit them.
- Admin-only policies use trusted `app_metadata.role`, never user-editable metadata.
- Submitter email is stored separately in `valentines_submission_contacts`; only admins can read it.
- The public feed is a `security_invoker` view over approved, consented submissions.
- Featured listings are public only when `is_published=true`.
- The browser contains only the Supabase publishable key. Never add a service-role or secret key to GitHub Pages.

### Public links

- Main experience: `index.html`
- Submit: `submit.html` (supports `?type=business|event|love_message|story`)
- Admin: `admin.html`



## Annual tradition and live community experience

Love Is Local is an annual Tacoma Community Hub / Tacoma Nights tradition held every February 14. The public page remains year-round; its countdown automatically targets the next February 14 in Tacoma time. Submissions and featured listings are assigned to a season year, so each year's content can be curated separately and prior seasons remain in the archive.

- Annual seasons are stored in `valentines_seasons` (2027 and 2028 are seeded).
- Submissions and featured listings have a `season_year`; new records default to the next upcoming February 14 season in Pacific time.
- The public page displays the current upcoming season, approved community content, approved local-partner photographs, and the annual season archive.
- Supabase Realtime refreshes the public content when submissions, featured listings, or season records change.
- The photo gallery uses images on published featured listings. Add only images with permission and publish them through the Admin Control Room.
- Each season is archived by setting its status to `archived` and entering season highlights in `valentines_seasons`.

Apply the annual extension at the end of `supabase-setup.sql` when setting up a fresh environment. The live CrowRules Supabase project already has this extension applied.
