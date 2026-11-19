import { RUFISQUE_QUARTIERS } from "./mock-data";

type LatLng = { lat: number; lng: number };

export function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestQuartier(lat: number, lng: number) {
  let best = RUFISQUE_QUARTIERS[0];
  let bestD = Infinity;
  for (const q of RUFISQUE_QUARTIERS) {
    const d = distanceMeters({ lat, lng }, q);
    if (d < bestD) {
      bestD = d;
      best = q;
    }
  }
  return best;
}

export const RUFISQUE_CENTER = { lat: 14.7215, lng: -17.2705 };
