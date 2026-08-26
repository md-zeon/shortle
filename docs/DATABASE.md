# Database Schema

Shortle uses PostgreSQL with Prisma ORM for data management.

## Schema Overview

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Link     │       │    Click    │       │     Tag     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │       │ id (PK)     │
│ originalUrl │   │   │ linkId (FK) │──────►│ name (UQ)   │
│ customAlias │   │   │ referrer    │       │ createdAt   │
│ createdAt   │   │   │ device      │       └──────┬──────┘
│ expiresAt   │   │   │ browser     │              │
│ userId      │   │   │ country     │              │
└─────────────┘   │   │ clickedAt   │              │
                  │   └─────────────┘              │
                  │                                │
                  └────────────────────────────────┘
                        _LinkToTag (join table)
```

## Models

### Link

Stores shortened URLs.

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
```

| Field        | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| `id`         | `String`   | Unique short code (nanoid, 7 chars)      |
| `originalUrl`| `String`   | The destination URL                      |
| `customAlias`| `String?`  | Optional custom alias (unique)           |
| `createdAt`  | `DateTime` | When the link was created                |
| `expiresAt`  | `DateTime?`| Optional expiration time                 |
| `clicks`     | `Click[]`  | All click events for this link           |
| `tags`       | `Tag[]`    | Tags associated with this link           |
| `userId`     | `String?`  | Owner ID (future: auth support)          |

### Click

Records individual click events.

```prisma
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
```

| Field       | Type       | Description                              |
| ----------- | ---------- | ---------------------------------------- |
| `id`        | `String`   | Unique click identifier (cuid)           |
| `linkId`    | `String`   | Foreign key to Link                      |
| `referrer`  | `String?`  | HTTP Referer header value                |
| `device`    | `String?`  | Device type (Mobile/Desktop/Tablet)      |
| `browser`   | `String?`  | Browser name (Chrome/Firefox/Safari)     |
| `country`   | `String?`  | Country code from IP geolocation         |
| `clickedAt` | `DateTime` | When the click occurred                  |

### Tag

Labels for organizing links into campaigns.

```prisma
model Tag {
  id        String   @id @default(cuid())
  name      String
  links     Link[]
  createdAt DateTime @default(now())

  @@unique([name])
}
```

| Field       | Type       | Description                              |
| ----------- | ---------- | ---------------------------------------- |
| `id`        | `String`   | Unique tag identifier (cuid)             |
| `name`      | `String`   | Tag name (unique, e.g., "marketing")     |
| `links`     | `Link[]`   | All links with this tag                  |
| `createdAt` | `DateTime` | When the tag was created                 |

## Relationships

```
Link 1──◆ Click    (one link has many clicks)
Tag  1──◆ Link     (many-to-many via _LinkToTag)
```

## Common Queries

### Find link by alias

```typescript
const link = await prisma.link.findUnique({
  where: { customAlias: "my-link" }
});
```

### Get link with click count

```typescript
const link = await prisma.link.findUnique({
  where: { id: "abc123" },
  include: { _count: { select: { clicks: true } } }
});
```

### Top referrers for a link

```typescript
const referrers = await prisma.click.groupBy({
  by: ["referrer"],
  where: { linkId: "abc123" },
  _count: { id: true },
  orderBy: { _count: { id: "desc" } },
  take: 10
});
```

### Clicks grouped by country

```typescript
const countries = await prisma.click.groupBy({
  by: ["country"],
  where: { linkId: "abc123" },
  _count: { id: true },
  orderBy: { _count: { id: "desc" } }
});
```

### Links filtered by tag

```typescript
const links = await prisma.tag.findUnique({
  where: { name: "marketing" },
  include: {
    links: {
      include: { _count: { select: { clicks: true } } }
    }
  }
});
```

### Daily click timeline

```typescript
const clicks = await prisma.click.findMany({
  where: {
    linkId: "abc123",
    clickedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  },
  select: { clickedAt: true }
});

// Group by date in application code
```

## Migrations

### Creating a Migration

```bash
# Make changes to schema.prisma, then:
npx prisma migrate dev --name <descriptive_name>
```

### Applying Migrations in Production

```bash
npx prisma migrate deploy
```

### Resetting the Database (Development Only)

```bash
npx prisma db push --force-reset
```

## Performance Notes

- **Indexes**: `Link.customAlias` and `Click.linkId` are indexed for fast lookups
- **Nanoid**: Collision-resistant, URL-safe IDs at minimal overhead
- **Connection Pooling**: Use PgBouncer or Prisma Accelerate for production
- **Read Replicas**: Consider for analytics-heavy queries at scale
