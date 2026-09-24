# Split deploy: Hostinger API + Vercel frontend

**Recommended production** for Sunbird Vacations:

| Role | Host | URL |
|------|------|-----|
| Frontend (Next.js) | Vercel | `https://sunbirdvacations.com` |
| Backend (Laravel API + media) | Hostinger | `https://backend.sunbirdvacations.com` |

Single-domain static export (`npm run build:live` into `backend/public/`) remains an **optional legacy** path at the bottom of this doc.

## Architecture

| URL | Served by |
|-----|-----------|
| `https://sunbirdvacations.com/` | Vercel (Next.js) |
| `https://sunbirdvacations.com/admin/*` | Vercel (Next.js) |
| `https://sunbirdvacations.com/sitemap.xml` | Vercel (proxies Laravel sitemap) |
| `https://sunbirdvacations.com/robots.txt` | Vercel |
| `https://backend.sunbirdvacations.com/api/*` | Hostinger (Laravel) |
| `https://backend.sunbirdvacations.com/uploads/*` | Hostinger |
| `https://backend.sunbirdvacations.com/images/*` | Hostinger |
| `https://backend.sunbirdvacations.com/sitemap.xml` | Hostinger (Laravel; prefer frontend sitemap for Search Console) |

CORS: Laravel `config/cors.php` allows `FRONTEND_URL` only. Media URLs in the browser use the origin of `NEXT_PUBLIC_API_URL` (backend subdomain).

## DNS and SSL

1. Point apex / www (`sunbirdvacations.com`) to Vercel (A/CNAME per Vercel DNS docs).
2. Point `backend.sunbirdvacations.com` to Hostinger (A or CNAME).
3. Enable HTTPS on both hosts (Vercel auto; Hostinger SSL for the subdomain).
4. Prefer redirecting `www` → apex (or the reverse) on Vercel so `FRONTEND_URL` matches the browser origin exactly.

## Environment variables

### Backend (Hostinger `backend/.env`)

Copy from [`backend/.env.production.example`](../backend/.env.production.example):

| Variable | Production value |
|----------|------------------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://backend.sunbirdvacations.com` |
| `FRONTEND_URL` | `https://sunbirdvacations.com` |
| `APP_KEY` | Generated (`php artisan key:generate`) |
| DB / mail / `ADMIN_*` | Fill on server — never commit secrets |

`FRONTEND_URL` must match the live Vercel origin (scheme + host, no trailing slash). It drives CORS and sitemap `<loc>` values.

### Frontend (Vercel project env)

Copy from the production block in [`frontend/.env.example`](../frontend/.env.example):

| Variable | Production value |
|----------|------------------|
| `NEXT_PUBLIC_API_URL` | `https://backend.sunbirdvacations.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://sunbirdvacations.com` |
| `BUILD_API_URL` | `https://backend.sunbirdvacations.com/api` (optional; used at build/SSR when set) |

Do not commit real `.env` files or passwords.

## Vercel (frontend)

1. Import the repo; set **Root Directory** to `frontend`.
2. Framework: Next.js. **Build Command:** `npm run build`. **Do not** set Output Directory to `out` (that is for static export only).
3. Add the three env vars above (Production + Preview as needed).
4. Deploy. New package/blog/admin routes work without a full static rebuild.

No `vercel.json` is required for the standard Node Next.js runtime.

## Hostinger (backend only)

Upload the Laravel project so the web document root is Laravel **`public/`** (or use [`backend/.htaccess`](../backend/.htaccess) at the Laravel root if the host points at the project root).

### What to keep in `public/`

| Keep | Purpose |
|------|---------|
| `index.php` | Laravel front controller |
| `.htaccess` | Laravel rewrite rules (API + uploads) |
| `uploads/` | Admin-uploaded media |
| `images/` | Static package/site images |
| `storage/` | If present / linked |

### What **not** to put in `public/`

Do **not** upload or copy Next static export artifacts onto Hostinger:

- `index.html` (Next homepage)
- `_next/`
- Admin HTML trees (`admin/…/index.html`)
- Other Next slug folders from `build:live`

Those belong on Vercel only. Hostinger serves API + media.

### Setup steps

1. Upload Laravel `backend/` (exclude `node_modules`, `frontend/`, `.git`).
2. Create MySQL DB/user in hPanel; fill `.env` from `.env.production.example`.
3. On SSH (or equivalent):

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
chmod -R 775 storage bootstrap/cache
mkdir -p public/uploads
chmod -R 775 public/uploads
```

4. Without SSH: after `.env` edits, delete `bootstrap/cache/config.php` via File Manager so config reloads.

## Local development

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```env
# backend/.env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

Run Laravel on `:8000` and `npm run dev` in `frontend/`. Optional: `npm run sync:images` to pull live media into `backend/public/`.

`NEXT_PUBLIC_SITE_URL` must match backend `FRONTEND_URL` in each environment.

## Post-deploy checklist

- [ ] `https://backend.sunbirdvacations.com/api/health` → `{ "status": "ok" }`
- [ ] `https://sunbirdvacations.com/` loads with API/DB content
- [ ] `https://sunbirdvacations.com/admin/login/` — login works (CORS OK)
- [ ] Browser Network: API calls go to `backend.sunbirdvacations.com`
- [ ] Images load from `https://backend.sunbirdvacations.com/uploads/...` or `/images/...`
- [ ] `https://sunbirdvacations.com/sitemap.xml` — valid XML (`<loc>` uses frontend URLs)
- [ ] `https://sunbirdvacations.com/robots.txt` — `Sitemap: https://sunbirdvacations.com/sitemap.xml`
- [ ] Contact / inquiry forms POST to the API without CORS errors

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors in browser | Set `FRONTEND_URL=https://sunbirdvacations.com` (exact origin); clear `bootstrap/cache/config.php` |
| Images 404 / wrong host | Set `NEXT_PUBLIC_API_URL` to `https://backend.sunbirdvacations.com/api` on Vercel and redeploy |
| Admin login works, data empty | Check Network tab — requests must hit the backend subdomain |
| Homepage shows Laravel welcome | Document root should be API-only; frontend is on Vercel, not `public/index.html` |
| Laravel uses old `.env` | Delete `bootstrap/cache/config.php` |
| `/api/*` 404 on Hostinger | Confirm `mod_rewrite`, `index.php`, and root→`public/` forwarding |

---

## Legacy: single-domain Hostinger static export

Optional path only. Copies a Next **static export** into `backend/public/` so one domain serves HTML + API.

```bash
npm run build:live
```

[`scripts/build-live.mjs`](../scripts/build-live.mjs) sets `STATIC_EXPORT=1`, runs `next build` → `frontend/out/`, then copies into `backend/public/` (preserving `index.php`, uploads, images).

With static export:

- New packages/blogs/admin IDs need a rebuild + re-upload of `public/` HTML folders.
- Do **not** use this as the primary flow when the site is on Vercel.

For split deploy, leave Hostinger `public/` Laravel-only and deploy the frontend on Vercel with `npm run build` (no `STATIC_EXPORT`).
