"use client";

import { useState } from "react";
import { BINS } from "@/lib/campus";
import { PICKUP_AT } from "@/lib/route";
import { STREAMS } from "@/lib/streams";
import { CampusSvg } from "./CampusSvg";

export function BinMap() {
  const [id, setId] = useState(BINS[0].id);
  const bin = BINS.find((item) => item.id === id) ?? BINS[0];
  return (
    <div className="panel">
      <p className="kicker">Campus bins</p>
      <h2>Where it goes</h2>
      <p className="fine">Fill levels are demo data. The drawing is schematic. Distances use the coordinates.</p>
      <div className="split" style={{ marginTop: 16 }}>
        <div className="map-wrap">
          <CampusSvg selected={id} onSelect={setId} />
        </div>
        <div className="stack">
          <article className="card" style={{ background: STREAMS[bin.stream].color, color: STREAMS[bin.stream].ink }}>
            <strong>{bin.name}</strong>
            {bin.zone} · {STREAMS[bin.stream].label}
            <span className="note">{bin.fill}% full · {bin.kgPerDay} kg/day assumed</span>
            <span className="note">{bin.fill >= PICKUP_AT ? "On this morning's round." : `Skip today. Under ${PICKUP_AT}%.`}</span>
          </article>
          <div className="bin-list">
            {BINS.map((item) => (
              <button key={item.id} type="button" aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <b>{item.code}</b> {item.name}
                <div className="fill" aria-hidden="true"><i style={{ width: `${item.fill}%`, background: STREAMS[item.stream].color }} /></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
