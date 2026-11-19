"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Truck } from "lucide-react";
import { useCleanCity } from "@/lib/store";
import {
  WASTE_CATEGORIES,
  URGENCY_LABELS,
  type WasteReport,
} from "@/lib/mock-data";
import { formatCFA } from "@/lib/utils";
import { celebrate } from "@/lib/celebrate";
import { RufisqueMap } from "@/components/map/RufisqueMap";
import { Reveal } from "@/components/ui/motion";

export default function AgentPage() {
  const { reports, updateReportStatus, notify } = useCleanCity();
  const [filterStatus, setFilterStatus] = useState<
    "todo" | "completed" | "all"
  >("todo");
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || "rep-101"
  );
  const [refusedIds, setRefusedIds] = useState<string[]>([]);

  const visibleReports = reports.filter((r) => {
    if (refusedIds.includes(r.id)) return false;
    if (filterStatus === "todo") return r.status !== "completed";
    if (filterStatus === "completed") return r.status === "completed";
    return true;
  });

  const completedToday = reports.filter((r) => r.status === "completed");
  const totalKgCollected = completedToday.reduce(
    (acc, item) => acc + item.estimatedKg,
    320
  );
  const dailyBonusCFA = completedToday.length * 3500 + 14000;

  const handleCompleteWithPhoto = (rep: WasteReport) => {
    updateReportStatus(
      rep.id,
      "completed",
      "Photo Après enregistrée · Zone nettoyée"
    );
    celebrate();
  };

  const handleRefuseMission = (rep: WasteReport) => {
    setRefusedIds((prev) => [...prev, rep.id]);
    notify(
      `Mission ${rep.code} réassignée`,
      "Transmise à l’équipe de secteur la plus proche."
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-7">
      {/* En-tête à fort contraste Agent : met en évidence la prime et les missions */}
      <Reveal>
        <section className="rounded-card bg-ink text-surface p-5 sm:p-7 shadow-lift flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#41C889]">
              <Truck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GIE Setal Diokoul · Tricycle #04 en service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Tournée de collecte · Moussa Diop
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-5 px-4 py-3 rounded-field bg-surface/10 border border-surface/15">
            <div>
              <span className="block text-[11px] text-surface/70">
                Terminées
              </span>
              <span className="text-lg font-bold text-surface tabular">
                {completedToday.length + 4}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-surface/70">Volume</span>
              <span className="text-lg font-bold text-surface tabular">
                {totalKgCollected} kg
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-surface/70">
                Prime jour
              </span>
              <span className="text-lg font-bold text-[#41C889] tabular">
                {formatCFA(dailyBonusCFA)}
              </span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Filtres animés */}
      <div className="inline-flex p-1 rounded-full bg-subtle border border-line">
        {(
          [
            {
              id: "todo",
              label: `À traiter (${
                reports.filter(
                  (r) => r.status !== "completed" && !refusedIds.includes(r.id)
                ).length
              })`,
            },
            {
              id: "completed",
              label: `Terminées (${completedToday.length})`,
            },
            {
              id: "all",
              label: "Toutes",
            },
          ] as const
        ).map((tab) => {
          const active = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`relative h-9 px-4 rounded-full text-xs font-semibold transition-colors z-10 ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="agent-filter-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-surface shadow-soft -z-10"
                />
              ) : null}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Liste des missions */}
      <div className="space-y-3">
        {visibleReports.length === 0 ? (
          <div className="p-8 rounded-card bg-surface border border-line text-center text-sm text-muted">
            Aucune intervention dans cette vue.
          </div>
        ) : (
          visibleReports.map((rep, idx) => {
            const cat = WASTE_CATEGORIES[rep.category];
            const isUrgent =
              rep.urgency === "critique" && rep.status !== "completed";
            return (
              <article
                key={rep.id}
                className={`p-5 rounded-card bg-surface border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  idx === 0 && rep.status !== "completed"
                    ? "border-ink/40 shadow-lift"
                    : "border-line shadow-soft"
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={
                      rep.status === "completed" && rep.photoAfter
                        ? rep.photoAfter
                        : rep.photoBefore
                    }
                    alt={rep.addressHint}
                    width={76}
                    height={76}
                    loading="lazy"
                    className="w-18 h-18 rounded-field object-cover border border-line shrink-0"
                  />

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-ink text-surface font-bold tabular">
                        {rep.code}
                      </span>
                      <span className="font-semibold text-accent tabular">
                        à {350 + idx * 250} m · +3 500 FCFA
                      </span>
                      <span className="text-muted">· {cat.label}</span>
                      {isUrgent ? (
                        <span className="px-2 py-0.5 rounded-full bg-danger-soft text-danger font-bold">
                          Urgence {URGENCY_LABELS[rep.urgency]}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-base font-bold text-ink truncate">
                      {rep.quartier} — {rep.addressHint}
                    </h2>
                    <p className="text-xs text-muted line-clamp-1">
                      {rep.description}
                    </p>
                  </div>
                </div>

                {/* Actions mises en évidence */}
                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === "reported" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRefuseMission(rep)}
                        className="h-10 px-3.5 rounded-full border border-line text-xs font-medium text-muted hover:text-ink"
                      >
                        Passer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateReportStatus(
                            rep.id,
                            "assigned",
                            "Accepté par Moussa Diop"
                          )
                        }
                        className="h-10 px-4 rounded-full bg-ink text-surface text-xs font-semibold shadow-soft"
                      >
                        Accepter
                      </button>
                    </>
                  )}

                  {rep.status === "assigned" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          updateReportStatus(
                            rep.id,
                            "scheduled",
                            "Passage programmé"
                          )
                        }
                        className="h-10 px-3.5 rounded-full border border-line text-xs font-semibold text-ink hover:bg-subtle"
                      >
                        Planifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCompleteWithPhoto(rep)}
                        className="h-10 px-4 rounded-full bg-accent text-accent-fg text-xs font-semibold shadow-soft"
                      >
                        Terminer avec photo
                      </button>
                    </>
                  )}

                  {rep.status === "scheduled" && (
                    <button
                      type="button"
                      onClick={() => handleCompleteWithPhoto(rep)}
                      className="h-10 px-5 rounded-full bg-accent text-accent-fg text-xs font-semibold shadow-soft"
                    >
                      Valider photo Après
                    </button>
                  )}

                  {rep.status === "completed" && (
                    <span className="px-3 py-1 rounded-full bg-accent-soft text-accent inline-flex items-center gap-1.5 text-xs font-bold">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Terminé
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Carte de tournée en bas */}
      <RufisqueMap
        reports={visibleReports}
        selectedReportId={selectedReportId}
        onSelectReport={(rep) => setSelectedReportId(rep.id)}
        heightClass="h-[300px]"
      />
    </div>
  );
}
