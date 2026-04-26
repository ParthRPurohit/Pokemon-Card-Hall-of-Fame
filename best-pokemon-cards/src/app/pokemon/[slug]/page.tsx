import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemonBySlug, genOneCompetitiveCards } from "@/lib/data/gen-one-cards";

type PokemonDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return genOneCompetitiveCards.map((pokemon) => ({
    slug: pokemon.slug,
  }));
}

export async function generateMetadata({
  params,
}: PokemonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pokemon = getPokemonBySlug(slug);

  if (!pokemon) {
    return {
      title: "Pokemon Not Found | Best Pokemon Cards",
    };
  }

  return {
    title: `${pokemon.name} | Best Pokemon Cards`,
    description: `Why ${pokemon.selectedCard.cardName} is our current best competitive ${pokemon.name} card pick.`,
  };
}

export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { slug } = await params;
  const pokemon = getPokemonBySlug(slug);

  if (!pokemon) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--accent-strong)] transition hover:text-[var(--ink-strong)]"
      >
        <span aria-hidden="true">←</span>
        Back to all Gen 1 picks
      </Link>

      <section className="grid gap-8 lg:grid-cols-[minmax(300px,420px)_1fr]">
        <div className="card-panel p-5 sm:p-6">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--card-image-shell)] p-4">
            <Image
              src={pokemon.selectedCard.imageUrl}
              alt={`${pokemon.selectedCard.cardName} card art`}
              width={734}
              height={1024}
              className="mx-auto h-auto w-full max-w-sm rounded-[1.1rem] object-contain shadow-[0_18px_40px_rgba(10,38,43,0.18)]"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-panel p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="section-kicker">Pokemon Detail</p>
                <div>
                  <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
                    {pokemon.name}
                  </h1>
                  <p className="mt-2 text-lg text-[var(--ink-soft)]">
                    Selected best card:{" "}
                    <span className="font-semibold text-[var(--ink-strong)]">
                      {pokemon.selectedCard.cardName}
                    </span>
                  </p>
                </div>
              </div>
              <span
                className={`confidence-pill confidence-${pokemon.selectedCard.confidence.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {pokemon.selectedCard.confidence}
              </span>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="meta-block">
                <dt>Set</dt>
                <dd>{pokemon.selectedCard.setName}</dd>
              </div>
              <div className="meta-block">
                <dt>Number</dt>
                <dd>{pokemon.selectedCard.cardNumber}</dd>
              </div>
              <div className="meta-block">
                <dt>Era</dt>
                <dd>{pokemon.selectedCard.era}</dd>
              </div>
              <div className="meta-block">
                <dt>Format Context</dt>
                <dd>{pokemon.selectedCard.formatFocus}</dd>
              </div>
            </dl>
          </div>

          <section className="card-panel p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--ink-strong)]">
              Why this is the best competitive pick
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
              {pokemon.selectedCard.reason}
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
              {pokemon.selectedCard.explanation}
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="card-panel p-6">
              <h2 className="text-lg font-semibold text-[var(--ink-strong)]">
                Evidence Links
              </h2>
              <ul className="mt-4 space-y-3">
                {pokemon.selectedCard.evidenceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--border-strong)] hover:bg-white"
                    >
                      <span>
                        <span className="block font-medium text-[var(--ink-strong)]">
                          {link.label}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--ink-soft)]">
                          {link.note}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[var(--accent-strong)] transition group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-panel p-6">
              <h2 className="text-lg font-semibold text-[var(--ink-strong)]">
                External Links
              </h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={pokemon.selectedCard.externalLinks.tcgplayer}
                    target="_blank"
                    rel="noreferrer"
                    className="link-row"
                  >
                    TCGplayer search
                  </a>
                </li>
                <li>
                  <a
                    href={pokemon.selectedCard.externalLinks.limitless}
                    target="_blank"
                    rel="noreferrer"
                    className="link-row"
                  >
                    Limitless search
                  </a>
                </li>
                <li>
                  <a
                    href={pokemon.selectedCard.externalLinks.pkmncards}
                    target="_blank"
                    rel="noreferrer"
                    className="link-row"
                  >
                    PkmnCards search
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
