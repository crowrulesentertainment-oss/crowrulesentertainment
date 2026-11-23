# CrowRules Division Management

The Corporate Command Center includes a private Division Management workspace at `division-management.html`.

## Portfolio data

The live portfolio is stored in the Supabase table `public.corporate_divisions`. It holds the 13 approved CrowRules divisions and supports:

- Public name and description
- Status: Active, Testing, In Development, Planned, Coming Soon
- Public destination URL
- Launch target date
- Internal milestone notes
- Published/hidden visibility
- Sort order and update attribution

The public directory reads from the curated `public.corporate_divisions_public` view. The view intentionally excludes internal milestone notes and administrator attribution, and returns published divisions only.

## Access model

- Supabase Auth handles administrator sign-in.
- The workspace checks the existing `public.recruitment_admin_access_check()` authorization function.
- The base table has RLS enabled. Authenticated administrators receive management access through the existing admin check.
- Anonymous visitors cannot query the base table. They can read only the curated public view.
- The browser uses the Supabase publishable key only. No service-role key is included.

## Pages and assets

- `command-center.html` — corporate dashboard
- `division-management.html` — administrator editor
- `assets/division-management.js` and `assets/division-management.css` — editor behavior and layout
- `assets/divisions-live.js` — public directory renderer

## Notes

This module manages the existing 13 divisions. It does not create or delete divisions, change the approved division numbering, or automatically publish an unpublished record. A division becomes visible publicly only when its administrator enables the Published checkbox.
