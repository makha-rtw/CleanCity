export type Locale = "fr" | "wo";

const fr = {
  nav: {
    home: "Accueil",
    map: "Carte",
    report: "Signaler",
    points: "Points",
    profile: "Profil",
  },
  greeting: "Bonjour",
  report: {
    cta: "Signaler un dépôt sauvage",
    free: "Gratuit, en 3 étapes",
    step: "Étape",
    of: "sur",
    photoTitle: "Prenez une photo du dépôt",
    placeTitle: "Où se trouve-t-il\u00A0?",
    typeTitle: "Quel type de déchets\u00A0?",
    next: "Continuer",
    send: "Envoyer le signalement",
    thanks: "Merci",
  },
};

export type Dictionary = typeof fr;

const wo: Dictionary = {
  nav: {
    home: "Kër",
    map: "Kart",
    report: "Yëgle",
    points: "Poñ",
    profile: "Sama kont",
  },
  greeting: "Salaam aleekum",
  report: {
    cta: "Yëgle mbalit mu ñu sànni",
    free: "Amul fay, 3 tappal",
    step: "Tappal",
    of: "ci",
    photoTitle: "Nataal mbalit mi",
    placeTitle: "Fan la nekk\u00A0?",
    typeTitle: "Ban xeetu mbalit la\u00A0?",
    next: "Kontine",
    send: "Yónne ko",
    thanks: "Jërëjëf",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, wo };
