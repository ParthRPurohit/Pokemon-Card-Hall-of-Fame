"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  ConfidenceLabel,
  ReviewEntry,
  ReviewPriority,
  ScoredCandidateGroup,
} from "@/lib/types";

type ReviewDashboardProps = {
  entries: ReviewEntry[];
};

type ReviewFilter =
  | "All"
  | "High confidence"
  | "Medium confidence"
  | "Low confidence"
  | "Needs Review"
  | "Has fetched candidates"
  | "Missing fetched candidates";

type CandidatePriorityFilter =
  | "All candidates"
  | "High priority"
  | "Medium priority"
  | "Low priority";

type CandidateDisplayMode =
  | "Best representative only"
  | "Functional groups"
  | "All printings";

const reviewFilters: ReviewFilter[] = [
  "All",
  "High confidence",
  "Medium confidence",
  "Low confidence",
  "Needs Review",
  "Has fetched candidates",
  "Missing fetched candidates",
];

const candidatePriorityFilters: CandidatePriorityFilter[] = [
  "All candidates",
  "High priority",
  "Medium priority",
  "Low priority",
];

const candidateDisplayModes: CandidateDisplayMode[] = [
  "Best representative only",
  "Functional groups",
  "All printings",
];

function confidenceClass(confidence: ConfidenceLabel) {
  return `confidence-pill confidence-${confidence.toLowerCase().replace(/\s+/g, "-")}`;
}

function priorityClass(priority: ReviewPriority) {
  return `review-label review-priority-${priority.toLowerCase()}`;
}

function evidenceStatusClass(status: ScoredCandidateGroup["evidenceStatus"]) {
  return `review-label review-evidence-${status.toLowerCase().replace(/\s+/g, "-")}`;
}

function evidenceSourceClass(source: string) {
  return `review-label review-source-${source.toLowerCase()}`;
}

function formatLegalities(legalities: Record<string, string> | null) {
  if (!legalities) {
    return "No legality data";
  }

  return Object.entries(legalities)
    .map(([format, status]) => `${format}: ${status}`)
    .join(" • ");
}

function summarizeEntry(entry: ReviewEntry) {
  const candidateNames = entry.groupedCandidates
    .flatMap((group) => [
      group.representativeCard.name,
      ...group.printings.map((printing) => printing.set.name),
    ])
    .join(" ");

  return [
    entry.pokemon.name,
    entry.pokemon.selectedCard.cardName,
    entry.pokemon.selectedCard.reason,
    candidateNames,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesReviewFilter(entry: ReviewEntry, filter: ReviewFilter) {
  switch (filter) {
    case "All":
      return true;
    case "High confidence":
      return entry.pokemon.selectedCard.confidence === "High";
    case "Medium confidence":
      return entry.pokemon.selectedCard.confidence === "Medium";
    case "Low confidence":
      return entry.pokemon.selectedCard.confidence === "Low";
    case "Needs Review":
      return entry.pokemon.selectedCard.confidence === "Needs Review";
    case "Has fetched candidates":
      return entry.groupedCandidates.length > 0;
    case "Missing fetched candidates":
      return entry.groupedCandidates.length === 0;
  }
}

function matchesCandidatePriority(
  group: ScoredCandidateGroup,
  filter: CandidatePriorityFilter,
) {
  switch (filter) {
    case "All candidates":
      return true;
    case "High priority":
      return group.reviewPriority === "High";
    case "Medium priority":
      return group.reviewPriority === "Medium";
    case "Low priority":
      return group.reviewPriority === "Low";
  }
}

function getDisplayGroups(
  entry: ReviewEntry,
  candidatePriorityFilter: CandidatePriorityFilter,
  _candidateDisplayMode: CandidateDisplayMode,
  showHiddenDuplicates: boolean,
) {
  const priorityFiltered = entry.groupedCandidates.filter((group) =>
    matchesCandidatePriority(group, candidatePriorityFilter),
  );

  return showHiddenDuplicates
    ? priorityFiltered
    : priorityFiltered.filter((group) => !group.hiddenAsNearDuplicateOf);
}

function countDisplayedCandidates(
  groups: ScoredCandidateGroup[],
  displayMode: CandidateDisplayMode,
) {
  if (displayMode === "All printings") {
    return groups.reduce((total, group) => total + group.printingCount, 0);
  }

  return groups.length;
}

function countHiddenDuplicates(
  entry: ReviewEntry,
  candidatePriorityFilter: CandidatePriorityFilter,
) {
  return entry.groupedCandidates.filter(
    (group) =>
      matchesCandidatePriority(group, candidatePriorityFilter) &&
      Boolean(group.hiddenAsNearDuplicateOf),
  ).length;
}

function CandidateGroupCard({
  group,
  needsReview,
}: {
  group: ScoredCandidateGroup;
  needsReview: boolean;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/72 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="review-label review-label-candidate">
          Possible candidate
        </span>
        <span className={priorityClass(group.reviewPriority)}>
          {group.reviewPriority} priority
        </span>
        <span className={evidenceStatusClass(group.evidenceStatus)}>
          {group.evidenceStatus}
        </span>
        {group.isFunctionalReprintGroup ? (
          <span className="review-label review-label-reprint">
            Functional reprint group
          </span>
        ) : null}
        {needsReview ? (
          <span className="review-label review-label-review">Needs review</span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {group.evidenceSourceBadges.map((badge) => (
          <span key={`${group.groupId}-${badge}`} className={evidenceSourceClass(badge)}>
            {badge}
          </span>
        ))}
      </div>

      {group.hiddenAsNearDuplicateOf ? (
        <p className="mt-3 rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-soft)]">
          Hidden as near-duplicate of higher-ranked {group.hiddenAsNearDuplicateOf}
          when duplicate hiding is enabled.
        </p>
      ) : null}

      <div className="mt-3 overflow-hidden rounded-[1.1rem] border border-[var(--border-soft)] bg-[var(--card-image-shell)] p-3">
        <Image
          src={group.representativeCard.images.large}
          alt={`${group.representativeCard.name} representative card art`}
          width={734}
          height={1024}
          className="mx-auto h-auto w-full max-w-[220px] rounded-[0.9rem] object-contain"
        />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <h4 className="text-lg font-semibold text-[var(--ink-strong)]">
            {group.representativeCard.name}
          </h4>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Representative print: {group.representativeCard.set.name} •{" "}
            {group.representativeCard.number}
          </p>
        </div>

        <dl className="space-y-2 text-sm text-[var(--ink-soft)]">
          <div className="review-row">
            <dt>Printings</dt>
            <dd>{group.printingCount}</dd>
          </div>
          <div className="review-row">
            <dt>Family groups</dt>
            <dd>{group.familyGroupCount}</dd>
          </div>
          <div className="review-row">
            <dt>Earliest</dt>
            <dd>{group.earliestReleaseDate}</dd>
          </div>
          <div className="review-row">
            <dt>Latest</dt>
            <dd>{group.latestReleaseDate}</dd>
          </div>
          <div className="review-row">
            <dt>Sets</dt>
            <dd>{group.allSetNames.join(", ")}</dd>
          </div>
          <div className="review-row">
            <dt>Legalities</dt>
            <dd>{formatLegalities(group.representativeCard.legalities)}</dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white px-3 py-3">
              <p className="text-[var(--ink-faint)]">Total Score</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--accent-strong)]">
                {group.totalScore}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white px-3 py-3">
              <p className="text-[var(--ink-faint)]">Competitive</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--ink-strong)]">
                {group.competitiveEvidenceScore}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white px-3 py-3">
              <p className="text-[var(--ink-faint)]">Manual</p>
              <p className="mt-1 text-xl font-semibold text-[var(--ink-strong)]">
                {group.manualEvidenceScore}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-white px-3 py-3">
              <p className="text-[var(--ink-faint)]">Heuristic</p>
              <p className="mt-1 text-xl font-semibold text-[var(--ink-strong)]">
                {group.heuristicScore}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--ink-soft)]">
          <p className="font-semibold text-[var(--ink-strong)]">
            Why this ranks here
          </p>
          <ul className="mt-2 space-y-2 leading-6">
            {group.scoreBreakdown.map((item) => (
              <li key={`${group.groupId}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        {group.evidenceLinks.length > 0 ? (
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-3">
            <p className="text-sm font-semibold text-[var(--ink-strong)]">
              Evidence links
            </p>
            <ul className="mt-2 space-y-2">
              {group.evidenceLinks.map((link) => (
                <li key={`${group.groupId}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-row text-sm"
                  >
                    {link.label} ({link.type})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <details className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--ink-strong)]">
            Show printings ({group.printingCount})
          </summary>
          <ul className="mt-3 space-y-3 text-sm text-[var(--ink-soft)]">
            {group.printings.map((printing) => (
              <li
                key={printing.id}
                className="rounded-2xl border border-[var(--border-soft)] bg-white px-3 py-3"
              >
                <p className="font-semibold text-[var(--ink-strong)]">
                  {printing.name}
                </p>
                <p className="mt-1">
                  {printing.set.name} • {printing.number} • {printing.set.releaseDate}
                </p>
                <p className="mt-1">{printing.rarity ?? "Unknown rarity"}</p>
                {printing.tcgplayer.url ? (
                  <a
                    href={printing.tcgplayer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-[var(--accent-strong)]"
                  >
                    TCGplayer ↗
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </details>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            title="Persistence coming later."
            className="rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--ink-faint)] opacity-70"
          >
            Mark as selected
          </button>
          <button
            type="button"
            disabled
            title="Persistence coming later."
            className="rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--ink-faint)] opacity-70"
          >
            Reject
          </button>
        </div>
      </div>
    </section>
  );
}

function PrintingCard({
  group,
  printing,
  needsReview,
}: {
  group: ScoredCandidateGroup;
  printing: ScoredCandidateGroup["printings"][number];
  needsReview: boolean;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/72 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="review-label review-label-candidate">Raw printing</span>
        <span className={priorityClass(group.reviewPriority)}>
          {group.reviewPriority} priority
        </span>
        <span className={evidenceStatusClass(group.evidenceStatus)}>
          {group.evidenceStatus}
        </span>
        {group.hiddenAsNearDuplicateOf ? (
          <span className="review-label review-label-reprint">
            Near-duplicate family
          </span>
        ) : null}
        {needsReview ? (
          <span className="review-label review-label-review">Needs review</span>
        ) : null}
      </div>

      <div className="mt-3 overflow-hidden rounded-[1.1rem] border border-[var(--border-soft)] bg-[var(--card-image-shell)] p-3">
        <Image
          src={printing.images.large}
          alt={`${printing.name} printing card art`}
          width={734}
          height={1024}
          className="mx-auto h-auto w-full max-w-[220px] rounded-[0.9rem] object-contain"
        />
      </div>

      <div className="mt-4 space-y-3 text-sm text-[var(--ink-soft)]">
        <div>
          <h4 className="text-lg font-semibold text-[var(--ink-strong)]">
            {printing.name}
          </h4>
          <p className="mt-1">
            {printing.set.name} • {printing.number} • {printing.set.releaseDate}
          </p>
        </div>
        <p>Family representative: {group.representativeCard.name}</p>
        {group.hiddenAsNearDuplicateOf ? (
          <p>
            Hidden as near-duplicate of higher-ranked {group.hiddenAsNearDuplicateOf}
            when duplicate hiding is enabled.
          </p>
        ) : null}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-3">
          <p className="font-semibold text-[var(--ink-strong)]">
            Group score context
          </p>
          <p className="mt-2">
            Total {group.totalScore} = Competitive {group.competitiveEvidenceScore}
            {" "}+ Manual {group.manualEvidenceScore} + Heuristic {group.heuristicScore}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ReviewDashboard({ entries }: ReviewDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("All");
  const [candidatePriorityFilter, setCandidatePriorityFilter] =
    useState<CandidatePriorityFilter>("All candidates");
  const [candidateDisplayMode, setCandidateDisplayMode] =
    useState<CandidateDisplayMode>("Best representative only");
  const [showHiddenDuplicates, setShowHiddenDuplicates] = useState(false);

  const visibleEntries = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return entries.filter((entry) => {
      const passesReviewFilter = matchesReviewFilter(entry, activeFilter);
      const passesSearch = normalizedSearch
        ? summarizeEntry(entry).includes(normalizedSearch)
        : true;
      const visibleGroups = getDisplayGroups(
        entry,
        candidatePriorityFilter,
        candidateDisplayMode,
        showHiddenDuplicates,
      );

      return passesReviewFilter && passesSearch && visibleGroups.length > 0;
    });
  }, [
    activeFilter,
    candidateDisplayMode,
    candidatePriorityFilter,
    entries,
    showHiddenDuplicates,
    searchTerm,
  ]);

  return (
    <section className="space-y-6">
      <div className="card-panel p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="section-kicker">Manual Curation Dashboard</p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">
              Compare seeded picks against competitive candidate views
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">
              Candidates are grouped by functional card text to avoid reviewing
              reprints repeatedly. Rankings prioritize competitive evidence and
              manual overrides first, with text heuristics used only as a
              fallback.
            </p>
          </div>

          <div className="w-full max-w-md">
            <label htmlFor="review-search" className="sr-only">
              Search review entries
            </label>
            <input
              id="review-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search Pokemon, candidate names, or set names..."
              className="w-full rounded-full border border-[var(--border-strong)] bg-white px-5 py-3 text-sm text-[var(--ink-strong)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[var(--accent-glow)]"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {reviewFilters.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[var(--ink-strong)] bg-[var(--ink-strong)] text-white"
                    : "border-[var(--border-soft)] bg-white/75 text-[var(--ink-soft)] hover:border-[var(--border-strong)] hover:text-[var(--ink-strong)]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {candidatePriorityFilters.map((filter) => {
            const isActive = filter === candidatePriorityFilter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setCandidatePriorityFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[var(--accent-strong)] bg-[var(--accent-strong)] text-white"
                    : "border-[var(--border-soft)] bg-white/75 text-[var(--ink-soft)] hover:border-[var(--border-strong)] hover:text-[var(--ink-strong)]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {candidateDisplayModes.map((mode) => {
            const isActive = mode === candidateDisplayMode;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => setCandidateDisplayMode(mode)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[var(--ink-strong)] bg-white text-[var(--ink-strong)]"
                    : "border-[var(--border-soft)] bg-white/75 text-[var(--ink-soft)] hover:border-[var(--border-strong)] hover:text-[var(--ink-strong)]"
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>

        <label className="mt-4 inline-flex items-center gap-3 text-sm text-[var(--ink-soft)]">
          <input
            type="checkbox"
            checked={showHiddenDuplicates}
            onChange={(event) => setShowHiddenDuplicates(event.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent-strong)]"
          />
          Show hidden duplicates
        </label>

        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Showing <span className="font-semibold">{visibleEntries.length}</span>{" "}
          of <span className="font-semibold">{entries.length}</span> seeded
          Pokemon.
        </p>
      </div>

      {visibleEntries.length === 0 ? (
        <div className="card-panel p-8 text-center">
          <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
            No review entries match
          </h3>
          <p className="mt-3 text-base leading-7 text-[var(--ink-soft)]">
            Try another search term or switch the confidence, priority, display
            mode, or duplicate filters.
          </p>
        </div>
      ) : null}

      <div className="space-y-6">
        {visibleEntries.map((entry) => {
          const selectedCard = entry.pokemon.selectedCard;
          const needsReview = selectedCard.confidence === "Needs Review";
          const visibleGroups = getDisplayGroups(
            entry,
            candidatePriorityFilter,
            candidateDisplayMode,
            showHiddenDuplicates,
          );
          const totalRawPrintings = entry.candidateFile?.cards.length ?? 0;
          const exactFunctionalGroups = entry.groupedCandidates.filter((group) =>
            matchesCandidatePriority(group, candidatePriorityFilter),
          ).length;
          const hiddenFamilyGroups = countHiddenDuplicates(
            entry,
            candidatePriorityFilter,
          );
          const displayedCandidates = countDisplayedCandidates(
            visibleGroups,
            candidateDisplayMode,
          );

          return (
            <article key={entry.pokemon.slug} className="card-panel p-5 sm:p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">
                        {entry.pokemon.name}
                      </h3>
                      <span className={confidenceClass(selectedCard.confidence)}>
                        {selectedCard.confidence}
                      </span>
                      <span className="review-label review-label-selected">
                        Currently selected best card
                      </span>
                      {needsReview ? (
                        <span className="review-label review-label-review">
                          Needs review
                        </span>
                      ) : null}
                    </div>

                    <p className="text-lg font-semibold text-[var(--accent-strong)]">
                      {selectedCard.cardName}
                    </p>
                    <p className="max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">
                      {selectedCard.reason}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-[var(--ink-soft)]">
                      <span>{selectedCard.setName}</span>
                      <span>•</span>
                      <span>{selectedCard.cardNumber}</span>
                      <span>•</span>
                      <span>{exactFunctionalGroups} exact functional groups</span>
                      <span>•</span>
                      <span>{totalRawPrintings} raw printings</span>
                      <span>•</span>
                      <span>{displayedCandidates} displayed candidates</span>
                    </div>
                    <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-white/55 px-4 py-3 text-sm leading-6 text-[var(--ink-soft)]">
                      <div>raw printings: {totalRawPrintings}</div>
                      <div>exact functional groups: {exactFunctionalGroups}</div>
                      <div>displayed candidates: {displayedCandidates}</div>
                      <div>
                        hidden duplicates: {showHiddenDuplicates ? 0 : hiddenFamilyGroups}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/pokemon/${entry.pokemon.slug}`}
                    className="inline-flex w-fit rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink-strong)] transition hover:-translate-y-0.5 hover:border-[var(--ink-strong)]"
                  >
                    View public detail page
                  </Link>
                </div>

                <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
                  <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/65 p-4">
                    <div className="overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--card-image-shell)] p-3">
                      <Image
                        src={selectedCard.imageUrl}
                        alt={`${selectedCard.cardName} selected card art`}
                        width={734}
                        height={1024}
                        className="mx-auto h-auto w-full max-w-[240px] rounded-[1rem] object-contain"
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm text-[var(--ink-soft)]">
                        <p className="font-semibold text-[var(--ink-strong)]">
                          {selectedCard.cardName}
                        </p>
                        <p className="mt-1">
                          {selectedCard.setName} • {selectedCard.cardNumber}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-soft)]">
                        Scores are evidence-first shortlist aids for manual
                        curation. Persistence coming later.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {candidateDisplayMode === "All printings" ? (
                      visibleGroups.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                          {visibleGroups.flatMap((group) =>
                            group.printings.map((printing) => (
                              <PrintingCard
                                key={`${group.groupId}-${printing.id}`}
                                group={group}
                                printing={printing}
                                needsReview={needsReview}
                              />
                            )),
                          )}
                        </div>
                      ) : (
                        <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-white/60 p-8">
                          <p className="text-lg font-semibold text-[var(--ink-strong)]">
                            No printings match the current filters
                          </p>
                        </div>
                      )
                    ) : visibleGroups.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                        {visibleGroups.map((group) => (
                          <CandidateGroupCard
                            key={group.groupId}
                            group={group}
                            needsReview={needsReview}
                          />
                        ))}
                      </div>
                    ) : entry.groupedCandidates.length > 0 ? (
                      <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-white/60 p-8">
                        <p className="text-lg font-semibold text-[var(--ink-strong)]">
                          No candidates match the current filters
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                          Try another priority level, switch display mode, or turn
                          on hidden duplicate display.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-white/60 p-8">
                        <p className="text-lg font-semibold text-[var(--ink-strong)]">
                          No fetched candidates yet
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                          Run `npm run fetch:candidates -- {entry.pokemon.name}`
                          to generate a local candidate file at{" "}
                          <code>{`data/candidates/${entry.pokemon.slug}.json`}</code>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
