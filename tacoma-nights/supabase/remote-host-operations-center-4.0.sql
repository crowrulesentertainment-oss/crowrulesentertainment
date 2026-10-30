-- Tacoma Nights Remote Host Operations Center 4.0
-- Run after the 3.0 migration. Confirm the existing host table uses UUID IDs.
begin;

create table if not exists public.tacoma_nights_production_calendar (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  start_time time not null,
  end_time time,
  timezone text not null default 'America/Los_Angeles',
  event_status text not null default 'scheduled'
    check (event_status in ('planning','scheduled','live','completed','cancelled')),
  production_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tn_production_calendar_date_idx
  on public.tacoma_nights_production_calendar(event_date,start_time);

alter table public.tacoma_nights_host_assignments
  add column if not exists calendar_event_id uuid
  references public.tacoma_nights_production_calendar(id) on delete set null;
create index if not exists tn_host_assignments_calendar_idx
  on public.tacoma_nights_host_assignments(calendar_event_id);

create table if not exists public.tacoma_nights_producer_schedule (
  id uuid primary key default gen_random_uuid(),
  producer_name text not null,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  responsibilities text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);
create index if not exists tn_producer_schedule_weekday_idx
  on public.tacoma_nights_producer_schedule(weekday,start_time)
  where is_active;

create table if not exists public.tacoma_nights_host_checkins (
  id uuid primary key default gen_random_uuid(),
  calendar_event_id uuid not null references public.tacoma_nights_production_calendar(id) on delete cascade,
  host_id uuid not null references public.tacoma_nights_remote_hosts(id) on delete cascade,
  checkin_status text not null default 'expected'
    check (checkin_status in ('expected','checked_in','late','absent','released')),
  checked_in_at timestamptz,
  producer_notes text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(calendar_event_id,host_id)
);
create index if not exists tn_host_checkins_event_idx
  on public.tacoma_nights_host_checkins(calendar_event_id,checkin_status);

do $$
declare t text;
begin
  foreach t in array array[
    'tacoma_nights_production_calendar',
    'tacoma_nights_producer_schedule',
    'tacoma_nights_host_checkins'
  ] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('drop policy if exists "trusted admins manage rows" on public.%I',t);
    execute format(
      'create policy "trusted admins manage rows" on public.%I for all to authenticated using ((auth.jwt()->''app_metadata''->>''role'') = ''admin'') with check ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')',
      t
    );
  end loop;
end $$;

commit;
