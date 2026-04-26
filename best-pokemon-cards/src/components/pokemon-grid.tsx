"use client";

import { useMemo, useState } from "react";
import { PokemonCardTile } from "@/components/pokemon-card-tile";
import type { PokemonCardRecord } from "@/lib/types";

type PokemonGridProps = {
  pokemonCards: PokemonCardRecord[];
};

export function PokemonGrid({ pokemonCards }: PokemonGridProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return pokemonCards;
    }

    return pokemonCards.filter((pokemon) => {
      const haystack = [
        pokemon.name,
        pokemon.selectedCard.cardName,
        pokemon.selectedCard.setName,
        pokemon.selectedCard.reason,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [pokemonCards, searchTerm]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="section-kicker">Searchable Index</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">
            Current seeded Gen 1 picks
          </h2>
        </div>
        <div className="w-full max-w-md">
          <label htmlFor="pokemon-search" className="sr-only">
            Search Pokemon cards
          </label>
          <input
            id="pokemon-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search Charizard, Base Set, ex, control..."
            className="w-full rounded-full border border-[var(--border-strong)] bg-white px-5 py-3 text-sm text-[var(--ink-strong)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[var(--accent-glow)]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--ink-soft)]">
        <p>
          Showing <span className="font-semibold">{filteredCards.length}</span>{" "}
          of <span className="font-semibold">{pokemonCards.length}</span> seeded
          Pokemon.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCards.map((pokemon) => (
          <PokemonCardTile key={pokemon.slug} pokemon={pokemon} />
        ))}
      </div>

      {filteredCards.length === 0 ? (
        <div className="card-panel p-8 text-center">
          <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
            No matches yet
          </h3>
          <p className="mt-3 text-base leading-7 text-[var(--ink-soft)]">
            Try searching by Pokemon name, card name, set, or a keyword from
            the short reason.
          </p>
        </div>
      ) : null}
    </section>
  );
}
