import type { EvidenceLink } from "@/lib/evidence-types";
import type { EvidenceSourceBadge } from "@/lib/evidence-types";

export type ConfidenceLabel = "High" | "Medium" | "Low" | "Needs Review";

export type ResourceLink = {
  label: string;
  url: string;
  note: string;
};

export type PokemonCardRecord = {
  id: number;
  dexNumber: number;
  name: string;
  slug: string;
  selectedCard: {
    cardName: string;
    setName: string;
    cardNumber: string;
    imageUrl: string;
    reason: string;
    explanation: string;
    confidence: ConfidenceLabel;
    era: string;
    formatFocus: string;
    evidenceLinks: ResourceLink[];
    externalLinks: {
      tcgplayer: string;
      limitless: string;
      pkmncards: string;
    };
  };
};

export type CandidateCard = {
  id: string;
  name: string;
  hp?: string | null;
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
  abilities:
    | Array<{
        name: string;
        text: string;
        type: string;
      }>
    | null;
  attacks:
    | Array<{
        name: string;
        cost?: string[];
        convertedEnergyCost?: number;
        damage?: string;
        text?: string;
      }>
    | null;
  rules: string[] | null;
  nationalPokedexNumbers: number[] | null;
  weaknesses?: Array<{
    type: string;
    value: string;
  }> | null;
  resistances?: Array<{
    type: string;
    value: string;
  }> | null;
  retreatCost?: string[] | null;
  convertedRetreatCost?: number | null;
};

export type CandidateCardFile = {
  pokemonName: string;
  slug: string;
  fetchedAt: string;
  query: string;
  totalCount: number;
  cards: CandidateCard[];
};

export type ReviewPriority = "High" | "Medium" | "Low";

export type CandidateScoreOverride = {
  scoreAdjustment: number;
  notes: string[];
};

export type CandidateScoreOverrideMap = Record<string, CandidateScoreOverride>;

export type FunctionalCardGroup = {
  groupId: string;
  groupKey: string;
  functionalGroupId: string;
  cardFamilyGroupId: string;
  representativeCard: CandidateCard;
  printings: CandidateCard[];
  printingCount: number;
  earliestReleaseDate: string;
  latestReleaseDate: string;
  allSetNames: string[];
  isFunctionalReprintGroup: boolean;
  familyGroupCount: number;
  hiddenAsNearDuplicateOf: string | null;
};

export type ScoredCandidateGroup = FunctionalCardGroup & {
  competitiveScore: number;
  competitiveEvidenceScore: number;
  manualEvidenceScore: number;
  heuristicScore: number;
  totalScore: number;
  scoreBreakdown: string[];
  evidenceLinks: EvidenceLink[];
  evidenceStatus:
    | "Competitive evidence found"
    | "Manual evidence only"
    | "Heuristic only"
    | "Evidence missing";
  evidenceSourceBadges: EvidenceSourceBadge[];
  reviewPriority: ReviewPriority;
};

export type ReviewEntry = {
  pokemon: PokemonCardRecord;
  candidateFile: CandidateCardFile | null;
  groupedCandidates: ScoredCandidateGroup[];
};
