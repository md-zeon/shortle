# Changelog

All notable changes to Shortle will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Next.js 16, Tailwind CSS, and TypeScript
- Database schema with Prisma ORM (Link, Click, Tag models)
- Home page with URL shortening form
- Dashboard showing all shortened links
- Redirect handler for short URLs
- Click tracking (referrer, device, browser, country)
- Copy short URL to clipboard
- Stats page with analytics overview
- Referrer breakdown chart
- Device breakdown chart
- Geographic analytics
- Tag-based campaign grouping
- Link editing (update destination URL)
- Link deletion
- Link expiration support
- QR code generation
- Custom aliases
- API documentation
- Architecture documentation
- Database documentation
- Deployment guide
- Contributing guidelines
- Code of conduct

### Planned

- [ ] Password-protected links
- [ ] Custom short domains
- [ ] Deep linking to native apps
- [ ] UTM parameter builder
- [ ] API for programmatic access
- [ ] Bulk shortening
- [ ] User authentication
- [ ] Team workspaces

## [0.1.0] - 2026-08-26

### Added

- Initial release
- Project structure and configuration
- Prisma schema design
- Documentation suite

[Unreleased]: https://github.com/md-zeon/shortle/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/md-zeon/shortle/releases/tag/v0.1.0
