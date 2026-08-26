# API Reference

Shortle exposes a RESTful API for creating, managing, and tracking short links.

## Base URL

```
Development: http://localhost:3000
Production:  https://shortle.vercel.app
```

---

## Endpoints

### Shorten URL

```
POST /api/shorten
```

Create a new short link.

**Request Body**

| Field         | Type     | Required | Description                          |
| ------------- | -------- | -------- | ------------------------------------ |
| `url`         | `string` | Yes      | The original long URL to shorten     |
| `customAlias` | `string` | No       | Custom alias for the short link      |
| `tags`        | `string[]` | No     | Tags to associate with the link      |

**Response**

```json
{
  "shortUrl": "https://sho.rt/abc123",
  "id": "abc123"
}
```

**Errors**

| Status | Description                     |
| ------ | ------------------------------- |
| 400    | Invalid URL or alias already taken |
| 500    | Server error                    |

**Example**

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url", "customAlias": "my-link"}'
```

---

### Edit Link

```
PATCH /api/links/[code]
```

Update an existing link's destination or expiration.

**Path Parameters**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `code`    | `string` | The short link code  |

**Request Body**

| Field         | Type     | Required | Description                    |
| ------------- | -------- | -------- | ------------------------------ |
| `originalUrl` | `string` | No       | New destination URL            |
| `expiresAt`   | `string` | No       | ISO 8601 expiration datetime   |

**Response**

```json
{
  "success": true
}
```

---

### Delete Link

```
DELETE /api/links/[code]
```

Permanently delete a short link and all its analytics data.

**Path Parameters**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `code`    | `string` | The short link code  |

**Response**

```json
{
  "success": true
}
```

---

### Redirect

```
GET /[code]
```

Redirect to the original URL and track the click event.

**Path Parameters**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `code`    | `string` | The short link code  |

**Behavior**

- Redirects (301) to the original URL
- Records click with referrer, device, browser, and country data
- Returns 404 if link not found or expired

---

### Get Link Stats

```
GET /api/stats/[code]
```

Retrieve analytics for a specific short link.

**Path Parameters**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `code`    | `string` | The short link code  |

**Response**

```json
{
  "link": {
    "id": "abc123",
    "originalUrl": "https://example.com/very/long/url",
    "customAlias": "my-link",
    "createdAt": "2026-08-25T10:00:00Z"
  },
  "stats": {
    "totalClicks": 142,
    "todayClicks": 12,
    "referrers": [
      { "name": "Twitter", "count": 45 },
      { "name": "Direct", "count": 38 },
      { "name": "GitHub", "count": 32 }
    ],
    "devices": [
      { "name": "Mobile", "count": 95 },
      { "name": "Desktop", "count": 40 },
      { "name": "Tablet", "count": 7 }
    ],
    "countries": [
      { "name": "United States", "count": 62 },
      { "name": "United Kingdom", "count": 28 },
      { "name": "Germany", "count": 18 }
    ],
    "timeline": [
      { "date": "2026-08-25", "clicks": 12 },
      { "date": "2026-08-24", "clicks": 28 }
    ]
  }
}
```

---

### List Tags

```
GET /api/tags
```

Retrieve all tags with their link counts.

**Response**

```json
{
  "tags": [
    { "name": "marketing", "linkCount": 12 },
    { "name": "product-launch", "linkCount": 5 }
  ]
}
```

---

### Get Tag Stats

```
GET /api/tags/[name]
```

Retrieve all links and aggregated stats for a specific tag.

**Path Parameters**

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `name`    | `string` | The tag name     |

**Response**

```json
{
  "tag": "marketing",
  "links": [
    {
      "id": "abc123",
      "originalUrl": "https://example.com/campaign",
      "shortUrl": "https://sho.rt/abc123",
      "clicks": 142,
      "createdAt": "2026-08-25T10:00:00Z"
    }
  ],
  "stats": {
    "totalLinks": 12,
    "totalClicks": 840
  }
}
```

---

## Rate Limits

| Tier       | Requests per minute |
| ---------- | ------------------- |
| Free       | 60                  |
| Pro        | 600                 |

## Authentication

Authentication will be added in V2. Current endpoints are public.

## Data Tracking

Click events automatically capture:

- **Referrer** — HTTP `Referer` header
- **Device** — User-agent parsed (Mobile/Desktop/Tablet)
- **Browser** — Chrome, Firefox, Safari, etc.
- **Country** — IP-based geolocation
