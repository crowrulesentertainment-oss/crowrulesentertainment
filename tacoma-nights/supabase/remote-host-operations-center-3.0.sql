-- Tacoma Nights Remote Host Operations Center 3.0
-- Run in Supabase SQL Editor after confirming tacoma_nights_remote_hosts.id is UUID.
-- All operational records are private to trusted administrators.
begin;

alter table public.tacoma_nights_host_applications
  add column if not exists interview_confirmed boolean not null default false,
  add column if not exists follow_up_at timestamptz,
  add column if not exists follow_up_status text not null default 'not_started'
    check (follow_up_status in ('not_started','pending','completed','no_response')),
  add column if not exists interview_notes text;

create table if not exists public.tacoma_nights_host_availability (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.tacoma_nights_remote_hosts(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'America/Los_Angeles',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);
create index if not exists tn_host_availability_host_idx on public.tacoma_nights_host_availability(host_id,weekday);

create table if not exists public.tacoma_nights_host_assignments (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.tacoma_nights_remote_hosts(id) on delete cascade,
  show_title text not null,
  segment_title text,
  assignment_date date not null,
  start_time time,
  end_time time,
  assignment_status text not null default 'scheduled'
    check (assignment_status in ('proposed','scheduled','confirmed','completed','cancelled')),
  producer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tn_host_assignments_date_idx on public.tacoma_nights_host_assignments(assignment_date,host_id);

create table if not exists public.tacoma_nights_host_onboarding (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.tacoma_nights_remote_hosts(id) on delete cascade,
  checklist_key text not null,
  checklist_label text not null,
  is_complete boolean not null default false,
  completed_at timestamptz,
  admin_notes text,
  updated_at timestamptz not null default now(),
  unique(host_id,checklist_key)
);
create index if not exists tn_host_onboarding_host_idx on public.tacoma_nights_host_onboarding(host_id);

create table if not exists public.tacoma_nights_host_messages (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.tacoma_nights_remote_hosts(id) on delete cascade,
  subject text not null,
  message_body text not null,
  message_type text not null default 'internal'
    check (message_type in ('internal','follow_up','schedule','onboarding')),
  delivery_status text not null default 'draft'
    check (delivery_status in ('draft','ready','sent_externally','closed')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tn_host_messages_host_idx on public.tacoma_nights_host_messages(host_id,created_at desc);

create table if not exists public.tacoma_nights_host_activity (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references public.tacoma_nights_remote_hosts(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  action_key text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists tn_host_activity_created_idx on public.tacoma_nights_host_activity(created_at desc);
create index if not exists tn_host_activity_host_idx on public.tacoma_nights_host_activity(host_id,created_at desc);

create table if not exists public.tacoma_nights_host_performance (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.tacoma_nights_remote_hosts(id) on delete cascade,
  report_month date not null,
  appearances integer not null default 0 check (appearances >= 0),
  segments_completed integer not null default 0 check (segments_completed >= 0),
  minutes_on_air integer not null default 0 check (minutes_on_air >= 0),
  producer_rating numeric(3,2) check (producer_rating between 0 and 5),
  notes text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique(host_id,report_month)
);
create index if not exists tn_host_performance_month_idx on public.tacoma_nights_host_performance(report_month desc,host_id);

-- A single JWT claim is used consistently with the existing dashboard.
do $$
declare t text;
begin
  foreach t in array array[
    'tacoma_nights_host_availability',
    'tacoma_nights_host_assignments',
    'tacoma_nights_host_onboarding',
    'tacoma_nights_host_messages',
    'tacoma_nights_host_activity',
    'tacoma_nights_host_performance'
  ] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('drop policy if exists "trusted admins manage rows" on public.%I',t);
    execute format(
      'create policy "trusted admins manage rows" on public.%I for all to authenticated using ((auth.jwt()->''app_metadata''->>''role'') = ''admin'') with check ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')',
      t
    );
  end loop;
end $$;

-- Existing applicant table remains protected by its current RLS policies.
commit;
