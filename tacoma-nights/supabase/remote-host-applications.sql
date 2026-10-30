-- Tacoma Nights remote host applications
-- Run this in the Supabase SQL Editor for project cevylpnoexugwgygvtgu.
create table if not exists public.tacoma_nights_host_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  on_air_name text check (on_air_name is null or char_length(on_air_name) <= 80),
  email text not null check (char_length(email) <= 254),
  location text not null check (char_length(location) between 2 and 120),
  availability text not null,
  format text not null,
  interests text not null check (char_length(interests) between 2 and 2500),
  experience text check (experience is null or char_length(experience) <= 2500),
  setup text check (setup is null or char_length(setup) <= 1500),
  why text not null check (char_length(why) between 2 and 2500),
  volunteer_acknowledgement boolean not null check (volunteer_acknowledgement = true),
  contact_consent boolean not null check (contact_consent = true),
  status text not null default 'new' check (status in ('new','reviewing','contacted','accepted','declined','archived')),
  created_at timestamptz not null default now()
);
alter table public.tacoma_nights_host_applications enable row level security;
revoke all on table public.tacoma_nights_host_applications from anon, authenticated;
grant insert on table public.tacoma_nights_host_applications to anon, authenticated;
drop policy if exists "Public can submit remote host applications" on public.tacoma_nights_host_applications;
create policy "Public can submit remote host applications"
on public.tacoma_nights_host_applications
for insert to anon, authenticated
with check (
  volunteer_acknowledgement = true
  and contact_consent = true
  and status = 'new'
);
-- No public SELECT, UPDATE, or DELETE policy is created. Review applications only
-- through an authorized Supabase dashboard/admin workflow.
