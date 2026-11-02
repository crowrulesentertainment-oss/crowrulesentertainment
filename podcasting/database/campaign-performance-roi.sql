-- CrowRules Podcasting: campaign performance and ROI reporting
-- Run against project cevylpnoexugwgygvtgu.
create table if not exists public.podcast_sponsorship_campaign_metrics (
 id uuid primary key default gen_random_uuid(),
 deal_id uuid not null references public.podcast_sponsorship_deals(id) on delete cascade,
 creator_user_id uuid not null references auth.users(id) on delete cascade,
 episode_id uuid null references public.podcast_episodes(id) on delete set null,
 metric_date date not null default current_date,
 clicks integer not null default 0 check (clicks >= 0),
 conversions integer not null default 0 check (conversions >= 0),
 campaign_spend numeric(12,2) not null default 0 check (campaign_spend >= 0),
 attributed_revenue numeric(12,2) not null default 0 check (attributed_revenue >= 0),
 currency text not null default 'USD' check (currency in ('USD','CAD','GBP','EUR')),
 source text not null default 'sponsor_reported' check (source in ('sponsor_reported','creator_reported','tracked_external','other')),
 evidence_url text,
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint sponsorship_metric_evidence_url_length check (evidence_url is null or length(evidence_url) <= 2048),
 constraint sponsorship_metric_notes_length check (notes is null or length(notes) <= 2000)
);
alter table public.podcast_sponsorship_campaign_metrics enable row level security;
revoke all on public.podcast_sponsorship_campaign_metrics from anon, authenticated;
grant select,insert,update,delete on public.podcast_sponsorship_campaign_metrics to authenticated;
drop policy if exists sponsorship_campaign_metrics_creator_access on public.podcast_sponsorship_campaign_metrics;
create policy sponsorship_campaign_metrics_creator_access on public.podcast_sponsorship_campaign_metrics
 for all to authenticated
 using (creator_user_id=(select auth.uid()) and exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())))
 with check (creator_user_id=(select auth.uid()) and exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())));
create index if not exists sponsorship_campaign_metrics_creator_date_idx on public.podcast_sponsorship_campaign_metrics(creator_user_id,metric_date desc);
create index if not exists sponsorship_campaign_metrics_deal_idx on public.podcast_sponsorship_campaign_metrics(deal_id,metric_date desc);
