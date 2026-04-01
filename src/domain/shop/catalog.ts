import type { ShopCategory, ShopItemId } from "@/domain/types";

export interface ShopItemDefinition {
  id: ShopItemId;
  category: ShopCategory;
  title: string;
  subtitle: string;
  cost: number;
  icon: string;
  rarityLabel?: string;
  flavor: string;
  theme?: string;
}

const heroItems: ShopItemDefinition[] = [
  {
    id: "hero-cape-crimson",
    category: "hero",
    title: "Capa Carmesim",
    subtitle: "Visual do Herói",
    cost: 120,
    icon: "🧣",
    rarityLabel: "Comum",
    flavor: "Uma capa leve para dar mais presenca ao aventureiro."
  },
  {
    id: "hero-helm-silver",
    category: "hero",
    title: "Elmo Prateado",
    subtitle: "Visual do Herói",
    cost: 220,
    icon: "⛑️",
    rarityLabel: "Raro",
    flavor: "Um elmo de feira militar que deixa o perfil mais heroico."
  },
  {
    id: "hero-banner-frame",
    category: "hero",
    title: "Moldura de Estandarte",
    subtitle: "Visual do Herói",
    cost: 180,
    icon: "🏰",
    rarityLabel: "Comum",
    flavor: "Adiciona uma moldura nobre ao retrato do personagem."
  }
];

const villageItems: ShopItemDefinition[] = [
  {
    id: "village-forge",
    category: "village",
    title: "Ferraria da Vila",
    subtitle: "Restauração do Reino",
    cost: 260,
    icon: "⚒️",
    rarityLabel: "Raro",
    flavor: "Reacende a forja e devolve vida ao centro da aldeia."
  },
  {
    id: "village-garden",
    category: "village",
    title: "Jardim do Patio",
    subtitle: "Restauração do Reino",
    cost: 160,
    icon: "🌿",
    rarityLabel: "Comum",
    flavor: "Flores e ervas deixam a base mais acolhedora."
  },
  {
    id: "village-library",
    category: "village",
    title: "Biblioteca Antiga",
    subtitle: "Restauração do Reino",
    cost: 340,
    icon: "📖",
    rarityLabel: "Épico",
    flavor: "Um espaço de estudo que valoriza disciplina e constância."
  }
];

const companionGroups = [
  {
    theme: "Floresta",
    entries: [
      ["Raposa", "🦊"], ["Coruja", "🦉"], ["Coelho", "🐇"], ["Cervo", "🦌"], ["Esquilo", "🐿️"],
      ["Javali", "🐗"], ["Lobo", "🐺"], ["Corvo", "🐦"], ["Lontra", "🦦"], ["Falcao", "🦅"]
    ]
  },
  {
    theme: "Mistico",
    entries: [
      ["Slime", "🫧"], ["Sprite", "✨"], ["Fada", "🧚"], ["Wisp", "💫"], ["Mimo", "🌟"],
      ["Nimbo", "☁️"], ["Golem", "🗿"], ["Draco", "🐉"], ["Lince Arcano", "🐆"], ["Sombra", "👤"]
    ]
  },
  {
    theme: "Aguas",
    entries: [
      ["Axolote", "🦎"], ["Sapo", "🐸"], ["Carpa", "🐟"], ["Medusa", "🪼"], ["Cascudo", "🐠"],
      ["Golfinho", "🐬"], ["Salamandra", "🦎"], ["Tartaruga", "🐢"], ["Nereida", "🧜"], ["Enguia", "🐍"]
    ]
  },
  {
    theme: "Chamas",
    entries: [
      ["Salamandra de Fogo", "🦎"], ["Fenix", "🕊️"], ["Brasa", "🔥"], ["Fauno Rubro", "🦌"], ["Carbon", "🪨"],
      ["Ignis", "☄️"], ["Tocha Viva", "🕯️"], ["Faísca", "⚡"], ["Magma", "🌋"], ["Lavaj", "🐲"]
    ]
  },
  {
    theme: "Céu",
    entries: [
      ["Andorinha", "🐦"], ["Grifo", "🦅"], ["Albatroz", "🕊️"], ["Pegaso", "🪽"], ["Nuvem", "☁️"],
      ["Gavião", "🦅"], ["Arpia", "🪽"], ["Vento", "💨"], ["Aster", "⭐"], ["Nimbus", "🌥️"]
    ]
  },
  {
    theme: "Noite",
    entries: [
      ["Morcego", "🦇"], ["Pantera", "🐈"], ["Coruja Lunar", "🦉"], ["Sombra Noturna", "🌑"], ["Lunis", "🌙"],
      ["Neblina", "🌫️"], ["Vesper", "🌘"], ["Fantasma", "👻"], ["Lince Sombrio", "🐆"], ["Umbra", "🌚"]
    ]
  },
  {
    theme: "Sagrado",
    entries: [
      ["Pomba", "🕊️"], ["Cordeiro", "🐑"], ["Anjo", "😇"], ["Aurora", "🌅"], ["Halo", "💍"],
      ["Serafim", "👼"], ["Lirio", "🌼"], ["Guardiao", "🛡️"], ["Virtude", "✨"], ["Lumen", "🕯️"]
    ]
  },
  {
    theme: "Pedra",
    entries: [
      ["Marmore", "🪨"], ["Granito", "🪨"], ["Basalto", "🪨"], ["Topazio", "💎"], ["Rubi", "♦️"],
      ["Quartzo", "🔷"], ["Obsidia", "⬛"], ["Ametista", "🟣"], ["Jade", "🟢"], ["Agata", "🟠"]
    ]
  },
  {
    theme: "Vila",
    entries: [
      ["Gato", "🐈"], ["Cachorro", "🐕"], ["Pato", "🦆"], ["Galo", "🐓"], ["Cabra", "🐐"],
      ["Ovelha", "🐑"], ["Boi", "🐂"], ["Burro", "🫏"], ["Rato", "🐀"], ["Pombo", "🕊️"]
    ]
  },
  {
    theme: "Lendas",
    entries: [
      ["Minidraco", "🐉"], ["Quimera", "🦁"], ["Hidra", "🐍"], ["Unicornio", "🦄"], ["Basilisco", "🦎"],
      ["Manticora", "🦂"], ["Kraken", "🐙"], ["Wyvern", "🐲"], ["Cerbero", "🐕"], ["Kirin", "🦌"]
    ]
  }
] as const;

const companionItems: ShopItemDefinition[] = companionGroups.flatMap((group) =>
  group.entries.map(([name, icon], index) => ({
    id: `companion-${group.theme.toLowerCase()}-${index + 1}`,
    category: "companion" as const,
    title: name,
    subtitle: "Companheiro",
    cost: 1000,
    icon,
    flavor: `Um companheiro do tema ${group.theme.toLowerCase()} para acompanhar sua jornada.`,
    theme: group.theme
  }))
);

export const shopCatalog: ShopItemDefinition[] = [...heroItems, ...villageItems, ...companionItems];

export const getShopItem = (id: ShopItemId) => shopCatalog.find((item) => item.id === id);
export const getShopItemsByCategory = (category: ShopCategory) => shopCatalog.filter((item) => item.category === category);
export const getCompanionThemes = () =>
  [...new Set(companionItems.map((item) => item.theme).filter((theme): theme is string => Boolean(theme)))];
