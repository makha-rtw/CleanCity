import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nf = new Intl.NumberFormat("fr-FR");
const tf = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });

export function formatNumber(n: number): string {
  return nf.format(n);
}

export function formatCFA(n: number): string {
  return `${nf.format(n)}\u00A0FCFA`;
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.max(10, Math.round(m / 10) * 10)}\u00A0m`;
  return `${(m / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}\u00A0km`;
}

export function timeNow(): string {
  return tf.format(new Date());
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function firstName(name: string): string {
  return name.split(" ")[0] || name;
}
