# Shortle

A modern, full-stack URL shortener with analytics, QR codes, tag-based grouping, and 5 switchable color palettes.

## Features

- **URL Shortening** — Paste a long URL, get a short link with optional custom alias
- **Click Analytics** — Track referrers, devices, browsers, and countries per link
- **QR Codes** — Generate and download QR codes for any short link
- **Tags** — Group links with tags for campaign-level organization
- **Inline Editing** — Edit destination URLs and manage links directly from the dashboard
- **5 Color Palettes** — Rose Spark, Indigo Velocity, Violet Pulse, Teal Stream, Emerald Link
- **Light/Dark/System Theme** — Full theme support with smooth transitions
- **Country Detection** — Vercel/Cloudflare headers + geoip-lite fallback for local dev

## Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| Styling   | Tailwind CSS v4         |
| Database  | PostgreSQL + Prisma ORM |
| Short IDs | nanoid (7 characters)   |
| QR Codes  | qrcode (client-side)    |
| Charts    | Recharts                |
| Themes    | next-themes             |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/md-zeon/shortle.git
cd shortle

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push schema to database
npx prisma db push

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
shortle/
├── app/                  # Next.js App Router pages + API routes
├── components/           # React components (UI, charts, theme/palette providers)
├── lib/                  # Utilities (Prisma client, helpers, types)
├── types/                # TypeScript declarations (geoip-lite)
├── prisma/               # Database schema
└── docs/                 # Detailed documentation
```

## Documentation

- [API Reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Changelog](docs/CHANGELOG.md)

## License

MIT
