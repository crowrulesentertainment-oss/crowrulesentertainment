-- CrowRules Podcasting: Listener Activity Feed
-- Applied to Supabase project cevylpnoexugwgygvtgu.

alter table public.podcast_listener_profiles
  add column if not exists share_follow_activity boolean not null default false,
  add column if not exists share_milestones boolean not null default false;

create table if not exists public.podcast_listener_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  milestone_code text not null check (milestone_code in ('first_play','five_episodes','ten_completions')),
  created_at timestamptz not null default now(),
  unique(user_id,milestone_code)
);

alter table public.podcast_listener_milestones enable row level security;

drop policy if exists "Listeners view shared milestones" on public.podcast_listener_milestones;
create policy "Listeners view shared milestones"
  on public.podcast_listener_milestones for select to anon, authenticated
  using (
    exists (
      select 1 from public.podcast_listener_profiles p
      where p.user_id = podcast_listener_milestones.user_id
        and p.visibility = 'public'
        and p.share_milestones = true
    )
  );

drop policy if exists "Owners create their milestones" on public.podcast_listener_milestones;
create policy "Owners create their milestones"
  on public.podcast_listener_milestones for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant select on public.podcast_listener_milestones to anon, authenticated;
grant insert on public.podcast_listener_milestones to authenticated;

create index if not exists podcast_listener_library_user_type_created_idx
  on public.podcast_listener_library(user_id,item_type,created_at desc);
create index if not exists podcast_listener_follows_follower_created_idx
  on public.podcast_listener_follows(follower_id,created_at desc);
