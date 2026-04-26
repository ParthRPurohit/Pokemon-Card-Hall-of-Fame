import {
  type CompetitiveEvidenceSummary,
  type EvidenceLink,
  type EvidenceSourceBadge,
  type ManualEvidence,
} from "@/lib/evidence-types";
import { normalizeReviewText } from "@/lib/card-grouping";
import type {
  CandidateCard,
  CandidateScoreOverrideMap,
  FunctionalCardGroup,
  ReviewPriority,
  ScoredCandidateGroup,
} from "@/lib/types";

type ScoringRule = {
  points: number;
  reason: string;
  patterns: RegExp[];
};

export type CompetitiveEvidenceRecord = {
  competitiveEvidenceScore?: number;
  manualEvidenceScore?: number;
  notes?: string[];
  links?: EvidenceLink[];
  sourceType?: "Manual" | "Limitless" | "Retro";
};

export type CompetitiveEvidenceFile = {
  byCardId?: Record<string, CompetitiveEvidenceRecord>;
  byCardName?: Record<string, CompetitiveEvidenceRecord>;
  byPokemonAndCardName?: Record<string, CompetitiveEvidenceRecord>;
  byGroupId?: Record<string, CompetitiveEvidenceRecord>;
};

export type LimitlessEvidenceFile = {
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

const heuristicRules: ScoringRule[] = [
  {
    points: 6,
    reason: "Searches the deck",
    patterns: [/search your deck/i],
  },
  {
    points: 4,
    reason: "Draw support text",
    patterns: [/\bdraw\b/i],
  },
  {
    points: 4,
    reason: "Energy acceleration or attachment utility",
    patterns: [/attach/i, /accelerat/i, /energy/i],
  },
  {
    points: 3,
    reason: "Switching, gusting, or board-position utility",
    patterns: [/\bswitch\b/i, /\bbench/i, /active pok[eé]mon/i],
  },
  {
    points: 5,
    reason: "Lock, denial, or prevention text",
    patterns: [/can't attack/i, /can't play/i, /prevent all effects/i, /reduce/i],
  },
  {
    points: 4,
    reason: "Damage counters or spread pressure",
    patterns: [/damage counters/i, /place .*damage/i],
  },
  {
    points: 3,
    reason: "Repeatable once-per-turn ability pattern",
    patterns: [/once during your turn/i, /as often as you like during your turn/i],
  },
  {
    points: 3,
    reason: "Coming-into-play effect from hand",
    patterns: [/when you play this pok[eé]mon from your hand/i],
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function addBreakdown(breakdown: string[], points: number, reason: string) {
  breakdown.push(`${points >= 0 ? "+" : ""}${points}: ${reason}`);
}

function groupText(group: FunctionalCardGroup) {
  const card = group.representativeCard;

  return [
    card.name,
    ...(card.rules ?? []),
    ...(card.abilities?.map((ability) => `${ability.name} ${ability.text}`) ?? []),
    ...(card.attacks?.map((attack) => `${attack.name} ${attack.text ?? ""}`) ?? []),
  ].join(" ");
}

function isVanillaDamageCard(card: CandidateCard) {
  if (card.abilities?.length || card.rules?.length || !card.attacks?.length) {
    return false;
  }

  return card.attacks.every((attack) => {
    const attackText = attack.text?.trim() ?? "";
    return attackText.length === 0 && Boolean(attack.damage?.trim());
  });
}

function dedupeLinks(links: EvidenceLink[]) {
  const seen = new Set<string>();

  return links.filter((link) => {
    const key = `${link.label}|${link.url}|${link.type}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function dedupeBadges(badges: EvidenceSourceBadge[]) {
  return [...new Set(badges)];
}

function dedupeNotes(notes: string[]) {
  return [...new Set(notes)];
}

function computeHeuristicScore(group: FunctionalCardGroup) {
  const breakdown: string[] = [];
  let score = 0;
  const card = group.representativeCard;
  const text = groupText(group);

  if (card.abilities?.length) {
    score += 3;
    addBreakdown(breakdown, 3, "Ability or Pokemon Power present");
  }

  const effectAttackCount =
    card.attacks?.filter((attack) => (attack.text?.trim().length ?? 0) > 0).length ?? 0;
  if (effectAttackCount > 0) {
    const attackEffectScore = Math.min(effectAttackCount * 2, 4);
    score += attackEffectScore;
    addBreakdown(breakdown, attackEffectScore, "Attack text adds utility beyond raw damage");
  }

  for (const rule of heuristicRules) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      score += rule.points;
      addBreakdown(breakdown, rule.points, rule.reason);
    }
  }

  if (/\b-gx\b/i.test(card.name) || /\bgx\b/i.test(card.name)) {
    score += 3;
    addBreakdown(breakdown, 3, "GX or TAG TEAM structure");
  }

  if (
    /\bex\b/i.test(card.name) ||
    /\b v\b/i.test(card.name) ||
    /\bvmax\b/i.test(card.name) ||
    /\bvstar\b/i.test(card.name)
  ) {
    score += 2;
    addBreakdown(breakdown, 2, "Special-rule Pokemon structure");
  }

  if (isVanillaDamageCard(card)) {
    score -= 8;
    addBreakdown(breakdown, -8, "Vanilla damage-only profile");
  }

  return {
    heuristicScore: clamp(score, 0, 25),
    breakdown,
  };
}

function buildManualEvidenceSource(
  label: string,
  record: CompetitiveEvidenceRecord,
) {
  return {
    source: "manual" as const,
    label,
    notes: record.notes ?? [],
    scoreContribution: record.manualEvidenceScore ?? 0,
    url: record.links?.[0]?.url,
  } satisfies ManualEvidence;
}

function mergeCompetitiveRecord(
  target: {
    competitiveEvidenceScore: number;
    manualEvidenceScore: number;
    notes: string[];
    links: EvidenceLink[];
    badges: EvidenceSourceBadge[];
    sources: ManualEvidence[];
  },
  label: string,
  record: CompetitiveEvidenceRecord | undefined,
) {
  if (!record) {
    return;
  }

  if (typeof record.competitiveEvidenceScore === "number") {
    target.competitiveEvidenceScore = Math.max(
      target.competitiveEvidenceScore,
      record.competitiveEvidenceScore,
    );
  }

  if (typeof record.manualEvidenceScore === "number") {
    target.manualEvidenceScore = Math.max(
      target.manualEvidenceScore,
      record.manualEvidenceScore,
    );
  }

  target.notes.push(...(record.notes ?? []));
  target.links.push(...(record.links ?? []));
  target.badges.push(record.sourceType ?? "Manual");
  target.sources.push(buildManualEvidenceSource(label, record));
}

export function buildCompetitiveEvidenceSummary(
  group: FunctionalCardGroup,
  pokemonSlug: string,
  evidenceFile: CompetitiveEvidenceFile,
  limitlessEvidence: LimitlessEvidenceFile | null = null,
): CompetitiveEvidenceSummary {
  const representativeName = normalizeReviewText(group.representativeCard.name);
  const pokemonAndCardKey = `${normalizeReviewText(pokemonSlug)}|${representativeName}`;
  const accumulator = {
    competitiveEvidenceScore: 0,
    manualEvidenceScore: 0,
    notes: [] as string[],
    links: [] as EvidenceLink[],
    badges: [] as EvidenceSourceBadge[],
    sources: [] as ManualEvidence[],
  };

  for (const printing of group.printings) {
    mergeCompetitiveRecord(
      accumulator,
      `Card id ${printing.id}`,
      evidenceFile.byCardId?.[printing.id],
    );
  }

  mergeCompetitiveRecord(
    accumulator,
    `Card name ${representativeName}`,
    evidenceFile.byCardName?.[representativeName],
  );
  mergeCompetitiveRecord(
    accumulator,
    `Pokemon and card ${pokemonAndCardKey}`,
    evidenceFile.byPokemonAndCardName?.[pokemonAndCardKey],
  );
  mergeCompetitiveRecord(
    accumulator,
    `Group id ${group.groupId}`,
    evidenceFile.byGroupId?.[group.groupId],
  );
  mergeCompetitiveRecord(
    accumulator,
    `Functional group id ${group.functionalGroupId}`,
    evidenceFile.byGroupId?.[group.functionalGroupId],
  );

  if (limitlessEvidence?.status === "fetched") {
    const limitlessScore = clamp(
      (limitlessEvidence.decklistAppearances ?? 0) * 8 +
        (limitlessEvidence.eventCount ?? 0) * 6,
      0,
      150,
    );
    accumulator.competitiveEvidenceScore = Math.max(
      accumulator.competitiveEvidenceScore,
      limitlessScore,
    );
    accumulator.notes.push(
      `Limitless evidence imported for ${limitlessEvidence.searchedCardName}.`,
    );
    accumulator.links.push(
      ...limitlessEvidence.sourceUrls.map((url) => ({
        label: "Limitless evidence source",
        url,
        type: "limitless",
      })),
    );
    accumulator.badges.push("Limitless");
  }

  return {
    competitiveEvidenceScore: clamp(accumulator.competitiveEvidenceScore, 0, 150),
    manualEvidenceScore: clamp(accumulator.manualEvidenceScore, 0, 100),
    notes: dedupeNotes(accumulator.notes),
    links: dedupeLinks(accumulator.links),
    sourceBadges: dedupeBadges(accumulator.badges),
    sources: accumulator.sources,
  };
}

function computeLegacyOverrideNotes(
  group: FunctionalCardGroup,
  overrides: CandidateScoreOverrideMap,
) {
  const notes: string[] = [];
  const keys = [
    group.groupId,
    group.functionalGroupId,
    ...group.printings.map((printing) => printing.id),
  ];

  for (const key of keys) {
    const override = overrides[key];

    if (!override) {
      continue;
    }

    notes.push(
      `Legacy candidate-overrides entry found for ${key}; migrate to competitive-evidence.json when convenient.`,
    );
    notes.push(...override.notes);
  }

  return dedupeNotes(notes);
}

function priorityFromScores(
  totalScore: number,
  competitiveEvidenceScore: number,
  manualEvidenceScore: number,
): ReviewPriority {
  if (competitiveEvidenceScore >= 80 || manualEvidenceScore >= 75 || totalScore >= 120) {
    return "High";
  }

  if (competitiveEvidenceScore >= 25 || manualEvidenceScore >= 35 || totalScore >= 45) {
    return "Medium";
  }

  return "Low";
}

function evidenceStatusForScores(
  competitiveEvidenceScore: number,
  manualEvidenceScore: number,
  heuristicScore: number,
): ScoredCandidateGroup["evidenceStatus"] {
  if (competitiveEvidenceScore > 0) {
    return "Competitive evidence found";
  }

  if (manualEvidenceScore > 0) {
    return "Manual evidence only";
  }

  if (heuristicScore > 0) {
    return "Heuristic only";
  }

  return "Evidence missing";
}

export function scoreCandidateGroup(
  group: FunctionalCardGroup,
  pokemonSlug: string,
  evidenceFile: CompetitiveEvidenceFile,
  overrides: CandidateScoreOverrideMap = {},
  limitlessEvidence: LimitlessEvidenceFile | null = null,
): ScoredCandidateGroup {
  const evidenceSummary = buildCompetitiveEvidenceSummary(
    group,
    pokemonSlug,
    evidenceFile,
    limitlessEvidence,
  );
  const { heuristicScore, breakdown: heuristicBreakdown } =
    computeHeuristicScore(group);
  const competitiveEvidenceScore = evidenceSummary.competitiveEvidenceScore;
  const manualEvidenceScore = evidenceSummary.manualEvidenceScore;
  const legacyOverrideNotes = computeLegacyOverrideNotes(group, overrides);
  const competitiveScore = competitiveEvidenceScore + manualEvidenceScore;
  const totalScore = competitiveScore + heuristicScore;
  const evidenceStatus = evidenceStatusForScores(
    competitiveEvidenceScore,
    manualEvidenceScore,
    heuristicScore,
  );
  const evidenceSourceBadges = dedupeBadges([
    ...evidenceSummary.sourceBadges,
    ...(heuristicScore > 0 ? (["Heuristic"] as const) : []),
  ]);

  const scoreBreakdown = [
    `Competitive evidence score: ${competitiveEvidenceScore}`,
    `Manual evidence score: ${manualEvidenceScore}`,
    `Heuristic score: ${heuristicScore}`,
    ...evidenceSummary.notes.map((note) => `Evidence note: ${note}`),
    ...legacyOverrideNotes.map((note) => `Override note: ${note}`),
    ...heuristicBreakdown,
  ];

  return {
    ...group,
    competitiveScore,
    competitiveEvidenceScore,
    manualEvidenceScore,
    heuristicScore,
    totalScore,
    scoreBreakdown,
    evidenceLinks: evidenceSummary.links,
    evidenceStatus,
    evidenceSourceBadges,
    reviewPriority: priorityFromScores(
      totalScore,
      competitiveEvidenceScore,
      manualEvidenceScore,
    ),
  };
}

export function sortCandidateGroupsByScore(
  groups: ScoredCandidateGroup[],
): ScoredCandidateGroup[] {
  return [...groups].sort((left, right) => {
    if (right.totalScore !== left.totalScore) {
      return right.totalScore - left.totalScore;
    }

    if (right.competitiveEvidenceScore !== left.competitiveEvidenceScore) {
      return right.competitiveEvidenceScore - left.competitiveEvidenceScore;
    }

    if (right.manualEvidenceScore !== left.manualEvidenceScore) {
      return right.manualEvidenceScore - left.manualEvidenceScore;
    }

    if (right.familyGroupCount !== left.familyGroupCount) {
      return right.familyGroupCount - left.familyGroupCount;
    }

    return left.representativeCard.name.localeCompare(right.representativeCard.name);
  });
}
