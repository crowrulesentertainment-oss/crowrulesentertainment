# Tacoma Nights — Supabase operations

The Tacoma Nights page uses the CrowRules Supabase project `cevylpnoexugwgygvtgu`.

## Control Room

Private dashboard: https://crowrulesentertainment-oss.github.io/crowrulesentertainment/tacoma-nights/control-room.html

The Control Room includes:
- **Premiere settings:** edit title, YouTube video ID, Pacific date/time, playlist/scheduled/live/ended status, and whether settings are published.
- **Crew directory:** add, edit, publish/unpublish, feature, reorder, and delete crew profiles.
- **Private submission inbox:** review crew interest, guest pitches, story pitches, and topic suggestions; change status and add private internal notes.

### Grant administrator access

The dashboard requires a Supabase Auth account whose **app metadata** contains `"role": "admin"`. This is intentionally not read from user-editable user metadata.

1. Open Supabase Dashboard → Authentication → Users.
2. Select the intended administrator's existing account (or create and confirm an account first).
3. In the user's app metadata / raw app metadata editor, set the JSON to include this property, preserving any existing app metadata:
   ```json
   { "role": "admin" }
   ```
   If the account already has app metadata, add `"role": "admin"` to that existing JSON instead of replacing unrelated values.
4. Save the metadata, then sign out and sign back in at the Control Room so the session token includes the updated claim.
5. Open the dashboard URL above and sign in with that account.

Only assign this role to trusted administrators. Do not set the role in user metadata and do not expose a service-role or secret key in the browser. The dashboard's UI check is not the security boundary; database Row Level Security independently enforces the admin role for writes and private inbox access.

## Public site integrations

- **Crew directory:** reads only published rows from `public.tacoma_nights_crew`.
- **Guest / crew / story submissions:** inserts into `public.tacoma_nights_submissions`. Public users cannot read or change submissions.
- **Premiere player and live chat:** reads the published `premiere` row in `public.tacoma_nights_show_settings`. If no valid video ID is configured, the page uses the playlist fallback.

The page uses the Supabase **publishable** key. Never place a service-role key or secret key in GitHub Pages HTML.

## Publish a crew profile manually

You can use the Control Room instead. For direct SQL administration, run this only with the person's permission to publish their name, role, bio, and links:

```sql
insert into public.tacoma_nights_crew
  (display_name, role_title, bio, avatar_url, profile_url, sort_order, is_featured, is_published)
values
  ('Display Name', 'Producer', 'A short approved bio.', null, null, 10, false, true);
```

Use `https://` URLs for `avatar_url` and `profile_url`. Keep `is_published = false` until approved. Do not add fictional crew members or publish anyone's details without consent.

## Configure a premiere

Use the Control Room for routine updates. If using SQL instead, replace the example ID with the 11-character ID from the actual YouTube video or premiere URL. This is an example only; do not publish an unconfirmed date or video ID.

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

Use `status = 'live'` when streaming, `'scheduled'` for an upcoming premiere, `'ended'` for replay-only, and `'playlist'` when no live chat should show. Set `youtube_video_id = null` to use the playlist fallback. Confirm the real date/time and video ID before publishing. Tacoma Nights' usual Friday premiere target has been 10 PM Pacific; account for daylight-saving changes.

## Submission review and security

- All three Tacoma Nights tables have Row Level Security enabled.
- Public users can select only published crew profiles and published premiere settings.
- Public users can insert a valid submission but cannot read, update, or delete submission records.
- Authenticated users with `app_metadata.role = admin` can manage crew and premiere settings and review/update submissions.
- Admin policies are enforced in Postgres; hiding the dashboard UI alone is not relied on for access control.
- The public form's client validation and honeypot are only basic spam measures. Before wide promotion, add server-side rate limiting / CAPTCHA verification and optional email alerts.
- Use only consented, approved crew profile data. Avoid storing sensitive personal information in public profile fields.
