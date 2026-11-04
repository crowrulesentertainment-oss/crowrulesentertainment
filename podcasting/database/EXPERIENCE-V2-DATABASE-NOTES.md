# Experience V2 database notes

Inspection confirmed that the core product areas already exist. This rollout intentionally adds no DDL and no policy changes.

| Feature | Existing resources reused |
|---|---|
| Streaming catalog | `podcasts`, `podcast_episodes` |
| Listener library | `podcast_listener_library`, `podcast_episode_progress` |
| Creator rankings inputs | `podcasts.total_plays`, `podcasts.listener_count` |
| Awards | `crowrules_award_seasons`, `crowrules_award_nominees`, secure existing vote workflow |
| Guest directory | `podcast_guest_profiles` |
| Guest applications | `podcast_guest_applications` |
| Guest sessions | `podcast_guest_collaborations`, `podcast_guest_recording_rooms`, `podcast_guest_recording_assets` |
| Creator circles | `podcast_community_circles`, `podcast_community_circle_posts` |
| Browser studio | `studio_recordings`, private `studio-recordings` Storage bucket |

## Studio upload contract
- Bucket: `studio-recordings` (private).
- Object path: `<auth.uid()>/<timestamp>-<sanitized-title>.<extension>`.
- Storage policy requires the first folder to match the authenticated user ID.
- Metadata row: `owner_user_id`, `title`, `status`, `duration_seconds`, `duration_ms`, `tracks`, `storage_path`, `mime_type`, `size_bytes`.
- Browser uploads use the existing authenticated Supabase client; no service-role key.

## Do not do
- Do not create duplicate show, episode, guest, award, community or studio tables.
- Do not insert votes directly into `crowrules_award_votes`; use the secure voting workflow.
- Do not make private media buckets public.
- Do not relax RLS to make the frontend work.
