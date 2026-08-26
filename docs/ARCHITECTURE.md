# Architecture

## Overview

Shortle is a full-stack URL shortener built with Next.js 16 App Router, PostgreSQL, and Prisma ORM. The application follows a monolithic architecture with server-side rendering and API routes co-located within the Next.js app.

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│  ┌──────────┐  ┌──────────┐                             │
│  │  Home    │  │  Stats   │                             │
│  │  Page    │  │  Page    │                             │
│  └────┬─────┘  └────┬─────┘                             │
│       │              │                                   │
└───────┼──────────────┼───────────────────────────────────┘
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)               │
│  ┌────────────────────────────────────────────────────┐ │
│  │                    Server Layer                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │ │
│  │  │  Page    │  │  Route   │  │  Server  │         │ │
│  │  │  Server  │  │  Handler │  │  Action  │         │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │ │
│  └───────┼──────────────┼──────────────┼───────────────┘ │
│          │              │              │                  │
│          ▼              ▼              ▼                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │                   Data Layer                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │ │
│  │  │  Prisma  │  │  nanoid  │  │  QR Code │         │ │
│  │  │  Client  │  │  (IDs)   │  │  Gen     │         │ │
│  │  └────┬─────┘  └──────────┘  └──────────┘         │ │
│  └───────┼─────────────────────────────────────────────┘ │
└──────────┼───────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Link    │  │  Click   │  │  Tag     │             │
│  │  Table   │  │  Table   │  │  Table   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
shortle/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (URL shortener + dashboard)
│   ├── [code]/
│   │   └── page.tsx       # Redirect handler with click tracking
│   ├── stats/
│   │   └── [code]/
│   │       └── page.tsx   # Analytics page (server component)
│   ├── api/               # API routes
│   │   ├── shorten/
│   │   │   └── route.ts   # POST: Create short link
│   │   ├── links/
│   │   │   ├── route.ts   # GET: List all links
│   │   │   └── [code]/
│   │   │       └── route.ts  # PATCH/DELETE: Edit or remove link
│   │   ├── stats/
│   │   │   └── [code]/
│   │   │       └── route.ts  # GET: Link analytics
│   │   └── tags/
│   │       ├── route.ts      # GET: List all tags
│   │       └── [name]/
│   │           └── route.ts  # GET: Tag stats
│   ├── layout.tsx         # Root layout (header, footer, theme, palette)
│   └── globals.css        # 5 palette definitions, animations, base styles
├── components/            # React components
│   ├── UrlInput.tsx       # URL input form with custom alias + tags
│   ├── ShortenedResult.tsx # Short link display + copy/QR/stats
│   ├── LinksTable.tsx     # Card-based dashboard with inline edit/delete
│   ├── QrModal.tsx        # QR code modal with download
│   ├── StatsOverview.tsx  # Stats summary cards
│   ├── ClickChart.tsx     # Clicks over time bar chart (Recharts)
│   ├── ReferrerChart.tsx  # Referrer breakdown
│   ├── DeviceChart.tsx    # Device breakdown
│   ├── CountryChart.tsx   # Geographic breakdown grid
│   ├── theme-provider.tsx # next-themes wrapper
│   ├── theme-toggle.tsx   # Light/dark/system cycle toggle
│   ├── palette-provider.tsx # Palette context + localStorage persistence
│   └── palette-switcher.tsx # Dropdown palette selector
├── lib/                   # Utilities and shared logic
│   ├── db.ts              # Prisma client singleton
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Helpers (cn, formatDate, detectDevice, getCountryName)
├── types/
│   └── geoip-lite.d.ts    # Type declarations for geoip-lite module
├── prisma/
│   └── schema.prisma      # Database schema
├── docs/                  # Project documentation
└── public/                # Static assets
```

## Request Flow

### URL Shortening

```
User submits URL
       │
       ▼
POST /api/shorten
       │
       ▼
Validate URL format
       │
       ▼
Check custom alias availability
       │
       ▼
Generate nanoid (or use custom alias)
       │
       ▼
Insert into Link table
       │
       ▼
Return short URL
```

### URL Redirect

```
User visits sho.rt/abc123
       │
       ▼
GET /[code]
       │
       ▼
Lookup Link by code
       │
       ▼
Check if expired → 404 if yes
       │
       ▼
Record Click (referrer, device, browser, country)
       │
       ▼
307 Redirect to originalUrl
```

### Analytics Retrieval

```
User visits /stats/abc123
       │
       ▼
Page Server fetches link + all clicks
       │
       ▼
Aggregate: referrers, devices, countries, timeline
       │
       ▼
Render StatsOverview, ClickChart, ReferrerChart, DeviceChart, CountryChart
```

## Key Design Decisions

### 1. Prisma as ORM

- Type-safe database queries
- Auto-generated migrations
- Single `schema.prisma` file as source of truth

### 2. nanoid for Short IDs

- URL-safe characters only
- Configurable length (default: 7 characters)
- Collision-resistant

### 3. Server-Side Click Tracking

Clicks are recorded server-side in the redirect handler to ensure:

- Accurate tracking regardless of client-side JS
- No dependency on browser capabilities
- Works with bots and crawlers

### 4. Co-located API Routes

API routes live under `app/api/` following Next.js conventions:

- Clear separation between pages and API
- Shared Prisma client via `lib/db.ts`
- Consistent error handling patterns

### 5. Tag-Based Campaign Grouping

Links can be tagged for campaign-level analytics:

- Many-to-many relationship (Link ↔ Tag)
- Aggregate stats per tag
- Tags displayed as badges on link cards

### 6. Five Switchable Color Palettes

- CSS custom properties in `globals.css` define all palette colors
- `PaletteProvider` context manages selection via localStorage
- `data-palette` attribute on `<html>` activates the selected palette
- FOUC prevention script in `<head>` reads preferences before paint

## Performance Targets

| Metric                  | Target  |
| ----------------------- | ------- |
| Short URL generation    | < 200ms |
| Redirect latency        | < 100ms |
| Analytics page load     | < 500ms |
| Time to First Byte (TTFB) | < 50ms |

## Security Considerations

- Validate and sanitize all URL inputs
- No user data stored (anonymous by default)
- HTTPS enforced in production
- Environment variables for secrets (never committed)
