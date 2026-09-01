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

## API Integration (Phase 5)

The frontend reads section data from the Laravel API at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`).

| Layer | Path | Purpose |
|-------|------|---------|
| Config | `src/lib/api/config.ts` | Resolves API base URL from env |
| Client | `src/lib/api/client.ts` | `apiGet()` with envelope parsing |
| Types | `src/lib/api/types.ts` | Typed API response models |
| Sections | `src/lib/api/sections.ts` | Section fetch helpers |
| Mappers | `src/lib/mappers/` | API → existing component prop shapes |

**Currently dynamic:** Travel Your Way homepage section (`ChooseYourJourney`) — server-fetched on the homepage via `GET /api/sections/travel-your-way`, categories mapped to the existing `JourneyCategory` card shape (`title`, `category` ← `filter_value`, `image`). Card links remain `/travelyourway?category={filter_value}`.

If the API is unavailable at build or request time, the section falls back to `src/data/journey-categories.ts` so the UI stays unchanged.

**Not yet dynamic:** `/travelyourway` listing page and all other homepage sections still use static data files.

Responses are cached for 5 minutes (`revalidate: 300`) via Next.js fetch.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# sunbird-vacations-website" 
