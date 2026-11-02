-- CrowRules Podcasting Notifications Center
-- Applied to Supabase project cevylpnoexugwgygvtgu.
alter table public.podcast_listener_profiles
 add column if not exists notify_new_episodes boolean not null default true,
 add column if not exists notify_new_followers boolean not null default true,
 add column if not exists notify_milestones boolean not null default true;

create table if not exists public.podcast_listener_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 event_key text not null,
 notification_type text not null check (notification_type in ('episode','follower','milestone')),
 title text not null,
 body text not null default '',
 target_url text not null default 'listener-activity.html',
 created_at timestamptz not null default now(),
 read_at timestamptz,
 unique(user_id,event_key)
);
alter table public.podcast_listener_notifications enable row level security;
revoke all on table public.podcast_listener_notifications from anon;
grant select,insert,update,delete on table public.podcast_listener_notifications to authenticated;
drop policy if exists "Listeners read own notifications" on public.podcast_listener_notifications;
create policy "Listeners read own notifications" on public.podcast_listener_notifications for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "Listeners create own notifications" on public.podcast_listener_notifications;
create policy "Listeners create own notifications" on public.podcast_listener_notifications for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists "Listeners update own notifications" on public.podcast_listener_notifications;
create policy "Listeners update own notifications" on public.podcast_listener_notifications for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "Listeners delete own notifications" on public.podcast_listener_notifications;
create policy "Listeners delete own notifications" on public.podcast_listener_notifications for delete to authenticated using ((select auth.uid())=user_id);
grant select,insert,update,delete on public.podcast_listener_notifications to authenticated;
create index if not exists podcast_listener_notifications_user_created_idx on public.podcast_listener_notifications(user_id,created_at desc);
create index if not exists podcast_listener_notifications_user_unread_idx on public.podcast_listener_notifications(user_id,created_at desc) where read_at is null;
