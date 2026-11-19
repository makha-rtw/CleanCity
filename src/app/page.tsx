"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Plus,
  Camera,
  MapPin,
  Truck,
  Recycle,
  Building2,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useCleanCity } from "@/lib/store";
import {
  Reveal,
  AnimatedHeadline,
  CountUp,
  MarqueeTicker,
  EASE_OUT_EXPO,
} from "@/components/ui/motion";

const HERO_SCENES = [
  {
    id: "signalement",
    tag: "01 · Signalement Habitant",
    quartier: "Diokoul · Avenue principale",
    title: "Signalé en 10 secondes, 100 % gratuit",
    metric: "+65 pts",
    metricLabel: "Crédités dès l’envoi",
    status: "Photo compressée à 138 Ko",
    image: "/avant.jpg",
  },
  {
    id: "collecte",
    tag: "02 · Intervention GIE",
    quartier: "Tricycle #04 · Moussa Diop",
    title: "Enlèvement rapide & preuve photo « Après »",
    metric: "3h 15m",
    metricLabel: "Délai de résolution",
    status: "Zone vérifiée propre",
    image: "/apres.jpg",
  },
  {
    id: "valorisation",
    tag: "03 · Éco-Points & Recyclage",
    quartier: "Point Vert Thiawlène",
    title: "Vos kilos triés convertis en crédit Wave ou Orange",
    metric: "2 000 FCFA",
    metricLabel: "Virement mobile instantané",
    status: "97 % de pureté matière",
    image: "/Eco-points.jpg",
  },
];

const FIVE_STEPS = [
  {
    num: "01",
    title: "Signalement photo en 10 secondes",
    actor: "Habitant · 100 % Gratuit",
    desc: "Une photo prise au smartphone suffit. L’application compresse l’image automatiquement (< 150 Ko pour les réseaux 3G) et verrouille la position GPS du dépôt à Rufisque.",
    highlight: "Zéro frais, aucune inscription complexe",
  },
  {
    num: "02",
    title: "Affectation automatique au GIE du quartier",
    actor: "Agent de collecte · Tricycle",
    desc: "L’agent GIE le plus proche (Diokoul, Thiawlène, Keur Ndiaye Lo…) reçoit l’alerte sur son téléphone avec la distance exacte, le volume estimé et le niveau d’urgence.",
    highlight: "Tournées optimisées par proximité GPS",
  },
  {
    num: "03",
    title: "Collecte et validation par photo « Après »",
    actor: "Preuve visuelle transparente",
    desc: "Une fois la zone nettoyée, l’agent photographie le lieu assaini. Le citoyen reçoit une notification en temps réel avec le comparateur Avant / Après.",
    highlight: "Confiance totale entre citoyens et mairie",
  },
  {
    num: "04",
    title: "Pesée en Éco-Kiosque et gain d’Éco-Points",
    actor: "Récompense citoyenne",
    desc: "Les déchets triés (plastique PET, bidons PEHD, canettes, carton sec) rapportés aux points partenaires créditent des points échangeables contre du crédit Wave, Orange ou des bons d’achat.",
    highlight: "Le tri devient une source de valeur directe",
  },
  {
    num: "05",
    title: "Rachat industriel et pilotage communal",
    actor: "Recycleurs & Mairie de Rufisque",
    desc: "Les recycleurs réservent les balles compactées directement sur la plateforme, tandis que la Mairie suit en direct la propreté quartier par quartier.",
    highlight: "Économie circulaire locale traçable de bout en bout",
  },
];

export default function LandingPage() {
  const { setIsReportModalOpen, setIsAuthModalOpen, reports } = useCleanCity();
  const prefersReduced = useReducedMotion();

  const [activeScene, setActiveScene] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const resolvedCount =
    1280 + reports.filter((r) => r.status === "completed").length;

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % HERO_SCENES.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [prefersReduced]);

  const currentScene = HERO_SCENES[activeScene];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO CHORÉGRAPHIÉ + VITRINE INTERACTIVE EN DIRECT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Colonne gauche : Message fort & Actions mises en évidence */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface border border-line shadow-soft"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-semibold text-ink">
                Pilote Rufisque en direct
              </span>
              <span className="text-xs text-muted">
                · Diokoul, Thiawlène, Keur Ndiaye Lo
              </span>
            </motion.div>

            <AnimatedHeadline
              text="Chaque citoyen devient l’acteur de la propreté de son quartier."
              highlight="propreté quartier"
              className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-ink tracking-tight leading-[1.08]"
            />

            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg text-muted max-w-xl leading-relaxed"
            >
              CleanCity connecte sur mobile les{" "}
              <strong className="text-ink font-semibold">habitants</strong>, les{" "}
              <strong className="text-ink font-semibold">
                équipes GIE en tricycle
              </strong>{" "}
              et les{" "}
              <strong className="text-ink font-semibold">
                entreprises de recyclage
              </strong>{" "}
              au Sénégal. Signalez gratuitement un dépôt sauvage en 10 secondes
              et gagnez des récompenses en triant vos déchets.
            </motion.p>

            {/* Boutons d'action principaux très visibles */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="group h-13 px-6 py-3.5 rounded-full bg-accent text-accent-fg text-sm sm:text-base font-semibold shadow-lift inline-flex items-center justify-center gap-2.5 hover:opacity-95 active:scale-[0.98] transition-transform"
              >
                <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Signaler un dépôt (100 % Gratuit)</span>
              </button>

              <Link
                href="/citoyen"
                className="group h-13 px-6 py-3.5 rounded-full bg-ink text-surface text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-transform"
              >
                <span>Ouvrir l’espace habitant</span>
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>

            {/* 3 Piliers de réassurance mis en valeur */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-3 grid grid-cols-3 gap-3 border-t border-line max-w-lg"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <ShieldCheck
                    className="w-3.5 h-3.5 text-accent shrink-0"
                    aria-hidden="true"
                  />
                  <span>100 % Gratuit</span>
                </div>
                <p className="text-[11px] text-muted">Signalement en 3 taps</p>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Clock
                    className="w-3.5 h-3.5 text-accent shrink-0"
                    aria-hidden="true"
                  />
                  <span>Intervention &lt; 4h</span>
                </div>
                <p className="text-[11px] text-muted">Avec photo Avant/Après</p>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Sparkles
                    className="w-3.5 h-3.5 text-accent shrink-0"
                    aria-hidden="true"
                  />
                  <span>Primes Wave/Orange</span>
                </div>
                <p className="text-[11px] text-muted">Dès 400 Éco-Points</p>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite : Vitrine Interactive Animée (Style Jawoo) */}
          <motion.div
            initial={
              prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-card bg-surface border border-line shadow-lift p-4 sm:p-5 space-y-4">
              {/* Sélecteur de scène animé avec layoutId */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-subtle border border-line">
                {[
                  { label: "1. Signaler" },
                  { label: "2. Collecter" },
                  { label: "3. Gagner" },
                ].map((tab, idx) => {
                  const active = activeScene === idx;
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActiveScene(idx)}
                      className={`relative h-8 rounded-full text-xs font-semibold transition-colors z-10 ${
                        active ? "text-surface" : "text-muted hover:text-ink"
                      }`}
                    >
                      {active ? (
                        <motion.span
                          layoutId="hero-scene-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                          className="absolute inset-0 rounded-full bg-ink -z-10"
                        />
                      ) : null}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Carte animée avec transition fluide entre les 3 moments clés */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  initial={
                    prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  className="space-y-4"
                >
                  <div className="relative rounded-field overflow-hidden border border-line aspect-[16/10] bg-subtle">
                    <img
                      src={currentScene.image}
                      alt={currentScene.title}
                      width={640}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink/90 text-surface text-[11px] font-semibold backdrop-blur-xs">
                      {currentScene.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-surface/95 text-ink border border-line text-xs font-semibold shadow-soft">
                      {currentScene.status}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-accent">
                        {currentScene.quartier}
                      </p>
                      <h2 className="text-base font-bold text-ink leading-snug">
                        {currentScene.title}
                      </h2>
                    </div>

                    <div className="px-3.5 py-2 rounded-field bg-accent-soft border border-accent/20 text-right shrink-0">
                      <div className="text-base font-bold text-accent tabular">
                        {currentScene.metric}
                      </div>
                      <div className="text-[10px] font-medium text-muted">
                        {currentScene.metricLabel}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action directe sous la démo */}
              <div className="pt-2 border-t border-line flex items-center justify-between text-xs">
                <span className="text-muted">
                  Simulation interactive · Ville de Rufisque
                </span>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="font-semibold text-accent hover:underline inline-flex items-center gap-1"
                >
                  <span>Tester maintenant</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BANDEAU DYNAMIQUE (TICKER FLUIDE DES QUARTIERS & ACTEURS) */}
      <MarqueeTicker
        items={[
          "Diokoul · Score propreté 94/100",
          "Thiawlène Littoral · 4 190 kg recyclés",
          "Keur Ndiaye Lo · +18 % ce mois",
          "Colobane · Collecte GIE active",
          "Mérina · Délai moyen 3h 35m",
          "Gouye Mouride · 3 Éco-Kiosques partenaires",
          "Wave & Orange Sénégal · Éco-Primes instantanées",
        ]}
      />

      {/* 3. BLOC D'IMPACT MONUMENTAL (FORTE MISE EN ÉVIDENCE SUR FOND ENCRE) */}
      <section
        aria-label="Chiffres clés d’impact à Rufisque"
        className="max-w-5xl mx-auto px-4 sm:px-6"
      >
        <Reveal>
          <div className="rounded-card bg-ink text-surface p-6 sm:p-10 shadow-lift space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface/15 pb-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#41C889]">
                  <span className="w-2 h-2 rounded-full bg-[#41C889]" />
                  Impact Mesuré · Pilote Rufisque
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Des résultats visibles dans chaque rue, vérifiés par photo.
                </h2>
              </div>
              <Link
                href="/commune"
                className="h-10 px-4 rounded-full bg-surface/10 hover:bg-surface/20 text-surface text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>Voir le tableau de bord Mairie</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="space-y-1.5">
                <div className="text-3xl sm:text-5xl font-bold tracking-tight text-surface">
                  <CountUp to={resolvedCount} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#41C889]">
                  Dépôts sauvages traités
                </div>
                <p className="text-xs text-surface/65">
                  96,9 % clôturés avec photo Après
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-3xl sm:text-5xl font-bold tracking-tight text-surface">
                  <CountUp to={34.2} decimals={1} suffix=" t" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#41C889]">
                  Matières valorisées
                </div>
                <p className="text-xs text-surface/65">
                  Plastique PET, PEHD, carton & alu
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-3xl sm:text-5xl font-bold tracking-tight text-surface">
                  <CountUp to={2890} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#41C889]">
                  Ménages participants
                </div>
                <p className="text-xs text-surface/65">
                  Actifs sur 6 quartiers de Rufisque
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-3xl sm:text-5xl font-bold tracking-tight text-surface tabular">
                  3h 35m
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#41C889]">
                  Délai moyen GIE
                </div>
                <p className="text-xs text-surface/65">
                  Contre 48h en collecte classique
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. LES 4 ACTEURS MIS EN ÉVIDENCE (CARTES INTERACTIVES AVEC ÉLÉVATION) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-accent">
                Plateforme Multi-Acteurs
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                Un espace dédié pour chaque maillon de la chaîne
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-xs">
              Cliquez sur un espace pour l’explorer en direct avec des données
              réalistes de Rufisque.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              tag: "Cœur Mobile · Priorité n°1",
              title: "1. Espace Habitant",
              desc: "Signalez gratuitement un dépôt en 3 étapes, suivez le tricycle sur la carte avec photo Avant/Après et convertissez vos points de tri en crédit Wave ou Orange.",
              metric: "1 450 pts · 4 récompenses",
              href: "/citoyen",
              cta: "Ouvrir l’application habitant",
              icon: MapPin,
              featured: true,
            },
            {
              tag: "Terrain · GIE de Quartier",
              title: "2. Espace Agent de Collecte",
              desc: "Recevez les missions triées par urgence et proximité GPS, planifiez la tournée en tricycle et validez l’enlèvement avec photo Après.",
              metric: "+3 500 FCFA / mission validée",
              href: "/agent",
              cta: "Ouvrir la tournée agent",
              icon: Truck,
              featured: false,
            },
            {
              tag: "Économie Circulaire · B2B",
              title: "3. Espace Entreprise de Recyclage",
              desc: "Consultez les stocks de plastique PET, PEHD, carton et aluminium triés à 97 % de pureté dans les Éco-Kiosques et réservez un enlèvement camion.",
              metric: "3 020 kg prêts à charger",
              href: "/recycleur",
              cta: "Explorer la bourse matières",
              icon: Recycle,
              featured: false,
            },
            {
              tag: "Pilotage Décisionnel · B2G",
              title: "4. Tableau de Bord Commune (Mairie)",
              desc: "Supervisez le score de propreté des 6 quartiers de Rufisque, les délais moyens de traitement des GIE et exportez les bilans officiels en CSV.",
              metric: "SLA municipal < 4h respecté à 96,9 %",
              href: "/commune",
              cta: "Consulter le dashboard Maire",
              icon: Building2,
              featured: true,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.08}>
                <motion.div
                  whileHover={prefersReduced ? undefined : { y: -4 }}
                  transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  className="h-full"
                >
                  <Link
                    href={card.href}
                    className={`group h-full p-6 rounded-card border transition-all flex flex-col justify-between gap-6 ${
                      card.featured
                        ? "bg-surface border-ink/30 shadow-lift hover:border-accent"
                        : "bg-surface border-line shadow-soft hover:border-ink/40"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            card.featured
                              ? "bg-accent-soft text-accent"
                              : "bg-subtle text-muted"
                          }`}
                        >
                          {card.tag}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-field flex items-center justify-center transition-colors ${
                            card.featured
                              ? "bg-accent text-accent-fg"
                              : "bg-subtle text-ink group-hover:bg-ink group-hover:text-surface"
                          }`}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-xl font-bold text-ink">
                          {card.title}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-line flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-muted tabular">
                        {card.metric}
                      </span>
                      <span className="text-xs font-bold text-ink group-hover:text-accent inline-flex items-center gap-1.5 transition-colors">
                        <span>{card.cta}</span>
                        <ArrowRight
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 5. PARCOURS INTERACTIF EN 5 ÉTAPES (SCROLL / TABS ANIMÉS) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <Reveal>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-accent">
              Chaîne de Valeur Continue
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              Comment fonctionne CleanCity en 5 étapes
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Liste interactive des 5 étapes */}
          <div className="lg:col-span-6 rounded-card bg-surface border border-line divide-y divide-line overflow-hidden shadow-soft">
            {FIVE_STEPS.map((st, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`w-full p-4 sm:p-5 text-left transition-colors flex items-start gap-4 ${
                    isSelected
                      ? "bg-accent-soft/50 border-l-4 border-l-accent"
                      : "hover:bg-subtle/60"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full text-xs font-bold tabular flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-accent text-accent-fg"
                        : "bg-subtle text-muted"
                    }`}
                  >
                    {st.num}
                  </span>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-accent">
                      {st.actor}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-ink">
                      {st.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Focus détaillé sur l'étape sélectionnée */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={FIVE_STEPS[activeStep].num}
                initial={
                  prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                className="p-6 sm:p-8 rounded-card bg-surface border border-line shadow-lift space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-ink text-surface text-xs font-bold tabular">
                    Étape {FIVE_STEPS[activeStep].num} sur 05
                  </span>
                  <span className="text-xs font-semibold text-accent">
                    {FIVE_STEPS[activeStep].actor}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-ink">
                    {FIVE_STEPS[activeStep].title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted leading-relaxed">
                    {FIVE_STEPS[activeStep].desc}
                  </p>
                </div>

                <div className="p-4 rounded-field bg-accent-soft/60 border border-accent/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-fg flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-ink">
                    {FIVE_STEPS[activeStep].highlight}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStep((prev) => (prev + 1) % FIVE_STEPS.length)
                    }
                    className="text-xs font-semibold text-muted hover:text-ink"
                  >
                    Étape suivante →
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="h-10 px-4 rounded-full bg-accent text-accent-fg text-xs font-semibold"
                  >
                    Lancer un signalement
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. MODÈLE ÉCONOMIQUE & TARIFS CLAIRS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <Reveal>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-accent">
              Modèle Économique Durable
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              Gratuit pour le signalement citoyen, pérenne pour les GIE
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              badge: "Citoyens",
              title: "Signalement & Points",
              price: "0 FCFA",
              sub: "Toujours gratuit",
              points: [
                "Signalement illimité des dépôts sauvages",
                "Suivi temps réel avec photo Avant/Après",
                "Gain d’Éco-Points Wave & Orange en Éco-Kiosque",
              ],
              cta: "Signaler gratuitement",
              action: "report" as const,
              featured: false,
            },
            {
              badge: "Ménages · Optionnel",
              title: "Collecte à Domicile",
              price: "2 500 FCFA",
              sub: "par mois · Wave / Orange Money",
              points: [
                "2 à 3 passages garantis par semaine en tricycle",
                "SMS de rappel 30 min avant le passage",
                "Points de tri doublés sur le plastique PET",
              ],
              cta: "Voir l’abonnement domicile",
              href: "/citoyen?tab=abonnement",
              featured: true,
            },
            {
              badge: "Commerces, Recycleurs & Mairie",
              title: "Contrats B2B & B2G",
              price: "Sur-mesure",
              sub: "Commerces dès 8 500 FCFA/mois",
              points: [
                "Enlèvement quotidien marchés & commerces",
                "Commission sur la bourse de matières recyclées",
                "Licence municipale de supervision territoriale",
              ],
              cta: "Ouvrir un compte partenaire",
              action: "auth" as const,
              featured: false,
            },
          ].map((plan, i) => (
            <Reveal key={plan.title} delay={i * 0.08}>
              <div
                className={`h-full p-6 rounded-card border flex flex-col justify-between gap-6 ${
                  plan.featured
                    ? "bg-surface border-accent ring-1 ring-accent shadow-lift"
                    : "bg-surface border-line shadow-soft"
                }`}
              >
                <div className="space-y-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      plan.featured
                        ? "bg-accent text-accent-fg"
                        : "bg-subtle text-muted"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{plan.title}</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-ink tabular mt-2">
                      {plan.price}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{plan.sub}</p>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-line">
                    {plan.points.map((pt) => (
                      <li
                        key={pt}
                        className="text-xs sm:text-sm text-muted flex items-start gap-2"
                      >
                        <Check
                          className="w-4 h-4 text-accent shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.href ? (
                  <Link
                    href={plan.href}
                    className="h-11 px-4 rounded-full bg-accent text-accent-fg text-xs font-semibold flex items-center justify-center hover:opacity-95 transition-opacity"
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      plan.action === "report"
                        ? setIsReportModalOpen(true)
                        : setIsAuthModalOpen(true)
                    }
                    className="h-11 px-4 rounded-full bg-ink text-surface text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
