"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Check, Camera, Sparkles } from "lucide-react";
import { useCleanCity } from "@/lib/store";
import {
  RUFISQUE_QUARTIERS,
  REWARDS_CATALOG,
  SORTING_GUIDES,
  WASTE_CATEGORIES,
} from "@/lib/mock-data";
import { STATUS_LABEL, levelFor } from "@/lib/domain";
import { formatNumber, firstName } from "@/lib/utils";
import { celebrate } from "@/lib/celebrate";
import { RufisqueMap } from "@/components/map/RufisqueMap";
import { InterventionTracker } from "@/components/report/InterventionTracker";
import { Reveal, EASE_OUT_EXPO } from "@/components/ui/motion";

type CitizenTab = "suivi" | "recompenses" | "abonnement" | "sensibilisation";

function CitoyenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    user,
    reports,
    t,
    setIsReportModalOpen,
    redeemReward,
    subscribeHomeCollection,
  } = useCleanCity();

  const tabParam = searchParams.get("tab") as CitizenTab | null;
  const [activeTab, setActiveTab] = useState<CitizenTab>("suivi");
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || "rep-101"
  );

  useEffect(() => {
    if (
      tabParam &&
      ["suivi", "recompenses", "abonnement", "sensibilisation"].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (reports.length > 0 && !reports.some((r) => r.id === selectedReportId)) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);

  const handleTabChange = (nextTab: CitizenTab) => {
    setActiveTab(nextTab);
    router.replace(`/citoyen?tab=${nextTab}`, { scroll: false });
  };

  const citizenReports = reports.slice(0, 2);
  const selectedReport =
    citizenReports.find((r) => r.id === selectedReportId) || citizenReports[0];

  const handleRedeem = (reward: (typeof REWARDS_CATALOG)[number]) => {
    const ok = redeemReward(reward);
    if (ok) celebrate();
  };

  const lvl = levelFor(user.points);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-7">
      {/* Carte d'en-tête à fort contraste : met en évidence le solde et l'action principale */}
      <Reveal>
        <section className="rounded-card bg-ink text-surface p-5 sm:p-7 shadow-lift space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-surface/75">
                <span className="w-2 h-2 rounded-full bg-[#41C889]" />
                <span>
                  {user.quartier}, Rufisque · {lvl.current.name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t.greeting}, {firstName(user.name)}
              </h1>
            </div>

            {/* Solde Éco-Points mis en valeur */}
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-field bg-surface/10 border border-surface/15">
              <div>
                <div className="text-[11px] text-surface/70">Éco-Points</div>
                <div className="text-lg font-bold text-[#41C889] tabular">
                  {formatNumber(user.points)} pts
                </div>
              </div>
              <div className="h-7 w-px bg-surface/15" />
              <div>
                <div className="text-[11px] text-surface/70">Trié</div>
                <div className="text-base font-bold text-surface tabular">
                  {user.kgTriTotal} kg
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="w-full h-13 px-6 rounded-full bg-accent text-accent-fg text-sm sm:text-base font-semibold shadow-soft inline-flex items-center justify-center gap-2.5 hover:opacity-95 active:scale-[0.99] transition-transform"
          >
            <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.report.cta} (100 % Gratuit)</span>
          </button>
        </section>
      </Reveal>

      {/* Sélecteur d'onglets animé (layoutId) */}
      <div
        role="tablist"
        aria-label="Rubriques habitant"
        className="grid grid-cols-4 p-1 rounded-full bg-subtle border border-line"
      >
        {(
          [
            { id: "suivi", label: "Suivi" },
            { id: "recompenses", label: "Points" },
            { id: "abonnement", label: "Domicile" },
            { id: "sensibilisation", label: "Guide" },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleTabChange(tab.id)}
              className={`relative h-10 px-2 sm:px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-colors z-10 ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="citizen-active-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-surface shadow-soft -z-10"
                />
              ) : null}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ONGLET 1 : SUIVI & CARTE */}
      {activeTab === "suivi" && (
        <div className="space-y-6">
          {selectedReport ? (
            <InterventionTracker report={selectedReport} />
          ) : null}

          <RufisqueMap
            reports={citizenReports}
            selectedReportId={selectedReport?.id}
            onSelectReport={(rep) => setSelectedReportId(rep.id)}
          />

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink">
                Signalements du quartier ({citizenReports.length})
              </h2>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs font-semibold text-accent hover:underline"
              >
                + Nouveau signalement
              </button>
            </div>

            <div className="rounded-card bg-surface border border-line divide-y divide-line overflow-hidden shadow-soft">
              {citizenReports.map((rep) => {
                const isSelected = rep.id === selectedReport?.id;
                const cat = WASTE_CATEGORIES[rep.category];
                const isDone = rep.status === "completed";
                return (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`w-full p-4 text-left flex items-center justify-between gap-4 transition-colors ${
                      isSelected
                        ? "bg-accent-soft/45 border-l-4 border-l-accent"
                        : "hover:bg-subtle/50"
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span className="font-bold text-ink tabular">
                          {rep.code}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-ink">
                          {rep.quartier}
                        </span>
                        <span>·</span>
                        <span>{cat.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-ink truncate">
                        {rep.addressHint}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        isDone
                          ? "bg-accent-soft text-accent"
                          : "bg-subtle text-ink"
                      }`}
                    >
                      {STATUS_LABEL[rep.status]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ONGLET 2 : POINTS & CLASSEMENT */}
      {activeTab === "recompenses" && (
        <div className="space-y-7">
          {/* Progression niveau */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-accent">
                Portefeuille Éco-Points
              </p>
              <div className="text-3xl font-bold text-ink tabular">
                {formatNumber(user.points)} points
              </div>
              <p className="text-xs text-muted">
                {user.kgTriTotal} kg valorisés en point de tri · {user.phone}
              </p>
            </div>
            {lvl.next ? (
              <div className="w-full sm:w-52 space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted">
                  <span>Prochain palier : {lvl.next.name}</span>
                  <span className="tabular font-bold text-ink">
                    {lvl.next.min} pts
                  </span>
                </div>
                <div className="h-2 rounded-full bg-subtle overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.round(lvl.progress * 100))}%`,
                    }}
                    transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-ink">
              Récompenses échangeables immédiatement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {REWARDS_CATALOG.map((item) => {
                const canAfford = user.points >= item.pointsCost;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-card bg-surface border border-line shadow-soft flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-accent-soft text-accent text-xs font-bold">
                          {item.valueLabel}
                        </span>
                        <span className="text-xs font-bold text-ink tabular">
                          {item.pointsCost} pts
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-ink">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted">{item.partner}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRedeem(item)}
                      disabled={!canAfford}
                      className={`w-full h-10 px-4 rounded-full text-xs font-semibold transition-colors ${
                        canAfford
                          ? "bg-ink text-surface hover:opacity-90"
                          : "bg-subtle text-muted cursor-not-allowed"
                      }`}
                    >
                      {canAfford
                        ? `Convertir contre ${item.valueLabel}`
                        : `${item.pointsCost - user.points} pts manquants`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-ink">
              Classement des quartiers de Rufisque
            </h2>
            <div className="rounded-card bg-surface border border-line divide-y divide-line overflow-hidden shadow-soft">
              {RUFISQUE_QUARTIERS.map((q) => {
                const isMine = q.name === user.quartier;
                return (
                  <div
                    key={q.name}
                    className={`px-4 py-3.5 flex items-center justify-between text-sm ${
                      isMine ? "bg-accent-soft/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold tabular flex items-center justify-center ${
                          q.rank === 1
                            ? "bg-accent text-accent-fg"
                            : "bg-subtle text-ink"
                        }`}
                      >
                        {q.rank}
                      </span>
                      <span className="font-semibold text-ink">{q.name}</span>
                      {isMine ? (
                        <span className="px-2 py-0.5 rounded-full bg-accent text-accent-fg text-[10px] font-bold">
                          Votre quartier
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs font-semibold text-ink tabular">
                      {formatNumber(q.kgRecycled)} kg ·{" "}
                      <span className="text-accent">
                        {q.cleanlinessScore}/100
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ONGLET 3 : COLLECTE À DOMICILE */}
      {activeTab === "abonnement" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Essentiel",
                price: "2 500 FCFA",
                period: "/ mois",
                schedule: "2 passages par semaine",
                features: ["Mardi et samedi matin", "Rappel SMS avant passage"],
                featured: false,
              },
              {
                name: "Tri Domicile",
                price: "4 000 FCFA",
                period: "/ mois",
                schedule: "3 passages par semaine",
                features: [
                  "2 bacs fournis (sec / organique)",
                  "Points doublés sur le plastique",
                ],
                featured: true,
              },
              {
                name: "Commerce",
                price: "8 500 FCFA",
                period: "/ mois",
                schedule: "Passage quotidien (lun–sam)",
                features: [
                  "Enlèvement cartons & biodéchets",
                  "Pour boutiques et restaurants",
                ],
                featured: false,
              },
            ].map((plan) => {
              const isCurrent = user.subscriptionPlan?.includes(plan.name);
              return (
                <div
                  key={plan.name}
                  className={`p-5 rounded-card border flex flex-col justify-between gap-6 ${
                    plan.featured
                      ? "bg-surface border-accent ring-1 ring-accent shadow-lift"
                      : "bg-surface border-line shadow-soft"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-ink">
                        {plan.name}
                      </h3>
                      {plan.featured ? (
                        <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent text-[10px] font-bold">
                          Populaire
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted">{plan.schedule}</p>
                    <div className="text-2xl font-bold text-ink tabular">
                      {plan.price}{" "}
                      <span className="text-xs font-normal text-muted">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-1.5 pt-2 border-t border-line">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="text-xs text-muted flex items-center gap-2"
                        >
                          <Check
                            className="w-3.5 h-3.5 text-accent shrink-0"
                            aria-hidden="true"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => subscribeHomeCollection(plan.name)}
                    className={`w-full h-10 rounded-full text-xs font-semibold transition-colors ${
                      isCurrent
                        ? "bg-accent-soft text-accent"
                        : plan.featured
                        ? "bg-accent text-accent-fg"
                        : "bg-ink text-surface hover:opacity-90"
                    }`}
                  >
                    {isCurrent ? "✓ Formule active" : "Activer la formule"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ONGLET 4 : GUIDE DE TRI */}
      {activeTab === "sensibilisation" && (
        <div className="space-y-4">
          <div className="rounded-card bg-surface border border-line divide-y divide-line shadow-soft">
            {SORTING_GUIDES.map((g) => (
              <div key={g.id} className="p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-ink">{g.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-accent-soft text-xs font-bold text-accent tabular">
                    {g.pointsPerKg}
                  </span>
                </div>
                <ul className="space-y-1.5 text-sm text-muted">
                  {g.doList.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check
                        className="w-4 h-4 text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CitoyenPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-6 text-sm text-muted">
          Chargement…
        </div>
      }
    >
      <CitoyenContent />
    </Suspense>
  );
}
