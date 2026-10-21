"use client";

import { useEffect, useState } from "react";
import type { SortResult } from "@/lib/classify";
import { isRoutePlan, planRound, type RoutePlan } from "@/lib/route";
import { BinMap } from "./BinMap";
import { Bolo } from "./Bolo";
import { ImpactView } from "./ImpactView";
import { RoundView } from "./RoundView";

const TABS = [
  ["bolo", "Bolo"],
  ["bins", "Bins"],
  ["round", "Round"],
  ["impact", "Impact"],
] as const;

type Tab = (typeof TABS)[number][0];
const STORE = "bola.sorts";

export function App() {
  const [tab, setTab] = useState<Tab>("bolo");
  const [sorts, setSorts] = useState<SortResult[]>([]);
  const [plan, setPlan] = useState<RoutePlan>(() => planRound());
  const [via, setVia] = useState<"local" | "render">("local");
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORE);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as SortResult[];
      if (Array.isArray(parsed)) setSorts(parsed);
    } catch {
      localStorage.removeItem(STORE);
    }
  }, []);

  function onSort(result: SortResult) {
    setSorts((prev) => {
      const next = [result, ...prev].slice(0, 40);
      localStorage.setItem(STORE, JSON.stringify(next));
      return next;
    });
  }

  async function onRender() {
    const res = await fetch("/api/round", { method: "POST", signal: AbortSignal.timeout(90000) });
    const body = (await res.json()) as { via?: string; plan?: unknown; warning?: string };
    if (isRoutePlan(body.plan)) setPlan(body.plan);
    setVia(body.via === "render" ? "render" : "local");
    setWarning(body.warning ?? null);
  }

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <header>
        <div>
          <div className="brand">Bola</div>
          <div className="brand-sub">Say it. Bin it.</div>
        </div>
        <nav aria-label="Sections">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main id="main">
        {tab === "bolo" ? <div className="panel"><Bolo onSort={onSort} /></div> : null}
        {tab === "bins" ? <BinMap /> : null}
        {tab === "round" ? <RoundView plan={plan} via={via} warning={warning} onRender={onRender} /> : null}
        {tab === "impact" ? <ImpactView plan={plan} sorts={sorts} /> : null}
      </main>
    </div>
  );
}
