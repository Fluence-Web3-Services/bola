import { classify } from "@/lib/classify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text : "";
  if (text.length > 500) return Response.json({ error: "Keep it short." }, { status: 400 });
  return Response.json(classify(text));
}
