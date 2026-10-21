import { STREAMS, type BinId } from "./streams";

export type ItemHit = {
  phrase: string;
  bin: BinId;
  note: string;
};

export type SortResult = {
  query: string;
  items: ItemHit[];
  unknown: string[];
  say: string;
};

type Rule = {
  bin: BinId;
  keys: string[];
  note: string;
};

const RANK: Record<BinId, number> = {
  hazard: 6,
  sanitary: 5,
  ewaste: 4,
  wet: 3,
  reject: 2,
  dry: 1,
};

const RULES: Rule[] = [
  { bin: "hazard", keys: ["broken glass", "tube light", "tubelight", "spray can", "aerosol", "medicine bottle", "tablet strip", "medicine strip"], note: "Do not put this in a mess bin." },
  { bin: "hazard", keys: ["medicine", "dawai", "dawa", "phenyl", "acid", "paint", "thinner", "pesticide", "syrup", "chemical", "cfl", "दवाई", "दवा"], note: "Hazard bin. Keep it sealed." },
  { bin: "sanitary", keys: ["sanitary pad", "sanitary napkin", "sanitary", "diaper", "condom", "पैड"], note: "Wrap it. Sanitary bin only." },
  { bin: "sanitary", keys: ["pad"], note: "If it is a sanitary pad, use the sanitary bin." },
  { bin: "ewaste", keys: ["power bank", "dead battery", "pencil cell", "charging cable", "data cable"], note: "Tape battery ends. Take it to the e-waste point." },
  { bin: "ewaste", keys: ["charger", "charjer", "battery", "batteries", "battary", "cable", "earphone", "earphones", "headphone", "adapter", "mobile", "phone", "laptop", "charger", "बैटरी", "चार्जर"], note: "Not in the mess bin. E-waste point." },
  { bin: "wet", keys: ["leftover rice", "leftover", "banana peel", "paper plate", "tea leaves", "mess food"], note: "Food waste. Green bin." },
  { bin: "wet", keys: ["rice", "chawal", "roti", "dal", "sabzi", "khana", "food", "peel", "chilka", "chai", "coffee", "cup", "plate", "thaali", "samosa", "tiffin", "curry", "चावल", "रोटी", "दाल", "सब्जी", "छिलका", "चाय"], note: "Green bin, with the food waste." },
  { bin: "reject", keys: ["chips packet", "chip packet", "pizza box", "plastic bag", "carry bag", "milk packet"], note: "Clean it only if a recycler takes that pack. Otherwise reject." },
  { bin: "reject", keys: ["chips", "wrapper", "maggi", "toffee", "kurkure", "namkeen", "foil", "polythene", "polybag", "tissue", "styrofoam", "thermocol"], note: "This wrap is not a dry-bin item." },
  { bin: "dry", keys: ["plastic bottle", "water bottle", "pani ki bottle", "glass bottle", "प्लास्टिक बोतल"], note: "Empty it. Cap on." },
  { bin: "dry", keys: ["cardboard", "carton", "newspaper", "notebook", "writing pad", "paper", "bottle", "can", "dibba", "glass", "metal", "steel", "aluminium", "aluminum", "tetra pak", "tetrapak", "कागज", "बोतल"], note: "Empty and dry, then the blue bin." },
];

export function norm(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasKey(text: string, key: string): boolean {
  if (!key) return false;
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(text);
}

function bestRule(segment: string): Rule | null {
  let best: { rule: Rule; len: number } | null = null;
  for (const rule of RULES) {
    for (const key of rule.keys.map(norm)) {
      if (!hasKey(segment, key)) continue;
      const len = key.length;
      if (!best || len > best.len || (len === best.len && RANK[rule.bin] > RANK[best.rule.bin])) {
        best = { rule, len };
      }
    }
  }
  return best?.rule ?? null;
}

function splitItems(query: string): string[] {
  return query
    .split(/\s*(?:,|&|\/|\+|\band\b|\baur\b|\bplus\b|और)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function snippet(phrase: string): string {
  const words = phrase.split(" ").slice(0, 3).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function buildSay(items: ItemHit[], unknown: string[]): string {
  if (!items.length && unknown.length) return "Not sure. Ask at the mess.";
  if (!items.length) return "Say what you're throwing.";
  if (items.length === 1 && unknown.length === 0) return STREAMS[items[0].bin].say;
  if (items.length > 2) {
    const labels = [...new Set(items.map((item) => STREAMS[item.bin].label.toLowerCase()))];
    return `${items.length} items. ${labels.join(", ")}.`;
  }
  const bits = items.map((item) => `${snippet(item.phrase)}, ${STREAMS[item.bin].voice}.`);
  if (unknown.length) bits.push("Rest unclear.");
  const text = bits.join(" ");
  return text.length > 140 ? `${items.length} items. Check the cards.` : text;
}

export function classify(raw: string): SortResult {
  const query = norm(raw);
  const items: ItemHit[] = [];
  const unknown: string[] = [];

  for (const part of splitItems(query)) {
    const rule = bestRule(part);
    if (!rule) {
      unknown.push(part);
      continue;
    }
    items.push({ phrase: part, bin: rule.bin, note: rule.note });
  }

  return { query: raw.trim(), items, unknown, say: buildSay(items, unknown) };
}
