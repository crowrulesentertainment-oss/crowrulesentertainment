-- CrowRules Podcasting: verified sponsor conversion tracking
-- Project: cevylpnoexugwgygvtgu
-- Sponsor postbacks are written only by the podcast-campaign-conversions Edge Function.
create table if not exists public.podcast_sponsorship_conversion_keys (
 id uuid primary key default gen_random_uuid(),
 deal_id uuid not null references public.podcast_sponsorship_deals(id) on delete cascade,
 creator_user_id uuid not null references auth.users(id) on delete cascade,
 key_prefix text not null,
 key_hash text not null unique,
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 revoked_at timestamptz
);
create index if not exists podcast_sponsorship_conversion_keys_deal_idx
 on public.podcast_sponsorship_conversion_keys(deal_id,is_active);
alter table public.podcast_sponsorship_conversion_keys enable row level security;
revoke all on public.podcast_sponsorship_conversion_keys from anon,authenticated;
-- No client policies or grants: only the Edge Function's server-side service role can read/write keys.

create table if not exists public.podcast_sponsorship_conversion_events (
 id uuid primary key default gen_random_uuid(),
 deal_id uuid not null references public.podcast_sponsorship_deals(id) on delete cascade,
 creator_user_id uuid not null references auth.users(id) on delete cascade,
 external_event_id text not null,
 event_type text not null default 'purchase',
 event_at timestamptz not null default now(),
 amount numeric(12,2) not null default 0 check(amount>=0),
 currency text not null default 'USD' check(currency in ('USD','CAD','GBP','EUR')),
 source text not null default 'sponsor_postback' check(source in ('sponsor_postback','creator_verified','admin_verified')),
 created_at timestamptz not null default now(),
 unique(deal_id,external_event_id),
 check(length(external_event_id) between 1 and 160),
 check(length(event_type) between 1 and 60)
);
create index if not exists podcast_sponsorship_conversion_events_creator_date_idx
 on public.podcast_sponsorship_conversion_events(creator_user_id,event_at desc);
create index if not exists podcast_sponsorship_conversion_events_deal_date_idx
 on public.podcast_sponsorship_conversion_events(deal_id,event_at desc);
alter table public.podcast_sponsorship_conversion_events enable row level security;
revoke all on public.podcast_sponsorship_conversion_events from anon,authenticated;
grant select on public.podcast_sponsorship_conversion_events to authenticated;
drop policy if exists "Creators view own verified conversions" on public.podcast_sponsorship_conversion_events;
create policy "Creators view own verified conversions"
 on public.podcast_sponsorship_conversion_events for select to authenticated
 using(creator_user_id=(select auth.uid()));
