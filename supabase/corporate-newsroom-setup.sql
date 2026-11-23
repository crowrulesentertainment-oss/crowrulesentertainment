-- CrowRules Entertainment · Corporate Newsroom
-- Review and run in the Supabase SQL Editor for project cevylpnoexugwgygvtgu.
-- Uses the existing recruitment_admin_access_check() authorization function.
-- Browser clients use the publishable key only; never add a service-role key here.

create table if not exists public.corporate_news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary text not null check (char_length(summary) between 1 and 400),
  body_html text not null default '',
  body_text text not null default '',
  category text not null default 'announcement'
    check (category in ('announcement','company','division','press')),
  status text not null default 'draft'
    check (status in ('draft','in_review','approved','scheduled','published','archived')),
  division_id uuid references public.corporate_divisions(id) on delete set null,
  featured_image_url text,
  author_name text not null default 'CrowRules Entertainment',
  scheduled_at timestamptz,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_articles_need_date check (status <> 'published' or published_at is not null)
);

create index if not exists corporate_news_articles_status_date_idx
  on public.corporate_news_articles(status, published_at desc);
create index if not exists corporate_news_articles_division_idx
  on public.corporate_news_articles(division_id);

alter table public.corporate_news_articles enable row level security;

drop policy if exists "Public can read published corporate news" on public.corporate_news_articles;
create policy "Public can read published corporate news"
  on public.corporate_news_articles for select to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "CrowRules admins can manage corporate news" on public.corporate_news_articles;
create policy "CrowRules admins can manage corporate news"
  on public.corporate_news_articles for all to authenticated
  using ((select public.recruitment_admin_access_check()) is true)
  with check ((select public.recruitment_admin_access_check()) is true);

grant select on public.corporate_news_articles to anon, authenticated;
grant insert, update, delete on public.corporate_news_articles to authenticated;

drop view if exists public.corporate_news_public;
create view public.corporate_news_public
with (security_invoker = true) as
select id, title, slug, summary, body_html, body_text, category,
       featured_image_url, author_name, published_at, division_id
from public.corporate_news_articles
where status = 'published' and published_at <= now();

grant select on public.corporate_news_public to anon, authenticated;

comment on table public.corporate_news_articles is
  'Private editorial source of truth for CrowRules corporate newsroom content.';
comment on view public.corporate_news_public is
  'Published corporate newsroom articles only; security-invoker view respects base-table RLS.';