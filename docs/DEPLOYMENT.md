# Single-domain shared hosting deployment for **sunbirdvacations.com**

Deploy the Laravel backend with the static Next.js export inside `backend/public/` on **one domain**.

| URL | Served by |
|-----|-----------|
| `https://sunbirdvacations.com/` | Static Next.js (`index.html`) |
| `https://sunbirdvacations.com/api/*` | Laravel API |
| `https://sunbirdvacations.com/admin/*` | Static admin UI |
| `https://sunbirdvacations.com/uploads/*` | Uploaded media |
| `https://sunbirdvacations.com/sitemap.xml` | Laravel (`routes/web.php`) |
| `https://sunbirdvacations.com/robots.txt` | Laravel (`routes/web.php`) |

## Content policy: DB-only public data

The frontend no longer falls back to hardcoded packages, blogs, or section cards from `frontend/src/data/`. Public pages show **only API/DB content**:

- Empty database sections render empty (no fake Spiti/Kashmir cards).
- Build-time HTML is generated from `BUILD_API_URL` (use the **live** API URL so exported HTML matches production DB).
- After admin changes, re-run `npm run build:live` and upload `backend/public/`.

Minimal generic SEO titles/descriptions are still used when page SEO API fails (not content cards).

## Local build workflow

After admin/content changes, rebuild and upload:

```bash
cd ..
npm run build:live
```

Recommended `frontend/.env.production` for Hostinger staging:

```env
NEXT_PUBLIC_API_URL=https://darkturquoise-albatross-364819.hostingersite.com/api
NEXT_PUBLIC_SITE_URL=https://darkturquoise-albatross-364819.hostingersite.com
BUILD_API_URL=https://darkturquoise-albatross-364819.hostingersite.com/api
BUILD_ADMIN_EMAIL=admin@sunbirdvacations.com
BUILD_ADMIN_PASSWORD=<same as server ADMIN_PASSWORD>
```

For final domain:

```env
NEXT_PUBLIC_API_URL=https://sunbirdvacations.com/api
NEXT_PUBLIC_SITE_URL=https://sunbirdvacations.com
BUILD_API_URL=https://sunbirdvacations.com/api
BUILD_ADMIN_EMAIL=admin@sunbirdvacations.com
BUILD_ADMIN_PASSWORD=<same as server ADMIN_PASSWORD>
```

`npm run build:live` will:

1. Run `next build` (static export to `frontend/out/`)
2. Copy generated files into `backend/public/`
3. Preserve `index.php`, `.htaccess`, `uploads/`, `images/`, `storage/`
4. Log how many admin ID routes were pre-rendered

### Local images for development

Static package images live in `backend/public/images/`. Admin uploads live in `backend/public/uploads/`.

To pull the current live assets onto your machine:

```bash
npm run sync:images
```

Then use `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run Laragon/backend on port `8000`, then `npm run dev` in `frontend/`. When the frontend runs on `:3000`, image paths are resolved from the Laravel origin automatically.

`NEXT_PUBLIC_SITE_URL` must match `FRONTEND_URL` on the backend.

## Admin edit pages and 404 fixes

Admin edit URLs (e.g. `/admin/sections/1/edit/`) are **static HTML shells** pre-rendered at build time. The page then loads data from the API in the browser.

### Why `/admin/sections/1/edit` returned 404

With `output: 'export'`, only IDs returned by `generateStaticParams` become real files like `admin/sections/1/edit/index.html`. If build-time admin login failed, only a placeholder ID was exported.

### Fixes in place

1. **Build params** — `getSectionIdParams()` tries admin API, then public `GET /api/sections`, then IDs `1–10`.
2. **`.htaccess` shell fallback** — [`backend/public/.htaccess`](../backend/public/.htaccess) rewrites missing admin edit/content URLs to a pre-built template shell so client-side routing + API fetch still work for new IDs.
3. **Build warnings** — `build-live.mjs` warns when `BUILD_ADMIN_EMAIL` / `BUILD_ADMIN_PASSWORD` are missing or login fails.

**Important:** `BUILD_ADMIN_PASSWORD` in `frontend/.env.production` must match `ADMIN_PASSWORD` in the server `backend/.env`.

## Production environment

### Backend (`backend/.env` on server)

Copy from [`backend/.env.production.example`](../backend/.env.production.example):

```env
APP_NAME="Sunbird Vacations"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sunbirdvacations.com
APP_KEY=base64:...generated...

FRONTEND_URL=https://sunbirdvacations.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_cpanel_db
DB_USERNAME=your_cpanel_user
DB_PASSWORD=your_cpanel_password

ADMIN_EMAIL=admin@sunbirdvacations.com
ADMIN_PASSWORD=your-secure-password
```

### Laravel root `.htaccess` (no file moves)

If the full Laravel project lives in `public_html/` and web root is `public_html/` (not `public_html/public/`), use [`backend/.htaccess`](../backend/.htaccess) at the Laravel root to forward requests into `public/` without moving files.

## Shared hosting upload (cPanel)

Typical layout when uploading the whole `backend/` folder into `public_html/`:

```
public_html/              ← Laravel root
  app/
  bootstrap/
  .env
  .htaccess               ← forwards to public/
  public/                 ← web files
    index.php
    index.html
    .htaccess
    _next/
    admin/
    uploads/
```

### Steps

1. Upload Laravel project files (exclude `node_modules`, `frontend/`, `.git`).
2. Add root `.htaccess` if document root is `public_html` (see above).
3. Create MySQL database and user in cPanel.
4. Copy `backend/.env.example` → `.env` and fill production values.
5. Run once (SSH or cPanel terminal) if available:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --force
   php artisan db:seed --force
   chmod -R 775 storage bootstrap/cache
   mkdir -p public/uploads
   chmod -R 775 public/uploads
   ```
6. Upload the contents of `backend/public/` after local `npm run build:live`.

Without SSH: delete `bootstrap/cache/config.php` via File Manager after `.env` changes.

### Re-deploy after content changes

1. Local: `npm run build:live` (with live `BUILD_API_URL`)
2. Upload changed files from `backend/public/` (at minimum `_next/`, `admin/`, changed HTML folders, new slug paths).
3. Upload any backend PHP changes if applicable.

## Verify

- `https://sunbirdvacations.com/` — homepage loads with DB content
- `https://sunbirdvacations.com/api/health` — JSON `{ "status": "ok" }`
- `https://sunbirdvacations.com/admin/login` — admin login page
- `https://sunbirdvacations.com/admin/sections/1/edit/` — section edit form loads (not Apache 404)
- `https://sunbirdvacations.com/sitemap.xml` — XML sitemap
- `https://sunbirdvacations.com/robots.txt` — robots file

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Homepage shows old/hardcoded packages | Rebuild with `BUILD_API_URL` pointing at live API; upload `backend/public/` |
| Homepage shows Laravel welcome | Ensure `index.html` exists in `public/` and `.htaccess` has `DirectoryIndex index.html index.php` |
| `/api/*` returns 404 | Confirm `mod_rewrite` enabled; `index.php` present; root `.htaccess` forwards to `public/` |
| Admin `/sections/1/edit` 404 | Re-run `build:live` with correct `BUILD_ADMIN_*`; ensure `public/.htaccess` admin shell rules uploaded |
| Admin login works but edit page empty | Check browser Network tab — API URL must match live domain in `NEXT_PUBLIC_API_URL` |
| Admin images fail | Check `public/uploads` is writable |
| New package/blog page 404 | Re-run `npm run build:live` and upload new slug folders |
| CORS errors | Set `FRONTEND_URL` same as site URL (single origin) |
| Laravel uses old `.env` | Delete `bootstrap/cache/config.php` via File Manager |
