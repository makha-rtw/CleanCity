"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Download } from "lucide-react";
import { useCleanCity } from "@/lib/store";
import {
  RUFISQUE_QUARTIERS,
  MONTHLY_ANALYTICS_RUFISQUE,
} from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { RufisqueMap } from "@/components/map/RufisqueMap";
import { Reveal, CountUp, EASE_OUT_EXPO } from "@/components/ui/motion";

export default function CommuneDashboardPage() {
  const { reports, notify } = useCleanCity();
  const [selectedQuartier, setSelectedQuartier] = useState<string>("Tous");

  const handleExportReport = () => {
    const headers =
      "Quartier,Signalements,Traites,Delai_Heures,Kg_Recycles,Menages,Score\n";
    const rows = RUFISQUE_QUARTIERS.map(
      (q) =>
        `${q.name},${q.reportsTotal},${q.reportsResolved},${q.avgResolutionHours},${q.kgRecycled},${q.activeHouseholds},${q.cleanlinessScore}`
    ).join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CleanCity_Rufisque_Nov2026.csv";
    a.click();
    URL.revokeObjectURL(url);

    notify("Rapport CSV téléchargé", "Synthèse des 6 quartiers de Rufisque.");
  };

  const filteredReports =
    selectedQuartier === "Tous"
      ? reports
      : reports.filter((r) => r.quartier === selectedQuartier);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-14 space-y-8">
      {/* En-tête Exécutif Mairie + 4 KPIs mis en valeur */}
      <Reveal>
        <section className="rounded-card bg-ink text-surface p-6 sm:p-8 shadow-lift space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface/15 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#41C889]">
                <span className="w-2 h-2 rounded-full bg-[#41C889]" />
                <span>Ville de Rufisque · Direction Technique</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Suivi communal de la propreté
              </h1>
            </div>

            <button
              type="button"
              onClick={handleExportReport}
              className="h-11 px-5 rounded-full bg-accent text-accent-fg text-xs font-semibold inline-flex items-center gap-2 shadow-soft hover:opacity-95 transition-opacity self-start sm:self-auto"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Exporter le bilan CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-surface/70">Dépôts traités (mois)</p>
              <div className="text-3xl font-bold text-surface tabular">
                <CountUp to={731} />{" "}
                <span className="text-sm font-normal text-surface/60">
                  / 754
                </span>
              </div>
              <p className="text-xs font-semibold text-[#41C889]">
                96,9 % résolus avec photo
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-surface/70">Délai moyen GIE</p>
              <div className="text-3xl font-bold text-surface tabular">
                3h 35m
              </div>
              <p className="text-xs text-surface/65">Cible municipale &lt; 4h</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-surface/70">Déchets valorisés</p>
              <div className="text-3xl font-bold text-surface tabular">
                <CountUp to={34.2} decimals={1} suffix=" t" />
              </div>
              <p className="text-xs text-surface/65">Détournés de la décharge</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-surface/70">Ménages participants</p>
              <div className="text-3xl font-bold text-surface tabular">
                <CountUp to={2890} />
              </div>
              <p className="text-xs font-semibold text-[#41C889]">
                +412 ce mois
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Carte + État par quartier avec barres de progression animées */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 rounded-card bg-surface border border-line shadow-soft overflow-hidden">
          <div className="px-4 py-3.5 border-b border-line flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">
              Score par quartier (Rufisque)
            </h2>
            {selectedQuartier !== "Tous" ? (
              <button
                type="button"
                onClick={() => setSelectedQuartier("Tous")}
                className="text-xs font-semibold text-accent"
              >
                Tout afficher
              </button>
            ) : null}
          </div>

          <div className="divide-y divide-line">
            {RUFISQUE_QUARTIERS.map((q) => {
              const pending = q.reportsTotal - q.reportsResolved;
              const isSelected = selectedQuartier === q.name;
              return (
                <button
                  key={q.name}
                  type="button"
                  onClick={() =>
                    setSelectedQuartier(isSelected ? "Tous" : q.name)
                  }
                  className={`w-full px-4 py-3.5 text-left space-y-2 transition-colors ${
                    isSelected
                      ? "bg-accent-soft/50 border-l-4 border-l-accent"
                      : "hover:bg-subtle/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">{q.name}</span>
                    <div className="flex items-center gap-2 tabular">
                      <span
                        className={`text-xs font-semibold ${
                          pending >= 18 ? "text-danger" : "text-muted"
                        }`}
                      >
                        {pending} en cours
                      </span>
                      <span className="text-sm font-bold text-ink">
                        {q.cleanlinessScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 rounded-full bg-subtle overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${q.cleanlinessScore}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
                      className={`h-full rounded-full ${
                        pending >= 18 ? "bg-danger" : "bg-accent"
                      }`}
                    />
                  </div>

                  <div className="text-xs text-muted tabular">
                    Délai moyen {q.avgResolutionHours}h ·{" "}
                    {formatNumber(q.kgRecycled)} kg valorisés
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7">
          <RufisqueMap reports={filteredReports} heightClass="h-[400px]" />
        </div>
      </section>

      {/* Graphique d'évolution mensuelle */}
      <Reveal>
        <section className="p-5 sm:p-6 rounded-card bg-surface border border-line shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">
              Évolution mensuelle des dépôts traités (Juin – Novembre)
            </h2>
            <span className="text-xs font-semibold text-accent">
              Traités vs Signalés
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MONTHLY_ANALYTICS_RUFISQUE}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                  opacity={0.5}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                  opacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--surface))",
                    color: "hsl(var(--ink))",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--line))",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="signalements"
                  name="Signalés"
                  stroke="#676E6A"
                  fill="#676E6A"
                  fillOpacity={0.08}
                  strokeWidth={1.75}
                />
                <Area
                  type="monotone"
                  dataKey="traites"
                  name="Traités"
                  stroke="#0F6C4A"
                  fill="#0F6C4A"
                  fillOpacity={0.2}
                  strokeWidth={2.25}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
