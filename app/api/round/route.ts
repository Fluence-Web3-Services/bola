import { isRoutePlan, planRound } from "@/lib/route";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type Finished = { status?: string; results?: unknown };

function unwrap(details: Finished): unknown {
  const results = details.results;
  if (Array.isArray(results)) return results[0];
  return results;
}

export async function GET() {
  return Response.json({ via: "local", plan: planRound() });
}

export async function POST() {
  const task = process.env.RENDER_WORKFLOW_TASK;
  const local = planRound();
  if (!process.env.RENDER_API_KEY || !task) {
    return Response.json({
      via: "local",
      plan: local,
      warning: "Set RENDER_API_KEY and RENDER_WORKFLOW_TASK to run this on Render.",
    });
  }

  try {
    const { Render } = await import("@renderinc/sdk");
    const render = new Render();
    const finished = (await render.workflows.runTask(task, [], AbortSignal.timeout(70000))) as Finished;
    const plan = unwrap(finished);
    if (!isRoutePlan(plan)) {
      return Response.json({
        via: "local",
        plan: local,
        warning: "Render answered, but the round shape did not match.",
        status: finished.status,
      });
    }
    return Response.json({ via: "render", plan, status: finished.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Render did not answer.";
    return Response.json({ via: "local", plan: local, warning: message });
  }
}
