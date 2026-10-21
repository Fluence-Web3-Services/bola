import assert from "node:assert/strict";
import { classify } from "../lib/classify";
import { projectImpact } from "../lib/impact";
import { PICKUP_AT, planRound } from "../lib/route";

const rice = classify("leftover rice");
assert.equal(rice.items[0]?.bin, "wet");
assert.match(rice.say, /Green bin/);

const pair = classify("plastic bottle aur purana charger");
assert.deepEqual(
  pair.items.map((item) => item.bin),
  ["dry", "ewaste"],
);

const chips = classify("chips packet");
assert.equal(chips.items[0]?.bin, "reject");

const medicine = classify("dawai ki strip");
assert.equal(medicine.items[0]?.bin, "hazard");

const hindi = classify("चावल और बैटरी");
assert.deepEqual(
  hindi.items.map((item) => item.bin),
  ["wet", "ewaste"],
);

const writing = classify("writing pad");
assert.equal(writing.items[0]?.bin, "dry");

const plan = planRound();
assert.ok(plan.stops.every((stop) => stop.fill >= PICKUP_AT));
assert.equal(plan.stops.length + plan.skipped.length, 15);
assert.ok(plan.savedKm > 0);
assert.ok(plan.say.length < 80);

const impact = projectImpact(plan);
assert.equal(Math.round(impact.cleanerKgDay), 227);

console.log(plan.say);
console.log(`round ${plan.km.toFixed(2)} km, list ${plan.baselineKm.toFixed(2)} km, saved ${plan.savedKm.toFixed(2)}`);
console.log(`cleaner ${impact.cleanerKgDay.toFixed(1)} kg/day, ${impact.litresYear.toFixed(1)} L/year`);
