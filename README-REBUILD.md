# CrowRules Entertainment corporate rebuild

This branch refreshes the corporate front door for GitHub Pages.

- Cinematic corporate homepage with black, charcoal, metallic-gold and crimson identity direction.
- Shared responsive navigation and footer.
- Company, divisions, careers, partnerships, press and contact pages.
- All 13 approved divisions and transparent development statuses.
- Existing Tacoma Nights, Back Deck Live, Podcasting and other project folders are preserved; their files, database migrations and independent branding are not rewritten.

Security: client-side role checks and hidden links do not secure administration. Any future admin rebuild must enforce identity and permissions server-side and with Supabase RLS. Never put a service-role key in GitHub Pages.

GitHub Pages serves index.html from the repository root.