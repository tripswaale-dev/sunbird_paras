# Sunbird Vacations — Frontend Dynamic Conversion Analysis

> **Analysis-only document.** No code was modified. Use this to plan backend/database architecture and step-by-step dynamic conversion while keeping the existing UI 100% unchanged.

---

## 1. Frontend Technology & Project Structure

### Framework & Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16.2.9** (App Router) |
| UI | **React 19** + **TypeScript 5** |
| Styling | **Tailwind CSS v4** (`globals.css` with `@theme inline` design tokens) |
| Animation | **Framer Motion**, **Lenis** (smooth scroll via `LenisProvider`) |
| Icons | **lucide-react** |
| Fonts | Playfair Display (headings), Outfit (body) via `next/font` |
| Images | `next/image` with remote Unsplash allowed in `next.config.ts` |

### Project Location

All frontend code lives in:

```
frontend/
├── src/
│   ├── app/              ← Pages & routing (Next.js App Router)
│   ├── components/       ← UI components
│   ├── data/             ← ALL static content (no API)
│   ├── types/            ← TypeScript interfaces
│   ├── lib/              ← Utilities (cn, siteConfig)
│   ├── hooks/
│   └── styles/globals.css
├── public/               ← Exists but appears EMPTY in repo (no committed images)
├── package.json
├── next.config.ts
└── tsconfig.json         ← Path alias: @/* → src/*
```

### Architecture Pattern

```
app/[route]/page.tsx          → Server component page
    ↓ imports
data/*.ts                     → Static TypeScript arrays/objects
    ↓ passes props
components/sections/home/*    → Homepage section components ('use client')
components/common/*           → Reusable cards, carousel, section wrapper
components/ui/*               → Primitives (button, section-header, etc.)
```

- **No backend, no API routes, no fetch calls, no database.**
- **No CMS or admin panel.**
- All content is hardcoded in `src/data/*.ts` files.
- Homepage sections are **client components** (`'use client'`) for animations/interactivity.
- Listing pages are **server components** that pass data to client `PackageList`.

### Routing

| Route Pattern | Purpose |
|---------------|---------|
| `/` | Homepage (7 target sections) |
| `/popular-destinations` | Section listing page |
| `/travelyourway` | Section listing page |
| `/across-boundaries` | Section listing page |
| `/gateway-to-the-hills` | Section listing page |
| `/best-of-india` | Section listing page |
| `/spiritual-destinations` | Section listing page |
| `/explore-wild-india` | Section listing page |
| `/[section]/[slug]` | All re-export `@/app/packages/[slug]/page` |
| `/packages/[slug]` | Canonical package detail page |

### Key Reusable Components

| Component | Path | Role |
|-----------|------|------|
| `Section` | `components/common/Section.tsx` | Section wrapper with padding, bg, scroll animation |
| `SectionHeader` | `components/ui/section-header.tsx` | Title + subtitle + "View all" link |
| `ImageOverlayCard` | `components/common/ImageOverlayCard.tsx` | Image card with text overlay |
| `PackageCard` | `components/common/PackageCard.tsx` | White card with image, price, location |
| `Carousel` | `components/common/Carousel.tsx` | Generic carousel (shows N items, wraps) |
| `PackageList` | `components/sections/packages/PackageList.tsx` | Listing page grid with optional category filters |
| `StatsCard` | `components/shared/stats-card.tsx` | Animated stats row |
| `HeroBanner` | `components/common/HeroBanner.tsx` | Listing page hero |

**Important:** There are **two different `PackageCard` components**:

- `components/common/PackageCard.tsx` — used by homepage carousels and listing pages
- `components/package/PackageCard.tsx` — used only on the package detail page (related packages)

### Critical Structural Finding: Duplicate Data Sources

Every section has **two separate static data files**:

| Section | Homepage Data File | Listing Page Data File |
|---------|-------------------|------------------------|
| Popular Destinations | `popular-destinations.ts` | `popularDestinationsData.ts` |
| Travel Your Way | `journey-categories.ts` | `travelPackages.ts` |
| Across Boundaries | `international-packages.ts` | `acrossBoundariesData.ts` |
| Gateway to the Hills | `hill-destinations.ts` | `hillPackages.ts` |
| Best of India | `best-of-india.ts` | `bestOfIndiaData.ts` |
| Spiritual Destinations | `spiritual-packages.ts` | `spiritualDestinationsData.ts` |
| Explore the WILD | `wildlife-packages.ts` | `exploreWildData.ts` |

These pairs use **different field names, different price formats, and sometimes different values** for the same package. This is the single biggest issue for future dynamic conversion.

---

## 2. Popular Destinations — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/popular-destinations/index.tsx` |
| Homepage data | `frontend/src/data/popular-destinations.ts` |
| Listing page | `frontend/src/app/popular-destinations/page.tsx` |
| Listing data | `frontend/src/data/popularDestinationsData.ts` |
| Detail route | `frontend/src/app/popular-destinations/[slug]/page.tsx` → re-exports `packages/[slug]` |

### 2. Current Implementation

- Client component with a **bento-style grid carousel** showing **exactly 5 cards** at a time.
- Advances by 5 on prev/next or swipe.
- Uses `AnimatePresence` + Framer Motion for slide transitions.
- Section header + bento grid + stats bar below.

### 3. Static Data (Hardcoded)

**Section metadata (in component):**

- Title: `"Popular Destinations"`
- Subtitle: `"Handpicked experiences for every kind of traveller"`
- View-all link: `/popular-destinations`

**Per destination item (`popularDestinations` — 12 items):**

- `name` — card title
- `location` — actually price text, e.g. `"Starts at ₹28,999"`
- `duration` — e.g. `"6N / 7D"`
- `imageSrc` — local path, e.g. `"/images/destinations/spiti.jpg"`
- `href` — e.g. `"/packages/spiti-valley"`

**Grid layout (`popularDestinationsGridSlots` — fixed 5 slots):**

- Tailwind classes for column span, row span, height per slot position

**Stats (`popularStats` — 4 items):**

- `value` — e.g. `"2+"`, `"90+"`
- `label` — e.g. `"years of experience"`

### 4. Data Structure (Homepage)

```
destination {
  name: string
  location: string        // misnamed — holds price text
  duration: string
  imageSrc: string
  href: string
}

gridSlot {
  colSpan: string
  rowSpan: string
  height: string
}

stat {
  value: string
  label: string
}
```

Listing page uses `TravelPackage`:

```
TravelPackage {
  id, title, category, duration, price (number),
  pax, image, amenities[]
}
```

### 5. Reusable Components

- `Section`, `SectionHeader`, `ImageOverlayCard`, `CarouselButton`, `StatsCard`

### 6. Images/Media

- Local paths under `/images/destinations/`, `/images/india/`, `/images/hills/`, `/images/spiritual/`, `/images/international/`
- Served from `public/` (folder exists but is **empty in the repo** — images likely not committed)
- Rendered via `next/image` inside `ImageOverlayCard`

### 7. Links/Routes

| Context | Link Pattern | Example |
|---------|-------------|---------|
| Homepage card | `href` from data | `/packages/spiti-valley` |
| View all | hardcoded | `/popular-destinations` |
| Listing page card | `baseRoute + id` | `/popular-destinations/spiti-valley` |
| Detail page | slug lookup | Same UI via `packages/[slug]` |

### 8. Dynamic Potential

| Easy to Dynamic | Harder / Tightly Coupled |
|-----------------|---------------------------|
| Destination items (name, price text, duration, image, link) | Fixed 5-slot bento grid layout |
| Stats values/labels | Grid slot CSS classes (layout engine, not content) |
| Section title/subtitle | Carousel advance-by-5 logic assumes ≥5 items |
| | Duplicate data between homepage and listing files |

### 9. UI Preservation

- Keep `PopularDestinations` component unchanged.
- Replace imports from `popular-destinations.ts` with API-fetched data mapped to the same field names.
- Map API response: `name`, `location` (price display string), `duration`, `imageSrc`, `href`.
- Grid slots and stats can remain static in the component or become a separate CMS config later.
- **Do not change `ImageOverlayCard` props.**

### 10. Dependencies

- Depends on `ImageOverlayCard`, `StatsCard`, bento grid slot config
- Listing page depends on `PackageList`, `TravelPackage` type, `popularDestinationsData.ts`
- Detail pages depend on `packages.ts` → `getPackageBySlug()`
- Shares package slugs with `bestOfIndiaData`, `travelPackages`, etc.

---

## 3. Travel Your Way — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/travel-your-way/index.tsx` |
| Exported as | `ChooseYourJourney` |
| Homepage data | `frontend/src/data/journey-categories.ts` |
| Listing page | `frontend/src/app/travelyourway/page.tsx` |
| Listing data | `frontend/src/data/travelPackages.ts` |

### 2. Current Implementation

- Split layout: **left text block** + **right 2×2 grid** of category cards.
- Left side text is fully hardcoded in the component.
- Right side maps over 4 `journeyCategories`.
- Framer Motion scroll-in animations.

### 3. Static Data

**Hardcoded in component:**

- Eyebrow: `"CHOOSE YOUR JOURNEY"`
- Title: `"Travel Your Way"`
- Description paragraph
- Button: `"Explore all"` → `/travelyourway`

**Category cards (`journeyCategories` — 4 items):**

- `title` — display name
- `category` — filter value (note: `"Off Beat"` vs title `"Off-Beat"`)
- `image` — local path

### 4. Data Structure

```
journeyCategory {
  title: string
  category: string    // used in query param, must match travelPackages.category
  image: string
}
```

Listing uses `TravelPackage` with `travelCategories` filter array.

### 5. Reusable Components

- `Section`, `ImageOverlayCard` (overlayMode `"always"`), `Button`

### 6. Images/Media

- `/images/destinations/jaipur.jpg`, `spiti.jpg`, `ladakh.jpg`, `andaman.jpg`

### 7. Links/Routes

| Element | Destination |
|---------|-------------|
| Category card | `/travelyourway?category=Pocket%20Friendly` (etc.) |
| Explore all button | `/travelyourway` |
| Listing cards | `/travelyourway/pkg-1` etc. |

### 8. Dynamic Potential

| Easy | Harder |
|------|--------|
| Category cards (title, image, category slug) | Fixed 2×2 grid (expects exactly 4) |
| Left-side marketing copy (optional CMS) | Category string must match listing filter exactly |

### 9. UI Preservation

- Pass fetched categories into the existing `.map()` — same props to `ImageOverlayCard`.
- Preserve link format: `` `/travelyourway?category=${encodeURIComponent(category)}` ``.
- Card height classes stay hardcoded: `h-[150px] lg:h-[190px]`.

### 10. Dependencies

- `PackageList` on listing page reads `?category=` query param
- Category names in `journey-categories.ts` must match `travelPackages.ts` categories
- `FilterTabs` component for listing page filtering

---

## 4. Across Boundaries — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/across-boundaries/index.tsx` |
| Homepage data | `frontend/src/data/international-packages.ts` |
| Listing page | `frontend/src/app/across-boundaries/page.tsx` |
| Listing data | `frontend/src/data/acrossBoundariesData.ts` |

### 2. Current Implementation

- Generic `Carousel` component showing **3 cards** at a time.
- Spreads entire package object into `PackageCard`.
- Mobile-only "View all" button below carousel.

### 3. Static Data

**Section metadata (via SectionHeader):**

- Title: `"Across Boundaries"`
- Subtitle: `"International packages curated for best experiences"`
- View all: `/across-boundaries`

**Homepage items (`internationalPackages` — 5 items):**

- `title`, `image`, `price` (string `"₹5,999"`), `rating`, `reviews`, `location`, `duration`, `href`

**Listing items (`acrossBoundariesPackages` — 5 items, different prices!):**

- `TravelPackage` format with numeric `price` (e.g. `35999`)

### 4. Data Structure (Homepage)

```
internationalPackage {
  title: string
  image: string
  price: string          // pre-formatted with ₹
  rating: number         // in data but NOT rendered by PackageCard
  reviews: number        // in data but NOT rendered
  location: string       // uppercase country name
  duration: string
  href: string
}
```

### 5. Reusable Components

- `Section`, `SectionHeader`, `Carousel`, `PackageCard`, `Button`

### 6. Images/Media

- `/images/international/srilanka.jpg`, `nepal.jpg`, `maldives.jpg`, `dubai.jpg`, `bali.jpg`

### 7. Links/Routes

| Context | Link |
|---------|------|
| Homepage card | `/across-boundaries/intl-1` (from `href`) |
| Listing card | `/across-boundaries/intl-1` |
| View all | `/across-boundaries` |

### 8. Dynamic Potential

| Easy | Harder |
|------|--------|
| Package list (title, image, price, location, duration, href) | Price format mismatch (string vs number) between homepage and listing |
| | `rating`/`reviews` exist in data but are unused in UI |

### 9. UI Preservation

- Fetch data, map to same props passed to `PackageCard`.
- Keep `price` as pre-formatted string for homepage (component expects string).
- Keep `visibleCount={3}` unchanged.
- `{...pkg}` spread pattern can stay if API response matches prop names.

### 10. Dependencies

- `Carousel` generic component (shared with Spiritual & Explore Wild)
- `PackageCard` common component
- Price inconsistency between `international-packages.ts` (₹5,999) and `acrossBoundariesData.ts` (35999) — **data bug today**

---

## 5. Gateway to the Hills — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/gateway-to-hills/index.tsx` |
| Exported as | `GatewayToHills` |
| Homepage data | `frontend/src/data/hill-destinations.ts` |
| Listing page | `frontend/src/app/gateway-to-the-hills/page.tsx` |
| Listing data | `frontend/src/data/hillPackages.ts` |

### 2. Current Implementation

- Split layout: **left** (header + 2-column category grid) + **right** (large lifestyle hero image).
- 3 destination category cards in a 2×2 grid (one card is `featured`, spans wider).
- Right-side image is **fully hardcoded** (not from data file).

### 3. Static Data

**Section metadata (SectionHeader):**

- Title: `"Gateway to the Hills"`
- Subtitle: `"Escape to the serene and majestic mountains"`
- View all: `/gateway-to-the-hills`, label: `"Explore all"`

**Category cards (`hillDestinations` — 3 items):**

- `title`, `category`, `image`, `featured?` (boolean)

**Hardcoded in component (NOT in data):**

- Right hero image: `/hills/lifestyle.png`
- Alt text: `"Traveller experiencing freedom in the hills"`
- Animation: floating `motion.img`

### 4. Data Structure

```
hillDestination {
  title: string
  category: string       // filter param for listing page
  image: string
  featured?: boolean     // controls height: 180px vs 160px
}
```

### 5. Reusable Components

- `Section`, `SectionHeader`, `ImageOverlayCard`, `Button`

### 6. Images/Media

- Category cards: `/images/hills/himalayas.jpg`, `northeast.jpg`, `southern-hills.jpg`
- Hero: `/hills/lifestyle.png` (hardcoded, separate from data)

### 7. Links/Routes

| Element | Destination |
|---------|-------------|
| Category card | `/gateway-to-the-hills?category=Northern%20Himalayas` |
| View all | `/gateway-to-the-hills` |
| Listing cards | `/gateway-to-the-hills/hill-1` etc. |

### 8. Dynamic Potential

| Easy | Harder |
|------|--------|
| Category cards (title, image, category, featured flag) | Right-side lifestyle hero image (hardcoded) |
| | Fixed 3-item grid layout |
| | `featured` flag controls card height — must preserve boolean |

### 9. UI Preservation

- Map API data to `hillDestinations` shape.
- Keep hardcoded hero image in component (or add optional `sectionHeroImage` field later).
- Preserve `featured` → height class logic: `'h-[180px]'` vs `'h-[160px]'`.

### 10. Dependencies

- Category names must match `hillCategories` in `hillPackages.ts`
- Listing page uses `PackageList` with `variant="horizontal"` and `FilterTabs`
- Similar layout pattern to Travel Your Way

---

## 6. Best of India — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/best-of-india/index.tsx` |
| Homepage data | `frontend/src/data/best-of-india.ts` |
| Listing page | `frontend/src/app/best-of-india/page.tsx` |
| Listing data | `frontend/src/data/bestOfIndiaData.ts` |

### 2. Current Implementation

- **Nearly identical to Popular Destinations** — bento grid carousel, 5 visible slots, advance by 5.
- Uses `bestOfIndiaGridClasses` instead of structured slot objects.
- No stats bar.

### 3. Static Data

**Section metadata:**

- Title: `"Best of India"`
- Subtitle: `"Discover India's diverse landscapes and experiences"`
- View all: `/best-of-india`

**Homepage items (`bestOfIndiaDestinations` — 14 items):**

- `title`, `subtitle` (price text), `duration`, `image`, `href`

**Grid layout (`bestOfIndiaGridClasses` — 5 fixed Tailwind class strings)**

### 4. Data Structure

```
bestOfIndiaItem {
  title: string
  subtitle: string       // price text, e.g. "Starts at ₹18,999"
  duration: string
  image: string
  href: string
}
```

### 5. Reusable Components

- Same as Popular Destinations: `Section`, `SectionHeader`, `ImageOverlayCard`, `CarouselButton`
- **Does NOT use `StatsCard`**

### 6. Images/Media

- `/images/india/`, `/images/hills/`, `/images/spiritual/`, `/images/destinations/`

### 7. Links/Routes

| Context | Link |
|---------|------|
| Homepage card | `/packages/golden-triangle` |
| Listing card | `/best-of-india/golden-triangle` |

### 8. Dynamic Potential

Same as Popular Destinations — item data is easy; bento grid layout is fixed.

### 9. UI Preservation

- Map API response to `{ title, subtitle, duration, image, href }`.
- Keep 5-slot grid and carousel logic unchanged.
- `ImageOverlayCard` receives `subtitle` (price) and `description` (duration) — same as Popular Destinations but field names differ (`subtitle` vs `location`).

### 10. Dependencies

- Duplicate of Popular Destinations carousel pattern (copy-pasted logic)
- Shares package IDs with `popularDestinationsData.ts` (e.g. `"golden-triangle"`)
- Field naming inconsistency: Popular uses `name`/`location`/`imageSrc`; Best of India uses `title`/`subtitle`/`image`

---

## 7. Spiritual Destinations — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/spiritual-destinations/index.tsx` |
| Homepage data | `frontend/src/data/spiritual-packages.ts` |
| Listing page | `frontend/src/app/spiritual-destinations/page.tsx` |
| Listing data | `frontend/src/data/spiritualDestinationsData.ts` |

### 2. Current Implementation

- `Carousel` with `visibleCount={3}`.
- Manually passes specific props to `PackageCard` (does NOT spread full object).
- **`href` and `tag` from data are NOT passed to `PackageCard`.**
- Background: `bg-surface-alt`.

### 3. Static Data

**Section metadata:**

- Title: `"Spiritual Destinations"`
- Subtitle: `"Sacred journeys and soulful experiences across India"`
- View all: `/spiritual-destinations`

**Homepage items (`spiritualPackages` — 9 items):**

- `title`, `location`, `image`, `price` (string), `tag`, `href`
- Only `title`, `image`, `price`, `location` are passed to component
- `tag` is in data but **not rendered** (PackageCard accepts `tag` prop but never uses it)

### 4. Data Structure

```
spiritualPackage {
  title: string
  location: string       // e.g. "Uttarakhand, India"
  image: string
  price: string          // pre-formatted "₹28,999"
  tag: string            // e.g. "Pilgrimage" — NOT rendered
  href: string           // NOT passed to PackageCard
}
```

### 5. Reusable Components

- `Section`, `SectionHeader`, `Carousel`, `PackageCard`, `Button`

### 6. Images/Media

- `/images/spiritual/chardham.jpg`, `kedarnath.jpg`, `varanasi.jpg`
- Some cards reuse wrong images (e.g. Gujarat package uses `rajasthan.jpg`)

### 7. Links/Routes

| Context | Link |
|---------|------|
| Homepage card | Auto-generated from title: `/packages/char-dham-yatra` |
| Data has | `href: "/packages/char-dham-yatra"` (ignored) |
| Listing card | `/spiritual-destinations/char-dham-yatra` |

### 8. Dynamic Potential

| Easy | Harder |
|------|--------|
| Package items | Must explicitly pass `href` (currently missing) |
| | `tag` field exists but unused — dead data |
| | Price format: string on homepage, number on listing |

### 9. UI Preservation

- Map API data and pass same 4 props: `title`, `image`, `price`, `location`.
- Consider also passing `href` (currently broken — uses auto-generated slug).
- Do not add tag display unless UI change is intended.

### 10. Dependencies

- Same carousel pattern as Across Boundaries and Explore Wild
- `spiritualCategories` on listing page: `["All Spiritual", "Pilgrimage", "Temple Tours", "Retreats"]`
- Category filter on listing page uses loose matching (`category === activeCategory || title.includes`)

---

## 8. Explore the WILD — Analysis

### 1. Exact File Path(s)

| Role | Path |
|------|------|
| Homepage section | `frontend/src/components/sections/home/explore-wild-india/index.tsx` |
| Exported as | `ExploreWildIndia` |
| Homepage data | `frontend/src/data/wildlife-packages.ts` |
| Listing page | `frontend/src/app/explore-wild-india/page.tsx` |
| Listing data | `frontend/src/data/exploreWildData.ts` |

### 2. Current Implementation

- `Carousel` with `visibleCount={3}`.
- **Custom header** (not `SectionHeader`) — title has inline styled `"WILD"` span.
- Explicitly passes 9 props to `PackageCard`.
- Sets `accentColor="var(--color-primary)"` and `priceSuffix="/person"`.

### 3. Static Data

**Section metadata (hardcoded custom header):**

- Title: `"Explore the WILD"` (with styled span)
- Subtitle: `"Handpicked wildlife experiences for every kind of traveller"`
- View all: `/explore-wild-india`

**Homepage items (`wildlifePackages` — 6 items):**

- `title`, `location`, `duration`, `category`, `price`, `rating`, `reviews`, `image`, `href`
- `rating` and `reviews` passed to `PackageCard` but **NOT rendered**

### 4. Data Structure

```
wildlifePackage {
  title: string
  location: string       // uppercase, e.g. "JAWAI"
  duration: string
  category: string       // e.g. "Wildlife Safari" — rendered as Chip
  price: string
  rating: number         // NOT rendered
  reviews: number        // NOT rendered
  image: string
  href: string
}
```

### 5. Reusable Components

- `Section`, `Carousel`, `PackageCard`, `Button`
- Uses `Chip` component indirectly via `PackageCard` when both `duration` and `category` are present

### 6. Images/Media

- `/images/wildlife/leopard.jpg`, `rhino.jpg`, `tiger.jpg`

### 7. Links/Routes

| Context | Link |
|---------|------|
| Homepage card | `/packages/leopard-land-jawai` (from `href`) |
| Listing card | `/explore-wild-india/leopard-land-jawai` |

### 8. Dynamic Potential

| Easy | Harder |
|------|--------|
| All displayed fields | Custom header layout (not using SectionHeader) |
| | `rating`/`reviews` in data but unused |
| | Category chips require both `duration` AND `category` |

### 9. UI Preservation

- Pass same 9 props to `PackageCard`.
- Keep custom header JSX unchanged.
- Preserve `priceSuffix="/person"` and `accentColor`.

### 10. Dependencies

- Most feature-rich `PackageCard` usage (duration + category chips)
- `wildlifeCategories` on listing: `["All Wildlife", "Tiger Safari", "Nature Walks", "Bird Watching"]`
- Category mismatch: homepage uses `"Wildlife Safari"`, listing uses `"Tiger Safari"`

---

## 9. Common Patterns Across All Sections

### Structural Groups

**Group A — Bento Carousel (2 sections):**

- Popular Destinations, Best of India
- Fixed 5-slot grid, carousel advances by 5
- Uses `ImageOverlayCard` with `overlayMode="hover"`
- Shows title + price + duration on hover
- Copy-pasted carousel logic (~identical code)

**Group B — Split Layout with Category Cards (2 sections):**

- Travel Your Way, Gateway to the Hills
- Left: marketing text; Right/top: `ImageOverlayCard` grid with `overlayMode="always"`
- Category cards link to listing page with `?category=` filter

**Group C — Package Carousel (3 sections):**

- Across Boundaries, Spiritual Destinations, Explore the WILD
- Uses shared `Carousel` component with `visibleCount={3}`
- Uses `PackageCard` from `components/common/`
- Mobile "View all" button

### Shared Card Components

| Component | Used By |
|-----------|---------|
| `ImageOverlayCard` | Popular Destinations, Travel Your Way, Gateway to the Hills, Best of India |
| `PackageCard` (common) | Across Boundaries, Spiritual, Explore Wild, all listing pages |
| `Carousel` | Across Boundaries, Spiritual, Explore Wild |
| `SectionHeader` | All except Explore Wild (custom header) and Travel Your Way (inline header) |

### Data Patterns

| Pattern | Sections |
|---------|----------|
| Homepage lightweight array + listing `TravelPackage[]` | All 7 |
| Price as display string (homepage) vs number (listing) | All carousel sections |
| Category string for filtering | Travel Your Way, Gateway to the Hills, all listing pages |
| Pre-built `href` link | Most sections (except Spiritual homepage) |

### Could Share One Common Data Model?

**Partially yes.** A unified `TourPackage` entity could serve all sections with:

- Core fields: `id`, `slug`, `title`, `image`, `price`, `duration`, `category`
- Section assignment: which homepage section(s) a package appears in
- Display order per section
- Optional: `featured`, `location`, `tag`

**But separate display configs needed for:**

- Bento grid slot positions (Popular Destinations, Best of India)
- Section-specific marketing copy
- Gateway to the Hills lifestyle hero image
- Explore Wild custom header styling

### Duplicated Code

1. **Carousel logic** — Popular Destinations and Best of India have nearly identical ~80 lines
2. **Data duplication** — every section has 2 data files with overlapping content
3. **Two `PackageCard` components** with the same name in different folders
4. **All `[slug]/page.tsx` files** are identical one-line re-exports

### Components to Preserve Unchanged

- `ImageOverlayCard`, `PackageCard` (common), `Carousel`, `Section`, `SectionHeader`, `StatsCard`, `PackageList`, `FilterTabs`, `HeroBanner`

---

## 10. Required Future Data Structure

Based strictly on what the frontend currently consumes:

### A. Package / Destination Item (Core — Used by All Sections)

| Field | Type | Used By |
|-------|------|---------|
| `id` | string | Listing pages, detail lookup |
| `slug` | string | URL routing, `getPackageBySlug()` |
| `title` | string | All cards |
| `image` | string (URL/path) | All cards |
| `price` | number | Listing pages, detail page |
| `priceDisplay` | string | Homepage cards (e.g. `"Starts at ₹28,999"` or `"₹28,999"`) |
| `duration` | string | Homepage bento cards, PackageCard, detail page |
| `category` | string | Listing page filters |
| `location` | string | PackageCard location row |
| `href` | string | Card click destination |

### B. Section Membership (Which Packages Appear Where)

| Field | Type | Used By |
|-------|------|---------|
| `section` | enum/string | One of 7 section identifiers |
| `displayOrder` | number | Carousel/grid ordering |
| `isFeatured` | boolean | Gateway to the Hills card height |

### C. Section-Level Config (Optional but Used Today)

| Field | Type | Used By |
|-------|------|---------|
| `sectionTitle` | string | SectionHeader |
| `sectionSubtitle` | string | SectionHeader |
| `viewAllHref` | string | SectionHeader link |

### D. Popular Destinations Stats (Unique to That Section)

| Field | Type |
|-------|------|
| `value` | string (e.g. `"90+"`) |
| `label` | string |

### E. Travel Your Way / Gateway Category Cards (Subset of Packages)

| Field | Type |
|-------|------|
| `title` | string |
| `category` | string (must match filter) |
| `image` | string |

### F. Package Detail Page (Full `Package` Type — Already Defined)

| Field | Type |
|-------|------|
| `id`, `slug`, `title`, `subtitle` | string |
| `startingPrice` | number |
| `duration.nights`, `duration.days` | number |
| `destinations` | string[] |
| `heroImages`, `gallery` | string[] |
| `overview` | string |
| `itinerary` | ItineraryDay[] |
| `sightseeing`, `inclusions`, `exclusions`, `highlights` | string[] |
| `faqs` | FAQ[] |

---

## 11. Optional Future Data Fields

Fields present in data files but **NOT rendered** by current UI:

| Field | Present In | Rendered? |
|-------|-----------|-----------|
| `rating` | international-packages, wildlife-packages | No |
| `reviews` | international-packages, wildlife-packages | No |
| `tag` | spiritual-packages | No (prop exists, unused) |
| `pax` | TravelPackage (listing) | No on cards |
| `amenities` | TravelPackage (listing) | Only on horizontal card variant |
| `active/inactive` | Not present | Would be useful for admin |
| `featured` (global) | Not present | Only used in Gateway section |
| `metaDescription` | Not present | Would help SEO on detail pages |

---

## 12. Minimum Frontend Changes Required Later

The goal: **swap data source only, zero UI changes.**

### Per Section — What Changes

```
CURRENT:
  import { popularDestinations } from '@/data/popular-destinations'
  → component renders cards

FUTURE:
  const popularDestinations = await fetchPopularDestinations()
  → same component, same props, same UI
```

### Specific Swap Points

| File | Current Import | Future Replacement |
|------|---------------|-------------------|
| `popular-destinations/index.tsx` | `@/data/popular-destinations` | API fetch or server-side data loader |
| `travel-your-way/index.tsx` | `@/data/journey-categories` | API fetch |
| `across-boundaries/index.tsx` | `@/data/international-packages` | API fetch |
| `gateway-to-hills/index.tsx` | `@/data/hill-destinations` | API fetch |
| `best-of-india/index.tsx` | `@/data/best-of-india` | API fetch |
| `spiritual-destinations/index.tsx` | `@/data/spiritual-packages` | API fetch |
| `explore-wild-india/index.tsx` | `@/data/wildlife-packages` | API fetch |
| Each listing `page.tsx` | `@/data/*Data.ts` | API fetch (server component) |
| `packages.ts` → `getPackageBySlug()` | Static array lookup | API call by slug |

### Recommended Approach (Minimal UI Impact)

1. Create a **data access layer** (`lib/api/` or `services/`) that returns the exact shapes components already expect.
2. Homepage sections become async server components wrapping existing client components, OR fetch in client with same prop interface.
3. Add a **mapper function** per section to transform API response → existing prop shape.
4. **Do not rename props** on `ImageOverlayCard`, `PackageCard`, or `Carousel`.
5. Listing pages already use server components — easiest to add `fetch()` there first.
6. Consolidate duplicate data files into single API source before touching components.

### What Stays Unchanged

- All component files in `components/`
- All CSS/Tailwind classes
- Grid slot configs (`popularDestinationsGridSlots`, `bestOfIndiaGridClasses`)
- Carousel `visibleCount`, animation logic
- Hardcoded marketing copy (unless CMS desired later)
- Gateway lifestyle hero image path

---

## 13. Risks / Problems to Watch

### Critical Risks

| Risk | Detail | Impact |
|------|--------|--------|
| **Duplicate data sources** | 14 data files for 7 sections; same packages defined twice with different values | Backend must be single source of truth; frontend mapper must unify |
| **Price inconsistency** | Homepage `"₹5,999"` vs listing `35999` for same package (Across Boundaries) | Must decide canonical price format |
| **Field naming mismatch** | Popular uses `name`/`location`/`imageSrc`; Best of India uses `title`/`subtitle`/`image` | Mapper layer required per section |
| **Missing href on Spiritual homepage** | `href` in data but not passed to `PackageCard` | Links auto-generated from title — may break with API titles |
| **Empty public folder** | All images referenced as `/images/...` but not in repo | Backend needs image URL management; missing images will break cards |
| **Fixed 5-slot bento grid** | Popular & Best of India always show exactly 5 | Fewer than 5 API items = empty slots; need fallback or min-count logic |
| **Carousel advance-by-5** | `(prev + 5) % length` | Works with any count ≥5, but UX odd if count not divisible by 5 |
| **Fixed 4-item grid** | Travel Your Way expects exactly 4 categories | Adding/removing categories breaks 2×2 layout |
| **Fixed 3-item grid** | Gateway to the Hills has 3 cards + featured flag | Adding a 4th card breaks layout |
| **Category string matching** | Filter uses exact string match + loose title match | API categories must match filter tab labels exactly |
| **No empty state on homepage** | `EmptyState` only on listing pages | Zero API results on homepage = blank/broken grid |
| **No image fallback** | `next/image` with no `onError` handler | Broken image URL = broken card |
| **`getPackageBySlug` fallback** | Generates fake itinerary from `TravelPackage` if no full detail exists | Most packages show placeholder content on detail page |
| **Client component data fetching** | 7 homepage sections are `'use client'` | Fetching in client = loading states needed (currently none) |
| **Two PackageCard components** | Same name, different interfaces | Risk of importing wrong one during refactor |

### Moderate Risks

| Risk | Detail |
|------|--------|
| Long titles | No truncation on `ImageOverlayCard` — long API titles may overflow |
| Text length | Price/duration strings assumed short |
| `location` field misuse | Popular Destinations uses `location` for price text — confusing for API mapping |
| Unused props | `rating`, `reviews`, `tag` in data but not rendered — may confuse admin panel design |
| Slug re-export pattern | All section slugs resolve via same `getPackageBySlug` — slug collisions across sections possible |

---

## 14. Recommended Future Architecture

### Backend Type

A **simple REST or GraphQL API** with a **relational database** (PostgreSQL/MySQL) fits best. No need for a headless CMS initially — a basic admin panel CRUD is sufficient.

### Recommended Data Model

```
┌─────────────────────────────────┐
│          sections               │
│  id, slug, title, subtitle,     │
│  view_all_path, display_type,   │
│  hero_image, sort_order         │
└──────────┬──────────────────────┘
           │ M:N
┌──────────▼──────────────────────┐
│     section_packages            │
│  section_id, package_id,        │
│  display_order, is_featured,    │
│  grid_slot_index (nullable)     │
└──────────┬──────────────────────┘
           │
┌──────────▼──────────────────────┐
│          packages               │
│  id, slug, title, subtitle,     │
│  price, duration_nights,        │
│  duration_days, location,         │
│  category, image_url,           │
│  tag, is_active                 │
└──────────┬──────────────────────┘
           │ 1:1 or 1:N
┌──────────▼──────────────────────┐
│     package_details             │
│  overview, itinerary (JSON),    │
│  inclusions, exclusions,        │
│  highlights, faqs, gallery[]    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│     section_stats               │
│  section_id, value, label,      │
│  sort_order                     │
└─────────────────────────────────┘
         (Popular Destinations only)

┌─────────────────────────────────┐
│     journey_categories          │
│  id, title, category_slug,      │
│  image_url, sort_order          │
└─────────────────────────────────┘
         (Travel Your Way only)
```

### One Model or Multiple?

- **One `packages` table** for all tour packages (recommended).
- **One `sections` table** for the 7 homepage sections.
- **Junction table** `section_packages` controls which packages appear in which section and in what order.
- **Separate `journey_categories`** for Travel Your Way (these are filters, not packages).
- **Separate `section_stats`** for Popular Destinations stats bar.
- **Grid slot layout stays in frontend code** (not in database) — it's pure CSS.

### How Sections Connect to Backend

| Section | API Endpoint (Suggested) | Returns |
|---------|-------------------------|---------|
| Popular Destinations | `GET /api/sections/popular-destinations` | `{ items[], stats[] }` |
| Travel Your Way | `GET /api/sections/travel-your-way` | `{ categories[] }` |
| Across Boundaries | `GET /api/sections/across-boundaries` | `{ packages[] }` |
| Gateway to the Hills | `GET /api/sections/gateway-to-the-hills` | `{ categories[] }` |
| Best of India | `GET /api/sections/best-of-india` | `{ items[] }` |
| Spiritual | `GET /api/sections/spiritual-destinations` | `{ packages[] }` |
| Explore Wild | `GET /api/sections/explore-wild-india` | `{ packages[] }` |
| Any listing page | `GET /api/sections/{slug}/packages?category=` | `{ packages[], categories[] }` |
| Package detail | `GET /api/packages/{slug}` | Full `Package` object |

Each endpoint response should be **mapped server-side** to the exact prop shape each component expects today.

### What Remains Unchanged

- All React components
- All Tailwind/CSS
- Grid slot configs
- Carousel logic and animation
- Layout structure
- Route structure
- `ImageOverlayCard`, `PackageCard`, `Carousel` interfaces

---

## 15. Recommended Implementation Order

### Phase 0 — Foundation (Before Any Section)

1. **Unify duplicate data files** — merge homepage + listing data pairs into single source
2. **Create data access layer** with mapper functions per section
3. **Set up image storage** (CDN or `/public` upload pipeline)
4. **Build backend API** with `packages`, `sections`, `section_packages` tables
5. **Build admin panel** for CRUD on packages and section assignments

### Phase 1 — Simplest Sections First

| Order | Section | Why First |
|-------|---------|-----------|
| **1** | **Travel Your Way** | Simplest: 4 fixed category cards, no carousel, clear category → filter link. Lowest risk. |
| **2** | **Gateway to the Hills** | Similar to #1: 3 category cards + 1 hardcoded hero. Small data set. |
| **3** | **Across Boundaries** | Standard carousel + PackageCard. Establishes the carousel API pattern for remaining sections. |

### Phase 2 — Carousel Sections

| Order | Section | Why |
|-------|---------|-----|
| **4** | **Spiritual Destinations** | Same carousel pattern as #3. Fix missing `href` pass while converting. |
| **5** | **Explore the WILD** | Richest PackageCard usage (duration + category chips). Validates all PackageCard props. |

### Phase 3 — Complex Bento Sections

| Order | Section | Why Last |
|-------|---------|----------|
| **6** | **Best of India** | Bento grid carousel. Field naming differs from Popular Destinations. |
| **7** | **Popular Destinations** | Most complex: bento grid + stats bar + most items (12). Also has the duplicate data inconsistency to resolve. |

### Phase 4 — Detail Pages & Listing Pages

- Convert listing pages to API (can happen in parallel with Phase 1–3 since they use `TravelPackage` format)
- Convert `getPackageBySlug()` to API call
- Populate full package details (itinerary, FAQs, etc.) via admin panel

### Why This Order?

1. **Lowest risk first** — category card sections have no carousel edge cases
2. **Pattern reuse** — carousel pattern proven on section 3 before applying to 4–5
3. **Most complex last** — bento grids have fixed slot counts and duplicated carousel code
4. **Popular Destinations last** — has the most data inconsistencies and the unique stats bar
5. **Each phase validates the mapper layer** before moving to harder sections

---

*Generated from static frontend inspection. No files were modified during analysis.*
