import type { LatLng } from "./campus";

export type Point = { x: number; y: number };

export function project(points: LatLng[], pad = 12): (point: LatLng) => Point {
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat || 1;
  const spanLng = maxLng - minLng || 1;
  const size = 100 - pad * 2;
  return (point) => ({
    x: pad + ((point.lng - minLng) / spanLng) * size,
    y: pad + ((maxLat - point.lat) / spanLat) * size,
  });
}
