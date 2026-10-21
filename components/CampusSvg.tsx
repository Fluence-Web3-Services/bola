"use client";

import { BINS, DEPOT, type CampusBin } from "@/lib/campus";
import { project } from "@/lib/project";
import { STREAMS } from "@/lib/streams";

export function CampusSvg({
  route,
  selected,
  onSelect,
}: {
  route?: CampusBin[];
  selected?: string | null;
  onSelect?: (id: string) => void;
}) {
  const xy = project([DEPOT, ...BINS], 14);
  const depot = xy(DEPOT);
  const line = route ? [DEPOT, ...route, DEPOT].map((point) => {
    const { x, y } = xy(point);
    return `${x},${y}`;
  }).join(" ") : "";

  return (
    <svg className="campus" viewBox="0 0 100 100" role="img" aria-label="Schematic of IIT Roorkee bins">
      <rect width="100" height="100" rx="4" fill="#dfe8dc" />
      <text x="14" y="8" fontSize="3.2" fill="#5c675f">Ganga canal side</text>
      {line ? <polyline points={line} fill="none" stroke="#17211b" strokeWidth="0.7" /> : null}
      <rect x={depot.x - 1.4} y={depot.y - 1.4} width="2.8" height="2.8" fill="#17211b" />
      {BINS.map((bin) => {
        const { x, y } = xy(bin);
        const onRoute = route?.some((stop) => stop.id === bin.id);
        return (
          <g
            key={bin.id}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={`${bin.name}, ${bin.fill}% full`}
            onClick={() => onSelect?.(bin.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(bin.id);
              }
            }}
          >
            <circle
              cx={x}
              cy={y}
              r={selected === bin.id ? 3.3 : 2.5}
              fill={STREAMS[bin.stream].color}
              opacity={route && !onRoute ? 0.35 : 1}
              stroke={selected === bin.id ? "#17211b" : "none"}
              strokeWidth="0.6"
            />
            <text x={x + 3.2} y={y + 1.1} fontSize="3.1" fill="#17211b">{bin.code}</text>
          </g>
        );
      })}
    </svg>
  );
}
