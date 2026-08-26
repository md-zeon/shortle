# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Vercel account (for production deployment)
- GitHub repository

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/md-zeon/shortle.git
cd shortle
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/shortle
```

### 4. Set Up the Database

**Option A: Local PostgreSQL**

```bash
# Create database
createdb shortle

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

**Option B: Docker**

```bash
docker run -d \
  --name shortle-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shortle \
  -p 5432:5432 \
  postgres:16
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import Project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — keep default settings
4. Click **Deploy**

### 3. Set Up Database

Choose a hosted PostgreSQL provider:

| Provider    | Free Tier          | Link                          |
| ----------- | ------------------ | ----------------------------- |
| Supabase    | 500MB, 50K rows    | [supabase.com](https://supabase.com) |
| Neon        | 512MB              | [neon.tech](https://neon.tech) |
| Railway     | $5 credit          | [railway.app](https://railway.app) |

### 4. Configure Environment Variables

In Vercel dashboard → **Settings → Environment Variables**:

```
DATABASE_URL = postgresql://user:password@host:5432/shortle
```

### 5. Initialize Database Schema

After first deploy, run Prisma push:

**Option A: Vercel CLI**

```bash
npx vercel env pull .env.local
npx prisma db push
```

**Option B: Vercel SSH**

```bash
npx prisma db push
```

### 6. Verify Deployment

1. Visit your Vercel URL (e.g., `https://shortle.vercel.app`)
2. Shorten a test URL
3. Verify redirect works
4. Check analytics page

---

## Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to **Settings → Domains**
2. Add your custom domain (e.g., `sho.rt`)

### 2. Configure DNS

Add these DNS records at your registrar:

| Type  | Name  | Value                   |
| ----- | ----- | ----------------------- |
| A     | @     | 76.76.21.21             |
| CNAME | www   | cname.vercel-dns.com    |

### 3. Update Environment Variable

Update `BASE_URL` in your environment:

```env
BASE_URL=https://sho.rt
```

---

## Database Migrations

When schema changes are needed:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# (For production with migrations)
npx prisma migrate dev --name <migration_name>
npx prisma migrate deploy
```

---

## Troubleshooting

### Common Issues

**Database connection refused**

- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Ensure IP allowlist includes your server (for hosted DBs)

**Prisma client not generated**

```bash
npx prisma generate
```

**Redirect not working**

- Ensure `[code]/page.tsx` exists in `app/`
- Check database has the link record
- Verify the link hasn't expired

**Analytics not recording**

- Check click tracking is implemented in redirect handler
- Verify `Click` table exists in database
- Inspect server logs for errors

### Useful Commands

```bash
# View database tables
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Check Prisma version
npx prisma --version
```

---

## Performance Optimization

### Vercel Settings

- **Edge Functions**: Redirects should use Edge for lowest latency
- **ISR**: Cache stats pages with `revalidate` option
- **Image Optimization**: Use `next/image` for QR code previews

### Database Optimization

- Indexes on `Link.customAlias` and `Click.linkId`
- Consider read replicas for high-traffic analytics
- Add connection pooling with PgBouncer for production
