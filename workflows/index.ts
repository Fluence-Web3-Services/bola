import { task, type TaskContext } from "@renderinc/sdk/workflows";
import { BINS, type CampusBin } from "../lib/campus";
import { PICKUP_AT, buildRound } from "../lib/route";

type BinScore = { id: string; pickup: boolean; priority: number };

export const scoreBin = task(
  { name: "scoreBin", plan: "flex", timeoutSeconds: 60 },
  function scoreBin(_ctx: TaskContext, bin: CampusBin): BinScore {
    const wetBoost = bin.stream === "wet" ? 5 : 0;
    return { id: bin.id, pickup: bin.fill >= PICKUP_AT, priority: bin.fill + wetBoost };
  },
);

export const planRound = task(
  { name: "planRound", plan: "flex", timeoutSeconds: 180 },
  async function planRoundTask(ctx: TaskContext) {
    const scores = await Promise.all(BINS.map((bin) => ctx.run(scoreBin, bin)));
    const pickup = new Set(scores.filter((score) => score.pickup).map((score) => score.id));
    return buildRound(
      BINS,
      BINS.filter((bin) => pickup.has(bin.id)),
    );
  },
);
