import {
  Milk,
  Trash2,
  Apple,
  Package,
  CupSoda,
  BrickWall,
  type LucideIcon,
} from "lucide-react";
import type { ReportStatus, WasteCategory, WasteReport } from "./mock-data";

export const CATEGORY: Record<WasteCategory, { label: string; icon: LucideIcon }> = {
  plastique: { label: "Plastique", icon: Milk },
  menager_mixte: { label: "Ordures mélangées", icon: Trash2 },
  organique: { label: "Organique", icon: Apple },
  carton_papier: { label: "Carton, papier", icon: Package },
  metal_verre: { label: "Métal, verre", icon: CupSoda },
  gravats: { label: "Gravats, encombrants", icon: BrickWall },
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  reported: "Signalé",
  assigned: "Pris en charge",
  scheduled: "Collecte prévue",
  completed: "Terminé",
};

export const STATUS_ORDER: Record<ReportStatus, number> = {
  reported: 0,
  assigned: 1,
  scheduled: 2,
  completed: 3,
};

export type PointKind = "urgent" | "progress" | "done" | "kiosk";

export function reportKind(r: WasteReport): PointKind {
  if (r.status === "completed") return "done";
  if (r.urgency === "critique" && r.status === "reported") return "urgent";
  return "progress";
}

export const LEVELS = [
  { name: "Voisin", min: 0 },
  { name: "Voisin engagé", min: 500 },
  { name: "Ambassadeur du quartier", min: 1200 },
  { name: "Gardien de Rufisque", min: 2500 },
];

export function levelFor(points: number) {
  let index = 0;
  LEVELS.forEach((l, i) => {
    if (points >= l.min) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? (points - current.min) / (next.min - current.min) : 1;
  return { current, next, progress, index };
}
