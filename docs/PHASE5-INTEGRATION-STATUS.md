# Phase 5 Integration Status & Deployment Guide

Handoff document for Sunbird Vacations frontend–backend integration. **Phases 5–12 complete.**

---

## 1. Executive Summary

**Phase 5 scope is complete.** **Phases 6–12 are complete** (SEO crawl files, blogs CMS, gallery CMS, blog SEO, page SEO CMS, about/contact content CMS, contact form submissions, destinations hub).

All core package, section, blog, gallery, static-page, and destinations hub flows on the Next.js frontend now load data from the Laravel public API (read and write where applicable), with static fallbacks preserved for resilience. The UI and visual design were intentionally left unchanged — only the data source migrated from hardcoded `src/data/*` files to API fetch helpers in `frontend/src/lib/api/`.

**What was integrated:**

- 7 homepage sections
- 7 listing pages (+ listing SEO via `generateMetadata`)
- Package detail pages (+ SEO + related packages)
- `/packages` index (+ `page_seo` metadata)
- `/search` (+ `page_seo` metadata)
- **Phase 7 — Blogs listing and detail** (`/blogs`, `/blogs/[slug]`) with featured packages on detail
- **Phase 7 — Sitemap blog post URLs** (active indexable blogs at `/blogs/{slug}` via backend → frontend proxy)
- **Phase 8 — Gallery** (`/gallery` → API + fallback; sitemap `/gallery` with dynamic `lastmod`)
- **Phase 9 — Blog SEO** — detail `seo` on `blogs` table; listing SEO via `page_seo` (`page_key: blogs`)
- **Phase 10 — Page SEO CMS** — `page_seo` keys for `home`, `gallery`, `packages`, `search`, `about`, `contact`, `payment-policy`, `cancellation-policy`; frontend `generateMetadata` on all wired routes; sitemap `canonical_url` / `is_indexable` for managed paths
- **Phase 11 — About + Contact** — `page_contents` API for hero/body/contact fields; `/about` and `/contact` frontend pages; `POST /api/contact-inquiries` + admin inquiry list; real contact form submission
- **Phase 12 — Destinations hub** — `destination_categories` config + `GET /api/destinations`; `/destinations` page with category tabs, hero, and scoped package grid; `page_seo.destinations`

**What remains static:** navigation, policy page **bodies**, homepage hero/shell components, gallery **filter tabs**, and other items in Section 3. `blogsData.ts`, `gallery.ts`, `about.ts`, `contact.ts`, and `destinations.ts` are retained as **fallback sources** — do not delete.

---

## 2. Dynamic Pages Matrix

Six section `[slug]` routes re-export a single implementation at `frontend/src/app/packages/[slug]/page.tsx` — one codebase, seven URL prefixes (`/packages`, `/across-boundaries`, `/popular-destinations`, `/best-of-india`, `/spiritual-destinations`, `/explore-wild-india`, `/travelyourway`, `/gateway-to-the-hills`).

| Page / Route | API Endpoint(s) | Fetch Helper | Fallback Static Data |
|--------------|-----------------|--------------|----------------------|
| **Homepage** — Popular Destinations | `GET /api/sections/popular-destinations` | `getPopularDestinationsSection()` | `popular-destinations.ts` (`popularDestinations`, `popularStats`) |
| **Homepage** — Travel Your Way | `GET /api/sections/travel-your-way` | `getTravelYourWayCategories()` | `journey-categories.ts` |
| **Homepage** — Across Boundaries | `GET /api/sections/across-boundaries` | `getAcrossBoundariesPackages()` | `international-packages.ts` |
| **Homepage** — Gateway to the Hills | `GET /api/sections/gateway-to-the-hills` | `getGatewayToHillsCategories()` | `hill-destinations.ts` |
| **Homepage** — Best of India | `GET /api/sections/best-of-india` | `getBestOfIndiaDestinations()` | `best-of-india.ts` |
| **Homepage** — Spiritual Destinations | `GET /api/sections/spiritual-destinations` | `getSpiritualDestinationsPackages()` | `spiritual-packages.ts` |
| **Homepage** — Explore Wild India | `GET /api/sections/explore-wild-india` | `getExploreWildIndiaPackages()` | `wildlife-packages.ts` |
| `/` (+ SEO) | `GET /api/page-seo/home` | `getHomeLayoutMetadata()` in `layout.tsx` | `siteConfig` in `lib/utils.ts` (title/description fallback) |
| `/across-boundaries` (+ SEO) | `GET /api/sections/across-boundaries/packages`, `GET /api/sections/across-boundaries` | `getAcrossBoundariesListingPackages()`, `getSectionListingMetadata('across-boundaries')` | `acrossBoundariesData.ts` |
| `/popular-destinations` (+ SEO) | `GET /api/sections/popular-destinations/packages`, `GET /api/sections/popular-destinations` | `getPopularDestinationsListingPackages()`, `getSectionListingMetadata('popular-destinations')` | `popularDestinationsData.ts` |
| `/best-of-india` (+ SEO) | `GET /api/sections/best-of-india/packages`, `GET /api/sections/best-of-india` | `getBestOfIndiaListingPackages()`, `getSectionListingMetadata('best-of-india')` | `bestOfIndiaData.ts` |
| `/spiritual-destinations` (+ SEO) | `GET /api/sections/spiritual-destinations/packages`, `GET /api/sections/spiritual-destinations` | `getSpiritualDestinationsListingPackages()`, `getSectionListingMetadata('spiritual-destinations')` | `spiritualDestinationsData.ts` |
| `/explore-wild-india` (+ SEO) | `GET /api/sections/explore-wild-india/packages`, `GET /api/sections/explore-wild-india` | `getExploreWildIndiaListingPackages()`, `getSectionListingMetadata('explore-wild-india')` | `exploreWildData.ts` |
| `/travelyourway` (+ SEO) | `GET /api/sections/travel-your-way/packages` (API slug `travel-your-way`) | `getTravelYourWayListingData()`, `getSectionListingMetadata('travel-your-way')` | `travelPackages.ts` |
| `/gateway-to-the-hills` (+ SEO) | `GET /api/sections/gateway-to-the-hills/packages` | `getGatewayToHillsListingData()`, `getSectionListingMetadata('gateway-to-the-hills')` | `hillPackages.ts` |
| Package detail (`/packages/[slug]` + 6 section re-exports) | `GET /api/packages/{slug}`, `GET /api/packages?category=` | `getPackageBySlug()`, `getPackageMetadata()`, `getRelatedPackages()` | `packages.ts` |
| `/packages` (+ SEO) | `GET /api/packages`, `GET /api/page-seo/packages` | `getPackagesIndexListingPackages()`, `getPackagesMetadata()` | `packages.ts` (`allTravelPackages`) |
| `/search` (+ SEO) | `GET /api/packages?search={q}` or all packages when `q` empty; `GET /api/page-seo/search` | `getSearchPackages(query)`, `getSearchMetadata()` | `packages.ts` via `filterStaticPackagesByQuery()` |
| `/blogs` (+ SEO) | `GET /api/blogs`, `GET /api/page-seo/blogs` | `getBlogsListing()`, `getBlogListingMetadata()` | `blogsData.ts` (content); static title/description for metadata fallback |
| `/blogs/[slug]` (+ SEO) | `GET /api/blogs/{slug}` | `getBlogBySlug()`, `getBlogMetadata()` | `blogsData.find()` (content); title + excerpt for metadata fallback |
| Featured packages on blog detail | `GET /api/packages?per_page=3` | `getBlogFeaturedPackages()` | `travelPackages.slice(0, 3)` |
| `/gallery` (+ SEO) | `GET /api/gallery`, `GET /api/page-seo/gallery` | `getGalleryItems()`, `getGalleryMetadata()` | `gallery.ts` (`galleryItems`) |
| `/about` (+ SEO) | `GET /api/page-content/about`, `GET /api/page-seo/about` | `getAboutPageContent()`, `getAboutMetadata()` | `about.ts` |
| `/contact` (+ SEO + form) | `GET /api/page-content/contact`, `GET /api/page-seo/contact`, `POST /api/contact-inquiries` | `getContactPageContent()`, `getContactMetadata()`, `submitContactInquiry()` | `contact.ts` |
| `/payment-policy` (+ SEO) | `GET /api/page-seo/payment-policy` | `getPaymentPolicyMetadata()` | Static title/description in `page-seo.ts` fallbacks |
| `/cancellation-policy` (+ SEO) | `GET /api/page-seo/cancellation-policy` | `getCancellationPolicyMetadata()` | Static title/description in `page-seo.ts` fallbacks |
| `/destinations` (+ SEO) | `GET /api/destinations?category=`, `GET /api/page-seo/destinations` | `getDestinationsHub(category)`, `getDestinationsMetadata()` | `destinations.ts` (categories + per-code packages from listing fallbacks) |

**`page_seo` seeded keys:** `home`, `gallery`, `packages`, `search`, `blogs`, `about`, `contact`, `payment-policy`, `cancellation-policy`, `destinations`.

**`page_seo` helpers** (`frontend/src/lib/api/page-seo.ts`): `getPageMetadata()`, `getHomeLayoutMetadata()`, `getGalleryMetadata()`, `getPackagesMetadata()`, `getSearchMetadata()`, `getBlogListingMetadata()`, `getAboutMetadata()`, `getContactMetadata()`, `getPaymentPolicyMetadata()`, `getCancellationPolicyMetadata()`, `getDestinationsMetadata()`.

### API layer inventory

| File | Purpose |
|------|---------|
| `frontend/src/lib/api/config.ts` | `getApiBaseUrl()` from `NEXT_PUBLIC_API_URL` |
| `frontend/src/lib/api/client.ts` | `apiGet()` (envelope parsing, `revalidate: 300`); `apiPost()` (mutations, no ISR cache) |
| `frontend/src/lib/api/types.ts` | Typed API response models |
| `frontend/src/lib/api/sections.ts` | Section fetch helpers (homepage, listings, SEO) |
| `frontend/src/lib/api/packages.ts` | Package fetch helpers (detail, index, search, related) |
| `frontend/src/lib/api/blogs.ts` | Blog fetch helpers (listing, detail, featured packages) |
| `frontend/src/lib/api/page-seo.ts` | Page SEO fetch helpers (`getPageMetadata()`, per-route helpers) |
| `frontend/src/lib/api/page-content.ts` | Page content fetch helpers (`getAboutPageContent()`, `getContactPageContent()`) |
| `frontend/src/lib/api/contact-inquiries.ts` | Contact form submission (`submitContactInquiry()`) |
| `frontend/src/lib/api/gallery.ts` | Gallery fetch helper (`getGalleryItems()`) |
| `frontend/src/lib/api/destinations.ts` | Destinations hub fetch helper (`getDestinationsHub()`) |

### Mapper inventory

| File | Purpose |
|------|---------|
| `travel-packages.ts` | `PackageSummary[]` → `TravelPackage[]` |
| `package-cards.ts` | Carousel card shapes (Across Boundaries, Spiritual, Wild) |
| `popular-destinations.ts` | Bento destinations + stats bar |
| `journey-categories.ts` | Travel Your Way category cards |
| `hill-destinations.ts` | Gateway to the Hills category cards |
| `best-of-india.ts` | Best of India bento destinations |
| `package-detail.ts` | Full package detail → `Package` |
| `package-metadata.ts` | Package SEO → Next.js `Metadata` |
| `section-metadata.ts` | Section SEO → Next.js `Metadata` |
| `related-packages.ts` | Summary → minimal `Package` for related cards |
| `blogs.ts` | `BlogSummary` / `BlogDetail` → `Blog` (listing + detail) |
| `blog-metadata.ts` | `BlogDetail` / `PageSeoResponse` → Next.js `Metadata` (detail + listing) |
| `gallery.ts` | `GalleryApiItem[]` → `GalleryItem[]` |

---

## 3. Intentionally Static (Phase 5 scope excluded)

These remain hardcoded by design. Do not assume they reflect admin CRUD changes.

| Item | Location | Reason |
|------|----------|--------|
| Hero section | `components/sections/home/hero/` | Visual/marketing shell — no API endpoint |
| Customer Promise | `customer-promises.ts` | Static trust badges — no API endpoint |
| Bento grid slot configs | `popular-destinations.ts` (`popularDestinationsGridSlots`), `best-of-india.ts` (`bestOfIndiaGridClasses`) | Layout CSS classes, not content |
| Section headers / copy | Various homepage components (e.g. Gateway hero image) | Hardcoded marketing copy |
| `navbarDestinations` | `navigation.ts` | Used as `/packages` filter tabs (title substring match) |
| `navigationLinks` | `navigation.ts` | Navbar menu structure |
| Gallery filter tabs | `gallery.ts` (`galleryCategories`) | UI-only `ALL` tab + fixed category order; not from API |
| Policy page bodies | `cancellation-policy`, `payment-policy` | Static legal HTML content (metadata via `page_seo`; body not CMS yet) |
| `siteConfig` shell fields | `lib/utils.ts` | Used for layout keywords, authors, OG `siteName`/`url` alongside `page_seo.home` title/description |

---

## 4. Static Fallback Strategy

Every integrated page follows the same pattern:

1. **Server component or helper** calls the Laravel API via `apiGet()` or `apiPost()` in `frontend/src/lib/api/client.ts`.
2. **Response caching (GET only):** `apiGet()` uses `next: { revalidate: 300 }` — ISR-style 5-minute cache. `apiPost()` uses plain `fetch` with no revalidate.
3. **Error handling:** `try/catch` in each `get*()` helper; on failure, log with `console.error` in development only.
4. **Fallback:** Return equivalent data from `frontend/src/data/*` so the site remains usable when the API is down or unreachable.
5. **Empty API responses:** Most helpers treat an empty package array as a signal to use static fallback (search with a non-empty query is an exception — returns `[]` for no matches).

**Do not remove fallback files.** They are required for:

- Local frontend development without a running backend
- Graceful degradation in production if the API is temporarily unavailable
- Build-time static generation when the API is not reachable

---

## 5. Known Data Mismatches (documented, not bugs)

These are intentional or legacy mapping decisions. Fixing them would require UI or schema changes outside Phase 5 scope.

| Mismatch | Detail |
|----------|--------|
| Travel Your Way / Gateway filter tabs | Client-side `?category=` filtering uses `filter_value` from API categories, not the display `title` |
| Popular Destinations `location` field | Homepage bento maps API `location` to **price text** (legacy static shape) |
| `/packages` navbar filters | `navbarDestinations` tabs match package **title substring**, not API `category` field |
| Search scope | API searches `title`, `subtitle`, `location`, `slug` — not `duration` or `category` like the old client-side filter (fallback still uses title + category + duration) |
| Homepage carousel prices | Displayed prices on homepage carousels may differ from canonical API prices on package detail pages |

---

## 6. Environment Variables

| Variable | App | Purpose |
|----------|-----|---------|
| `NEXT_PUBLIC_API_URL` | Frontend | Laravel API base URL (must include `/api` suffix, e.g. `http://localhost:8000/api`) |
| `NEXT_PUBLIC_SITE_URL` | Frontend | Frontend origin for OpenGraph `url`, `/robots.txt` Sitemap line, sitemap fallback (no trailing slash). Defaults to `https://sunbirdvacations.com` when unset |
| `FRONTEND_URL` | Backend | Sitemap `<loc>` canonical URLs, SEO canonical generation |
| `APP_URL` | Backend | API base URL; used in robots.txt `Sitemap:` line (`{APP_URL}/api/sitemap.xml`) |
| CORS allowed origins | Backend | `config/cors.php` → `allowed_origins` = `[env('FRONTEND_URL')]` — must match the deployed Next.js origin |

### Frontend / backend URL alignment

`NEXT_PUBLIC_SITE_URL` (frontend) and `FRONTEND_URL` (backend) must match in each environment so proxied sitemap `<loc>` values and frontend robots `Sitemap:` reference the same origin.

| Environment | Frontend `NEXT_PUBLIC_SITE_URL` | Backend `FRONTEND_URL` |
|-------------|--------------------------------|------------------------|
| Local | `http://localhost:3000` | `http://localhost:3000` |
| Production | `https://sunbirdvacations.com` | `https://sunbirdvacations.com` |

### Example local values

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend** (`backend/.env`):

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Example production values

**Frontend:**

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://sunbirdvacations.com
```

**Backend:**

```env
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

Do not commit `.env` files. Do not put secrets in documentation.

---

## 7. Local Dev Checklist

1. **Backend setup**

   ```bash
   cd backend
   cp .env.example .env
   php artisan key:generate
   # Configure DB_* in .env
   php artisan migrate --seed
   php artisan serve
   ```

2. **Verify API health**

   ```bash
   curl http://localhost:8000/api/health
   ```

3. **Frontend setup**

   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

4. **Spot-check one page from each category**

   | Category | URL to verify |
   |----------|---------------|
   | Homepage section | http://localhost:3000/ |
   | Listing page | http://localhost:3000/popular-destinations |
   | Package detail | http://localhost:3000/packages/kashmir-paradise |
   | Packages index | http://localhost:3000/packages |
   | Search | http://localhost:3000/search?q=kashmir |
   | Blogs listing | http://localhost:3000/blogs |
   | Blog detail | http://localhost:3000/blogs/story-behind-sunbird-vacations |
   | Gallery | http://localhost:3000/gallery |
   | About | http://localhost:3000/about |
   | Contact | http://localhost:3000/contact (submit form with API running → 201) |
   | Destinations hub | http://localhost:3000/destinations?category=popular |

5. **Optional:** Run backend API tests: `php artisan test --filter=Api` (**464** tests as of Phase 12)

---

## 8. Production Deployment Checklist

### Backend

- [ ] Set `APP_ENV=production`, `APP_DEBUG=false`
- [ ] Set `APP_URL` to production API domain (e.g. `https://api.yourdomain.com`)
- [ ] Set `FRONTEND_URL` to production frontend domain (e.g. `https://yourdomain.com`)
- [ ] Configure production database credentials
- [ ] Run `php artisan migrate` (use `--seed` only on fresh installs)
- [ ] Confirm CORS: `FRONTEND_URL` matches the deployed Next.js origin exactly
- [ ] Configure cache driver appropriate for production (`CACHE_DRIVER`)
- [ ] Set admin credentials via env + `php artisan db:seed --class=AdminSeeder` (first deploy only)

### Frontend

- [ ] Set `NEXT_PUBLIC_API_URL` to production API base (include `/api` suffix)
- [ ] Build: `npm run build && npm run start` (or deploy to Vercel/similar)
- [ ] Ensure frontend can reach the API over HTTPS

### Post-deploy verification

- [ ] `GET {APP_URL}/api/health` returns OK
- [ ] Homepage loads all 7 sections with package data
- [ ] One listing page (e.g. `/popular-destinations`) shows packages
- [ ] Package detail: `/packages/kashmir-paradise`
- [ ] Search: `/search?q=kashmir`
- [ ] Blogs listing: `/blogs` — view-source shows title/description from `GET /api/page-seo/blogs` (default: "Travel Blogs | Sunbird Vacations")
- [ ] Blog detail: `/blogs/story-behind-sunbird-vacations` — view-source shows metadata from `GET /api/blogs/{slug}` `seo` object (or title + excerpt fallback)
- [ ] Blog listing SEO admin: `PATCH /api/admin/page-seo/blogs` with bearer token — verify `GET /api/page-seo/blogs` reflects change within 5 minutes
- [ ] Blog detail SEO admin: `PATCH /api/admin/blogs/{id}` with `meta_title` / `is_indexable` — verify public detail + sitemap behavior
- [ ] Gallery: `/gallery` (22 items, category filters work)
- [ ] About: `/about` — founder story from `GET /api/page-content/about`
- [ ] Contact: `/contact` — hero + contact info from `GET /api/page-content/contact`; form `POST /api/contact-inquiries` → 201
- [ ] Page content API: `GET /api/page-content/about` and `/contact` return camelCase JSON
- [ ] Page SEO API: `GET /api/page-seo/home`, `/gallery`, `/packages`, `/search`, `/blogs`, `/about`, `/contact`, `/payment-policy`, `/cancellation-policy`, `/destinations`
- [ ] Destinations hub: `/destinations` — category tabs, hero, packages; `?category=beaches` shows beach packages; `GET /api/destinations?category=popular`
- [ ] Homepage metadata: view-source on `/` shows title/description from `page_seo.home`
- [ ] Contact inquiries admin: `GET /api/admin/contact-inquiries` with bearer token (after form submit)
- [ ] Page SEO admin: `PATCH /api/admin/page-seo/{page_key}` smoke test for any seeded key
- [ ] Sitemap: `GET https://your-frontend.com/sitemap.xml` (valid XML, `<loc>` from backend `FRONTEND_URL`; **70 URLs** with default seed)
- [ ] Sitemap blogs: `curl https://your-frontend.com/sitemap.xml | grep blogs/` — listing URL respects `page_seo.canonical_url` when set; listing excluded when `page_seo.is_indexable` is false; post URLs at `/blogs/{slug}` for active indexable posts
- [ ] Robots: `GET https://your-frontend.com/robots.txt` → `Sitemap: https://your-frontend.com/sitemap.xml`
- [ ] Admin CRUD changes appear on frontend within **5 minutes** (ISR revalidate) or immediately after redeploy

### Sitemap & robots (Phase 6 Step 2 — complete)

| Route | Source | Notes |
|-------|--------|-------|
| Frontend `/sitemap.xml` | Proxies backend `GET /api/sitemap.xml` | 1-hour cache; minimal homepage-only fallback on API error |
| Frontend `/robots.txt` | Generated on frontend | `Sitemap:` uses `getSiteUrl()` / `NEXT_PUBLIC_SITE_URL`, not API domain |
| Backend `/api/sitemap.xml` | Laravel `SitemapGenerator` | `<loc>` values use `FRONTEND_URL`; active indexable blog posts at `/blogs/{slug}` (or post `canonical_url`); `/blogs` listing uses `page_seo` canonical/`lastmod`/`is_indexable`; `/gallery` listing has dynamic `<lastmod>` (70 URLs with default seed; no per-item gallery URLs) |
| Backend `/api/robots.txt` | Laravel `RobotsController` | Still references API sitemap URL — use frontend `/robots.txt` in production |

---

## 9. Remaining Future Work

| Priority | Item | Notes |
|----------|------|-------|
| 1 | Hero + Customer Promise CMS | Homepage marketing shell still hardcoded |
| 2 | Navigation CMS | `navigationLinks` / `navbarDestinations` still static |
| 3 | Admin dashboard UI | API-only admin today — no web UI for CRUD/SEO/inquiries |
| 4 | Policy page body CMS | Metadata via `page_seo`; legal body HTML still static |
| 5 | Contact form email notifications | Optional — inquiries stored in DB only today |
| 6 | Optional static data cleanup | Remove duplicate listing fallback files only after fallbacks are redesigned |

### Completed (Phase 6)

- **Step 2 — Frontend `/sitemap.xml`** — proxies backend XML (`revalidate: 3600`); minimal homepage fallback on error
- **Step 2 — Frontend `/robots.txt`** — generated on frontend with `Sitemap: {getSiteUrl()}/sitemap.xml` (not proxied from backend)
- **Step 3 — Env-driven site URL** — `NEXT_PUBLIC_SITE_URL` via `getSiteUrl()` in `lib/utils.ts`; defaults to `https://sunbirdvacations.com`

### Completed (Phase 7 — Blogs)

| Step | Scope | Status |
|------|-------|--------|
| 1 | Backend public API (`GET /api/blogs`, `GET /api/blogs/{slug}`) | Complete |
| 2 | Admin CRUD (`/api/admin/blogs`) | Complete |
| 3 | Frontend listing (`/blogs` → API + fallback) | Complete |
| 4 | Frontend detail (`/blogs/[slug]` → API + fallback + featured packages; dynamic route) | Complete |
| 5 | Sitemap blog post URLs (active blogs at `/blogs/{slug}`) | Complete |
| 6 | Integration documentation update | Complete |

### Completed (Phase 8 — Gallery)

| Step | Scope | Status |
|------|-------|--------|
| 1 | Backend public API (`GET /api/gallery`) | Complete |
| 2 | Admin CRUD (`/api/admin/gallery-items`) | Complete |
| 3 | Frontend integration (`/gallery` → API + fallback) | Complete |
| 4 | Sitemap `/gallery` dynamic `lastmod` + documentation | Complete |

### Completed (Phase 9 — Blog SEO)

| Step | Scope | Status |
|------|-------|--------|
| 1 | Backend blog SEO fields on `blogs` + public detail `seo` + sitemap `is_indexable` | Complete |
| 2 | Frontend blog detail `generateMetadata` from API SEO (`getBlogMetadata()`) | Complete |
| 3 | Blog listing page SEO via `page_seo` + `getBlogListingMetadata()` | Complete |
| 4 | Integration documentation + deployment checklist wrap-up | Complete |

### Completed (Phase 10 — Page SEO CMS)

| Step | Scope | Status |
|------|-------|--------|
| 1 | Extended `page_seo` keys: `home`, `gallery`, `packages`, `search`, `about`, `contact`, `payment-policy`, `cancellation-policy` | Complete |
| 2 | Frontend `getPageMetadata()` + per-route helpers; `getHomeLayoutMetadata()` in root layout | Complete |
| 3 | Policy pages (`/payment-policy`, `/cancellation-policy`) metadata wired | Complete |
| 4 | Sitemap `canonical_url` / `is_indexable` / `lastmod` for all managed static paths | Complete |

### Completed (Phase 11 — About + Contact)

| Step | Scope | Status |
|------|-------|--------|
| 1 | `page_contents` table + public/admin API (`about`, `contact`) | Complete |
| 2 | Frontend `/about` + `/contact` pages from `page_content` API + fallbacks | Complete |
| 3 | `contact_inquiries` table + `POST /api/contact-inquiries` + admin list/show | Complete |
| 4 | Frontend contact form real submission via `submitContactInquiry()` | Complete |

### Completed (Phase 12 — Destinations hub)

| Step | Scope | Status |
|------|-------|--------|
| 1 | `destination_categories` table + `GET /api/destinations` + admin GET/PATCH + `page_seo.destinations` | Complete |
| 2 | Frontend `/destinations` hub page — category tabs, hero, `PackageList` with `listingPath` | Complete |
| 3 | `getDestinationsMetadata()` + static fallback `destinations.ts` + integration docs | Complete |

---

## Fallback Files Preserved

Do not delete these files without a replacement fallback strategy:

**Package fallbacks:**

- `frontend/src/data/packages.ts`

**Listing fallbacks:**

- `frontend/src/data/acrossBoundariesData.ts`
- `frontend/src/data/popularDestinationsData.ts`
- `frontend/src/data/bestOfIndiaData.ts`
- `frontend/src/data/spiritualDestinationsData.ts`
- `frontend/src/data/exploreWildData.ts`
- `frontend/src/data/travelPackages.ts`
- `frontend/src/data/hillPackages.ts`

**Homepage section fallbacks:**

- `frontend/src/data/popular-destinations.ts`
- `frontend/src/data/journey-categories.ts`
- `frontend/src/data/international-packages.ts`
- `frontend/src/data/spiritual-packages.ts`
- `frontend/src/data/best-of-india.ts`
- `frontend/src/data/wildlife-packages.ts`
- `frontend/src/data/hill-destinations.ts`

**Blog fallbacks (Phase 7 — do not delete):**

- `frontend/src/data/blogsData.ts` — fallback only for `/blogs` and `/blogs/[slug]` when API is unavailable

**Gallery fallbacks (Phase 8 — do not delete):**

- `frontend/src/data/gallery.ts` — fallback for `/gallery` items when API is unavailable; `galleryCategories` still used for filter tabs (includes UI-only `ALL`)

**Page content fallbacks (Phase 11 — do not delete):**

- `frontend/src/data/about.ts` — fallback for `/about` hero + body when page-content API is unavailable
- `frontend/src/data/contact.ts` — fallback for `/contact` hero + contact fields when page-content API is unavailable

**Destinations hub fallbacks (Phase 12 — do not delete):**

- `frontend/src/data/destinations.ts` — fallback for `/destinations` hub when API is unavailable; aggregates per-category packages from existing listing fallbacks

**Always-static data (not fallbacks, but still in use):**

- `frontend/src/data/navigation.ts`
- `frontend/src/data/customer-promises.ts`

---

*Last updated: Phase 12 — Destinations hub complete (Phases 5–12).*
