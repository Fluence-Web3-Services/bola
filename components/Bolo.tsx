"use client";

import { useEffect, useRef, useState } from "react";
import { classify, type SortResult } from "@/lib/classify";
import { STREAMS } from "@/lib/streams";

const EXAMPLES = ["leftover rice", "plastic bottle aur purana charger", "chips packet", "dawai ki strip"];

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function recognizer(): (new () => SpeechRec) | null {
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

async function playLine(text: string) {
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Voice unavailable.");
  }
  const url = URL.createObjectURL(await res.blob());
  const audio = new Audio(url);
  audio.onended = () => URL.revokeObjectURL(url);
  await audio.play();
}

export function Bolo({ onSort }: { onSort: (result: SortResult) => void }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SortResult | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    fetch("/api/speak")
      .then((res) => res.json())
      .then((body: { enabled?: boolean }) => setVoiceOn(Boolean(body.enabled)))
      .catch(() => setVoiceOn(false));
    return () => recRef.current?.stop();
  }, []);

  async function run(raw: string) {
    const next = classify(raw);
    setResult(next);
    setError(null);
    if (next.items.length) onSort(next);
    if (!voiceOn || next.say === "Say what you're throwing.") return;
    try {
      await playLine(next.say);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Voice unavailable.");
    }
  }

  function toggleMic() {
    const Ctor = recognizer();
    if (!Ctor) {
      setError("This browser has no speech input. Type it.");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "hi-IN";
    rec.interimResults = true;
    rec.onresult = (event) => {
      const heard = Array.from(event.results)
        .map((item) => item[0].transcript)
        .join(" ");
      setText(heard);
      const last = event.results[event.results.length - 1];
      if (last?.isFinal) void run(heard);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <div className="bolo">
      <div className="stack">
        <p className="kicker">IIT Roorkee · mess door</p>
        <h1>Bolo.</h1>
        <p className="lede">Say what you are holding. One short line tells you the bin.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run(text);
          }}
        >
          <input
            type="text"
            value={text}
            maxLength={240}
            aria-label="What are you throwing?"
            placeholder={listening ? "Listening…" : "leftover rice, a bottle, a charger"}
            onChange={(event) => setText(event.target.value)}
          />
          <button className="mic" type="button" data-on={listening} aria-label={listening ? "Stop" : "Speak"} onClick={toggleMic}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#17211b" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
            </svg>
          </button>
        </form>
        <div className="chips">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" onClick={() => { setText(example); void run(example); }}>
              {example}
            </button>
          ))}
        </div>
        {result ? <p className="say">{result.say}</p> : null}
        <div className="row">
          <button className="play" type="button" disabled={!result} onClick={() => result && playLine(result.say).catch((err: unknown) => setError(err instanceof Error ? err.message : "Voice unavailable."))}>
            {voiceOn ? "Play" : "Voice needs a key"}
          </button>
          <p className="fine">Word list, Hindi and English. Not a camera model.</p>
        </div>
        {error ? <p className="warn">{error}</p> : null}
      </div>
      <div className="cards" aria-live="polite">
        {result?.items.map((item) => (
          <article key={`${item.phrase}-${item.bin}`} className="card" style={{ background: STREAMS[item.bin].color, color: STREAMS[item.bin].ink }}>
            <strong>{STREAMS[item.bin].label}</strong>
            {item.phrase}
            <span className="note">{item.note}</span>
          </article>
        ))}
        {result?.unknown.map((phrase) => (
          <article key={phrase} className="card" style={{ background: "#5c675f" }}>
            <strong>Unclear</strong>
            {phrase}
          </article>
        ))}
      </div>
    </div>
  );
}
