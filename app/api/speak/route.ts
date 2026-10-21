export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CAP = 80;
let spoken = 0;

export async function GET() {
  return Response.json({ enabled: Boolean(process.env.ELEVENLABS_API_KEY) });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 180) : "";
  if (!text) return Response.json({ error: "Nothing to say." }, { status: 400 });

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return Response.json({ error: "Add ELEVENLABS_API_KEY." }, { status: 503 });
  if (spoken >= CAP) return Response.json({ error: "Voice cap reached. Restart the server." }, { status: 429 });

  const voice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const model = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
  const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    }),
  });

  if (!upstream.ok) {
    return Response.json({ error: `Voice failed (${upstream.status}).` }, { status: 502 });
  }

  spoken += 1;
  return new Response(await upstream.arrayBuffer(), {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}
