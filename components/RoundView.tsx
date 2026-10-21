"use client";

import { useState } from "react";
import type { RoutePlan } from "@/lib/route";
import { STREAMS } from "@/lib/streams";
import { CampusSvg } from "./CampusSvg";

export function RoundView({
  plan,
  via,
  warning,
  onRender,
}: {
  plan: RoutePlan;
  via: "local" | "render";
  warning: string | null;
  onRender: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  async function speak() {
    setVoiceError(null);
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: plan.say }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setVoiceError(body?.error || "Voice unavailable.");
      return;
    }
    const audio = new Audio(URL.createObjectURL(await res.blob()));
    await audio.play();
  }

  return (
    <div className="panel">
      <p className="kicker">{via === "render" ? "Render workflow" : "Local round"}</p>
      <h2>{plan.say}</h2>
      <div className="row">
        <button className="play" type="button" onClick={() => void speak()}>Speak the round</button>
        <button
          className="ghost"
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void onRender().finally(() => setBusy(false));
          }}
        >
          {busy ? "Asking Render…" : "Plan on Render"}
        </button>
      </div>
      {warning ? <p className="warn">{warning}</p> : null}
      {voiceError ? <p className="warn">{voiceError}</p> : null}
      <div className="split" style={{ marginTop: 16 }}>
        <div className="map-wrap">
          <CampusSvg route={plan.stops} />
        </div>
        <ol className="bin-list">
          {plan.stops.map((stop, index) => (
            <li key={stop.id} className="card" style={{ background: STREAMS[stop.stream].color, color: STREAMS[stop.stream].ink }}>
              <strong>{index + 1}. {stop.name}</strong>
              {stop.fill}% · {STREAMS[stop.stream].label}
            </li>
          ))}
        </ol>
      </div>
      <p className="fine">Baseline is every bin, south to north, then back to the depot. This round skips bins under 75% and visits the rest nearest-first.</p>
    </div>
  );
}
