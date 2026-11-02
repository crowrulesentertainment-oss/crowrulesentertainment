-- CrowRules Podcasting — Creator Analytics daily rollups
-- Applied to Supabase project cevylpnoexugwgygvtgu.
-- The trigger stores only daily aggregate counts; no listener IDs are copied into analytics.
-- Existing podcast_episode_progress rows are not backfilled.

create table if not exists public.podcast_episode_analytics_daily (
  episode_id uuid not null references public.podcast_episodes(id) on delete cascade,
  podcast_id uuid not null references public.podcasts(id) on delete cascade,
  metric_date date not null default current_date,
  plays bigint not null default 0,
  unique_listeners bigint not null default 0,
  completions bigint not null default 0,
  listening_seconds bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (episode_id, metric_date)
);
create index if not exists podcast_episode_analytics_podcast_date_idx on public.podcast_episode_analytics_daily (podcast_id, metric_date desc);
alter table public.podcast_episode_analytics_daily enable row level security;
revoke all on public.podcast_episode_analytics_daily from anon, authenticated;
grant select on public.podcast_episode_analytics_daily to authenticated;
create policy podcast_analytics_creator_read on public.podcast_episode_analytics_daily for select to authenticated using (
  exists (select 1 from public.podcast_episodes e where e.id=podcast_episode_analytics_daily.episode_id and private.can_manage_podcast(e.podcast_id))
  or crowrules_is_admin()
);
create or replace function private.rollup_podcast_episode_progress() returns trigger language plpgsql security definer set search_path='' as $$
declare v_podcast_id uuid; v_play bigint:=0; v_unique bigint:=0; v_completion bigint:=0; v_seconds bigint:=0;
begin
 select e.podcast_id into v_podcast_id from public.podcast_episodes e where e.id=new.episode_id;
 if v_podcast_id is null then return new; end if;
 if tg_op='INSERT' then
  v_play:=1; v_unique:=1;
  if coalesce(new.completed,false) then v_completion:=1; end if;
  v_seconds:=greatest(0,least(coalesce(new.position_seconds,0),120));
 else
  if not coalesce(old.completed,false) and coalesce(new.completed,false) then v_completion:=1; end if;
  v_seconds:=greatest(0,least(coalesce(new.position_seconds,0)-coalesce(old.position_seconds,0),120));
 end if;
 insert into public.podcast_episode_analytics_daily(episode_id,podcast_id,metric_date,plays,unique_listeners,completions,listening_seconds,updated_at)
 values(new.episode_id,v_podcast_id,(now() at time zone 'utc')::date,v_play,v_unique,v_completion,v_seconds,now())
 on conflict(episode_id,metric_date) do update set
  plays=public.podcast_episode_analytics_daily.plays+excluded.plays,
  unique_listeners=public.podcast_episode_analytics_daily.unique_listeners+excluded.unique_listeners,
  completions=public.podcast_episode_analytics_daily.completions+excluded.completions,
  listening_seconds=public.podcast_episode_analytics_daily.listening_seconds+excluded.listening_seconds,
  updated_at=now();
 return new;
end; $$;
revoke all on function private.rollup_podcast_episode_progress() from public,anon,authenticated;
create trigger podcast_episode_progress_analytics_rollup after insert or update of position_seconds,completed on public.podcast_episode_progress for each row execute function private.rollup_podcast_episode_progress();
