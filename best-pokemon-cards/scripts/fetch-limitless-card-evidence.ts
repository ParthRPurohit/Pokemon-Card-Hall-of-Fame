import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type LimitlessEvidenceFile = {
  searchedCardName: string;
  searchedSlug: string;
  fetchedAt: string;
  status:
    | "placeholder-needs-endpoint-confirmation"
    | "fetched"
    | "not-found";
  note: string;
  decklistAppearances: number | null;
  highestPlacement: string | null;
  eventCount: number | null;
  copiesPlayed: number | null;
  sourceUrls: string[];
};

function slugifyCardName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const searchedCardName = process.argv.slice(2).join(" ").trim();

  if (!searchedCardName) {
    throw new Error(
      'Please provide a card name. Example: npm run fetch:limitless-evidence -- "Radiant Charizard"',
    );
  }

  const searchedSlug = slugifyCardName(searchedCardName);
  const outputDir = path.join(process.cwd(), "data", "limitless-evidence");
  const outputFile = path.join(outputDir, `${searchedSlug}.json`);

  await mkdir(outputDir, { recursive: true });

  const placeholder: LimitlessEvidenceFile = {
    searchedCardName,
    searchedSlug,
    fetchedAt: new Date().toISOString(),
    status: "placeholder-needs-endpoint-confirmation",
    note: "Limitless integration is scaffolded, but a reliable no-key card-evidence endpoint still needs confirmation before automated imports should be treated as real competitive evidence.",
    decklistAppearances: null,
    highestPlacement: null,
    eventCount: null,
    copiesPlayed: null,
    sourceUrls: ["https://docs.limitlesstcg.com/developer.html"],
  };

  await writeFile(outputFile, `${JSON.stringify(placeholder, null, 2)}\n`, "utf8");

  console.log(
    `Saved Limitless evidence scaffold for ${searchedCardName} to ${path.relative(process.cwd(), outputFile)}`,
  );
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown error occurred";
  console.error(message);
  process.exitCode = 1;
});
