# Changelog

All notable changes to Shortle will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Next.js 16, Tailwind CSS v4, and TypeScript
- Database schema with Prisma ORM (Link, Click, Tag models)
- Home page with URL shortening form and glow border input
- Card-based dashboard showing all shortened links
- Redirect handler for short URLs with click tracking
- Click tracking (referrer, device, browser, country)
- Copy short URL to clipboard (per-link and per-result)
- Stats page with analytics overview (Recharts)
- Referrer breakdown chart
- Device breakdown chart (Mobile/Desktop/Tablet)
- Geographic analytics with 95 country name mappings
- Country detection via Vercel/Cloudflare headers + geoip-lite fallback
- Tag-based campaign grouping (create/assign/display on cards)
- Link editing (inline edit destination URL)
- Link deletion (inline two-step confirmation)
- Link expiration support (backend only, no frontend UI)
- QR code generation with download (client-side via qrcode lib)
- Custom aliases (validated, unique, UI in Options dropdown)
- 5 switchable color palettes (Rose Spark, Indigo Velocity, Violet Pulse, Teal Stream, Emerald Link)
- Light/dark/system theme toggle (next-themes)
- Palette persistence via localStorage
- FOUC prevention for theme and palette
- Smooth card hover animations and glow border effects
- Gradient text for hero heading
- API documentation
- Architecture documentation
- Database documentation
- Deployment guide
- Contributing guidelines
- Code of conduct

### Partially Implemented

- Link expiration: backend supports it (schema + redirect check + PATCH API), but no frontend UI to set expiration
- Tags: create/assign/display works, but no dedicated `/tags/[name]` page
- Browser analytics: tracked in DB but not displayed in stats UI

### Planned (V2)

- [ ] Password-protected links
- [ ] Custom short domains
- [ ] Deep linking to native apps
- [ ] UTM parameter builder
- [ ] API authentication (API keys)
- [ ] Bulk shortening
- [ ] User authentication and saved links
- [ ] Dedicated tag-filtered pages

## [0.1.0] - 2026-08-26

### Added

- Initial release
- Project structure and configuration
- Prisma schema design
- Documentation suite

[Unreleased]: https://github.com/md-zeon/shortle/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/md-zeon/shortle/releases/tag/v0.1.0
