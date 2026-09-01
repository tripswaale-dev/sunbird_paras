# API Notes — Phase 4A

Public read-only REST API for Sunbird Vacations. Frontend (`../frontend/`) was **not modified**.

## Response Envelope

**Success (single resource or collection):**
```json
{ "success": true, "data": { ... } }
```

**Success (paginated):**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": { "current_page": 1, "per_page": 15, "total": 53, "last_page": 4 }
}
```

**Error:**
```json
{ "success": false, "message": "Resource not found." }
```

Validation errors (422) include an `errors` object.

## Endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/health` | Health check (unchanged from Phase 1) |
| GET | `/api/sitemap.xml` | XML sitemap of frontend URLs (`FRONTEND_URL` + DB content) |
| GET | `/api/robots.txt` | Plain-text robots rules referencing the sitemap |
| GET | `/api/sections` | Active sections ordered by `sort_order` |
| GET | `/api/sections/{slug}` | Section detail with categories, stats, packages, SEO |
| GET | `/api/sections/{slug}/packages` | Section packages with optional `?category=` filter |
| GET | `/api/packages` | Paginated active packages with optional `?category=`, `?search=`, `?page=`, `?per_page=` |
| GET | `/api/packages/{slug}` | Full package detail with SEO, itinerary, FAQs, images |
| GET | `/api/blogs` | Active blogs ordered by `published_at` desc (plain array, no pagination) |
| GET | `/api/blogs/{slug}` | Full blog detail with content |

## Query Parameters

### `GET /api/packages`

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `category` | string | — | Exact match on `packages.category` |
| `search` | string | — | Searches `title`, `subtitle`, `location`, `slug` |
| `page` | integer | 1 | Pagination page |
| `per_page` | integer | 15 | Max 50 |

### `GET /api/sections/{slug}/packages`

| Param | Type | Notes |
|-------|------|-------|
| `category` | string | Exact match on `packages.category` |

## Active Status

Public API returns **404** for:
- Unknown slugs
- Inactive sections (`is_active = false`)
- Inactive packages (`is_active = false`)
- Inactive blogs (`is_active = false`)

Inactive categories are excluded from section responses.

## Blog Responses

**Summary** (`GET /api/blogs`, used for list cards):

```json
{
  "success": true,
  "data": [
    {
      "slug": "story-behind-sunbird-vacations",
      "title": "The Story Behind Sunbird Vacations",
      "excerpt": "\"Travel isn't just about reaching a destination...\"",
      "author": "Shwetangi",
      "date": "July 13, 2026",
      "category": "Story",
      "image": "/images/destinations/ladakh.jpg",
      "readTime": "3 min read"
    }
  ]
}
```

**Detail** (`GET /api/blogs/{slug}`) — same fields plus `content` (full article body).

JSON keys match the frontend `Blog` interface (`readTime`, not `read_time_label`). Individual blog post URLs are **not** included in the sitemap (only `/blogs` listing).

## Admin Blogs

All require `Authorization: Bearer {token}` and admin privileges.

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/blogs` | Paginated list (`?search=`, `?is_active=`, `?page=`, `?per_page=`) |
| POST | `/api/admin/blogs` | Create blog |
| GET | `/api/admin/blogs/{id}` | Blog detail by numeric ID (includes `content`) |
| PUT | `/api/admin/blogs/{id}` | Full update |
| PATCH | `/api/admin/blogs/{id}` | Partial update |
| DELETE | `/api/admin/blogs/{id}` | Hard delete |

Admin responses use snake_case DB field names (`read_time_label`, `published_at`) unlike the public API camelCase (`readTime`, `date`).

**Public API side effects:**

- New active blogs appear in `GET /api/blogs` and `GET /api/blogs/{slug}`
- `is_active: false` excludes blog from public index and show (404)
- Deleted blogs return 404 on public show

## Category Filter Values

The API returns canonical **database** values. Known mismatches with frontend static data:

| Issue | API behavior |
|-------|--------------|
| `river-retreat-haridwar-rishikesh` in spiritual section | Listed in both `best-of-india` and `spiritual-destinations`; `category` is `North` (not `Retreats`) |
| `essence-of-nepal` in Popular Destinations | `category: "International"` — no matching filter tab in frontend |
| `Bird Watching` tab (Explore Wild) | Tab exists in DB; zero packages with that category |
| Gateway `"Southern Hill Escapes"` title | `filter_value` is `"Southern Hill Escape"` (singular) |
| Best of India `East` tab | Seeded in DB; missing from frontend static filter array |

Filter param `?category=` must use the exact `packages.category` value, not section category titles.

## Sitemap & Robots

- **`GET /api/sitemap.xml`** — `application/xml`; `<loc>` values use `FRONTEND_URL` from `.env`.
- **`GET /api/robots.txt`** — `text/plain`; includes `Sitemap: {APP_URL}/api/sitemap.xml`.
- **Included:** static frontend paths (`/`, `/about`, `/contact`, `/packages`, `/destinations`, `/gallery`, `/blogs`, policy pages), active indexable section `view_all_path` URLs, active indexable package URLs.
- **Section URL:** `canonical_url` when set, otherwise `{FRONTEND_URL}{view_all_path}`.
- **Package URL:** `canonical_url` when set, otherwise `{FRONTEND_URL}/packages/{slug}`.
- **Excluded:** inactive sections/packages, `is_indexable = false` sections/packages, section-scoped package paths, individual blog post URLs.

## Section Detail

- `GET /api/sections/{slug}` includes a `seo` object (`meta_title`, `meta_description`, `canonical_url`, `og_image`, `is_indexable`). Section index (`GET /api/sections`) does not include SEO fields.

## Package Detail

- Only `kashmir-paradise` has full itinerary, FAQs, and images in seed data.
- Other packages return `detail.inclusions` from amenities; itinerary/FAQs/images may be empty arrays.
- Hero/gallery images are split by `type` in the `images` object.

## N+1 Prevention

Eager loading used per endpoint:
- Section show: `categories`, `stats`, `activePackages.detail`
- Section packages: `categories`, `activePackages.detail`
- Package index: `detail`
- Package show: `detail`, `itineraryDays`, `faqs`, `images`

## Testing

```bash
cd backend
php artisan test --filter=Api
```

Tests use SQLite in-memory (`phpunit.xml`).
