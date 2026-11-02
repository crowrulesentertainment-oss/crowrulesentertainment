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

-- Audience growth and retention intelligence. Raw listener/day deduplication is kept in private schema.
create table if not exists public.podcast_audience_analytics_daily (
 podcast_id uuid not null references public.podcasts(id) on delete cascade,
 metric_date date not null, active_listeners bigint not null default 0,
 new_listeners bigint not null default 0, returning_listeners bigint not null default 0,
 new_followers bigint not null default 0, updated_at timestamptz not null default now(),
 primary key (podcast_id,metric_date)
);
create index if not exists podcast_audience_analytics_date_idx on public.podcast_audience_analytics_daily(metric_date desc);
alter table public.podcast_audience_analytics_daily enable row level security;
revoke all on public.podcast_audience_analytics_daily from anon,authenticated;
grant select on public.podcast_audience_analytics_daily to authenticated;
create policy podcast_audience_analytics_creator_read on public.podcast_audience_analytics_daily for select to authenticated
using (private.can_manage_podcast(podcast_id) or public.crowrules_is_admin());
create table if not exists private.podcast_audience_daily_users (
 podcast_id uuid not null references public.podcasts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 metric_date date not null, first_ever_listener boolean not null default false,
 play_starts integer not null default 1,last_activity_at timestamptz not null default now(),
 primary key(podcast_id,user_id,metric_date)
);
revoke all on private.podcast_audience_daily_users from public,anon,authenticated;
create or replace function private.rollup_podcast_audience_progress()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_podcast_id uuid; v_metric_date date := (now() at time zone 'utc')::date; v_first_ever boolean; v_added integer:=0;
begin
 select e.podcast_id into v_podcast_id from public.podcast_episodes e where e.id=new.episode_id;
 if v_podcast_id is null or new.user_id is null then return new; end if;
 select not exists(select 1 from public.podcast_episode_progress prior join public.podcast_episodes pe on pe.id=prior.episode_id where prior.user_id=new.user_id and pe.podcast_id=v_podcast_id and prior.episode_id<>new.episode_id) into v_first_ever;
 insert into private.podcast_audience_daily_users(podcast_id,user_id,metric_date,first_ever_listener,play_starts,last_activity_at)
 values(v_podcast_id,new.user_id,v_metric_date,v_first_ever,1,now()) on conflict(podcast_id,user_id,metric_date) do nothing;
 get diagnostics v_added=row_count;
 if v_added=1 then
  insert into public.podcast_audience_analytics_daily(podcast_id,metric_date,active_listeners,new_listeners,returning_listeners,updated_at)
  values(v_podcast_id,v_metric_date,1,case when v_first_ever then 1 else 0 end,case when v_first_ever then 0 else 1 end,now())
  on conflict(podcast_id,metric_date) do update set active_listeners=public.podcast_audience_analytics_daily.active_listeners+1,new_listeners=public.podcast_audience_analytics_daily.new_listeners+excluded.new_listeners,returning_listeners=public.podcast_audience_analytics_daily.returning_listeners+excluded.returning_listeners,updated_at=now();
 else
  update private.podcast_audience_daily_users set play_starts=play_starts+1,last_activity_at=now() where podcast_id=v_podcast_id and user_id=new.user_id and metric_date=v_metric_date;
 end if;
 return new;
end; $$;
revoke all on function private.rollup_podcast_audience_progress() from public,anon,authenticated;
create trigger podcast_audience_progress_rollup after insert on public.podcast_episode_progress for each row execute function private.rollup_podcast_audience_progress();
create or replace function private.rollup_podcast_audience_follow()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.item_type<>'podcast' then return new; end if;
 insert into public.podcast_audience_analytics_daily(podcast_id,metric_date,new_followers,updated_at) values(new.item_id,(now() at time zone 'utc')::date,1,now())
 on conflict(podcast_id,metric_date) do update set new_followers=public.podcast_audience_analytics_daily.new_followers+1,updated_at=now();
 return new;
end; $$;
revoke all on function private.rollup_podcast_audience_follow() from public,anon,authenticated;
create trigger podcast_audience_follow_rollup after insert on public.podcast_listener_library for each row execute function private.rollup_podcast_audience_follow();
