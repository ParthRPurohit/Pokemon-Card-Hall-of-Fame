import { ReviewDashboard } from "@/components/review-dashboard";
import { getReviewEntries } from "@/lib/review-data";

export default async function ReviewPage() {
  const entries = await getReviewEntries();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-panel overflow-hidden rounded-[2rem] border border-[var(--border-strong)] p-8 shadow-[0_20px_60px_rgba(19,52,59,0.08)] sm:p-10">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-5">
          <p className="section-kicker">Internal Review</p>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-5xl">
              Local candidate review dashboard
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
              Compare the current seeded selection for each Pokemon against any
              locally fetched Pokemon TCG API candidates. This page groups
              functional reprints together, supports best-only, grouped, or raw
              printing views, and ranks candidates evidence-first for manual
              curation. It does not persist decisions yet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--ink-soft)]">
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Local seed data + raw candidate JSON
            </span>
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Best-only, grouped, or raw-printing review modes
            </span>
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Evidence-first ranking with duplicate-family hiding
            </span>
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Persistence coming later
            </span>
          </div>
        </div>
      </section>

      <ReviewDashboard entries={entries} />
    </main>
  );
}
