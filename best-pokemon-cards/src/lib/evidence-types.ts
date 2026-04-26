export type EvidenceLink = {
  label: string;
  url: string;
  type: string;
};

export type EvidenceSourceBadge =
  | "Manual"
  | "Limitless"
  | "Retro"
  | "Heuristic";

export type TournamentPlacementEvidence = {
  source: "tournament-placement";
  label: string;
  url: string;
  eventName: string;
  placement?: string;
  notes?: string[];
  scoreContribution: number;
};

export type DecklistEvidence = {
  source: "decklist";
  label: string;
  url: string;
  deckName?: string;
  notes?: string[];
  scoreContribution: number;
};

export type RetroEvidence = {
  source: "retro";
  label: string;
  url?: string;
  notes: string[];
  scoreContribution: number;
};

export type ManualEvidence = {
  source: "manual";
  label: string;
  url?: string;
  notes: string[];
  scoreContribution: number;
};

export type CompetitiveEvidenceSummary = {
  competitiveEvidenceScore: number;
  manualEvidenceScore: number;
  notes: string[];
  links: EvidenceLink[];
  sourceBadges: EvidenceSourceBadge[];
  sources: Array<
    TournamentPlacementEvidence | DecklistEvidence | RetroEvidence | ManualEvidence
  >;
};

// TODO: Add scripts/fetch-limitless-evidence.ts to populate tournament-placement
// and decklist evidence from maintained public sources such as Limitless.
// TODO: Add scripts/import-retro-evidence.ts to merge curated retro references
// for older formats that do not have structured modern coverage.
