# Shortle - URL Shortener — Implementation Plan

## Overview

A modern URL shortener with analytics. Paste a long URL, get a short link, track clicks with device/referrer data, and generate QR codes. Full-stack with PostgreSQL database.

---

## Market Research

### Competitors

| Tool      | Strengths                    | Weaknesses                   |
| --------- | ---------------------------- | ---------------------------- |
| Bitly     | Brand recognition, analytics | Limited free tier, expensive |
| TinyURL   | Simple, fast                 | No analytics, dated UI       |
| Rebrandly | Custom domains               | Complex, pricey              |
| Dub.co    | Modern, developer-first      | New, limited integrations    |
| T.LY      | Minimalist                   | Basic features               |

### Opportunity

- Most tools are expensive or lack good free tiers
- No modern, developer-friendly shortener with clean UI
- Analytics are often hidden behind paywalls

### Target Users

- Developers sharing links
- Marketing teams tracking campaigns
- Anyone needing short, trackable links

---

## UI/UX Design

### Layout

```
┌──────────────────────────────────────────────────┐
│  🔗 URL Shortener                                │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │  Paste your long URL                         ││
│  │  [https://example.com/very/long/url/here...] ││
│  │                              [Shorten]       ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │  ✅ https://sho.rt/abc123                    ││
│  │  [Copy] [QR Code] [View Stats]              ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ──────────────────────────────────────────────  │
│                                                  │
│  📊 Your Links                                   │
│  ┌──────────────────────────────────────────────┐│
│  │ Short URL      │ Clicks │ Created │ Actions  ││
│  │ ───────────────│────────│─────────│──────────││
│  │ sho.rt/abc123  │ 142    │ Aug 25  │ [📊] [🗑] ││
│  │ sho.rt/xyz789  │ 89     │ Aug 24  │ [📊] [🗑] ││
│  └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### Stats Page

```
┌──────────────────────────────────────────────────┐
│  📊 Stats for sho.rt/abc123                      │
│  Original: https://example.com/very/long/url     │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │  Total Clicks│  │  Today       │             │
│  │  142         │  │  12          │             │
│  └──────────────┘  └──────────────┘             │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │  Clicks Over Time (Bar Chart)                ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ┌─────────────────┐  ┌────────────────────────┐│
│  │  Top Referrers  │  │  Devices               ││
│  │  • Twitter: 45  │  │  • Mobile: 67%         ││
│  │  • Direct: 38   │  │  • Desktop: 28%        ││
│  │  • GitHub: 32   │  │  • Tablet: 5%         ││
│  └─────────────────┘  └────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### Color Palettes (5 Switchable Themes)

Each palette has light and dark mode variants, switchable via header controls.

| Palette            | Light BG | Dark BG  | Primary      |
| ------------------ | -------- | -------- | ------------ |
| Rose Spark (default)| `#FBF9FA` | `#0C0D12` | `#E11D48`  |
| Indigo Velocity    | `#F8F8FC` | `#0C0D14` | `#4F46E5`  |
| Violet Pulse       | `#FAFAFE` | `#0B0B0F` | `#7C3AED`  |
| Teal Stream        | `#F5FAFA` | `#0A1012` | `#0D9488`  |
| Emerald Link       | `#F6FAF8` | `#0A0D0C` | `#059669`  |

### Key Components

- `UrlInput` — paste long URL with custom alias and tags
- `ShortenedResult` — show short URL with copy/QR/stats buttons
- `LinksTable` — card-based dashboard with inline edit, delete, tags
- `StatsOverview` — total and today's click counts
- `ClickChart` — clicks over time bar chart (Recharts)
- `QRModal` — QR code display with download
- `ReferrerChart` — top referrers bar list
- `DeviceChart` — device breakdown (Mobile/Desktop/Tablet)
- `CountryChart` — geographic breakdown grid
- `ThemeProvider` — next-themes light/dark/system toggle
- `PaletteProvider` — 5-palette switching with localStorage persistence
- `PaletteSwitcher` — dropdown palette selector
- `ThemeToggle` — sun/moon icon toggle

---

## Tech Stack

| Layer      | Technology                |
| ---------- | ------------------------- |
| Framework  | Next.js 16 (App Router)   |
| Styling    | Tailwind CSS v4 (CSS-first) |
| Database   | PostgreSQL via Prisma ORM |
| Short IDs  | `nanoid`                  |
| QR Codes   | `qrcode`                  |
| Charts     | Recharts                  |
| Deployment | Vercel                    |

---

## Features

### MVP

- [x] Paste URL → generate short link
- [x] Redirect to original URL
- [x] Track click count
- [x] Copy short URL
- [x] Dashboard with link list

### V1

- [x] Click analytics (referrer, device, country)
- [x] Geographic analytics (95 country names mapped)
- [x] QR code for each link (with download)
- [x] Custom aliases
- [x] Editable destinations (update URL without breaking link)
- [x] Link expiration (backend only, no UI picker)
- [x] Delete links (inline two-step confirmation)
- [x] Tag-based campaign grouping (create/assign/display tags)
- [x] Click chart over time (Recharts bar chart)
- [x] 5 switchable color palettes with light/dark/system toggle
- [x] FOUC prevention for theme and palette
- [x] Country detection (Vercel/Cloudflare headers + geoip-lite fallback)

### V2 (Optional)

- [ ] Password-protected links
- [ ] Custom short domains (e.g., `go.yourbrand.com`)
- [ ] Deep linking to native apps
- [ ] UTM parameter builder
- [ ] API authentication (API keys)
- [ ] Bulk shortening
- [ ] User authentication and saved links
- [ ] Dedicated tag-filtered pages (`/tags/[name]`)

---

## Database Schema (PostgreSQL + Prisma)

```prisma
model Link {
  id            String   @id @default(nanoid(7))
  originalUrl   String
  customAlias   String?  @unique
  createdAt     DateTime @default(now())
  expiresAt     DateTime?
  clicks        Click[]
  tags          Tag[]
  userId        String?

  @@index([customAlias])
}

model Click {
  id        String   @id @default(cuid())
  linkId    String
  link      Link     @relation(fields: [linkId], references: [id])
  referrer  String?
  device    String?
  browser   String?
  country   String?
  clickedAt DateTime @default(now())

  @@index([linkId])
}

model Tag {
  id        String   @id @default(cuid())
  name      String
  links     Link[]
  createdAt DateTime @default(now())

  @@unique([name])
}
```

---

## API Routes

```typescript
// POST /api/shorten
// Body: { url: string, customAlias?: string, tags?: string[] }
// Response: { shortUrl: string, id: string }

// GET /api/links
// Response: { links: Link[] } (with tags and click counts)

// PATCH /api/links/[code]
// Body: { originalUrl?: string, expiresAt?: string }
// Response: { success: boolean }

// DELETE /api/links/[code]
// Response: { success: boolean }

// GET /[code]
// Redirects to original URL + tracks click (307 redirect)

// GET /api/stats/[code]
// Response: { link, stats: { totalClicks, todayClicks, referrers[], devices[], countries[], timeline[] } }

// GET /api/tags
// Response: { tags: { name: string, linkCount: number }[] }

// GET /api/tags/[name]
// Response: { tag, links: Link[], stats: { totalLinks, totalClicks } }
```

---

## File Structure

```
shortle/
├── app/
│   ├── page.tsx            # Home page (URL shortener + dashboard)
│   ├── [code]/
│   │   └── page.tsx        # Redirect handler
│   ├── stats/
│   │   └── [code]/
│   │       └── page.tsx    # Analytics page
│   ├── api/
│   │   ├── shorten/
│   │   │   └── route.ts    # POST: Create short link
│   │   ├── links/
│   │   │   ├── route.ts    # GET: List all links
│   │   │   └── [code]/
│   │   │       └── route.ts  # PATCH/DELETE: Edit or remove link
│   │   ├── stats/
│   │   │   └── [code]/
│   │   │       └── route.ts  # GET: Link analytics
│   │   └── tags/
│   │       ├── route.ts      # GET: List all tags
│   │       └── [name]/
│   │           └── route.ts  # GET: Tag stats
│   ├── layout.tsx          # Root layout (header, footer, theme, palette)
│   └── globals.css         # All 5 palette definitions, animations, base styles
├── components/
│   ├── UrlInput.tsx        # URL input with custom alias + tags
│   ├── ShortenedResult.tsx # Short link display + copy/QR/stats
│   ├── LinksTable.tsx      # Card-based dashboard with inline edit/delete
│   ├── QrModal.tsx         # QR code modal with download
│   ├── StatsOverview.tsx   # Stats summary cards
│   ├── ClickChart.tsx      # Clicks over time bar chart
│   ├── ReferrerChart.tsx   # Referrer breakdown
│   ├── DeviceChart.tsx     # Device breakdown
│   ├── CountryChart.tsx    # Geographic breakdown grid
│   ├── theme-provider.tsx  # next-themes wrapper
│   ├── theme-toggle.tsx    # Light/dark/system cycle toggle
│   ├── palette-provider.tsx # Palette context + localStorage persistence
│   └── palette-switcher.tsx # Dropdown palette selector
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Helpers (cn, formatDate, detectDevice, etc.)
├── types/
│   └── geoip-lite.d.ts     # Type declarations for geoip-lite
├── prisma/
│   └── schema.prisma       # Database schema
├── docs/                   # Project documentation
└── public/                 # Static assets
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:adminG1@host:5432/dbname
```

---

## Deployment

1. Create PostgreSQL database (Supabase/Neon/ Railway)
2. Push to GitHub
3. Connect to Vercel
4. Set DATABASE_URL in Vercel env vars
5. Run `npx prisma db push` on first deploy
6. Auto-deploy on push

---

## Success Metrics

- Short URL generation < 200ms
- Redirect latency < 100ms
- Analytics page loads < 500ms
- Works on mobile
