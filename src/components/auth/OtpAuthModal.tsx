"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useCleanCity, type UserProfile } from "@/lib/store";
import { RUFISQUE_QUARTIERS } from "@/lib/mock-data";

export function OtpAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, loginWithOtp } =
    useCleanCity();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState(user.phone || "+221 77 412 88 90");
  const [name, setName] = useState(user.name || "Aminata Sow");
  const [quartier, setQuartier] = useState(user.quartier || "Diokoul");
  const [role, setRole] = useState<UserProfile["role"]>(user.role || "citoyen");
  const [otpCode, setOtpCode] = useState("2026");

  if (!isAuthModalOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithOtp({ phone, name, quartier, role });
    setStep("phone");
    setIsAuthModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
    >
      <div className="w-full max-w-md bg-surface text-ink rounded-t-card sm:rounded-card border border-line shadow-lift overflow-hidden overscroll-contain">
        <div className="px-5 pt-4 pb-3 border-b border-line flex items-center justify-between">
          <h2 id="auth-dialog-title" className="text-base font-semibold">
            {step === "phone" ? "Identification" : "Code SMS"}
          </h2>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full hover:bg-subtle flex items-center justify-center text-muted hover:text-ink"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="phone-input"
                  className="block text-xs text-muted mb-1.5"
                >
                  Numéro de téléphone
                </label>
                <input
                  id="phone-input"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  spellCheck={false}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 412 88 90…"
                  className="w-full h-11 px-3.5 rounded-field bg-subtle border border-line text-sm text-ink tabular"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="name-input"
                    className="block text-xs text-muted mb-1.5"
                  >
                    Nom
                  </label>
                  <input
                    id="name-input"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aminata Sow…"
                    className="w-full h-11 px-3.5 rounded-field bg-subtle border border-line text-sm text-ink"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quartier-select"
                    className="block text-xs text-muted mb-1.5"
                  >
                    Quartier
                  </label>
                  <select
                    id="quartier-select"
                    name="quartier"
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    className="w-full h-11 px-3 rounded-field bg-subtle border border-line text-sm text-ink"
                  >
                    {RUFISQUE_QUARTIERS.map((q) => (
                      <option
                        key={q.name}
                        value={q.name}
                        className="bg-surface text-ink"
                      >
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span className="block text-xs text-muted mb-1.5">Profil</span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "citoyen", label: "Habitant" },
                      { id: "agent", label: "Agent collecte" },
                      { id: "recycleur", label: "Recycleur" },
                      { id: "commune", label: "Commune" },
                    ] as const
                  ).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`h-10 px-3 rounded-field border text-xs font-medium text-left transition-colors ${
                        role === r.id
                          ? "border-ink bg-ink text-surface"
                          : "border-line bg-surface text-muted hover:text-ink"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-accent text-accent-fg text-sm font-semibold"
              >
                Recevoir le code SMS
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-muted">
                Saisissez le code à 4 chiffres envoyé au {phone} (démo : 2026).
              </p>

              <div>
                <label htmlFor="otp-input" className="sr-only">
                  Code SMS
                </label>
                <input
                  id="otp-input"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  spellCheck={false}
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full h-12 px-4 rounded-field bg-subtle border border-line text-xl font-semibold tracking-widest text-center text-ink tabular"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="h-12 px-4 rounded-full border border-line text-xs font-medium text-muted hover:text-ink"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-full bg-accent text-accent-fg text-sm font-semibold"
                >
                  Confirmer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
