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

### Color Palette

- Background: `#0A090F`
- Cards: `#1A1A1E`
- Accent: `#5542FF`
- Success: `#22C55E`
- Text: `#EFEFE6`

### Key Components

- `UrlInput` — paste long URL
- `ShortenedResult` — show short URL with copy/QR
- `LinksTable` — list of all shortened links
- `StatsPage` — detailed analytics
- `QRModal` — QR code display
- `ReferrerChart` — top referrers pie chart
- `DeviceChart` — device breakdown
- `CountryChart` — geographic breakdown
- `TagManager` — create/assign tags to links
- `LinkEditor` — edit destination URL

---

## Tech Stack

| Layer      | Technology                |
| ---------- | ------------------------- |
| Framework  | Next.js 16 (App Router)   |
| Styling    | Tailwind CSS + shadcn/ui  |
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

- [ ] Click analytics (referrer, device, country)
- [ ] Geographic analytics
- [ ] QR code for each link
- [ ] Custom aliases
- [ ] Editable destinations (update URL without breaking link)
- [ ] Link expiration
- [ ] Delete links
- [ ] Tag-based campaign grouping

### V2 (Optional)

- [ ] Click chart over time (hourly patterns)
- [ ] Password-protected links
- [ ] Custom short domains (e.g., `go.yourbrand.com`)
- [ ] Deep linking to native apps
- [ ] UTM parameter builder
- [ ] API for programmatic access
- [ ] Bulk shortening

---

## Database Schema (PostgreSQL + Prisma)

```prisma
model Link {
  id            String   @id @default(nanoid())
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

// PATCH /api/links/[code]
// Body: { originalUrl?: string, expiresAt?: string }
// Response: { success: boolean }

// GET /[code]
// Redirects to original URL + tracks click

// GET /api/stats/[code]
// Response: { clicks, referrers[], devices[], countries[], timeline[] }

// GET /api/tags
// Response: { tags: { name: string, linkCount: number }[] }

// GET /api/tags/[name]
// Response: { links: Link[], stats: aggregatedStats }
```

---

## File Structure

```
url-shortener/
├── app/
│   ├── page.tsx
│   ├── [code]/page.tsx          # Redirect handler
│   ├── stats/[code]/page.tsx    # Stats page
│   ├── tags/[name]/page.tsx     # Tag-filtered view
│   ├── layout.tsx
│   └── globals.css
├── app/api/
│   ├── shorten/route.ts
│   ├── links/[code]/route.ts    # Edit/delete link
│   ├── stats/[code]/route.ts
│   ├── tags/route.ts            # List/create tags
│   └── tags/[name]/route.ts     # Get tag stats
├── components/
│   ├── UrlInput.tsx
│   ├── ShortenedResult.tsx
│   ├── LinksTable.tsx
│   ├── LinkRow.tsx
│   ├── LinkEditor.tsx
│   ├── StatsOverview.tsx
│   ├── ClickChart.tsx
│   ├── ReferrerChart.tsx
│   ├── DeviceChart.tsx
│   ├── CountryChart.tsx
│   ├── TagManager.tsx
│   └── ui/
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   ├── CODE_OF_CONDUCT.md
│   └── CHANGELOG.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── .env                         # DATABASE_URL
└── PLAN.md
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
