# CrowRules Entertainment — Cinematic Corporate Upgrade

## Direction
Hollywood meets Tacoma: a photorealistic, business-forward corporate presentation with a strong Tacoma/Pacific Northwest identity and a recurring raven emblem.

## Scope
- Corporate opening page and homepage
- Mission, Values, Vision, Future, Partnerships, Employees, Contact, Membership
- Shared cinematic CSS and presentation-only JavaScript
- Raven SVG brand mark and photographic credit register

## Preservation
This upgrade is presentation-only. It does not replace Supabase configuration, authentication, membership state, YouTube loading, notification logic, existing navigation destinations, or division applications. It is scoped to the corporate repository pages and is not loaded by Podcasting or Tacoma Nights sub-apps.

## New files
- assets/css/crowrules-cinematic.css
- assets/branding/crowrules-raven.svg
- assets/branding/PHOTO-CREDITS.md
- js/crowrules-cinematic.js

## Photography
Tacoma aerial imagery uses a CC0 Wikimedia Commons photograph. Additional Unsplash photographs are used for raven, studio, production, community, forest, and business scenes. Photo references are centralized in the presentation script.

## QA checklist
- Verify corporate navigation and internal links
- Verify membership/auth flows still load
- Verify homepage latest-video component still populates
- Verify no console errors from the presentation layer
- Check mobile layout and reduced-motion behavior
- Review image loading and external CDN availability
- Confirm GitHub Pages preview before merging to main
