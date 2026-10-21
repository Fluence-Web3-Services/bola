import { BINS, DEPOT, type CampusBin, type LatLng } from "./campus";

export const PICKUP_AT = 75;

export type RoutePlan = {
  stops: CampusBin[];
  skipped: CampusBin[];
  km: number;
  baselineKm: number;
  savedKm: number;
  say: string;
};

export function kmBetween(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function pathKm(points: LatLng[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i++) sum += kmBetween(points[i - 1], points[i]);
  return sum;
}

export function orderNearest(start: LatLng, stops: CampusBin[]): CampusBin[] {
  const left = [...stops];
  const ordered: CampusBin[] = [];
  let cursor = start;
  while (left.length) {
    let best = 0;
    let bestKm = Infinity;
    for (let i = 0; i < left.length; i++) {
      const distance = kmBetween(cursor, left[i]);
      if (distance < bestKm) {
        bestKm = distance;
        best = i;
      }
    }
    const [next] = left.splice(best, 1);
    ordered.push(next);
    cursor = next;
  }
  return ordered;
}

function roundSay(stops: number, total: number, km: number, saved: number): string {
  return `${stops} stops, not ${total}. ${km.toFixed(1)} kilometres. ${saved.toFixed(1)} saved.`;
}

export function buildRound(all: CampusBin[], chosen: CampusBin[]): RoutePlan {
  const stops = orderNearest(DEPOT, chosen);
  const skipped = all.filter((bin) => !chosen.some((stop) => stop.id === bin.id));
  const southNorth = [...all].sort((a, b) => a.lat - b.lat || a.lng - b.lng);
  const km = pathKm([DEPOT, ...stops, DEPOT]);
  const baselineKm = pathKm([DEPOT, ...southNorth, DEPOT]);
  const savedKm = baselineKm - km;
  return {
    stops,
    skipped,
    km,
    baselineKm,
    savedKm,
    say: roundSay(stops.length, all.length, km, savedKm),
  };
}

export function planRound(bins: CampusBin[] = BINS): RoutePlan {
  return buildRound(
    bins,
    bins.filter((bin) => bin.fill >= PICKUP_AT),
  );
}

export function isRoutePlan(value: unknown): value is RoutePlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<RoutePlan>;
  return (
    Array.isArray(plan.stops) &&
    Array.isArray(plan.skipped) &&
    typeof plan.km === "number" &&
    typeof plan.baselineKm === "number" &&
    typeof plan.say === "string"
  );
}
