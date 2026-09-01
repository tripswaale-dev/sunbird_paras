This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy the environment file and start the Laravel API (see `../backend/README.md`):

```bash
cp .env.example .env.local
```

Ensure the backend is running at `http://localhost:8000`, then start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production environment

```env
# Production example — must include /api suffix
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

Pair with backend `FRONTEND_URL` and `APP_URL` — see [Integration status & deployment guide](../docs/PHASE5-INTEGRATION-STATUS.md).

Set `NEXT_PUBLIC_SITE_URL` to the frontend origin (no trailing slash). It must match backend `FRONTEND_URL` in each environment so sitemap `<loc>` values and robots `Sitemap:` stay aligned.

```env
# Local
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://sunbirdvacations.com
```

When unset, defaults to `https://sunbirdvacations.com`.

## API Integration (Phase 5)

**Phase 5 complete** — all core package/section flows are API-driven with static fallbacks.

See [Integration status & deployment guide](../docs/PHASE5-INTEGRATION-STATUS.md) for the full dynamic pages matrix, deployment checklist, and known data mismatches.

The frontend reads section data from the Laravel API at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`).

| Layer | Path | Purpose |
|-------|------|---------|
| Config | `src/lib/api/config.ts` | Resolves API base URL from env |
| Client | `src/lib/api/client.ts` | `apiGet()` with envelope parsing |
| Types | `src/lib/api/types.ts` | Typed API response models |
| Sections | `src/lib/api/sections.ts` | Section fetch helpers |
| Mappers | `src/lib/mappers/` | API → existing component prop shapes |

**Currently dynamic (all 7 homepage sections):**

- **Popular Destinations** (`PopularDestinations`) — `GET /api/sections/popular-destinations` → bento `PopularDestination` (`name` ← `title`, `location` ← price text, `duration` ← `duration.short`, `imageSrc` ← `image`, `href` → `/packages/{slug}`) + `PopularStat` stats bar. Grid slots remain static in `popular-destinations.ts`. Fallback: `popularDestinations` + `popularStats` arrays in same file.
- **Travel Your Way** (`ChooseYourJourney`) — `GET /api/sections/travel-your-way` → `JourneyCategory` (`title`, `category` ← `filter_value`, `image`). Links: `/travelyourway?category={filter_value}`. Fallback: `src/data/journey-categories.ts`.
- **Across Boundaries** (`AcrossBoundaries`) — `GET /api/sections/across-boundaries` → `InternationalPackage` via reusable `mapPackageSummariesToPackageCards()` (`title`, `image`, formatted `price`, `location`, `duration` ← `duration.formatted`, `href` ← `/across-boundaries/{slug}`). Fallback: `src/data/international-packages.ts`.
- **Spiritual Destinations** (`SpiritualDestinations`) — `GET /api/sections/spiritual-destinations` → `SpiritualPackage` via `mapPackageSummariesToPackageCards(..., '/packages')` + `tag` from API. Links: `/packages/{slug}` (explicit `href` on `PackageCard`). Fallback: `src/data/spiritual-packages.ts`.
- **Best of India** (`BestOfIndia`) — `GET /api/sections/best-of-india` → `BestOfIndiaDestination` via `mapPackageSummariesToBestOfIndiaDestinations()` (`subtitle` from price, `duration` from `duration.short`, `href` → `/packages/{slug}`). Bento grid classes remain static in `best-of-india.ts`. Fallback: `bestOfIndiaDestinations` array in same file.
- **Explore the WILD** (`ExploreWildIndia`) — `GET /api/sections/explore-wild-india` → `WildlifePackage` via `mapPackageSummariesToPackageCards(..., '/packages')` + `category` from API. Links: `/packages/{slug}`. Fallback: `src/data/wildlife-packages.ts`.
- **Gateway to the Hills** (`GatewayToHills`) — `GET /api/sections/gateway-to-the-hills` → `HillDestination` (`title`, `category` ← `filter_value`, `image`, `featured` ← `is_featured`). Links: `/gateway-to-the-hills?category={filter_value}`. Right hero image and `SectionHeader` copy remain hardcoded. Fallback: `src/data/hill-destinations.ts`.

**Listing pages (Phase 5 Step 8+):**

- **Across Boundaries** (`/across-boundaries`) — `GET /api/sections/across-boundaries/packages` → `TravelPackage[]` via `mapPackageSummariesToTravelPackages()`. No filter tabs. Fallback: `src/data/acrossBoundariesData.ts`.
- **Popular Destinations** (`/popular-destinations`) — `GET /api/sections/popular-destinations/packages` → `TravelPackage[]` via `mapPackageSummariesToTravelPackages()`. No filter tabs. Fallback: `src/data/popularDestinationsData.ts` (`popularPackages`).
- **Best of India** (`/best-of-india`) — `GET /api/sections/best-of-india/packages` → `TravelPackage[]` via `mapPackageSummariesToTravelPackages()`. No filter tabs. Fallback: `src/data/bestOfIndiaData.ts` (`bestOfIndiaPackages`).
- **Spiritual Destinations** (`/spiritual-destinations`) — `GET /api/sections/spiritual-destinations/packages` → `TravelPackage[]` via `mapPackageSummariesToTravelPackages()`. No filter tabs. Fallback: `src/data/spiritualDestinationsData.ts` (`spiritualDestinationsPackages`).
- **Explore the WILD** (`/explore-wild-india`) — `GET /api/sections/explore-wild-india/packages` → `TravelPackage[]` via `mapPackageSummariesToTravelPackages()`. No filter tabs. Fallback: `src/data/exploreWildData.ts` (`exploreWildPackages`).
- **Travel Your Way** (`/travelyourway`) — `GET /api/sections/travel-your-way/packages` → `TravelPackage[]` + filter tabs from API `categories[].filter_value` (matches static `travelCategories`). Horizontal `PackageList` with client-side `?category=` filtering. Fallback: `src/data/travelPackages.ts` (`travelPackages`, `travelCategories`).
- **Gateway to the Hills** (`/gateway-to-the-hills`) — `GET /api/sections/gateway-to-the-hills/packages` → `TravelPackage[]` + filter tabs from API `categories[].filter_value` (matches static `hillCategories`). Horizontal `PackageList` with client-side `?category=` filtering. Fallback: `src/data/hillPackages.ts` (`hillPackages`, `hillCategories`).

Shared listing helpers: `fetchSectionPackages(slug, category?)` in `sections.ts`; mapper in `src/lib/mappers/travel-packages.ts`. Category-filter listings use `getTravelYourWayListingData()` / `getGatewayToHillsListingData()` returning `CategoryFilteredListingData`.

**All 7 listing pages are now API-driven** (packages + SEO via `getSectionListingMetadata()` → `GET /api/sections/{slug}` `data.seo`; static fallbacks in `sections.ts`. Route `/travelyourway` uses API slug `travel-your-way`).

**Package detail (Phase 5 Steps 15–17):**

- **Package detail** (`/packages/[slug]` and section `[slug]` re-exports) — `GET /api/packages/{slug}` → `Package` via `mapPackageDetailToPackage()` in `src/lib/mappers/package-detail.ts`. Helper: `getPackageBySlug()` in `src/lib/api/packages.ts` with static fallback from `src/data/packages.ts`.
- **Package detail SEO** — `getPackageMetadata()` maps API `seo` fields (`meta_title`, `meta_description`, `canonical_url`, `og_image`, `is_indexable`) to Next.js `Metadata` via `src/lib/mappers/package-metadata.ts`. Static fallback metadata preserved when API is unavailable.
- **Related packages** — `getRelatedPackages()` fetches `GET /api/packages?category=` (same category as current package, excludes self, limit 3) → minimal `Package` via `mapPackageSummaryToRelatedPackage()` in `src/lib/mappers/related-packages.ts`. Static fallback: `getRelatedPackages()` in `src/data/packages.ts`.

**Packages index (Phase 5 Step 19):**

- **Packages index** (`/packages`) — paginated `GET /api/packages` via `fetchAllPackageSummaries()` + `getPackagesIndexListingPackages()` → `TravelPackage[]` via `mapPackageSummariesToTravelPackages()`. Static fallback: `allTravelPackages` in `src/data/packages.ts`. Filter tabs: static `navbarDestinations` (title substring match). Page `metadata` remains static.

**Search (Phase 5 Step 20):**

- **Search** (`/search`) — `getSearchPackages(query)` from `?q=` param. Empty/whitespace `q` → `fetchAllPackageSummaries()`; non-empty → paginated `GET /api/packages?search={q}`. Static fallback: `filterStaticPackagesByQuery()` over `allTravelPackages` (title + category + duration match). Page `metadata` remains static.

Responses are cached for 5 minutes (`revalidate: 300`) via Next.js fetch.

## SEO Crawl Files (Phase 6 Step 2)

Crawlers should use the **frontend origin** directly:

| Route | Handler | Behavior |
|-------|---------|----------|
| `/sitemap.xml` | `src/app/sitemap.xml/route.ts` | Proxies backend `GET {NEXT_PUBLIC_API_URL}/sitemap.xml` via `fetchSitemapXml()` in `src/lib/seo/crawl-files.ts`. Cached with `revalidate: 3600` (1 hour). On API error, returns minimal XML urlset with homepage only (`getSiteUrl()`). |
| `/robots.txt` | `src/app/robots.txt/route.ts` | Generated on frontend (not proxied). `Sitemap:` points to `{getSiteUrl()}/sitemap.xml` — does **not** reference the API domain. |

Backend still serves `/api/sitemap.xml` and `/api/robots.txt` unchanged; production crawlers should use the frontend routes above.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

For production env pairing with the Laravel API, see [Integration status & deployment guide](../docs/PHASE5-INTEGRATION-STATUS.md).
