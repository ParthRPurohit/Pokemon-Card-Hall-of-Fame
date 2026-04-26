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
