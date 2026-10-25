# Tacoma Nights — Supabase operations

The Tacoma Nights page uses the CrowRules Supabase project `cevylpnoexugwgygvtgu`.

## Connected features

- **Crew directory:** reads only published rows from `public.tacoma_nights_crew`.
- **Guest / crew / story submissions:** inserts into `public.tacoma_nights_submissions`. The public client cannot read, edit, or delete submissions.
- **Premiere player and live chat:** reads the published `premiere` row in `public.tacoma_nights_show_settings`. If there is no configured video ID, the page falls back to the official Tacoma Nights playlist.

The page uses the Supabase **publishable** key. Never place a service-role key or secret key in GitHub Pages HTML.

## Publish a crew profile

Open Supabase Dashboard → SQL Editor and run this with the person's permission to publish their name, role, bio, and links:

```sql
insert into public.tacoma_nights_crew
  (display_name, role_title, bio, avatar_url, profile_url, sort_order, is_featured, is_published)
values
  ('Display Name', 'Producer', 'A short approved bio.', null, null, 10, false, true);
```

Use an `https://` image URL for `avatar_url` and an `https://` profile URL if desired. Keep `is_published = false` until the profile is approved. Update a profile by its `id`; do not add fictional crew members or publish anyone's details without consent.

## Configure a premiere

Edit the existing settings row in Supabase SQL Editor. Replace the video ID with the 11-character ID from the YouTube video or premiere URL.

```sql
update public.tacoma_nights_show_settings
set show_title = 'Tacoma Nights',
    youtube_video_id = 'YOUR_VIDEO_ID',
    premiere_at = '2026-10-30 22:00:00-07',
    status = 'scheduled',
    is_published = true,
    updated_at = now()
where setting_key = 'premiere';
```

Use `status = 'live'` when the stream is live, `'scheduled'` for an upcoming premiere, `'ended'` for replay-only, and `'playlist'` when no live chat should be shown. Set `youtube_video_id = null` to use the official playlist as the player fallback. Confirm the actual date/time and YouTube video ID before publishing. Tacoma Nights' usual Friday premiere target has been 10 PM Pacific; adjust daylight-saving offsets for the specific date.

## Submission review

Submissions are stored in `public.tacoma_nights_submissions` with `status = 'new'`. Review them in Supabase Dashboard → Table Editor. Change status and add internal notes only from a trusted admin session. Do not create a public read policy for this table.

## Security notes

- Row Level Security is enabled on all three Tacoma Nights tables.
- Public users can select only published crew profiles and the published premiere setting.
- Public users can insert a valid submission but cannot select or change submission records.
- Client-side validation and a hidden honeypot help with basic spam; they are **not** a substitute for server-side rate limiting or CAPTCHA. Before public promotion, add an Edge Function with rate limiting / CAPTCHA verification and optionally email notifications.
- Use only consented, approved crew profile data. Never store sensitive personal information in public profile fields.
