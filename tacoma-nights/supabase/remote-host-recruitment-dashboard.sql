-- Remote Host Recruitment Desk migration (already applied to project cevylpnoexugwgygvtgu).
alter table public.tacoma_nights_host_applications add column if not exists internal_notes text, add column if not exists interview_at timestamptz, add column if not exists reviewed_at timestamptz, add column if not exists reviewed_by uuid references auth.users(id);
alter table public.tacoma_nights_host_applications drop constraint if exists tacoma_nights_host_applications_status_check;
alter table public.tacoma_nights_host_applications add constraint tacoma_nights_host_applications_status_check check (status in ('new','reviewing','interview','contacted','accepted','declined','archived'));
create table if not exists public.tacoma_nights_remote_hosts (id uuid primary key default gen_random_uuid(), application_id uuid unique references public.tacoma_nights_host_applications(id) on delete set null, name text not null, on_air_name text, email text not null, location text, role text not null default 'Remote Host', team_status text not null default 'active' check (team_status in ('active','on_hold','inactive')), segment_interests text, availability text, internal_notes text, joined_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.tacoma_nights_remote_hosts enable row level security;
drop policy if exists "Remote host applications admin read" on public.tacoma_nights_host_applications;
drop policy if exists "Remote host applications admin update" on public.tacoma_nights_host_applications;
create policy "Remote host applications admin read" on public.tacoma_nights_host_applications for select to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin');
create policy "Remote host applications admin update" on public.tacoma_nights_host_applications for update to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin') with check ((auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Remote host team admin read" on public.tacoma_nights_remote_hosts;
drop policy if exists "Remote host team admin insert" on public.tacoma_nights_remote_hosts;
drop policy if exists "Remote host team admin update" on public.tacoma_nights_remote_hosts;
create policy "Remote host team admin read" on public.tacoma_nights_remote_hosts for select to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin');
create policy "Remote host team admin insert" on public.tacoma_nights_remote_hosts for insert to authenticated with check ((auth.jwt()->'app_metadata'->>'role')='admin');
create policy "Remote host team admin update" on public.tacoma_nights_remote_hosts for update to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin') with check ((auth.jwt()->'app_metadata'->>'role')='admin');
grant select, update on public.tacoma_nights_host_applications to authenticated;
grant select, insert, update on public.tacoma_nights_remote_hosts to authenticated;
