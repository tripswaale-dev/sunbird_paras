# Sunbird Vacations — Backend API

Phase 4C adds admin Sections and Packages CRUD. Phase 4D adds package SEO admin management. **Frontend integration complete (Phase 5 + Phase 7)** — the Next.js app at `../frontend/` consumes the public read API with static fallbacks, including blogs.

See [Integration status & deployment guide](../docs/PHASE5-INTEGRATION-STATUS.md) for the full dynamic pages matrix, deployment checklist, and environment variable reference.

## Requirements

| Tool | Version (tested) |
|------|------------------|
| PHP | 8.1+ |
| Composer | 2.x |
| MySQL | 8.0+ (for future phases) |

## Versions

- **PHP:** 8.1.10 (Laragon)
- **Laravel:** 10.x (framework v10.50.3)
- **Frontend (separate):** Next.js 16 at `../frontend/` — Phase 5 + Phase 7 API integration complete

## Project Structure

```
Sunbird_by_Paras/
├── frontend/     ← Next.js (Phase 5 API integration)
└── backend/      ← Laravel API (this project)
```

## Setup

1. **Install dependencies** (if not already done):

   ```bash
   cd backend
   composer install
   ```

2. **Environment file:**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure `.env`** (local placeholders — adjust for your machine):

   ```env
   APP_NAME="Sunbird Vacations API"
   APP_URL=http://localhost:8000

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sunbird_vacations
   DB_USERNAME=root
   DB_PASSWORD=

   FRONTEND_URL=http://localhost:3000
   ```

   Do not commit `.env`. Secrets stay local only.

4. **Database:**

   ```bash
   # Create database (if not exists)
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS sunbird_vacations CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

   # Run migrations
   php artisan migrate

   # Seed canonical data from frontend static files
   php artisan db:seed
   ```

   Or fresh migrate + seed:

   ```bash
   php artisan migrate:fresh --seed
   ```

   Database name: **`sunbird_vacations`**

## Start the Server

```bash
cd backend
php artisan serve
```

Application URL: **http://localhost:8000**

## API Base URL

**http://localhost:8000/api**

## Health Check

Confirm the API is running:

```bash
GET http://localhost:8000/api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "Sunbird Vacations API",
  "environment": "local",
  "timestamp": "2026-08-31T12:00:00+00:00"
}
```

## CORS

Cross-origin requests from the Next.js frontend are allowed for `api/*` routes.

Set the frontend origin in `.env`:

```env
FRONTEND_URL=http://localhost:3000
```

For production, replace with your real domain (e.g. `https://sunbirdvacations.com`). Do not use wildcard `*` in production.

**`FRONTEND_URL` is required in production** — it drives CORS `allowed_origins` in `config/cors.php` and sitemap `<loc>` canonical URLs (Phase 4D).

## Frontend Integration (Phase 5 + Phase 7 — complete)

The Next.js app in `../frontend/` calls this API using:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

See [Integration status & deployment guide](../docs/PHASE5-INTEGRATION-STATUS.md) for the full dynamic pages matrix (including blogs), deployment checklist, and production env pairing (`FRONTEND_URL` ↔ CORS ↔ sitemap).

### Phase 7 — Blogs (complete)

| Layer | Endpoints | Notes |
|-------|-----------|-------|
| Public read | `GET /api/blogs`, `GET /api/blogs/{slug}` | Active blogs only; ordered by `published_at` desc |
| Admin CRUD | `/api/admin/blogs` | Create, update, delete; `is_active: false` hides from public API |
| Sitemap | `SitemapGenerator` | Active blog posts at `{FRONTEND_URL}/blogs/{slug}` (`changefreq: monthly`, `priority: 0.6`); 70 URLs with default seed |

Frontend consumes blogs via `frontend/src/lib/api/blogs.ts` and `frontend/src/lib/mappers/blogs.ts`. Sitemap is proxied by frontend `/sitemap.xml` — no frontend sitemap code changes needed for blog URLs.

Run API tests: `php artisan test --filter=Api` (**441+ tests** as of Phase 11 Step 3, including `ContactInquiryApiTest` and `AdminContactInquiryTest`).

## Phase 2 — Database Schema

Nine business tables (plus default Laravel framework tables):

| Table | Purpose |
|-------|---------|
| `sections` | 7 homepage sections (slug, title, subtitle, view_all_path) |
| `packages` | Single source of truth for tour packages (price as integer INR) |
| `section_packages` | M:N pivot — packages assigned to sections with display_order and is_featured |
| `section_categories` | Category cards and listing filter tabs (Travel Your Way, Gateway, etc.) |
| `section_stats` | Popular Destinations stats bar |
| `package_details` | 1:1 extended content (overview, JSON list fields) |
| `package_itinerary_days` | Day-by-day itinerary |
| `package_faqs` | Package FAQs |
| `package_images` | Hero and gallery image paths |

### Relationships

- `sections` → `section_packages` → `packages` (CASCADE on delete)
- `sections` → `section_categories`, `section_stats`
- `packages` → `package_details`, `package_itinerary_days`, `package_faqs`, `package_images`

### Migration files

```
database/migrations/2026_08_31_100000_create_sections_table.php
database/migrations/2026_08_31_100001_create_packages_table.php
database/migrations/2026_08_31_100002_create_section_packages_table.php
database/migrations/2026_08_31_100003_create_section_categories_table.php
database/migrations/2026_08_31_100004_create_section_stats_table.php
database/migrations/2026_08_31_100005_create_package_details_table.php
database/migrations/2026_08_31_100006_create_package_itinerary_days_table.php
database/migrations/2026_08_31_100007_create_package_faqs_table.php
database/migrations/2026_08_31_100008_create_package_images_table.php
```

Verify migrations: `php artisan migrate:status`

## Phase 3 — Eloquent Models & Seed Data

Nine business models in `app/Models/`:

| Model | Table |
|-------|-------|
| `Section` | sections |
| `Package` | packages |
| `SectionPackage` | section_packages |
| `SectionCategory` | section_categories |
| `SectionStat` | section_stats |
| `PackageDetail` | package_details |
| `PackageItineraryDay` | package_itinerary_days |
| `PackageFaq` | package_faqs |
| `PackageImage` | package_images |

### Seeders

```
database/seeders/
├── DatabaseSeeder.php
├── SectionSeeder.php
├── PackageSeeder.php
├── SectionPackageSeeder.php
├── SectionCategorySeeder.php
├── SectionStatSeeder.php
├── PackageDetailSeeder.php
├── Data/PackageSeedData.php
├── Data/KashmirParadiseDetailData.php
└── Support/DurationParser.php
```

Seeder call order: Section → Package → SectionPackage → SectionCategory → SectionStat → PackageDetail.

See [`SEEDING_NOTES.md`](SEEDING_NOTES.md) for canonical source rules, conflict resolutions, and verification queries.

### Verify with Tinker

```bash
php artisan tinker
```

```php
Package::count();                    // 53
Section::count();                    // 7
SectionPackage::count();             // 53
Package::where('slug','kashmir-paradise')->first()->itineraryDays()->count(); // 7
```

## Phase 4A — Public Read-Only API

### Endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/health` | Health check |
| GET | `/api/sections` | List active sections |
| GET | `/api/sections/{slug}` | Section detail (categories, stats, packages) |
| GET | `/api/sections/{slug}/packages` | Section packages (`?category=` optional) |
| GET | `/api/packages` | Paginated packages (`?category=`, `?search=`, `?page=`, `?per_page=`) |
| GET | `/api/packages/{slug}` | Full package detail |
| GET | `/api/blogs` | Active blogs ordered by `published_at` desc |
| GET | `/api/blogs/{slug}` | Full blog detail with content |
| GET | `/api/gallery` | Active gallery items + filter category codes (excludes UI-only `ALL`) |
| GET | `/api/page-seo/{page_key}` | Page-level SEO (9 seeded keys — see Admin Page SEO) |
| GET | `/api/page-content/{page_key}` | Page content for `about` and `contact` (camelCase JSON) |
| POST | `/api/contact-inquiries` | Submit contact form (rate-limited: 10/min per IP) |

### Example Requests

```bash
curl http://localhost:8000/api/sections
curl http://localhost:8000/api/sections/popular-destinations
curl http://localhost:8000/api/sections/best-of-india/packages?category=North
curl http://localhost:8000/api/packages?search=kashmir
curl http://localhost:8000/api/packages/kashmir-paradise
curl http://localhost:8000/api/blogs
curl http://localhost:8000/api/blogs/story-behind-sunbird-vacations
curl http://localhost:8000/api/gallery
curl http://localhost:8000/api/page-seo/home
curl http://localhost:8000/api/page-seo/gallery
curl http://localhost:8000/api/page-seo/packages
curl http://localhost:8000/api/page-seo/search
curl http://localhost:8000/api/page-seo/blogs
curl http://localhost:8000/api/page-seo/about
curl http://localhost:8000/api/page-seo/contact
curl http://localhost:8000/api/page-seo/payment-policy
curl http://localhost:8000/api/page-seo/cancellation-policy
curl http://localhost:8000/api/page-content/about
curl http://localhost:8000/api/page-content/contact

curl -X POST http://localhost:8000/api/contact-inquiries \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","phone":"+91 98765 43210","subject":"general","message":"I would like to know more about your packages."}'
```

### API Structure

```
app/Http/Controllers/Api/
├── BlogController.php
├── GalleryController.php
├── SectionController.php
└── PackageController.php

app/Http/Resources/
├── BlogSummaryResource.php
├── BlogDetailResource.php
├── GalleryItemResource.php
├── SectionResource.php
├── SectionDetailResource.php
├── SectionCategoryResource.php
├── SectionStatResource.php
├── PackageSummaryResource.php
└── PackageDetailResource.php
```

See [`API_NOTES.md`](API_NOTES.md) for response format, category handling, and known mismatches.

### Run API Tests

```bash
php artisan test --filter=Api
```

Verify routes: `php artisan route:list`

## Phase 4B — Admin Authentication

### Endpoints

| Method | URL | Auth | Purpose |
|--------|-----|------|---------|
| POST | `/api/admin/login` | Public (rate-limited) | Issue Sanctum bearer token |
| GET | `/api/admin/me` | Bearer + admin | Current admin profile |
| POST | `/api/admin/logout` | Bearer + admin | Revoke current token |

### Setup Development Admin

Add to `.env`:

```env
ADMIN_NAME="Sunbird Admin"
ADMIN_EMAIL=admin@sunbird.local
ADMIN_PASSWORD=your-dev-password
```

```bash
php artisan db:seed --class=AdminSeeder
```

### Example Login

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sunbird.local","password":"your-dev-password"}'
```

Use the returned token: `Authorization: Bearer {token}`

See [`ADMIN_AUTH_NOTES.md`](ADMIN_AUTH_NOTES.md) for security details and error responses.

## Phase 4C — Admin Sections CRUD

### Endpoints

All require `Authorization: Bearer {token}` and admin privileges.

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/sections` | List all sections (active + inactive) |
| POST | `/api/admin/sections` | Create section |
| GET | `/api/admin/sections/{id}` | Section detail by numeric ID |
| PUT | `/api/admin/sections/{id}` | Full update |
| PATCH | `/api/admin/sections/{id}` | Partial update |
| DELETE | `/api/admin/sections/{id}` | Delete (409 if dependencies exist) |

### Example

```bash
curl http://localhost:8000/api/admin/sections \
  -H "Authorization: Bearer {token}"
```

Delete returns `409 Conflict` when section has packages, categories, or stats. Use `is_active: false` to hide from public API instead.

### Admin Packages CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/packages` | Paginated list (`?search=`, `?category=`, `?is_active=`, `?page=`, `?per_page=`) |
| POST | `/api/admin/packages` | Create package |
| GET | `/api/admin/packages/{id}` | Package detail by numeric ID |
| PUT | `/api/admin/packages/{id}` | Full update |
| PATCH | `/api/admin/packages/{id}` | Partial update |
| DELETE | `/api/admin/packages/{id}` | Delete (409 if dependencies exist) |

Delete returns `409 Conflict` when package has section assignments, details, itinerary, FAQs, or images.

### Admin Blogs CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/blogs` | Paginated list (`?search=`, `?is_active=`, `?page=`, `?per_page=`) |
| POST | `/api/admin/blogs` | Create blog |
| GET | `/api/admin/blogs/{id}` | Blog detail by numeric ID |
| PUT | `/api/admin/blogs/{id}` | Full update |
| PATCH | `/api/admin/blogs/{id}` | Partial update |
| DELETE | `/api/admin/blogs/{id}` | Delete blog |

**SEO fields** (on create/update): `meta_title`, `meta_description`, `canonical_url`, `og_image`, `is_indexable` (default `true`). Public `GET /api/blogs/{slug}` returns a nested `seo` object on detail only.

```bash
curl http://localhost:8000/api/admin/blogs \
  -H "Authorization: Bearer {token}"

curl -X POST http://localhost:8000/api/admin/blogs \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"slug":"my-travel-story","title":"My Travel Story","excerpt":"...","content":"...","author":"Admin","category":"Story","image":"/images/test.jpg","published_at":"2026-08-01","read_time_label":"4 min read","is_active":true}'
```

Blogs have no dependent relations — delete is a hard delete. Use `is_active: false` to hide from public API instead.

### Admin Page SEO

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/page-seo/{page_key}` | Show SEO fields for a static page (seeded keys only) |
| PUT | `/api/admin/page-seo/{page_key}` | Full SEO update |
| PATCH | `/api/admin/page-seo/{page_key}` | Partial SEO update |

**Fields:** `meta_title`, `meta_description`, `canonical_url`, `og_image`, `is_indexable`. No create/delete of page keys — seeded keys only.

Public `GET /api/page-seo/{page_key}` returns `{ page_key, seo: { ... } }`. Seeded keys: `home`, `gallery`, `packages`, `search`, `blogs`, `about`, `contact`, `payment-policy`, `cancellation-policy`. Sitemap respects `canonical_url` and `is_indexable` for managed listing URLs (`search` is API-only — not in sitemap).

### Admin Page Content

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/page-content/{page_key}` | Show content fields (`about`, `contact` only) |
| PUT | `/api/admin/page-content/{page_key}` | Full content update |
| PATCH | `/api/admin/page-content/{page_key}` | Partial content update |

**Fields:** `hero_image`, `hero_title`, `hero_subtitle`, `intro_text`, `body`, `contact_phone`, `contact_email`, `contact_address`, `working_hours`, `is_active`. No create/delete of page keys — seeded keys only. Separate from `page_seo` (metadata vs content).

Public `GET /api/page-content/{page_key}` returns camelCase JSON (`pageKey`, `heroImage`, `heroTitle`, etc.). Returns 404 when `is_active` is false.

### Admin Contact Inquiries

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/contact-inquiries` | Paginated list (`?search=`, `?subject=`, `?page=`, `?per_page=`) |
| GET | `/api/admin/contact-inquiries/{id}` | Inquiry detail |

Public `POST /api/contact-inquiries` accepts `firstName`/`lastName` (or `first_name`/`last_name`), `phone`, `subject` (`general` \| `booking` \| `custom` \| `support`), `message`. Returns `201` with `{ id, message }`. Rate-limited to 10 requests/minute per IP. Stores `ip_address` and `user_agent`. No email notifications yet.

### Admin Gallery Items CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/gallery-items` | Paginated list (`?search=`, `?category=`, `?is_active=`, `?page=`, `?per_page=`) |
| POST | `/api/admin/gallery-items` | Create gallery item |
| GET | `/api/admin/gallery-items/{id}` | Gallery item detail by numeric ID |
| PUT | `/api/admin/gallery-items/{id}` | Full update |
| PATCH | `/api/admin/gallery-items/{id}` | Partial update |
| DELETE | `/api/admin/gallery-items/{id}` | Delete gallery item |

```bash
curl http://localhost:8000/api/admin/gallery-items \
  -H "Authorization: Bearer {token}"

curl -X POST http://localhost:8000/api/admin/gallery-items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test-1","src":"/images/test.jpg","category":"GOA","title":"Test","subtitle":"Subtitle","aspect_ratio":"landscape","sort_order":100,"is_active":true}'
```

Gallery items have no dependent relations — delete is a hard delete. Use `is_active: false` to hide from public API instead. Category codes come from `GalleryItem::CATEGORY_CODES` (UI-only `ALL` is not stored). Image paths are strings — no file upload in this phase.

### Admin Section ↔ Package Assignments

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/sections/{section}/packages` | List packages assigned to section (numeric section ID) |
| POST | `/api/admin/sections/{section}/packages` | Assign package to section |
| PATCH | `/api/admin/sections/{section}/packages/{package}` | Update `display_order` / `is_featured` |
| DELETE | `/api/admin/sections/{section}/packages/{package}` | Remove assignment (does not delete package or section) |

**Assign body:** `package_id` (required), `display_order` (required, integer ≥ 0), `is_featured` (optional boolean, default false).

Duplicate `(section_id, package_id)` returns `422`. `is_featured` is stored on the pivot — the same package can be featured in one section but not another.

Admin APIs work for inactive sections and packages; public APIs continue to hide inactive records.

### Admin Section Categories CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/sections/{section}/categories` | List all categories for section (active + inactive) |
| POST | `/api/admin/sections/{section}/categories` | Create category |
| GET | `/api/admin/sections/{section}/categories/{category}` | Category detail (scoped to section) |
| PUT | `/api/admin/sections/{section}/categories/{category}` | Full update |
| PATCH | `/api/admin/sections/{section}/categories/{category}` | Partial update |
| DELETE | `/api/admin/sections/{section}/categories/{category}` | Delete category record only |

**Fields:** `title`, `filter_value` (nullable, exact match to `packages.category` for filtering), `image` (path string), `sort_order`, `is_featured`, `is_active`.

`section_id` comes from the route only — not accepted in request body. Duplicate `title` or `filter_value` (when not null) within a section returns `422`.

### Admin Section Stats CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/sections/{section}/stats` | List all stats for section |
| POST | `/api/admin/sections/{section}/stats` | Create stat |
| GET | `/api/admin/sections/{section}/stats/{stat}` | Stat detail (scoped to section) |
| PUT | `/api/admin/sections/{section}/stats/{stat}` | Full update |
| PATCH | `/api/admin/sections/{section}/stats/{stat}` | Partial update |
| DELETE | `/api/admin/sections/{section}/stats/{stat}` | Delete stat record only |

**Fields:** `value` (max 50), `label` (max 255), `sort_order` (0–255).

`section_id` comes from the route only — not accepted in request body. Duplicate `value` or `label` within a section returns `422`. No `is_active` / `is_featured` on stats.

### Admin Package Details CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/packages/{id}/detail` | Show package detail record |
| POST | `/api/admin/packages/{id}/detail` | Create detail (one per package) |
| PUT | `/api/admin/packages/{id}/detail` | Full update |
| PATCH | `/api/admin/packages/{id}/detail` | Partial update |
| DELETE | `/api/admin/packages/{id}/detail` | Delete detail record only |

**Fields:** `overview` (text), `destinations`, `sightseeing`, `inclusions`, `exclusions`, `highlights` (string arrays).

`package_id` comes from the route only. One detail per package — duplicate POST returns `422`. Deleting detail does not remove itinerary, FAQs, or images.

### Admin Package Itinerary CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/packages/{id}/itinerary` | List all itinerary days for package |
| POST | `/api/admin/packages/{id}/itinerary` | Create itinerary day |
| GET | `/api/admin/packages/{id}/itinerary/{itinerary}` | Itinerary day detail (scoped to package) |
| PUT | `/api/admin/packages/{id}/itinerary/{itinerary}` | Full update |
| PATCH | `/api/admin/packages/{id}/itinerary/{itinerary}` | Partial update |
| DELETE | `/api/admin/packages/{id}/itinerary/{itinerary}` | Delete itinerary day only |

**Fields:** `day` (1–65535), `title`, `description`, `stay_information` (max 500, nullable), `notes` (nullable), `images` (string array, nullable), `sort_order` (0–65535).

`package_id` comes from the route only — not accepted in request body. Duplicate `day` number within a package returns `422`. Deleting an itinerary day does not remove the package, details, FAQs, or images.

### Admin Package FAQs CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/packages/{id}/faqs` | List all FAQs for package |
| POST | `/api/admin/packages/{id}/faqs` | Create FAQ |
| GET | `/api/admin/packages/{id}/faqs/{faq}` | FAQ detail (scoped to package) |
| PUT | `/api/admin/packages/{id}/faqs/{faq}` | Full update |
| PATCH | `/api/admin/packages/{id}/faqs/{faq}` | Partial update |
| DELETE | `/api/admin/packages/{id}/faqs/{faq}` | Delete FAQ only |

**Fields:** `question` (max 500), `answer` (text), `sort_order` (0–65535).

`package_id` comes from the route only — not accepted in request body. Duplicate `question` within a package returns `422`. Deleting an FAQ does not remove the package, details, itinerary, or images.

### Admin Package Images CRUD

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/packages/{id}/images` | List all images for package |
| POST | `/api/admin/packages/{id}/images` | Create image path record |
| GET | `/api/admin/packages/{id}/images/{image}` | Image detail (scoped to package) |
| PUT | `/api/admin/packages/{id}/images/{image}` | Full update |
| PATCH | `/api/admin/packages/{id}/images/{image}` | Partial update |
| DELETE | `/api/admin/packages/{id}/images/{image}` | Delete image record only |

**Fields:** `path` (max 500, path/URL string — no file upload), `type` (`hero` or `gallery`), `alt_text` (max 255, nullable), `sort_order` (0–65535).

`package_id` comes from the route only — not accepted in request body. Duplicate `path` within a package returns `422`. Deleting an image does not remove the package, details, itinerary, or FAQs.

## Phase 4D — Package SEO Admin

### Admin Package SEO

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/packages/{id}/seo` | Show SEO fields for package |
| PUT | `/api/admin/packages/{id}/seo` | Full SEO update |
| PATCH | `/api/admin/packages/{id}/seo` | Partial SEO update |

**Fields:** `meta_title` (max 255, nullable), `meta_description` (nullable), `canonical_url` (max 500, nullable), `og_image` (max 500, path/URL string, nullable), `is_indexable` (boolean).

SEO columns live on the `packages` table — show always returns 200 for an existing package (fields may be null). No POST/DELETE endpoints. Core package CRUD does not manage SEO fields.

### Admin Section SEO

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/admin/sections/{section}/seo` | Show SEO fields for section |
| PUT | `/api/admin/sections/{section}/seo` | Full SEO update |
| PATCH | `/api/admin/sections/{section}/seo` | Partial SEO update |

**Fields:** `meta_title` (max 255, nullable), `meta_description` (nullable), `canonical_url` (max 500, nullable), `og_image` (max 500, path/URL string, nullable), `is_indexable` (boolean).

SEO columns live on the `sections` table — show always returns 200 for an existing section (fields may be null). No POST/DELETE endpoints. Core section CRUD does not manage SEO fields. Public `GET /api/sections/{slug}` includes a `seo` object on section detail only (not the index).

### Public Sitemap & Robots

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/sitemap.xml` | XML sitemap of frontend URLs |
| GET | `/api/robots.txt` | Robots rules + sitemap reference |

Sitemap `<loc>` values use `FRONTEND_URL` (from `.env`). **`FRONTEND_URL` must be set correctly in production** for canonical URLs. Includes static frontend paths, active indexable section `view_all_path` listings (or `canonical_url` when set), active indexable packages (`/packages/{slug}` or `canonical_url` when set), and active indexable blog post URLs (`/blogs/{slug}` or `canonical_url` when set; `changefreq: monthly`, `priority: 0.6`). Listing URLs for `/`, `/about`, `/contact`, `/packages`, `/gallery`, `/blogs`, `/payment-policy`, and `/cancellation-policy` use `page_seo` canonical when set, dynamic `lastmod` from `page_seo.updated_at` (gallery listing also uses latest active gallery item `updated_at` for `lastmod`), and are excluded when `page_seo.is_indexable` is false. `/search` and `/destinations` are not managed via `page_seo` in the sitemap (`/search` is API-only; `/destinations` has no `page_seo` key yet). Excludes inactive sections/packages/blogs/gallery items and `is_indexable = false` sections/packages/blogs. No section-scoped package URLs.

Robots `Sitemap:` line points to `{APP_URL}/api/sitemap.xml`.

## Phase 1 — What's Included

- Laravel 10 application scaffold
- Environment configuration (`.env.example`)
- CORS for local Next.js origin
- `GET /api/health` status endpoint

## Phase 4C — What's NOT Included (yet)

- Image upload
- Admin dashboard / Next.js UI

## Phase 4D — What's NOT Included (yet)

- Structured data / JSON-LD endpoints
- Admin dashboard / Next.js UI

## Phase 4B — What's NOT Included (yet)

- Admin dashboard / Next.js admin UI
- Package, section, category CRUD
- Image upload / media management
- SEO management
- Write APIs for business content
- Role/permission system beyond `is_admin`

## Phase 4A — What's NOT Included (yet)

- POST / PUT / PATCH / DELETE endpoints
- Admin panel, authentication, authorization
- CRUD UI, image upload
- Frontend / Next.js integration
- SEO HTML rendering

## Phase 3 — What's NOT Included (yet)

## Phase 1 — What's NOT Included

- Business database tables / migrations
- Package or section CRUD
- Admin panel
- Authentication
- Frontend API integration
- Image/media management

These will be added in later phases.

## Notes

- **PHP 8.1** limits this project to Laravel 10. Upgrade to PHP 8.2+ in Laragon before moving to Laravel 11+.
- If `composer install` fails due to security advisories, ensure you are on the latest Laravel 10 patch (see `composer.lock`).
