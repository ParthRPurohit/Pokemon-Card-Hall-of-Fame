# Best Pokemon Cards

This Next.js app is the first MVP for **Best Pokemon Cards**, a simple site that highlights the best competitively relevant Pokemon card for each Gen 1 Pokemon.

The current seed dataset is local-only and includes 10 sample Kanto Pokemon:

- Charizard
- Blastoise
- Venusaur
- Pikachu
- Mewtwo
- Mew
- Clefairy
- Gengar
- Alakazam
- Snorlax

## Run Locally

From the repo root:

```bash
cd best-pokemon-cards
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available Scripts

Run these from the `best-pokemon-cards/` subdirectory:

```bash
npm run lint
npm run dev
npm run build
npm run start
npm run fetch:candidates -- Charizard
```

## Project Notes

- App framework: Next.js App Router
- Data source: local seed file in `src/lib/data/gen-one-cards.ts`
- Current scope: 10 sample Gen 1 Pokemon
- Future-ready model: structured so the dataset can expand to all 151 later without introducing a database yet

## Deploy to Vercel

When creating the Vercel project for this repo:

1. Import the Git repository into Vercel.
2. Set the **Root Directory** to `best-pokemon-cards`.
3. Keep the default Next.js build settings unless you intentionally customize them.
4. Deploy.

Vercel will then run the app from the correct subdirectory instead of the repo root.

## MVP Features

- Searchable homepage grid
- Detail pages at `/pokemon/[slug]`
- Card image, set, number, short reason, and confidence label
- Expanded explanation plus evidence and external links on each detail page
- Local seed data only for now

## Candidate Fetcher

Use the candidate fetcher to pull all matching Pokemon card candidates for a given Pokemon name from the Pokemon TCG API v2:

```bash
npm run fetch:candidates -- Charizard
```

What it does:

- Searches the Pokemon TCG API cards endpoint for Pokemon cards whose name contains the provided Pokemon name
- Saves a trimmed JSON payload for manual review
- Preserves the curated best-card seed data already used by the app

Output location:

- `data/candidates/[pokemon-slug].json`

Example output files:

- `data/candidates/charizard.json`
- `data/candidates/gengar.json`

## Next Expansion Ideas

- Expand from 10 sample entries to all 151 Gen 1 Pokemon
- Replace local seed data with a database when curation needs editing workflows
- Add richer competitive evidence and source normalization per Pokemon

## Tech Reference

- [Next.js documentation](https://nextjs.org/docs)
- [Vercel deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
