-- CrowRules Entertainment: server-side YouTube upload cache and five-minute refresh.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create table if not exists public.cr_youtube_video_feed (
  video_id text primary key check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null,
  published_at timestamptz not null,
  video_url text not null,
  thumbnail_url text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.cr_youtube_feed_state (
  id smallint primary key check (id = 1),
  channel_id text,
  last_checked_at timestamptz,
  latest_video_id text,
  last_error text,
  updated_at timestamptz not null default now()
);

alter table public.cr_youtube_video_feed enable row level security;
alter table public.cr_youtube_feed_state enable row level security;
revoke all on public.cr_youtube_video_feed from anon, authenticated, public;
revoke all on public.cr_youtube_feed_state from anon, authenticated, public;
grant all on public.cr_youtube_video_feed to service_role;
grant all on public.cr_youtube_feed_state to service_role;
insert into public.cr_youtube_feed_state (id) values (1) on conflict (id) do nothing;

select cron.schedule(
  'crowrules-youtube-refresh',
  '*/5 * * * *',
  $job$
    select net.http_post(
      url := 'https://cevylpnoexugwgygvtgu.supabase.co/functions/v1/crowrules-youtube-feed',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := '{"action":"refresh"}'::jsonb,
      timeout_milliseconds := 15000
    );
  $job$
);
