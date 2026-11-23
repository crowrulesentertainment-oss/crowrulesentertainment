# CrowRules Corporate Newsroom

The newsroom is part of the existing Corporate Command Center and uses the same Supabase project and administrator authorization check.

## Included

- `newsroom.html`: public, searchable and filterable company news archive.
- `news-article.html`: public article detail route using a URL slug.
- `newsroom-management.html`: private administrator editorial workspace.
- `supabase/corporate-newsroom-setup.sql`: schema, RLS policies and public read-only view.

## One-time database setup

Before using the CMS, review and run `supabase/corporate-newsroom-setup.sql` in the Supabase SQL Editor for project `cevylpnoexugwgygvtgu`.

The script expects the existing `public.corporate_divisions` table and `public.recruitment_admin_access_check()` function from Division Management. It does not alter recruitment or division policies.

The article table has RLS enabled. Anonymous users can read only published rows through the `corporate_news_public` security-invoker view. Authenticated CrowRules administrators are authorized by the existing admin RPC. The public site uses only the existing publishable key. Never expose a service-role or secret key in browser code.

## Editorial workflow

1. Draft — private working copy.
2. In Review — awaiting editorial review.
3. Approved — approved for release but not public.
4. Scheduled — queued for a future publication date (manual publication is still required).
5. Published — public in the newsroom.
6. Archived — removed from public view.

Only set an article to Published when it is ready for public release. For scheduled content, review and publish it when the scheduled time arrives; automatic scheduled publishing is not part of this first release.

## HTML authoring safety

The editor's article body accepts HTML. Only trusted CrowRules administrators should receive access. Use simple semantic HTML (`p`, `h2`, `h3`, `ul`, `ol`, `li`, `blockquote`, `a`, `strong`, `em`). Do not paste scripts, embedded forms or untrusted third-party markup.

## Access

Sign in with an existing CrowRules administrator account. The editor reuses `recruitment_admin_access_check()`; it does not introduce a second role system or grant access to ordinary contributors.
