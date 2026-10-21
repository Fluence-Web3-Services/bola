"use client";

import type { SortResult } from "@/lib/classify";
import { ASSUMPTIONS, projectImpact } from "@/lib/impact";
import type { RoutePlan } from "@/lib/route";

export function ImpactView({ plan, sorts }: { plan: RoutePlan; sorts: SortResult[] }) {
  const impact = projectImpact(plan);
  const items = sorts.reduce((sum, sort) => sum + sort.items.length, 0);
  const recyclable = sorts.reduce(
    (sum, sort) => sum + sort.items.filter((item) => item.bin === "dry" || item.bin === "wet").length,
    0,
  );

  return (
    <div className="panel">
      <p className="kicker">Projection, not a field count</p>
      <h2>What a cleaner throw changes</h2>
      <div className="stats">
        <article className="stat">
          <b>{Math.round(impact.cleanerKgDay)}</b>
          kg/day kept recyclable
        </article>
        <article className="stat">
          <b>{impact.savedKm.toFixed(1)}</b>
          km saved each round
        </article>
        <article className="stat">
          <b>{Math.round(impact.litresYear)}</b>
          litres/year if the saving holds
        </article>
      </div>
      <p className="lede">This browser: {sorts.length} sorts, {items} items, {recyclable} headed to wet or dry.</p>
      <details>
        <summary>How the numbers are made</summary>
        <p>
          Campus waste is assumed at {ASSUMPTIONS.people.toLocaleString("en-IN")} people × {ASSUMPTIONS.kgPerPerson} kg,
          and {Math.round(ASSUMPTIONS.recyclableShare * 100)}% of that can be recycled or composted.
          Contamination is taken as {Math.round(ASSUMPTIONS.contaminationNow * 100)}% today and {Math.round(ASSUMPTIONS.contaminationWith * 100)}% if the bin is named before the throw.
          The kilogram figure is that gap. It is a target.
        </p>
        <p>
          The truck figure compares a full south-to-north list ({impact.baselineKm.toFixed(1)} km) with this round ({impact.roundKm.toFixed(1)} km).
          Two trips a day, {ASSUMPTIONS.kmPerLitre} km per litre, {ASSUMPTIONS.kgCo2PerLitre} kg CO₂ per litre, comes to about {Math.round(impact.co2Year)} kg CO₂ a year.
        </p>
        <p>v1 is a phone at the mess door, stickers on the bins you already have, and this page for the sweeper. Sensors can replace the demo fill levels later. The route task stays the same.</p>
      </details>
    </div>
  );
}
