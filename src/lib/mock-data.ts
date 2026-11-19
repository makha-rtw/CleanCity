export type ReportStatus =
  | "reported"
  | "assigned"
  | "scheduled"
  | "completed";

export type WasteCategory =
  | "plastique"
  | "menager_mixte"
  | "organique"
  | "gravats"
  | "carton_papier"
  | "metal_verre";

export type UrgencyLevel = "moderee" | "elevee" | "critique";

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  moderee: "Modérée",
  elevee: "Élevée",
  critique: "Critique",
};

export interface TimelineEvent {
  status: ReportStatus;
  label: string;
  timestamp: string;
  actor?: string;
  note?: string;
}

export interface WasteReport {
  id: string;
  code: string;
  quartier: string;
  addressHint: string;
  lat: number;
  lng: number;
  category: WasteCategory;
  urgency: UrgencyLevel;
  description: string;
  status: ReportStatus;
  createdAt: string;
  scheduledFor?: string;
  completedAt?: string;
  reporterName: string;
  reporterPhone: string;
  assignedAgent?: string;
  assignedTeam?: string;
  estimatedKg: number;
  pointsAwarded: number;
  photoBefore: string;
  photoAfter?: string;
  compressedSizeKb: number;
  originalSizeMb: number;
  upvotes: number;
  timeline: TimelineEvent[];
}

export interface EcoKiosk {
  id: string;
  name: string;
  quartier: string;
  lat: number;
  lng: number;
  acceptedCategories: WasteCategory[];
  openHours: string;
  managerName: string;
  phone: string;
  bonusMultiplier: string;
  fillLevelPercent: number;
}

export interface RecyclerLot {
  id: string;
  code: string;
  material: string;
  category: WasteCategory;
  subType: string;
  weightKg: number;
  purityPercent: number;
  pricePerKgCFA: number;
  totalPriceCFA: number;
  kioskOrigin: string;
  quartier: string;
  availableSince: string;
  status: "disponible" | "reserve" | "enleve";
  reservedBy?: string;
  balesCount: number;
}

export interface RewardItem {
  id: string;
  title: string;
  partner: string;
  category: "telecom" | "alimentation" | "transport" | "ecologie";
  pointsCost: number;
  valueLabel: string;
  description: string;
  badgeColor: string;
  stockCount: number;
}

export interface QuartierStat {
  name: string;
  lat: number;
  lng: number;
  reportsTotal: number;
  reportsResolved: number;
  avgResolutionHours: number;
  kgRecycled: number;
  activeHouseholds: number;
  cleanlinessScore: number;
  rank: number;
  trend: string;
}

export const PRESET_REPORT_PHOTOS = [
  {
    id: "preset-diokoul",
    label: "Débordement bac — Avenue Diokoul (Arrêt AFTU)",
    quartier: "Diokoul",
    category: "menager_mixte" as WasteCategory,
    originalMb: 3.8,
    compressedKb: 138,
    uri: "/avant.jpg",
  },
  {
    id: "preset-thiawlene",
    label: "3 bacs saturés — Carrefour Thiawlène",
    quartier: "Thiawlène",
    category: "plastique" as WasteCategory,
    originalMb: 3.1,
    compressedKb: 122,
    uri: "/avant2.jpg",
  },
];

export const CLEAN_AFTER_PHOTO = "/apres.jpg";

export const WASTE_CATEGORIES: Record<
  WasteCategory,
  {
    label: string;
    labelWo: string;
    points: number;
    recyclable: boolean;
    color: string;
    description: string;
    examples: string;
  }
> = {
  plastique: {
    label: "Plastiques & Sachets",
    labelWo: "Mbouss ak Buteelu Plastik",
    points: 65,
    recyclable: true,
    color: "#00876C",
    description: "Bouteilles d’eau, bidons PEHD, sachets et bassines",
    examples: "Bouteilles Kirène/Laafi, bidons d’huile 5L, sachets propres",
  },
  menager_mixte: {
    label: "Dépôt Ménager Mixte",
    labelWo: "Mbalitu Keur",
    points: 50,
    recyclable: false,
    color: "#C6462A",
    description: "Poubelle débordante ou tas d’ordures non triées",
    examples: "Sacs poubelles éventrés, dépôts au coin de rue",
  },
  organique: {
    label: "Organique & Marché",
    labelWo: "Mbalitu Waañ ak Marse",
    points: 55,
    recyclable: true,
    color: "#15803D",
    description: "Restes alimentaires, épluchures de légumes, feuilles",
    examples: "Épluchures de manioc, fanes, résidus de poisson ou marché",
  },
  carton_papier: {
    label: "Carton & Emballages",
    labelWo: "Kartoŋ ak Kayit",
    points: 60,
    recyclable: true,
    color: "#D97706",
    description: "Caisses de boutique, cartons secs, journaux",
    examples: "Cartons de grossistes, boîtes d’emballage sèches",
  },
  metal_verre: {
    label: "Métal, Canettes & Verre",
    labelWo: "Weñ ak Buteelu Verre",
    points: 75,
    recyclable: true,
    color: "#0B4F3F",
    description: "Canettes aluminium, ferraille légère, bouteilles en verre",
    examples: "Canettes de jus, boîtes de conserve, ferraille",
  },
  gravats: {
    label: "Gravats & Encombrants",
    labelWo: "Doj ak Tabax",
    points: 45,
    recyclable: false,
    color: "#64748B",
    description: "Débris de chantier, briques, vieux meubles ou pneus",
    examples: "Briques cassées, sable souillé, pneus usagés",
  },
};

export const RUFISQUE_QUARTIERS: QuartierStat[] = [
  {
    name: "Diokoul",
    lat: 14.7185,
    lng: -17.2782,
    reportsTotal: 142,
    reportsResolved: 134,
    avgResolutionHours: 2.8,
    kgRecycled: 4820,
    activeHouseholds: 640,
    cleanlinessScore: 94,
    rank: 1,
    trend: "+12 % ce mois",
  },
  {
    name: "Thiawlène",
    lat: 14.7112,
    lng: -17.2634,
    reportsTotal: 128,
    reportsResolved: 118,
    avgResolutionHours: 3.2,
    kgRecycled: 4190,
    activeHouseholds: 585,
    cleanlinessScore: 91,
    rank: 2,
    trend: "+9 % ce mois",
  },
  {
    name: "Keur Ndiaye Lo",
    lat: 14.7568,
    lng: -17.2415,
    reportsTotal: 164,
    reportsResolved: 145,
    avgResolutionHours: 3.9,
    kgRecycled: 3940,
    activeHouseholds: 530,
    cleanlinessScore: 88,
    rank: 3,
    trend: "+18 % ce mois",
  },
  {
    name: "Colobane",
    lat: 14.7242,
    lng: -17.2689,
    reportsTotal: 115,
    reportsResolved: 98,
    avgResolutionHours: 4.1,
    kgRecycled: 3110,
    activeHouseholds: 420,
    cleanlinessScore: 85,
    rank: 4,
    trend: "+7 % ce mois",
  },
  {
    name: "Mérina",
    lat: 14.7198,
    lng: -17.2715,
    reportsTotal: 96,
    reportsResolved: 81,
    avgResolutionHours: 4.4,
    kgRecycled: 2680,
    activeHouseholds: 375,
    cleanlinessScore: 83,
    rank: 5,
    trend: "+5 % ce mois",
  },
  {
    name: "Gouye Mouride",
    lat: 14.7285,
    lng: -17.2595,
    reportsTotal: 109,
    reportsResolved: 88,
    avgResolutionHours: 4.8,
    kgRecycled: 2390,
    activeHouseholds: 340,
    cleanlinessScore: 79,
    rank: 6,
    trend: "+11 % ce mois",
  },
];

export const INITIAL_REPORTS: WasteReport[] = [
  {
    id: "rep-101",
    code: "RF-2048",
    quartier: "Diokoul",
    addressHint: "Avenue principale, arrêt bus AFTU",
    lat: 14.7188,
    lng: -17.2775,
    category: "menager_mixte",
    urgency: "elevee",
    description:
      "Bac municipal saturé et dépôts accumulés le long du terre-plein central.",
    status: "scheduled",
    createdAt: "2026-11-19T07:15:00Z",
    scheduledFor: "Aujourd’hui à 11h30",
    reporterName: "Aminata Sow",
    reporterPhone: "+221 77 412 88 90",
    assignedAgent: "Moussa Diop",
    assignedTeam: "GIE Setal Diokoul (Tricycle #04)",
    estimatedKg: 185,
    pointsAwarded: 65,
    photoBefore: "/avant.jpg",
    photoAfter: "/apres.jpg",
    compressedSizeKb: 138,
    originalSizeMb: 3.8,
    upvotes: 14,
    timeline: [
      {
        status: "reported",
        label: "Signalé gratuitement par Aminata Sow",
        timestamp: "07h15",
        note: "Photo géolocalisée vérifiée (compression auto 138 Ko)",
      },
      {
        status: "assigned",
        label: "Pris en charge par GIE Setal Diokoul",
        timestamp: "07h42",
        actor: "Moussa Diop · Chef d’équipe",
      },
      {
        status: "scheduled",
        label: "Collecte programmée — Équipe en tournée",
        timestamp: "08h30",
        note: "Passage prévu à 11h30",
      },
    ],
  },
  {
    id: "rep-102",
    code: "RF-2044",
    quartier: "Thiawlène",
    addressHint: "Carrefour principal, 3 bacs municipaux",
    lat: 14.7109,
    lng: -17.2628,
    category: "plastique",
    urgency: "critique",
    description:
      "Trois bacs municipaux saturés avec débordement de cartons et plastiques au carrefour.",
    status: "reported",
    createdAt: "2026-11-19T08:40:00Z",
    reporterName: "Ibrahima Fall",
    reporterPhone: "+221 78 190 45 12",
    estimatedKg: 240,
    pointsAwarded: 65,
    photoBefore: "/avant2.jpg",
    photoAfter: "/apres2.jpg",
    compressedSizeKb: 122,
    originalSizeMb: 3.1,
    upvotes: 29,
    timeline: [
      {
        status: "reported",
        label: "Signalé gratuitement par Ibrahima Fall",
        timestamp: "08h40",
        note: "En attente de prise en charge par l’équipe GIE de Thiawlène",
      },
    ],
  },
];

export const ECO_KIOSKS: EcoKiosk[] = [
  {
    id: "kiosk-1",
    name: "Éco-Kiosque Diokoul Gare",
    quartier: "Diokoul",
    lat: 14.7194,
    lng: -17.2745,
    acceptedCategories: ["plastique", "carton_papier", "metal_verre"],
    openHours: "Lun–Sam · 08h00 – 19h30",
    managerName: "Awa Cissé",
    phone: "+221 77 811 22 33",
    bonusMultiplier: "x1.5 pts sur le PET clair",
    fillLevelPercent: 64,
  },
  {
    id: "kiosk-2",
    name: "Point Vert Thiawlène Littoral",
    quartier: "Thiawlène",
    lat: 14.7125,
    lng: -17.2612,
    acceptedCategories: ["plastique", "metal_verre", "organique"],
    openHours: "Tous les jours · 07h30 – 20h00",
    managerName: "Babacar Ndoye",
    phone: "+221 78 302 91 00",
    bonusMultiplier: "Pesée instantanée Wave / Points",
    fillLevelPercent: 78,
  },
  {
    id: "kiosk-3",
    name: "Hub Circulaire Keur Ndiaye Lo",
    quartier: "Keur Ndiaye Lo",
    lat: 14.7512,
    lng: -17.2435,
    acceptedCategories: [
      "plastique",
      "carton_papier",
      "metal_verre",
      "organique",
    ],
    openHours: "Lun–Sam · 08h00 – 18h30",
    managerName: "Mamadou Lamine Seck",
    phone: "+221 77 944 10 55",
    bonusMultiplier: "+100 pts dès 10 kg déposés",
    fillLevelPercent: 45,
  },
];

export const INITIAL_RECYCLER_LOTS: RecyclerLot[] = [
  {
    id: "lot-301",
    code: "LOT-PET-89",
    material: "Plastique PET Transparent Compacté",
    category: "plastique",
    subType: "Bouteilles d’eau lavées & triées sans bouchon",
    weightKg: 850,
    purityPercent: 97,
    pricePerKgCFA: 175,
    totalPriceCFA: 148750,
    kioskOrigin: "Point Vert Thiawlène Littoral",
    quartier: "Thiawlène",
    availableSince: "Aujourd’hui · 08h15",
    status: "disponible",
    balesCount: 17,
  },
  {
    id: "lot-302",
    code: "LOT-PEHD-42",
    material: "Flacons & Bidons PEHD Couleur",
    category: "plastique",
    subType: "Bidons rigides triés par densité",
    weightKg: 620,
    purityPercent: 95,
    pricePerKgCFA: 210,
    totalPriceCFA: 130200,
    kioskOrigin: "Éco-Kiosque Diokoul Gare",
    quartier: "Diokoul",
    availableSince: "Hier · 16h40",
    status: "disponible",
    balesCount: 12,
  },
  {
    id: "lot-303",
    code: "LOT-CART-19",
    material: "Carton Ondulé Sec Compressé",
    category: "carton_papier",
    subType: "Caisses grossistes Marché Central Rufisque",
    weightKg: 1240,
    purityPercent: 98,
    pricePerKgCFA: 85,
    totalPriceCFA: 105400,
    kioskOrigin: "Collecte Marché Colobane",
    quartier: "Colobane",
    availableSince: "Aujourd’hui · 09h00",
    status: "disponible",
    balesCount: 24,
  },
  {
    id: "lot-304",
    code: "LOT-ALU-07",
    material: "Canettes Aluminium & Métaux Non-Ferreux",
    category: "metal_verre",
    subType: "Aluminium pressé haute densité",
    weightKg: 310,
    purityPercent: 99,
    pricePerKgCFA: 480,
    totalPriceCFA: 148800,
    kioskOrigin: "Hub Circulaire Keur Ndiaye Lo",
    quartier: "Keur Ndiaye Lo",
    availableSince: "Il y a 2 jours",
    status: "reserve",
    reservedBy: "Proplast Industrie SARL",
    balesCount: 6,
  },
];

export const REWARDS_CATALOG: RewardItem[] = [
  {
    id: "rew-1",
    title: "Crédit Téléphonique / Pass Internet 1 Go",
    partner: "Orange Sénégal · Free · Expresso",
    category: "telecom",
    pointsCost: 400,
    valueLabel: "1 000 FCFA",
    description:
      "Recharge immédiate envoyée sur votre numéro (+221) dès validation.",
    badgeColor: "#D97706",
    stockCount: 140,
  },
  {
    id: "rew-2",
    title: "Transfert Cash Mobile Éco-Prime",
    partner: "Wave Sénégal",
    category: "telecom",
    pointsCost: 750,
    valueLabel: "2 000 FCFA",
    description:
      "Virement instantané sans frais sur votre compte Wave après pesée en Éco-Kiosque.",
    badgeColor: "#00876C",
    stockCount: 85,
  },
  {
    id: "rew-3",
    title: "Bon d’Achat Alimentaire & Savon",
    partner: "Boutiques Solidaire Diokoul & Auchan Rufisque",
    category: "alimentation",
    pointsCost: 900,
    valueLabel: "2 500 FCFA",
    description:
      "Valable sur le riz, l’huile, le savon de Marseille et les produits d’entretien.",
    badgeColor: "#0B4F3F",
    stockCount: 60,
  },
  {
    id: "rew-4",
    title: "Sac de Compost Naturel + Plant de Moringa",
    partner: "Pépinière Municipale de Rufisque",
    category: "ecologie",
    pointsCost: 350,
    valueLabel: "Kit Jardin 5 kg",
    description:
      "Compost 100 % produit à partir des déchets organiques du marché de Rufisque.",
    badgeColor: "#15803D",
    stockCount: 45,
  },
];

export const SORTING_GUIDES = [
  {
    id: "guide-pet",
    title: "Plastiques (PET & Bidons)",
    wolofHint: "Buteelu ndox ak bidon",
    accent: "#00876C",
    pointsPerKg: "35 pts / kg",
    doList: [
      "Vider complètement les bouteilles d’eau et de jus",
      "Les écraser à plat pour gagner 3x plus de place",
      "Séparer les bidons d’huile/javel rigides (très recherchés !)",
    ],
    dontList: [
      "Ne pas mélanger avec des restes de sauce ou de nourriture",
      "Ne pas brûler le plastique à l’air libre (fumées toxiques)",
    ],
  },
  {
    id: "guide-org",
    title: "Déchets Organiques & Cuisine",
    wolofHint: "Mbalitu waañ ak marse",
    accent: "#15803D",
    pointsPerKg: "20 pts / kg",
    doList: [
      "Mettre de côté épluchures de manioc, patate, oignon et feuilles",
      "Égoutter les liquides avant de déposer dans le seau vert",
      "Valorisable en compost fertile pour les maraîchers de Lendeng",
    ],
    dontList: ["Aucun sachet plastique ni pile dans le bac organique"],
  },
  {
    id: "guide-carton",
    title: "Cartons, Papiers & Canettes",
    wolofHint: "Kartoŋ bu wow ak weñ",
    accent: "#D97706",
    pointsPerKg: "30 à 60 pts / kg",
    doList: [
      "Plier les cartons de boutique à plat et les garder au sec",
      "Rincer rapidement les canettes de boisson en aluminium",
    ],
    dontList: [
      "Les cartons imbibés d’huile ou mouillés ne sont plus recyclables",
    ],
  },
];

export const MONTHLY_ANALYTICS_RUFISQUE = [
  { month: "Juin", signalements: 310, traites: 265, tonnesValorisees: 11.4 },
  { month: "Juil", signalements: 380, traites: 342, tonnesValorisees: 14.8 },
  { month: "Août", signalements: 460, traites: 425, tonnesValorisees: 17.2 },
  { month: "Sept", signalements: 520, traites: 492, tonnesValorisees: 21.5 },
  { month: "Oct", signalements: 615, traites: 589, tonnesValorisees: 26.8 },
  { month: "Nov", signalements: 754, traites: 731, tonnesValorisees: 34.2 },
];
