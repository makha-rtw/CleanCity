"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  INITIAL_REPORTS,
  INITIAL_RECYCLER_LOTS,
  CLEAN_AFTER_PHOTO,
  WASTE_CATEGORIES,
  type WasteReport,
  type ReportStatus,
  type WasteCategory,
  type UrgencyLevel,
  type RecyclerLot,
} from "./mock-data";
import { dictionaries, type Locale, type Dictionary } from "./i18n";

export interface UserProfile {
  name: string;
  phone: string;
  quartier: string;
  role: "citoyen" | "agent" | "recycleur" | "commune";
  points: number;
  levelTitle: string;
  kgTriTotal: number;
  reportsCount: number;
  subscriptionPlan: string | null;
  redeemedVouchers: {
    id: string;
    title: string;
    code: string;
    date: string;
    valueLabel: string;
  }[];
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "amber" | "urgent";
}

interface CleanCityContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
  theme: "light" | "dark";
  toggleTheme: () => void;
  isOfflineSim: boolean;
  toggleOfflineSim: () => void;
  mobileFrameOnDesktop: boolean;
  setMobileFrameOnDesktop: (v: boolean) => void;
  user: UserProfile;
  reports: WasteReport[];
  recyclerLots: RecyclerLot[];
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  notify: (
    title: string,
    description?: string,
    variant?: "success" | "amber" | "urgent"
  ) => void;
  addReport: (payload: {
    quartier: string;
    addressHint: string;
    lat: number;
    lng: number;
    category: WasteCategory;
    urgency: UrgencyLevel;
    description: string;
    photoBefore: string;
    compressedSizeKb: number;
    originalSizeMb: number;
  }) => WasteReport;
  updateReportStatus: (
    reportId: string,
    newStatus: ReportStatus,
    note?: string
  ) => void;
  upvoteReport: (reportId: string) => void;
  redeemReward: (reward: {
    id: string;
    title: string;
    pointsCost: number;
    valueLabel: string;
  }) => boolean;
  subscribeHomeCollection: (planName: string) => void;
  reserveRecyclerLot: (lotId: string, companyName: string) => void;
  loginWithOtp: (payload: {
    phone: string;
    name: string;
    quartier: string;
    role: UserProfile["role"];
  }) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  name: "Aminata Sow",
  phone: "+221 77 412 88 90",
  quartier: "Diokoul",
  role: "citoyen",
  points: 1450,
  levelTitle: "Ambassadrice Setal · Niveau 4",
  kgTriTotal: 64,
  reportsCount: 7,
  subscriptionPlan: "Formule Teranga Tri (2 passages / sem.)",
  redeemedVouchers: [
    {
      id: "v-01",
      title: "Transfert Cash Mobile Éco-Prime (Wave)",
      code: "WAVE-SN-8841",
      date: "14 nov. 2026",
      valueLabel: "2 000 FCFA",
    },
  ],
};

const STORAGE_KEY = "cleancity_rufisque_v5";

const CleanCityContext = createContext<CleanCityContextValue | null>(null);

export function CleanCityProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isOfflineSim, setIsOfflineSim] = useState(false);
  const [mobileFrameOnDesktop, setMobileFrameOnDesktop] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [reports, setReports] = useState<WasteReport[]>(INITIAL_REPORTS);
  const [recyclerLots, setRecyclerLots] = useState<RecyclerLot[]>(
    INITIAL_RECYCLER_LOTS
  );
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Hydrate from localStorage safely
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.reports && Array.isArray(parsed.reports))
          setReports(parsed.reports);
        if (parsed.recyclerLots && Array.isArray(parsed.recyclerLots))
          setRecyclerLots(parsed.recyclerLots);
        if (parsed.theme === "dark") {
          setTheme("dark");
          document.documentElement.classList.add("dark");
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  // Persist changes
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, reports, recyclerLots, theme })
      );
    } catch {
      // Ignore quota errors
    }
  }, [user, reports, recyclerLots, theme]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (
      title: string,
      description?: string,
      variant: "success" | "amber" | "urgent" = "success"
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 5000);
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  const toggleOfflineSim = useCallback(() => {
    setIsOfflineSim((prev) => {
      const next = !prev;
      if (next) {
        notify(
          "Mode Connexion Lente / Hors-ligne activé",
          "Les photos sont compressées à <150 Ko et mises en file d’attente locale.",
          "amber"
        );
      } else {
        notify(
          "Connexion 4G rétablie",
          "Synchronisation automatique avec le serveur Rufisque terminée.",
          "success"
        );
      }
      return next;
    });
  }, [notify]);

  const addReport = useCallback(
    (payload: {
      quartier: string;
      addressHint: string;
      lat: number;
      lng: number;
      category: WasteCategory;
      urgency: UrgencyLevel;
      description: string;
      photoBefore: string;
      compressedSizeKb: number;
      originalSizeMb: number;
    }): WasteReport => {
      const catMeta = WASTE_CATEGORIES[payload.category];
      const earnedPoints = catMeta.points;
      const code = `RF-${Math.floor(2052 + Math.random() * 900)}`;
      const nowTime = new Intl.DateTimeFormat("fr-SN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

      const newReport: WasteReport = {
        id: `rep-${Date.now()}`,
        code,
        quartier: payload.quartier,
        addressHint:
          payload.addressHint.trim() || `Secteur central, ${payload.quartier}`,
        lat: payload.lat,
        lng: payload.lng,
        category: payload.category,
        urgency: payload.urgency,
        description:
          payload.description.trim() ||
          `Signalement citoyen (${catMeta.label}) à ${payload.quartier}.`,
        status: "reported",
        createdAt: new Date().toISOString(),
        reporterName: user.name,
        reporterPhone: user.phone,
        estimatedKg: payload.urgency === "critique" ? 160 : 75,
        pointsAwarded: earnedPoints,
        photoBefore: payload.photoBefore,
        photoAfter:
          payload.photoBefore === "/avant2.jpg" ? "/apres2.jpg" : "/apres.jpg",
        compressedSizeKb: payload.compressedSizeKb,
        originalSizeMb: payload.originalSizeMb,
        upvotes: 1,
        timeline: [
          {
            status: "reported",
            label: isOfflineSim
              ? `Enregistré hors-ligne par ${user.name} (prêt à synchroniser)`
              : `Signalé gratuitement par ${user.name}`,
            timestamp: `Aujourd’hui ${nowTime}`,
            note: `Photo compressée (${payload.originalSizeMb} Mo → ${payload.compressedSizeKb} Ko)`,
          },
        ],
      };

      setReports((prev) => [newReport, ...prev]);
      setUser((prev) => ({
        ...prev,
        points: prev.points + earnedPoints,
        reportsCount: prev.reportsCount + 1,
      }));

      notify(
        `Jërëjëf ! Signalement ${code} enregistré`,
        `+${earnedPoints} Éco-Points ajoutés à votre compte citoyen.`,
        "success"
      );

      return newReport;
    },
    [user, isOfflineSim, notify]
  );

  const updateReportStatus = useCallback(
    (reportId: string, newStatus: ReportStatus, note?: string) => {
      const nowTime = new Intl.DateTimeFormat("fr-SN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

      setReports((prev) =>
        prev.map((rep) => {
          if (rep.id !== reportId) return rep;

          const statusLabels: Record<ReportStatus, string> = {
            reported: "Signalement ré-ouvert",
            assigned: "Pris en charge par GIE Setal Rufisque",
            scheduled: "Collecte programmée — Tricycle en route",
            completed:
              "Intervention terminée · Zone nettoyée et matières triées",
          };

          const updatedTimeline = [
            ...rep.timeline,
            {
              status: newStatus,
              label: statusLabels[newStatus],
              timestamp: `Aujourd’hui ${nowTime}`,
              actor: "Moussa Diop · GIE Setal Rufisque",
              note:
                note ||
                (newStatus === "completed"
                  ? "Photo Après vérifiée · Déchets pesés à l’Éco-Kiosque"
                  : undefined),
            },
          ];

          return {
            ...rep,
            status: newStatus,
            assignedAgent: rep.assignedAgent || "Moussa Diop",
            assignedTeam: rep.assignedTeam || "GIE Setal Rufisque (Tricycle #04)",
            scheduledFor:
              newStatus === "scheduled"
                ? "Passage aujourd’hui dans 45 min"
                : rep.scheduledFor,
            completedAt:
              newStatus === "completed"
                ? new Date().toISOString()
                : rep.completedAt,
            photoAfter:
              newStatus === "completed"
                ? rep.photoAfter || CLEAN_AFTER_PHOTO
                : rep.photoAfter,
            timeline: updatedTimeline,
          };
        })
      );

      if (newStatus === "completed") {
        setUser((prev) => ({
          ...prev,
          points: prev.points + 30,
          kgTriTotal: prev.kgTriTotal + 15,
        }));
        notify(
          "Collecte terminée avec photo Avant/Après !",
          "Le citoyen a été notifié et +30 Éco-Points bonus ont été débloqués.",
          "success"
        );
      } else {
        notify(
          "Statut d’intervention mis à jour",
          `Le suivi citoyen affiche désormais : ${
            newStatus === "assigned" ? "Pris en charge" : "Collecte programmée"
          }.`,
          "amber"
        );
      }
    },
    [notify]
  );

  const upvoteReport = useCallback(
    (reportId: string) => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r
        )
      );
      setUser((prev) => ({ ...prev, points: prev.points + 5 }));
      notify(
        "Confirmation citoyenne enregistrée (+5 pts)",
        "Votre confirmation aide la commune de Rufisque à prioriser ce dépôt.",
        "success"
      );
    },
    [notify]
  );

  const redeemReward = useCallback(
    (reward: {
      id: string;
      title: string;
      pointsCost: number;
      valueLabel: string;
    }): boolean => {
      if (user.points < reward.pointsCost) {
        notify(
          "Solde d’Éco-Points insuffisant",
          `Il vous manque ${
            reward.pointsCost - user.points
          } pts pour débloquer cette récompense.`,
          "urgent"
        );
        return false;
      }

      const code = `CC-SN-${Math.floor(1000 + Math.random() * 9000)}`;
      setUser((prev) => ({
        ...prev,
        points: prev.points - reward.pointsCost,
        redeemedVouchers: [
          {
            id: `v-${Date.now()}`,
            title: reward.title,
            code,
            date: "Aujourd’hui",
            valueLabel: reward.valueLabel,
          },
          ...prev.redeemedVouchers,
        ],
      }));

      notify(
        `Récompense débloquée : ${reward.valueLabel}`,
        `Code bon : ${code} envoyé par SMS au ${user.phone}`,
        "success"
      );
      return true;
    },
    [user.points, user.phone, notify]
  );

  const subscribeHomeCollection = useCallback(
    (planName: string) => {
      setUser((prev) => ({
        ...prev,
        subscriptionPlan: planName,
        points: prev.points + 100,
      }));
      notify(
        "Abonnement Collecte Domicile activé !",
        `${planName} enregistré pour ${user.quartier}. +100 Éco-Points de bienvenue !`,
        "success"
      );
    },
    [user.quartier, notify]
  );

  const reserveRecyclerLot = useCallback(
    (lotId: string, companyName: string) => {
      setRecyclerLots((prev) =>
        prev.map((lot) =>
          lot.id === lotId
            ? { ...lot, status: "reserve", reservedBy: companyName }
            : lot
        )
      );
      notify(
        "Demande d’enlèvement confirmée",
        `Lot réservé pour ${companyName}. Créneau de chargement bloqué à l’Éco-Kiosque.`,
        "success"
      );
    },
    [notify]
  );

  const loginWithOtp = useCallback(
    (payload: {
      phone: string;
      name: string;
      quartier: string;
      role: UserProfile["role"];
    }) => {
      setUser((prev) => ({
        ...prev,
        phone: payload.phone,
        name: payload.name || prev.name,
        quartier: payload.quartier || prev.quartier,
        role: payload.role,
      }));
      notify(
        `Dalal ak Jàmm, ${payload.name || user.name} !`,
        `Connecté en tant que ${payload.role.toUpperCase()} (${payload.quartier}).`,
        "success"
      );
    },
    [user.name, notify]
  );

  return (
    <CleanCityContext.Provider
      value={{
        locale,
        setLocale,
        t: dictionaries[locale],
        theme,
        toggleTheme,
        isOfflineSim,
        toggleOfflineSim,
        mobileFrameOnDesktop,
        setMobileFrameOnDesktop,
        user,
        reports,
        recyclerLots,
        toasts,
        dismissToast,
        notify,
        addReport,
        updateReportStatus,
        upvoteReport,
        redeemReward,
        subscribeHomeCollection,
        reserveRecyclerLot,
        loginWithOtp,
        isReportModalOpen,
        setIsReportModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </CleanCityContext.Provider>
  );
}

export function useCleanCity() {
  const ctx = useContext(CleanCityContext);
  if (!ctx) {
    throw new Error("useCleanCity must be used within a CleanCityProvider");
  }
  return ctx;
}
