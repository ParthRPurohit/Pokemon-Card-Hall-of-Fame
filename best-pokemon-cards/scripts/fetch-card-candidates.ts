import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type PokemonTcgApiCard = {
  id: string;
  name: string;
  hp?: string;
  number: string;
  rarity?: string;
  nationalPokedexNumbers?: number[];
  legalities?: Record<string, string>;
  weaknesses?: Array<{
    type: string;
    value: string;
  }>;
  resistances?: Array<{
    type: string;
    value: string;
  }>;
  retreatCost?: string[];
  convertedRetreatCost?: number;
  rules?: string[];
  abilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;
  attacks?: Array<{
    name: string;
    cost?: string[];
    convertedEnergyCost?: number;
    damage?: string;
    text?: string;
  }>;
  images: {
    small: string;
    large: string;
  };
  set: {
    name: string;
    series: string;
    releaseDate: string;
  };
  tcgplayer?: {
    url?: string;
  };
};

type PokemonTcgApiResponse = {
  data: PokemonTcgApiCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
};

type SavedCandidateCard = {
  id: string;
  name: string;
  hp: string | null;
  set: {
    name: string;
    series: string;
    releaseDate: string;
  };
  number: string;
  rarity: string | null;
  images: {
    small: string;
    large: string;
  };
  tcgplayer: {
    url: string | null;
  };
  legalities: Record<string, string> | null;
  weaknesses: PokemonTcgApiCard["weaknesses"] | null;
  resistances: PokemonTcgApiCard["resistances"] | null;
  retreatCost: string[] | null;
  convertedRetreatCost: number | null;
  abilities: PokemonTcgApiCard["abilities"] | null;
  attacks: PokemonTcgApiCard["attacks"] | null;
  rules: string[] | null;
  nationalPokedexNumbers: number[] | null;
};

const API_BASE_URL = "https://api.pokemontcg.io/v2/cards";
const PAGE_SIZE = 250;

function slugifyPokemonName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildQuery(pokemonName: string) {
  const escapedName = pokemonName.replace(/(["\\])/g, "\\$1");
  return `supertype:"Pokémon" AND name:"*${escapedName}*"`;
}

function mapCard(card: PokemonTcgApiCard): SavedCandidateCard {
  return {
    id: card.id,
    name: card.name,
    hp: card.hp ?? null,
    set: {
      name: card.set.name,
      series: card.set.series,
      releaseDate: card.set.releaseDate,
    },
    number: card.number,
    rarity: card.rarity ?? null,
    images: {
      small: card.images.small,
      large: card.images.large,
    },
    tcgplayer: {
      url: card.tcgplayer?.url ?? null,
    },
    legalities: card.legalities ?? null,
    weaknesses: card.weaknesses ?? null,
    resistances: card.resistances ?? null,
    retreatCost: card.retreatCost ?? null,
    convertedRetreatCost: card.convertedRetreatCost ?? null,
    abilities: card.abilities ?? null,
    attacks: card.attacks ?? null,
    rules: card.rules ?? null,
    nationalPokedexNumbers: card.nationalPokedexNumbers ?? null,
  };
}

async function fetchAllCandidates(pokemonName: string) {
  const query = buildQuery(pokemonName);
  const candidates: SavedCandidateCard[] = [];
  let page = 1;
  let totalCount = 0;

  while (true) {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      pageSize: String(PAGE_SIZE),
      orderBy: "name,set.releaseDate,number",
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(
        `Pokemon TCG API request failed (${response.status} ${response.statusText}): ${responseBody}`,
      );
    }

    const payload = (await response.json()) as PokemonTcgApiResponse;
    totalCount = payload.totalCount;
    candidates.push(...payload.data.map(mapCard));

    if (payload.page * payload.pageSize >= payload.totalCount) {
      break;
    }

    page += 1;
  }

  return {
    query,
    totalCount,
    cards: candidates,
  };
}

async function main() {
  const pokemonName = process.argv.slice(2).join(" ").trim();

  if (!pokemonName) {
    throw new Error(
      "Please provide a Pokemon name. Example: npm run fetch:candidates -- Charizard",
    );
  }

  const slug = slugifyPokemonName(pokemonName);
  const outputDir = path.join(process.cwd(), "data", "candidates");
  const outputFile = path.join(outputDir, `${slug}.json`);

  await mkdir(outputDir, { recursive: true });

  const result = await fetchAllCandidates(pokemonName);
  const output = {
    pokemonName,
    slug,
    fetchedAt: new Date().toISOString(),
    query: result.query,
    totalCount: result.totalCount,
    cards: result.cards,
  };

  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(
    `Saved ${result.cards.length} candidate cards for ${pokemonName} to ${path.relative(process.cwd(), outputFile)}`,
  );
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown error occurred";
  console.error(message);
  process.exitCode = 1;
});
