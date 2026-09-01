# Sunbird Vacations — Backend API

Phase 4A adds a public read-only REST API on top of Phase 3 models and seed data. The Next.js frontend remains untouched.

**Current scope:** Public GET API endpoints — no write operations, admin panel, or frontend integration yet.

## Requirements

| Tool | Version (tested) |
|------|------------------|
| PHP | 8.1+ |
| Composer | 2.x |
| MySQL | 8.0+ (for future phases) |

## Versions

- **PHP:** 8.1.10 (Laragon)
- **Laravel:** 10.x (framework v10.50.3)
- **Frontend (separate):** Next.js 16 at `../frontend/` — not modified in Phase 1

## Project Structure

```
Sunbird_by_Paras/
├── frontend/     ← Next.js (static, untouched)
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

## Future Frontend Connection (Phase 2+)

The Next.js app in `../frontend/` will eventually call this API using an environment variable such as:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

No frontend changes have been made yet.

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

### Example Requests

```bash
curl http://localhost:8000/api/sections
curl http://localhost:8000/api/sections/popular-destinations
curl http://localhost:8000/api/sections/best-of-india/packages?category=North
curl http://localhost:8000/api/packages?search=kashmir
curl http://localhost:8000/api/packages/kashmir-paradise
```

### API Structure

```
app/Http/Controllers/Api/
├── SectionController.php
└── PackageController.php

app/Http/Resources/
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

## Phase 1 — What's Included

- Laravel 10 application scaffold
- Environment configuration (`.env.example`)
- CORS for local Next.js origin
- `GET /api/health` status endpoint

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
