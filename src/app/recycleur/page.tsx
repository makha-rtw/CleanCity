"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Recycle } from "lucide-react";
import { useCleanCity } from "@/lib/store";
import { formatCFA, formatNumber } from "@/lib/utils";
import type { WasteCategory, RecyclerLot } from "@/lib/mock-data";
import { Reveal } from "@/components/ui/motion";

export default function RecycleurPage() {
  const { recyclerLots, reserveRecyclerLot } = useCleanCity();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | WasteCategory
  >("all");
  const [companyName, setCompanyName] = useState("Proplast Industrie");
  const [activeLotModal, setActiveLotModal] = useState<RecyclerLot | null>(
    null
  );
  const [pickupSlot, setPickupSlot] = useState("Demain matin (08h30 – 11h00)");

  const filteredLots = recyclerLots.filter((lot) =>
    selectedCategory === "all" ? true : lot.category === selectedCategory
  );

  const totalAvailableKg = recyclerLots
    .filter((l) => l.status === "disponible")
    .reduce((acc, l) => acc + l.weightKg, 0);

  const handleConfirmPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLotModal) return;
    reserveRecyclerLot(activeLotModal.id, companyName);
    setActiveLotModal(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-7">
      {/* En-tête à fort contraste Recycleur */}
      <Reveal>
        <section className="rounded-card bg-ink text-surface p-5 sm:p-7 shadow-lift flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#41C889]">
              <Recycle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Bourse B2B des Matières Triées · Rufisque</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Lots disponibles à l’enlèvement
            </h1>
          </div>

          <div className="flex items-center gap-6 px-4 py-3 rounded-field bg-surface/10 border border-surface/15">
            <div>
              <span className="block text-[11px] text-surface/70">
                Stock disponible
              </span>
              <span className="text-lg font-bold text-surface tabular">
                {formatNumber(totalAvailableKg)} kg
              </span>
            </div>
            <div className="h-7 w-px bg-surface/15" />
            <div>
              <span className="block text-[11px] text-surface/70">
                Pureté moyenne
              </span>
              <span className="text-lg font-bold text-[#41C889] tabular">
                97,2 %
              </span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Filtres animés */}
      <div className="inline-flex p-1 rounded-full bg-subtle border border-line overflow-x-auto no-scrollbar max-w-full">
        {(
          [
            { id: "all", label: "Tous les lots" },
            { id: "plastique", label: "Plastique" },
            { id: "carton_papier", label: "Carton" },
            { id: "metal_verre", label: "Aluminium" },
          ] as const
        ).map((f) => {
          const active = selectedCategory === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedCategory(f.id)}
              className={`relative h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-colors z-10 ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="recycler-filter-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-surface shadow-soft -z-10"
                />
              ) : null}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Cartes de lots mises en valeur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLots.map((lot) => {
          const isAvailable = lot.status === "disponible";
          return (
            <article
              key={lot.id}
              className="p-5 rounded-card bg-surface border border-line shadow-soft flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-ink text-surface text-xs font-bold tabular">
                    {lot.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isAvailable
                        ? "bg-accent-soft text-accent"
                        : "bg-subtle text-muted"
                    }`}
                  >
                    {isAvailable ? "● Disponible" : `Réservé · ${lot.reservedBy}`}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-ink">{lot.material}</h2>
                  <p className="text-xs text-muted mt-0.5">
                    {lot.kioskOrigin} ({lot.quartier})
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-field bg-subtle">
                    <div className="text-[11px] text-muted">Poids net</div>
                    <div className="text-sm font-bold text-ink tabular">
                      {formatNumber(lot.weightKg)} kg
                    </div>
                  </div>
                  <div className="p-2.5 rounded-field bg-subtle">
                    <div className="text-[11px] text-muted">Pureté</div>
                    <div className="text-sm font-bold text-accent tabular">
                      {lot.purityPercent} %
                    </div>
                  </div>
                  <div className="p-2.5 rounded-field bg-subtle">
                    <div className="text-[11px] text-muted">Prix / kg</div>
                    <div className="text-sm font-bold text-ink tabular">
                      {lot.pricePerKgCFA} F
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-muted">Valeur du lot</div>
                  <div className="text-lg font-bold text-ink tabular">
                    {formatCFA(lot.totalPriceCFA)}
                  </div>
                </div>

                {isAvailable ? (
                  <button
                    type="button"
                    onClick={() => setActiveLotModal(lot)}
                    className="h-10 px-5 rounded-full bg-accent text-accent-fg text-xs font-semibold shadow-soft"
                  >
                    Réserver ce lot
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {activeLotModal ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pickup-dialog-title"
        >
          <div className="w-full max-w-md bg-surface text-ink rounded-t-card sm:rounded-card border border-line shadow-lift p-5 space-y-4 overscroll-contain">
            <div className="flex items-center justify-between">
              <h3 id="pickup-dialog-title" className="text-base font-semibold">
                Planifier l’enlèvement
              </h3>
              <button
                type="button"
                onClick={() => setActiveLotModal(null)}
                className="text-xs text-muted hover:text-ink"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleConfirmPickup} className="space-y-4">
              <div className="p-3.5 rounded-field bg-subtle border border-line text-xs space-y-1">
                <div className="font-medium text-ink">
                  {activeLotModal.material} ({activeLotModal.weightKg} kg)
                </div>
                <div className="text-muted">{activeLotModal.kioskOrigin}</div>
                <div className="font-semibold text-ink tabular">
                  {formatCFA(activeLotModal.totalPriceCFA)}
                </div>
              </div>

              <div>
                <label
                  htmlFor="buyer-input"
                  className="block text-xs text-muted mb-1"
                >
                  Entreprise
                </label>
                <input
                  id="buyer-input"
                  name="company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-10 px-3 rounded-field bg-subtle border border-line text-sm text-ink"
                />
              </div>

              <div>
                <label
                  htmlFor="slot-select"
                  className="block text-xs text-muted mb-1"
                >
                  Créneau de chargement
                </label>
                <select
                  id="slot-select"
                  name="slot"
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full h-10 px-3 rounded-field bg-subtle border border-line text-sm text-ink"
                >
                  <option
                    value="Aujourd’hui (15h00 – 18h00)"
                    className="bg-surface text-ink"
                  >
                    Aujourd’hui (15h00 – 18h00)
                  </option>
                  <option
                    value="Demain matin (08h30 – 11h00)"
                    className="bg-surface text-ink"
                  >
                    Demain matin (08h30 – 11h00)
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-accent text-accent-fg text-sm font-semibold"
              >
                Confirmer la réservation
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
