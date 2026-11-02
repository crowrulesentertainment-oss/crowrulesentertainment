-- CrowRules Podcasting — Creator Sponsorship Studio
-- Supabase project: cevylpnoexugwgygvtgu
-- The base sponsorship opportunity/application/deal/deliverable tables already exist.

create table if not exists public.podcast_sponsorship_creator_payments (
 id uuid primary key default gen_random_uuid(),
 deal_id uuid not null references public.podcast_sponsorship_deals(id) on delete cascade,
 creator_user_id uuid not null references auth.users(id) on delete cascade,
 payment_label text not null default 'Sponsorship payment' check (char_length(payment_label) between 1 and 120),
 amount numeric(12,2) not null check (amount > 0),
 currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
 payment_status text not null default 'expected' check (payment_status in ('expected','invoiced','partial','paid','overdue','cancelled')),
 due_date date,
 received_date date,
 invoice_reference text,
 payment_method text,
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists idx_podcast_sponsorship_creator_payments_owner on public.podcast_sponsorship_creator_payments(creator_user_id,created_at desc);
create index if not exists idx_podcast_sponsorship_creator_payments_deal on public.podcast_sponsorship_creator_payments(deal_id);
alter table public.podcast_sponsorship_creator_payments enable row level security;
revoke all on public.podcast_sponsorship_creator_payments from anon,authenticated;
grant select,insert,update,delete on public.podcast_sponsorship_creator_payments to authenticated;
drop policy if exists "creators manage own sponsorship payment records" on public.podcast_sponsorship_creator_payments;
create policy "creators manage own sponsorship payment records"
on public.podcast_sponsorship_creator_payments for all to authenticated
using (creator_user_id=(select auth.uid()) and exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())))
with check (creator_user_id=(select auth.uid()) and exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())));

drop policy if exists "creators can insert deliverables" on public.podcast_sponsorship_deliverables;
drop policy if exists "creators can add deliverables to own deals" on public.podcast_sponsorship_deliverables;
create policy "creators can add deliverables to own deals" on public.podcast_sponsorship_deliverables for insert to authenticated
with check (exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())));
drop policy if exists "creators can submit own deliverables" on public.podcast_sponsorship_deliverables;
create policy "creators can submit own deliverables" on public.podcast_sponsorship_deliverables for update to authenticated
using (exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())))
with check (exists(select 1 from public.podcast_sponsorship_deals d where d.id=deal_id and d.creator_user_id=(select auth.uid())));

create or replace function public.guard_creator_sponsorship_deliverable_update()
returns trigger language plpgsql set search_path=''
as $$
begin
 if exists(select 1 from public.podcast_sponsorship_admins a where a.user_id=(select auth.uid())) then return new; end if;
 if not exists(select 1 from public.podcast_sponsorship_deals d where d.id=old.deal_id and d.creator_user_id=(select auth.uid())) then raise exception 'Not authorized'; end if;
 if new.deal_id is distinct from old.deal_id or new.title is distinct from old.title or new.description is distinct from old.description
 or new.due_date is distinct from old.due_date or new.status is distinct from old.status or new.review_note is distinct from old.review_note
 or new.approved_at is distinct from old.approved_at or new.created_at is distinct from old.created_at then
  raise exception 'Creators may only update submission URL, submission note and completion timestamp';
 end if;
 return new;
end;
$$;
revoke all on function public.guard_creator_sponsorship_deliverable_update() from public,anon,authenticated;
drop trigger if exists trg_guard_creator_sponsorship_deliverable_update on public.podcast_sponsorship_deliverables;
create trigger trg_guard_creator_sponsorship_deliverable_update before update on public.podcast_sponsorship_deliverables for each row execute function public.guard_creator_sponsorship_deliverable_update();
