# Sunbird Vacations — Backend API

Phase 1 foundation for the Sunbird Vacations travel website. This Laravel backend will eventually power dynamic content for the Next.js frontend.

**Current scope:** API foundation only — no business models, migrations, admin panel, or frontend integration yet.

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

4. **Database:** Config placeholders are set for Phase 2. No database or migrations are required for Phase 1.

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

## Phase 1 — What's Included

- Laravel 10 application scaffold
- Environment configuration (`.env.example`)
- CORS for local Next.js origin
- `GET /api/health` status endpoint

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
