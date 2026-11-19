"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { useCleanCity } from "@/lib/store";
import {
  PRESET_REPORT_PHOTOS,
  RUFISQUE_QUARTIERS,
  WASTE_CATEGORIES,
  type WasteCategory,
  type UrgencyLevel,
  type WasteReport,
} from "@/lib/mock-data";
import { CATEGORY } from "@/lib/domain";
import { compressImage, formatSize } from "@/lib/compress";
import { celebrate } from "@/lib/celebrate";

export function ReportModal() {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addReport,
    t,
    user,
  } = useCleanCity();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customPhoto, setCustomPhoto] = useState<{
    uri: string;
    originalKb: number;
    compressedKb: number;
  } | null>(null);

  const [quartier, setQuartier] = useState(user.quartier || "Diokoul");
  const [addressHint, setAddressHint] = useState(
    "Près de l’École Dior, rue Sabar"
  );
  const [category, setCategory] = useState<WasteCategory>("plastique");
  const [urgency, setUrgency] = useState<UrgencyLevel>("elevee");
  const [description, setDescription] = useState("");
  const [createdReport, setCreatedReport] = useState<WasteReport | null>(null);

  const activePreset = PRESET_REPORT_PHOTOS[selectedPresetIndex];

  useEffect(() => {
    if (isReportModalOpen) {
      setStep(1);
      setCreatedReport(null);
    }
  }, [isReportModalOpen]);

  if (!isReportModalOpen) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setCustomPhoto(null);
    const preset = PRESET_REPORT_PHOTOS[idx];
    setQuartier(preset.quartier);
    setCategory(preset.category);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await compressImage(file);
      setCustomPhoto({
        uri: res.dataUrl,
        originalKb: res.originalKb,
        compressedKb: res.compressedKb,
      });
    } catch {
      // Fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qObj =
      RUFISQUE_QUARTIERS.find((q) => q.name === quartier) ||
      RUFISQUE_QUARTIERS[0];

    const report = addReport({
      quartier,
      addressHint,
      lat: qObj.lat,
      lng: qObj.lng,
      category,
      urgency,
      description,
      photoBefore: customPhoto ? customPhoto.uri : activePreset.uri,
      compressedSizeKb: customPhoto
        ? customPhoto.compressedKb
        : activePreset.compressedKb,
      originalSizeMb: customPhoto
        ? Number((customPhoto.originalKb / 1024).toFixed(1))
        : activePreset.originalMb,
    });

    setCreatedReport(report);
    setStep(4);
    celebrate();
  };

  const displayCompressedKb = customPhoto
    ? customPhoto.compressedKb
    : activePreset.compressedKb;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-dialog-title"
    >
      <div className="w-full max-w-md bg-surface text-ink rounded-t-card sm:rounded-card border border-line shadow-lift overflow-hidden max-h-[92dvh] flex flex-col overscroll-contain">
        {/* En-tête minimal */}
        <div className="px-5 pt-4 pb-3 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                aria-label="Étape précédente"
                className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center text-muted hover:text-ink"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : null}
            <div>
              {step < 4 ? (
                <p className="text-xs text-muted">
                  {t.report.step} {step} {t.report.of} 3 · Gratuit
                </p>
              ) : (
                <p className="text-xs text-accent font-medium">Confirmé</p>
              )}
              <h2
                id="report-dialog-title"
                className="text-base font-semibold text-ink"
              >
                {step === 1 && t.report.photoTitle}
                {step === 2 && t.report.placeTitle}
                {step === 3 && t.report.typeTitle}
                {step === 4 && t.report.thanks}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(false)}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full hover:bg-subtle flex items-center justify-center text-muted hover:text-ink"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative rounded-card overflow-hidden border border-line bg-subtle aspect-[16/10]">
                <img
                  src={customPhoto ? customPhoto.uri : activePreset.uri}
                  alt={activePreset.label}
                  width={640}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-xs border border-line text-xs text-muted tabular">
                  Image optimisée · {formatSize(displayCompressedKb)}
                </div>
              </div>

              <label
                htmlFor="camera-file-input"
                className="cursor-pointer w-full min-h-11 px-4 py-2.5 rounded-field border border-line bg-subtle hover:bg-line/50 flex items-center justify-center gap-2 text-sm font-medium text-ink transition-colors"
              >
                <Camera className="w-4 h-4 text-muted" aria-hidden="true" />
                <span>Prendre ou importer une photo</span>
                <input
                  id="camera-file-input"
                  name="photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>

              <div className="space-y-1.5">
                <p className="text-xs text-muted">Exemples rapides (Rufisque)</p>
                <div className="divide-y divide-line rounded-field border border-line bg-surface overflow-hidden">
                  {PRESET_REPORT_PHOTOS.map((preset, idx) => {
                    const selected =
                      !customPhoto && selectedPresetIndex === idx;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(idx)}
                        className={`w-full min-h-11 px-3.5 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                          selected
                            ? "bg-subtle font-medium text-ink"
                            : "text-muted hover:text-ink hover:bg-subtle/50"
                        }`}
                      >
                        <span>{preset.label}</span>
                        {selected ? (
                          <Check
                            className="w-4 h-4 text-accent"
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full h-12 rounded-full bg-accent text-accent-fg text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                {t.report.next}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="block text-xs text-muted mb-2">
                  Quartier à Rufisque
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {RUFISQUE_QUARTIERS.map((q) => {
                    const active = quartier === q.name;
                    return (
                      <button
                        key={q.name}
                        type="button"
                        onClick={() => setQuartier(q.name)}
                        className={`h-11 px-3.5 rounded-field border text-sm text-left transition-colors flex items-center justify-between ${
                          active
                            ? "border-ink bg-ink text-surface font-medium"
                            : "border-line bg-surface text-ink hover:bg-subtle"
                        }`}
                      >
                        <span className="truncate">{q.name}</span>
                        {active ? (
                          <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="landmark-input"
                  className="block text-xs text-muted mb-1.5"
                >
                  Point de repère (école, rue, commerce)
                </label>
                <input
                  id="landmark-input"
                  name="addressHint"
                  type="text"
                  autoComplete="off"
                  value={addressHint}
                  onChange={(e) => setAddressHint(e.target.value)}
                  placeholder="Ex. Près de l’École Dior…"
                  className="w-full h-11 px-3.5 rounded-field bg-subtle border border-line text-sm text-ink placeholder:text-muted"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full h-12 rounded-full bg-accent text-accent-fg text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                {t.report.next}
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(CATEGORY) as WasteCategory[]).map((key) => {
                  const item = CATEGORY[key];
                  const Icon = item.icon;
                  const active = category === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`p-3.5 rounded-field border text-left transition-colors flex flex-col gap-2 ${
                        active
                          ? "border-ink bg-subtle font-medium text-ink"
                          : "border-line bg-surface text-muted hover:text-ink"
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm text-ink">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <span className="block text-xs text-muted mb-2">Urgence</span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "moderee", label: "Normale" },
                      { id: "elevee", label: "Importante" },
                      { id: "critique", label: "Urgente" },
                    ] as const
                  ).map((u) => {
                    const active = urgency === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUrgency(u.id)}
                        className={`h-10 rounded-field border text-xs font-medium transition-colors ${
                          active
                            ? "border-ink bg-ink text-surface"
                            : "border-line bg-surface text-muted hover:text-ink"
                        }`}
                      >
                        {u.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="note-input"
                  className="block text-xs text-muted mb-1.5"
                >
                  Note facultative
                </label>
                <input
                  id="note-input"
                  name="description"
                  type="text"
                  autoComplete="off"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Précision utile pour la collecte…"
                  className="w-full h-11 px-3.5 rounded-field bg-subtle border border-line text-sm text-ink placeholder:text-muted"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-accent text-accent-fg text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                {t.report.send}
              </button>
            </form>
          )}

          {step === 4 && createdReport && (
            <div className="py-4 text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-accent-soft text-accent mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-ink">
                  Signalement enregistré
                </h3>
                <p className="text-sm text-muted">
                  L’équipe de collecte de {createdReport.quartier} a été prévenue.
                </p>
              </div>

              <div className="p-4 rounded-field bg-subtle border border-line text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Référence</span>
                  <span className="font-medium tabular">{createdReport.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Quartier</span>
                  <span className="font-medium">{createdReport.quartier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Points gagnés</span>
                  <span className="font-semibold text-accent tabular">
                    +{WASTE_CATEGORIES[createdReport.category].points} pts
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="w-full h-12 rounded-full bg-ink text-surface text-sm font-semibold"
              >
                Voir le suivi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
