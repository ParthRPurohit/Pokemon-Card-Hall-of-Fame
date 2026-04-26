import type {
  CandidateCard,
  FunctionalCardGroup,
  PokemonCardRecord,
} from "@/lib/types";

export function normalizeReviewText(value: string | undefined | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/pokémon/g, "pokemon")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeRuleLines(lines: string[] | null | undefined) {
  return (lines ?? []).map(normalizeReviewText);
}

function normalizeAttackKey(card: CandidateCard) {
  return (card.attacks ?? []).map((attack) => ({
    name: normalizeReviewText(attack.name),
    cost: [...(attack.cost ?? [])].map(normalizeReviewText).sort().join("|"),
    damage: normalizeReviewText(attack.damage),
    text: normalizeReviewText(attack.text),
  }));
}

function normalizeAttackFamilyKey(card: CandidateCard) {
  return (card.attacks ?? []).map((attack) => ({
    name: normalizeReviewText(attack.name),
    text: normalizeReviewText(attack.text),
  }));
}

function normalizeAbilityKey(card: CandidateCard) {
  return (card.abilities ?? []).map((ability) => ({
    name: normalizeReviewText(ability.name),
    text: normalizeReviewText(ability.text),
    type: normalizeReviewText(ability.type),
  }));
}

function normalizeAbilityFamilyKey(card: CandidateCard) {
  return (card.abilities ?? []).map((ability) => ({
    name: normalizeReviewText(ability.name),
    text: normalizeReviewText(ability.text),
  }));
}

function normalizeWeakResValue(
  values:
    | Array<{
        type: string;
        value: string;
      }>
    | null
    | undefined,
) {
  return (values ?? [])
    .map((entry) => ({
      type: normalizeReviewText(entry.type),
      value: normalizeReviewText(entry.value),
    }))
    .sort((left, right) => `${left.type}${left.value}`.localeCompare(`${right.type}${right.value}`));
}

function buildFunctionalGroupKey(card: CandidateCard) {
  return JSON.stringify({
    name: normalizeReviewText(card.name),
    hp: normalizeReviewText(card.hp),
    rules: normalizeRuleLines(card.rules),
    abilities: normalizeAbilityKey(card),
    attacks: normalizeAttackKey(card),
    weaknesses: normalizeWeakResValue(card.weaknesses),
    resistances: normalizeWeakResValue(card.resistances),
    retreatCost: [...(card.retreatCost ?? [])].map(normalizeReviewText).sort(),
    convertedRetreatCost: card.convertedRetreatCost ?? null,
  });
}

function buildCardFamilyGroupKey(card: CandidateCard) {
  return JSON.stringify({
    name: normalizeReviewText(card.name),
    hp: normalizeReviewText(card.hp),
    abilities: normalizeAbilityFamilyKey(card),
    attacks: normalizeAttackFamilyKey(card),
    rules: normalizeRuleLines(card.rules),
  });
}

function parseReleaseDate(releaseDate: string) {
  const timestamp = Date.parse(releaseDate.replaceAll("/", "-"));
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function createStableHash(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash.toString(36);
}

function chooseRepresentativeCard(
  printings: CandidateCard[],
  selectedCard: PokemonCardRecord["selectedCard"],
) {
  const selectedMatch = printings.find(
    (printing) =>
      printing.name === selectedCard.cardName &&
      printing.set.name === selectedCard.setName &&
      printing.number === selectedCard.cardNumber,
  );

  if (selectedMatch) {
    return selectedMatch;
  }

  return [...printings].sort((left, right) => {
    const leftDate = parseReleaseDate(left.set.releaseDate);
    const rightDate = parseReleaseDate(right.set.releaseDate);

    if (leftDate !== rightDate) {
      return leftDate - rightDate;
    }

    if (left.set.name !== right.set.name) {
      return left.set.name.localeCompare(right.set.name);
    }

    return left.number.localeCompare(right.number);
  })[0];
}

export function groupFunctionalCardCandidates(
  cards: CandidateCard[],
  pokemon: PokemonCardRecord,
): FunctionalCardGroup[] {
  const strictGroups = new Map<
    string,
    {
      printings: CandidateCard[];
      cardFamilyGroupId: string;
      cardFamilyGroupKey: string;
    }
  >();

  for (const card of cards) {
    const functionalKey = buildFunctionalGroupKey(card);
    const cardFamilyGroupKey = buildCardFamilyGroupKey(card);
    const existing = strictGroups.get(functionalKey);

    if (existing) {
      existing.printings.push(card);
    } else {
      strictGroups.set(functionalKey, {
        printings: [card],
        cardFamilyGroupId: `${normalizeReviewText(card.name).replace(/\s+/g, "-")}-${createStableHash(cardFamilyGroupKey)}`,
        cardFamilyGroupKey,
      });
    }
  }

  const groups = [...strictGroups.entries()].map(([functionalKey, value]) => {
    const sortedPrintings = [...value.printings].sort((left, right) => {
      const leftDate = parseReleaseDate(left.set.releaseDate);
      const rightDate = parseReleaseDate(right.set.releaseDate);

      if (leftDate !== rightDate) {
        return leftDate - rightDate;
      }

      if (left.set.name !== right.set.name) {
        return left.set.name.localeCompare(right.set.name);
      }

      return left.number.localeCompare(right.number);
    });

    const representativeCard = chooseRepresentativeCard(
      sortedPrintings,
      pokemon.selectedCard,
    );

    return {
      groupId: `${normalizeReviewText(representativeCard.name).replace(/\s+/g, "-")}-${createStableHash(functionalKey)}`,
      groupKey: functionalKey,
      functionalGroupId: `${normalizeReviewText(representativeCard.name).replace(/\s+/g, "-")}-${createStableHash(functionalKey)}`,
      cardFamilyGroupId: value.cardFamilyGroupId,
      representativeCard,
      printings: sortedPrintings,
      printingCount: sortedPrintings.length,
      earliestReleaseDate: sortedPrintings[0]?.set.releaseDate ?? "",
      latestReleaseDate:
        sortedPrintings[sortedPrintings.length - 1]?.set.releaseDate ?? "",
      allSetNames: [...new Set(sortedPrintings.map((card) => card.set.name))],
      isFunctionalReprintGroup: sortedPrintings.length > 1,
      familyGroupCount: 0,
      hiddenAsNearDuplicateOf: null,
    } satisfies FunctionalCardGroup;
  });

  const familyCounts = new Map<string, number>();
  for (const group of groups) {
    familyCounts.set(
      group.cardFamilyGroupId,
      (familyCounts.get(group.cardFamilyGroupId) ?? 0) + 1,
    );
  }

  return groups
    .map((group) => ({
      ...group,
      familyGroupCount: familyCounts.get(group.cardFamilyGroupId) ?? 1,
    }))
    .sort((left, right) =>
      left.representativeCard.name.localeCompare(right.representativeCard.name),
    );
}
