import Image from "next/image";
import Link from "next/link";
import type { PokemonCardRecord } from "@/lib/types";

type PokemonCardTileProps = {
  pokemon: PokemonCardRecord;
};

export function PokemonCardTile({ pokemon }: PokemonCardTileProps) {
  return (
    <Link href={`/pokemon/${pokemon.slug}`} className="group block">
      <article className="card-panel h-full overflow-hidden p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(20,43,47,0.12)] sm:p-5">
        <div className="overflow-hidden rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--card-image-shell)] p-3">
          <Image
            src={pokemon.selectedCard.imageUrl}
            alt={`${pokemon.selectedCard.cardName} card art`}
            width={734}
            height={1024}
            className="mx-auto h-auto w-full max-w-[250px] rounded-[1rem] object-contain transition duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">
              {pokemon.name}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--accent-strong)]">
              {pokemon.selectedCard.cardName}
            </p>
          </div>
          <span
            className={`confidence-pill confidence-${pokemon.selectedCard.confidence.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {pokemon.selectedCard.confidence}
          </span>
        </div>

        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          {pokemon.selectedCard.setName} • {pokemon.selectedCard.cardNumber}
        </p>
        <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
          {pokemon.selectedCard.reason}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-strong)] transition group-hover:gap-3">
          View full rationale
          <span aria-hidden="true">→</span>
        </div>
      </article>
    </Link>
  );
}
