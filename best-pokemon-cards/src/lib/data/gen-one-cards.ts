import type { PokemonCardRecord } from "@/lib/types";

export const genOneCompetitiveCards: PokemonCardRecord[] = [
  {
    id: 1,
    dexNumber: 6,
    name: "Charizard",
    slug: "charizard",
    selectedCard: {
      cardName: "Charizard ex",
      setName: "Obsidian Flames",
      cardNumber: "125/197",
      imageUrl: "https://images.pokemontcg.io/sv3/125_hires.png",
      reason:
        "A real tournament anchor with self-accelerating damage output and one of the clearest recent Charizard win conditions.",
      explanation:
        "Among Charizard cards, this one has the strongest case as the competitive benchmark because it turned the name into a top-tier archetype rather than a niche inclusion. Infernal Reign dramatically compresses setup by jumping Basic Fire Energy from deck to board, and Burning Darkness scales to relevant knockout thresholds as prize counts shift. Compared with iconic but less successful Charizard cards, this pick has the deepest modern tournament relevance.",
      confidence: "High",
      era: "Scarlet & Violet",
      formatFocus: "Standard tournament archetypes",
      evidenceLinks: [
        {
          label: "Limitless deck search",
          url: "https://limitlesstcg.com/cards/OBF/125",
          note: "Track placements and deck adoption for the Obsidian Flames Charizard ex build.",
        },
        {
          label: "PkmnCards print reference",
          url: "https://pkmncards.com/?s=charizard+ex+obsidian+flames&sort=date&ord=auto&display=images",
          note: "Verify the exact print and compare with other Charizard variants.",
        },
        {
          label: "TCGplayer market listing",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Charizard+ex+Obsidian+Flames",
          note: "Useful for confirming the exact card and its common listing title.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Charizard+ex+Obsidian+Flames",
        limitless: "https://limitlesstcg.com/cards/OBF/125",
        pkmncards:
          "https://pkmncards.com/?s=charizard+ex+obsidian+flames&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 2,
    dexNumber: 9,
    name: "Blastoise",
    slug: "blastoise",
    selectedCard: {
      cardName: "Blastoise",
      setName: "Boundaries Crossed",
      cardNumber: "31/149",
      imageUrl: "https://images.pokemontcg.io/bw7/31_hires.png",
      reason:
        "Deluge remains the defining competitive Blastoise ability because it enabled explosive multi-Energy turns instead of just supporting slower Water shells.",
      explanation:
        "Blastoise has several beloved cards, but Boundaries Crossed Blastoise is the cleanest tournament-era reference point because Deluge enabled an entire archetype and materially changed how Water decks could sequence attacks. It powered Black Kyurem EX and Keldeo-EX lines with immediate burst potential, which gives it a stronger competitive identity than most other Blastoise prints.",
      confidence: "Medium",
      era: "Black & White",
      formatFocus: "Historical tournament archetypes",
      evidenceLinks: [
        {
          label: "PkmnCards search for Deluge Blastoise",
          url: "https://pkmncards.com/?s=blastoise+boundaries+crossed&sort=date&ord=auto&display=images",
          note: "Confirms the specific Deluge print that defined the deck.",
        },
        {
          label: "Limitless deck references",
          url: "https://limitlesstcg.com/decks?variants=true&q=blastoise",
          note: "A quick way to inspect whether Blastoise archetype references surface in competitive archives.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Blastoise+Boundaries+Crossed",
          note: "Cross-check naming and print details.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Blastoise+Boundaries+Crossed",
        limitless: "https://limitlesstcg.com/decks?variants=true&q=blastoise",
        pkmncards:
          "https://pkmncards.com/?s=blastoise+boundaries+crossed&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 3,
    dexNumber: 3,
    name: "Venusaur",
    slug: "venusaur",
    selectedCard: {
      cardName: "Venusaur & Snivy-GX",
      setName: "Cosmic Eclipse",
      cardNumber: "1/236",
      imageUrl: "https://images.pokemontcg.io/sm12/1_hires.png",
      reason:
        "A more credible competitive Venusaur representative than most solo Venusaur prints because it delivered acceleration and disruption in real grass-based shells.",
      explanation:
        "Venusaur has comparatively fewer top-level competitive peaks than Charizard or Blastoise, so the best pick is more arguable. Venusaur & Snivy-GX stands out because its attack profile and GX effect gave Grass decks a meaningful utility package, and it shows up more naturally in competitive discussion than many slower Venusaur cards. This is a strong placeholder choice but still worth revisiting when the dataset expands.",
      confidence: "Needs Review",
      era: "Sun & Moon",
      formatFocus: "Expanded and historical grass strategies",
      evidenceLinks: [
        {
          label: "PkmnCards print search",
          url: "https://pkmncards.com/?s=venusaur+snivy-gx&sort=date&ord=auto&display=images",
          note: "Compare this tag team with other Venusaur candidates.",
        },
        {
          label: "Limitless search",
          url: "https://limitlesstcg.com/cards?query=venusaur",
          note: "Useful for checking whether other Venusaur-era prints have a stronger tournament case.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Venusaur+%26+Snivy-GX",
          note: "Quick product reference for the chosen print.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Venusaur+%26+Snivy-GX",
        limitless: "https://limitlesstcg.com/cards?query=venusaur",
        pkmncards:
          "https://pkmncards.com/?s=venusaur+snivy-gx&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 4,
    dexNumber: 25,
    name: "Pikachu",
    slug: "pikachu",
    selectedCard: {
      cardName: "Flying Pikachu VMAX",
      setName: "Celebrations",
      cardNumber: "7/25",
      imageUrl: "https://images.pokemontcg.io/cel25/7_hires.png",
      reason:
        "One of the few Pikachu-named cards that functioned as a serious meta call thanks to its immunity pressure against basic-heavy decks.",
      explanation:
        "Pikachu is iconic, but most Pikachu cards have not been the center of elite competitive results. Flying Pikachu VMAX earns this slot because it became a genuine counter-meta inclusion and occasionally a featured attacker, especially when Fighting weakness coverage and Basic Pokemon immunity mattered. That makes it a stronger competitive entry than more collectible-only Pikachu prints.",
      confidence: "Medium",
      era: "Sword & Shield",
      formatFocus: "Standard metagame counter play",
      evidenceLinks: [
        {
          label: "Limitless card page",
          url: "https://limitlesstcg.com/cards/CEL/7",
          note: "Check card text and how often the card surfaced in lists.",
        },
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=flying+pikachu+vmax&sort=date&ord=auto&display=images",
          note: "Confirm the exact VMAX print used competitively.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Flying+Pikachu+VMAX",
          note: "Cross-reference the product entry and print.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Flying+Pikachu+VMAX",
        limitless: "https://limitlesstcg.com/cards/CEL/7",
        pkmncards:
          "https://pkmncards.com/?s=flying+pikachu+vmax&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 5,
    dexNumber: 150,
    name: "Mewtwo",
    slug: "mewtwo",
    selectedCard: {
      cardName: "Mewtwo & Mew-GX",
      setName: "Unified Minds",
      cardNumber: "71/236",
      imageUrl: "https://images.pokemontcg.io/sm11/71_hires.png",
      reason:
        "An all-time flexible attacker shell that converted Mewtwo into a format-defining toolbox centerpiece.",
      explanation:
        "This is one of the easiest selections in the seed file. Mewtwo & Mew-GX wasn't just playable, it was a format-shaping engine that could copy attacks from GX and EX Pokemon across the board. Its adaptability, tournament success, and longevity give it a much stronger competitive claim than most standalone Mewtwo cards.",
      confidence: "High",
      era: "Sun & Moon",
      formatFocus: "Standard and Expanded toolbox archetypes",
      evidenceLinks: [
        {
          label: "Limitless card page",
          url: "https://limitlesstcg.com/cards/UNM/71",
          note: "A strong starting point for tournament context and deck usage.",
        },
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=mewtwo+%26+mew-gx&sort=date&ord=auto&display=images",
          note: "Compare print variants and confirm the Unified Minds release.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Mewtwo+%26+Mew-GX",
          note: "Useful for exact listing nomenclature.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Mewtwo+%26+Mew-GX",
        limitless: "https://limitlesstcg.com/cards/UNM/71",
        pkmncards:
          "https://pkmncards.com/?s=mewtwo+%26+mew-gx&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 6,
    dexNumber: 151,
    name: "Mew",
    slug: "mew",
    selectedCard: {
      cardName: "Mew ex",
      setName: "Legend Maker",
      cardNumber: "88/92",
      imageUrl: "https://images.pokemontcg.io/ex12/88_hires.png",
      reason:
        "Versatile copy effects and broad utility gave this Mew a longstanding reputation as one of the most competitively meaningful prints bearing the name.",
      explanation:
        "Mew has many playable prints, so this slot is debatable. Legend Maker Mew ex is a strong seed choice because it offered remarkable flexibility through its attack-copying role and maintained a memorable tournament identity in its era. There are other contenders, including more modern utility Mew cards, so this entry is intentionally marked as a review candidate as the project matures.",
      confidence: "Needs Review",
      era: "EX Series",
      formatFocus: "Historical utility attacker",
      evidenceLinks: [
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=mew+ex+legend+maker&sort=date&ord=auto&display=images",
          note: "Check the exact Legend Maker print and compare alternative Mew choices.",
        },
        {
          label: "Limitless Mew card search",
          url: "https://limitlesstcg.com/cards?query=mew",
          note: "Helpful for finding modern Mew candidates that may challenge this slot.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Mew+ex+Legend+Maker",
          note: "Marketplace reference for the selected print.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Mew+ex+Legend+Maker",
        limitless: "https://limitlesstcg.com/cards?query=mew",
        pkmncards:
          "https://pkmncards.com/?s=mew+ex+legend+maker&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 7,
    dexNumber: 35,
    name: "Clefairy",
    slug: "clefairy",
    selectedCard: {
      cardName: "Clefairy",
      setName: "Base Set",
      cardNumber: "5/102",
      imageUrl: "https://images.pokemontcg.io/base1/5_hires.png",
      reason:
        "An iconic early-game competitive staple whose disruptive metronome effect mattered in the original era.",
      explanation:
        "Clefairy does not have a deep modern competitive catalog, so Base Set Clefairy remains the most defensible first-pass answer. Metronome let it borrow powerful attacks for a single Colorless Energy, which gave the card genuine tactical value in early organized play and makes it more than a nostalgia pick.",
      confidence: "Low",
      era: "Base Set",
      formatFocus: "Early format historical relevance",
      evidenceLinks: [
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=clefairy+base+set&sort=date&ord=auto&display=images",
          note: "Confirms the classic holo print and helps compare later Clefairy cards.",
        },
        {
          label: "Limitless Clefairy search",
          url: "https://limitlesstcg.com/cards?query=clefairy",
          note: "A good check for whether any later-era options make a stronger case.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Clefairy+Base+Set",
          note: "Marketplace reference for the chosen print.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Clefairy+Base+Set",
        limitless: "https://limitlesstcg.com/cards?query=clefairy",
        pkmncards:
          "https://pkmncards.com/?s=clefairy+base+set&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 8,
    dexNumber: 94,
    name: "Gengar",
    slug: "gengar",
    selectedCard: {
      cardName: "Gengar & Mimikyu-GX",
      setName: "Team Up",
      cardNumber: "53/181",
      imageUrl: "https://images.pokemontcg.io/sm9/53_hires.png",
      reason:
        "A disruptive hand-pressure attacker that gave Gengar one of its clearest high-level competitive identities in modern play.",
      explanation:
        "Gengar has several strong candidates, but Gengar & Mimikyu-GX stands out because it appeared in real control and disruption conversations instead of being merely a flavorful attacker. Horror House-GX could create devastating tempo swings, and the card remained relevant as a utility threat across multiple shells.",
      confidence: "Medium",
      era: "Sun & Moon",
      formatFocus: "Control and disruption archetypes",
      evidenceLinks: [
        {
          label: "Limitless card page",
          url: "https://limitlesstcg.com/cards/TEU/53",
          note: "Review card text and tournament-era references.",
        },
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=gengar+%26+mimikyu-gx&sort=date&ord=auto&display=images",
          note: "Compare this tag team with other competitive Gengar options.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Gengar+%26+Mimikyu-GX",
          note: "Marketplace reference for the selected print.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Gengar+%26+Mimikyu-GX",
        limitless: "https://limitlesstcg.com/cards/TEU/53",
        pkmncards:
          "https://pkmncards.com/?s=gengar+%26+mimikyu-gx&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 9,
    dexNumber: 65,
    name: "Alakazam",
    slug: "alakazam",
    selectedCard: {
      cardName: "Alakazam",
      setName: "Base Set",
      cardNumber: "1/102",
      imageUrl: "https://images.pokemontcg.io/base1/1_hires.png",
      reason:
        "Damage Swap is still the most famous and competitively meaningful Alakazam effect ever printed.",
      explanation:
        "Alakazam's strongest claim to competitive history still comes from Base Set. Damage Swap created one of the foundational control-combo engines in the early game, especially alongside Mr. Mime and healing loops. Later Alakazam prints have interesting roles, but none are as historically defining for the name's competitive legacy.",
      confidence: "Medium",
      era: "Base Set",
      formatFocus: "Historical combo-control archetypes",
      evidenceLinks: [
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=alakazam+base+set&sort=date&ord=auto&display=images",
          note: "Confirms the Damage Swap print and helps compare later versions.",
        },
        {
          label: "Limitless Alakazam search",
          url: "https://limitlesstcg.com/cards?query=alakazam",
          note: "Useful for checking whether later Alakazam cards surfaced competitively.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Alakazam+Base+Set",
          note: "Marketplace reference for the selected print.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Alakazam+Base+Set",
        limitless: "https://limitlesstcg.com/cards?query=alakazam",
        pkmncards:
          "https://pkmncards.com/?s=alakazam+base+set&sort=date&ord=auto&display=images",
      },
    },
  },
  {
    id: 10,
    dexNumber: 143,
    name: "Snorlax",
    slug: "snorlax",
    selectedCard: {
      cardName: "Snorlax",
      setName: "Pokemon GO",
      cardNumber: "55/78",
      imageUrl: "https://images.pokemontcg.io/pgo/55_hires.png",
      reason:
        "Block made this Snorlax a genuine competitive piece in control and stall shells rather than just a bulky generic attacker.",
      explanation:
        "Snorlax has a longer list of viable role-player cards than some of the other seeded Pokemon, but Pokemon GO Snorlax is a compelling current-era choice because Block gives it a concrete strategic identity in disruptive decks. Its role is narrow, yet it is meaningfully competitive and easier to defend for this project than nostalgia-driven alternatives.",
      confidence: "High",
      era: "Sword & Shield",
      formatFocus: "Control and stall archetypes",
      evidenceLinks: [
        {
          label: "Limitless card page",
          url: "https://limitlesstcg.com/cards/PGO/55",
          note: "Review the exact Block print and card text.",
        },
        {
          label: "PkmnCards search",
          url: "https://pkmncards.com/?s=snorlax+pokemon+go&sort=date&ord=auto&display=images",
          note: "Compare this Snorlax with other role-player variants.",
        },
        {
          label: "TCGplayer listing search",
          url: "https://www.tcgplayer.com/search/pokemon/product?q=Snorlax+Pokemon+GO+55%2F78",
          note: "Marketplace reference for the chosen card.",
        },
      ],
      externalLinks: {
        tcgplayer:
          "https://www.tcgplayer.com/search/pokemon/product?q=Snorlax+Pokemon+GO+55%2F78",
        limitless: "https://limitlesstcg.com/cards/PGO/55",
        pkmncards:
          "https://pkmncards.com/?s=snorlax+pokemon+go&sort=date&ord=auto&display=images",
      },
    },
  },
];

export function getPokemonBySlug(slug: string) {
  return genOneCompetitiveCards.find((pokemon) => pokemon.slug === slug);
}
