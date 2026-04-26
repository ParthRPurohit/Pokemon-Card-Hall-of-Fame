import { PokemonGrid } from "@/components/pokemon-grid";
import { genOneCompetitiveCards } from "@/lib/data/gen-one-cards";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-panel overflow-hidden rounded-[2rem] border border-[var(--border-strong)] p-8 shadow-[0_20px_60px_rgba(19,52,59,0.08)] sm:p-10">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-5">
          <p className="section-kicker">Gen 1 Competitive Hall of Fame</p>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-5xl">
              Best Pokemon Cards
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
              A curated MVP index of the strongest competitively relevant card
              pick for each original Kanto Pokemon, starting with 10 sample
              entries and a structure we can scale to all 151.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--ink-soft)]">
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Search by Pokemon or card name
            </span>
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Confidence labels included
            </span>
            <span className="rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1.5">
              Evidence and marketplace links on every detail page
            </span>
          </div>
        </div>
      </section>

      <PokemonGrid pokemonCards={genOneCompetitiveCards} />
    </main>
  );
}
