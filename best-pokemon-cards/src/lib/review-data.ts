import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  type CompetitiveEvidenceFile,
  type LimitlessEvidenceFile,
  scoreCandidateGroup,
  sortCandidateGroupsByScore,
} from "@/lib/candidate-scoring";
import {
  groupFunctionalCardCandidates,
  normalizeReviewText,
} from "@/lib/card-grouping";
import { genOneCompetitiveCards } from "@/lib/data/gen-one-cards";
import type {
  CandidateCardFile,
  CandidateScoreOverrideMap,
  ReviewEntry,
} from "@/lib/types";

async function readCandidateFile(slug: string) {
  const candidateFilePath = path.join(
    process.cwd(),
    "data",
    "candidates",
    `${slug}.json`,
  );

  try {
    const fileContents = await readFile(candidateFilePath, "utf8");
    return JSON.parse(fileContents) as CandidateCardFile;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

async function readCandidateOverrides() {
  const overridesPath = path.join(
    process.cwd(),
    "data",
    "candidate-overrides.json",
  );

  try {
    const fileContents = await readFile(overridesPath, "utf8");
    return JSON.parse(fileContents) as CandidateScoreOverrideMap;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return {};
    }

    throw error;
  }
}

async function readCompetitiveEvidence() {
  const evidencePath = path.join(
    process.cwd(),
    "data",
    "competitive-evidence.json",
  );

  try {
    const fileContents = await readFile(evidencePath, "utf8");
    return JSON.parse(fileContents) as CompetitiveEvidenceFile;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return {};
    }

    throw error;
  }
}

async function readLimitlessEvidenceIndex() {
  const evidenceDir = path.join(process.cwd(), "data", "limitless-evidence");

  try {
    const filenames = await readdir(evidenceDir);
    const evidenceEntries = await Promise.all(
      filenames
        .filter((filename) => filename.endsWith(".json"))
        .map(async (filename) => {
          const filePath = path.join(evidenceDir, filename);
          const fileContents = await readFile(filePath, "utf8");
          const parsed = JSON.parse(fileContents) as LimitlessEvidenceFile;

          return [normalizeReviewText(parsed.searchedCardName), parsed] as const;
        }),
    );

    return new Map(evidenceEntries);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return new Map<string, LimitlessEvidenceFile>();
    }

    throw error;
  }
}

export async function getReviewEntries(): Promise<ReviewEntry[]> {
  const [overrides, competitiveEvidence, limitlessEvidenceIndex] = await Promise.all([
    readCandidateOverrides(),
    readCompetitiveEvidence(),
    readLimitlessEvidenceIndex(),
  ]);

  return Promise.all(
    genOneCompetitiveCards.map(async (pokemon) => {
      const candidateFile = await readCandidateFile(pokemon.slug);
      const groupedCandidates = sortCandidateGroupsByScore(
        groupFunctionalCardCandidates(candidateFile?.cards ?? [], pokemon).map(
          (group) =>
            scoreCandidateGroup(
              group,
              pokemon.slug,
              competitiveEvidence,
              overrides,
              limitlessEvidenceIndex.get(
                normalizeReviewText(group.representativeCard.name),
              ) ?? null,
            ),
        ),
      );

      const topGroupByFamily = new Map<string, string>();
      for (const group of groupedCandidates) {
        if (!topGroupByFamily.has(group.cardFamilyGroupId)) {
          topGroupByFamily.set(group.cardFamilyGroupId, group.groupId);
        }
      }

      const groupedCandidatesWithFamilyState = groupedCandidates.map((group) => {
        const topGroupId = topGroupByFamily.get(group.cardFamilyGroupId) ?? group.groupId;

        return {
          ...group,
          hiddenAsNearDuplicateOf:
            topGroupId === group.groupId
              ? null
              : groupedCandidates.find((candidate) => candidate.groupId === topGroupId)
                  ?.representativeCard.name ?? null,
        };
      });

      return {
        pokemon,
        candidateFile,
        groupedCandidates: groupedCandidatesWithFamilyState,
      };
    }),
  );
}
