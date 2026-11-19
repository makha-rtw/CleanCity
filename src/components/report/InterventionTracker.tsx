"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  WASTE_CATEGORIES,
  CLEAN_AFTER_PHOTO,
  type WasteReport,
  type ReportStatus,
} from "@/lib/mock-data";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/domain";
import { useCleanCity } from "@/lib/store";
import { EASE_OUT_EXPO } from "@/components/ui/motion";

const STEPS: ReportStatus[] = [
  "reported",
  "assigned",
  "scheduled",
  "completed",
];

export function InterventionTracker({ report }: { report: WasteReport }) {
  const { updateReportStatus } = useCleanCity();
  const isCompleted = report.status === "completed";
  const [showAfter, setShowAfter] = useState(isCompleted);

  useEffect(() => {
    setShowAfter(report.status === "completed");
  }, [report.id, report.status]);

  const currentIdx = STATUS_ORDER[report.status];
  const catMeta = WASTE_CATEGORIES[report.category];
  const afterImage = report.photoAfter || CLEAN_AFTER_PHOTO;

  const advanceDemoStatus = () => {
    const nextMap: Record<ReportStatus, ReportStatus> = {
      reported: "assigned",
      assigned: "scheduled",
      scheduled: "completed",
      completed: "completed",
    };
    const next = nextMap[report.status];
    updateReportStatus(report.id, next);
    if (next === "completed") setShowAfter(true);
  };

  return (
    <motion.div
      key={report.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      className="rounded-card bg-surface border border-line shadow-lift p-5 sm:p-6 space-y-6"
    >
      {/* En-tête du dossier sélectionné */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-ink text-surface text-xs font-bold tabular">
              {report.code}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-subtle border border-line text-xs font-medium text-ink">
              {catMeta.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isCompleted
                  ? "bg-accent-soft text-accent"
                  : "bg-subtle text-ink"
              }`}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
              {STATUS_LABEL[report.status]}
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink">
            {report.quartier} — {report.addressHint}
          </h3>
        </div>

        {!isCompleted ? (
          <button
            type="button"
            onClick={advanceDemoStatus}
            className="group h-9 px-4 rounded-full bg-ink text-surface text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span>Simuler l’étape suivante</span>
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      {/* Barre de progression 4 étapes */}
      <div className="grid grid-cols-4 gap-2.5">
        {STEPS.map((st, idx) => {
          const done = currentIdx >= idx;
          const isCurrent = currentIdx === idx;
          return (
            <div key={st} className="space-y-2">
              <div className="h-2 rounded-full bg-subtle overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                ) : null}
                <p
                  className={`text-xs ${
                    isCurrent
                      ? "text-ink font-bold"
                      : done
                      ? "text-ink font-medium"
                      : "text-muted"
                  }`}
                >
                  {STATUS_LABEL[st]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo + Historique : le bouton "Après collecte" n'apparaît QUE lorsque toutes les étapes sont passées */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start pt-1">
        <div className="md:col-span-6 space-y-2">
          <div className="relative rounded-field overflow-hidden border border-line aspect-[16/10] bg-subtle">
            <AnimatePresence mode="wait">
              <motion.img
                key={isCompleted && showAfter ? "after" : "before"}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                src={isCompleted && showAfter ? afterImage : report.photoBefore}
                alt={`${report.quartier} ${
                  isCompleted && showAfter ? "après collecte" : "avant collecte"
                }`}
                width={640}
                height={400}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {isCompleted ? (
              <div className="absolute top-3 left-3 inline-flex rounded-full bg-surface/95 backdrop-blur-xs border border-line p-0.5 text-xs shadow-soft">
                <button
                  type="button"
                  onClick={() => setShowAfter(false)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    !showAfter
                      ? "bg-ink text-surface font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Avant
                </button>
                <button
                  type="button"
                  onClick={() => setShowAfter(true)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    showAfter
                      ? "bg-accent text-accent-fg font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Après collecte
                </button>
              </div>
            ) : (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/95 backdrop-blur-xs border border-line text-xs font-semibold text-ink shadow-soft">
                Avant collecte
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 divide-y divide-line text-sm">
          {report.timeline.map((ev, i) => (
            <div
              key={`${ev.status}-${i}`}
              className="py-2.5 first:pt-0 last:pb-0 flex items-baseline justify-between gap-3"
            >
              <span className="text-ink font-medium">{ev.label}</span>
              <span className="text-xs text-muted tabular shrink-0">
                {ev.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
