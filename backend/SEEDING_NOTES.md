# Seeding Notes — Phase 3

Canonical seed data transcribed manually from frontend static `*Data.ts` files. The frontend (`../frontend/`) was **not modified**.

## Canonical Source Rules

| Field | Source | Notes |
|-------|--------|-------|
| `slug` | Listing `id` from `*Data.ts` | Matches frontend routes (`/section/{id}`) |
| `title`, `price`, `duration`, `category`, `pax`, `image` | Listing `*Data.ts` | Numeric price, consistent durations |
| `location`, `tag` | Homepage section files where present | e.g. spiritual-packages.ts, wildlife-packages.ts |
| `display_order` | Homepage card order within each section | Preserves carousel order |
| `package_details.inclusions` (listing packages) | `amenities[]` from listing data only | No overview/itinerary/FAQs for listing packages |
| Full detail page | `packages.ts` | **Only `kashmir-paradise`** |

## Expected Counts (after `php artisan db:seed`)

| Entity | Count |
|--------|-------|
| Sections | 7 |
| Packages | 53 |
| Section–package pivots | 53 |
| Section categories | 27 (4 Travel Your Way + 3 Gateway + 20 listing filter tabs) |
| Section stats | 4 (Popular Destinations only) |
| Package details | 53 (52 with inclusions-only + 1 full kashmir-paradise) |

## Documented Conflicts & Resolutions

| Conflict | Resolution |
|----------|------------|
| Across Boundaries homepage prices (₹5,999 placeholders) vs listing (₹25,999–₹65,999) | Use listing `acrossBoundariesData.ts` prices |
| Duration mismatches (homepage vs listing for Popular/Best of India) | Use listing durations |
| `pkg-1` ID collision (Kashmir Paradise in `packages.ts` vs Udaipur Getaway in `travelPackages.ts`) | Seed `pkg-1` as **Udaipur Getaway**; seed `kashmir-paradise` as separate slug with full details |
| Wildlife category (homepage vs listing for Jawai/Kaziranga) | Use listing category |
| `river-retreat-haridwar-rishikesh` in Best of India (`North`) and Spiritual (`Retreats`) | One package row (first-seen listing data: Best of India / `North`); **two** `section_packages` pivot rows |
| Best of India filter array missing "East" in frontend | Seed "East" category tab anyway (used by Sikkim package) |

## Special Cases

### `kashmir-paradise`

- Detail-only package from `frontend/src/data/packages.ts`
- **Not assigned** to any homepage section (no `section_packages` row)
- Full `package_details`, 7 `package_itinerary_days`, 3 `package_faqs`, 6 `package_images`
- Hero image uses remote Unsplash URL (as in frontend)

### `river-retreat-haridwar-rishikesh`

- Single `packages` row
- Appears in both `best-of-india` and `spiritual-destinations` sections

### Duplicate slug deduplication in `PackageSeeder`

When the same slug appears in multiple listing files, **first occurrence wins** during merge (popular → travel → across → hill → best-of-india → spiritual → wildlife).

## Idempotent Seeding

All seeders use `updateOrCreate()` keyed on natural unique keys (`slug`, `section_id` + `package_id`, etc.). Safe to re-run:

```bash
php artisan db:seed
```

Or fresh migrate + seed:

```bash
php artisan migrate:fresh --seed
```

## Verification (Tinker)

```php
Section::where('slug','popular-destinations')->first()->packages()->orderByPivot('display_order')->pluck('slug');
Package::where('slug','river-retreat-haridwar-rishikesh')->first()->sections()->pluck('slug');
Package::where('slug','kashmir-paradise')->first()->detail;
Package::where('slug','kashmir-paradise')->first()->itineraryDays()->count(); // 7
Package::count(); // 53
SectionPackage::count(); // 53
```
