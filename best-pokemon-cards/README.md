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
npm run fetch:limitless-evidence -- "Radiant Charizard"
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

## Review Dashboard

Use the local review dashboard to compare the current seeded best-card choice against any fetched API candidates:

1. Run the app locally from `best-pokemon-cards/`.
2. Open `http://localhost:3000/review`.
3. Start in `Best representative only` mode to see the single top-ranked candidate per Pokemon.
4. Switch to `Functional groups` to inspect one candidate per grouped card text, or `All printings` to inspect every raw printing.
5. Use the duplicate-family toggle, filters, and evidence-first ranking details to narrow the shortlist faster.

How it fits the manual curation workflow:

1. Keep the curated public selections in `src/lib/data/gen-one-cards.ts`.
2. Fetch raw candidate pools with `npm run fetch:candidates -- <PokemonName>`.
3. Open `/review` to inspect the current pick beside grouped candidates derived from `data/candidates/[pokemon-slug].json`.
4. Let functional grouping collapse duplicate printings and near-duplicate families into one review unit by default.
5. Use competitive evidence and manual evidence first, with text heuristics only as a fallback.
6. Use `All printings` only when you need to inspect every promo, reprint, or alternate-art variant.
7. Manually update the seed file when you decide a better competitive card should replace the current selection.

Current limitation:

- Review actions like "Mark as selected" and "Reject" are visible but disabled. Persistence coming later.
- Candidate rankings are still review aids, not final competitive judgments.
- Manual score tweaks can still be added in `data/candidate-overrides.json`, but new curation signals should usually go in `data/competitive-evidence.json`.
- Competitive evidence can be curated in `data/competitive-evidence.json` by exact card id, normalized card name, normalized `pokemon|card name`, or group id.

## Limitless Evidence Scaffold

Use the scaffold command when you want to start tracking a future Limitless-backed evidence file for a card:

```bash
npm run fetch:limitless-evidence -- "Radiant Charizard"
```

Output location:

- `data/limitless-evidence/[card-slug].json`

Current behavior:

- Creates a structured placeholder JSON file for future decklist/tournament evidence import
- Includes TODO fields such as `decklistAppearances`, `highestPlacement`, `eventCount`, `copiesPlayed`, and `sourceUrls`
- Avoids scraping random websites until a reliable no-key Limitless card-evidence endpoint is confirmed

## Next Expansion Ideas

- Expand from 10 sample entries to all 151 Gen 1 Pokemon
- Replace local seed data with a database when curation needs editing workflows
- Add richer competitive evidence and source normalization per Pokemon

## Tech Reference

- [Next.js documentation](https://nextjs.org/docs)
- [Vercel deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
