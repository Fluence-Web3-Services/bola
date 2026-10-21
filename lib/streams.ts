export const SORT_BINS = ["wet", "dry", "reject", "ewaste", "hazard", "sanitary"] as const;

export type BinId = (typeof SORT_BINS)[number];

export type StreamInfo = {
  label: string;
  voice: string;
  say: string;
  color: string;
  ink: string;
};

export const STREAMS: Record<BinId | "mixed", StreamInfo> = {
  wet: {
    label: "Wet",
    voice: "geela",
    say: "Geela. Green bin.",
    color: "#1c7a45",
    ink: "#f4f0e6",
  },
  dry: {
    label: "Dry",
    voice: "sukha",
    say: "Sukha. Blue bin.",
    color: "#2457c5",
    ink: "#f4f0e6",
  },
  reject: {
    label: "Reject",
    voice: "reject",
    say: "Reject bin.",
    color: "#5e584f",
    ink: "#f4f0e6",
  },
  ewaste: {
    label: "E-waste",
    voice: "e-waste",
    say: "E-waste. Alag rakhna.",
    color: "#643db8",
    ink: "#f4f0e6",
  },
  hazard: {
    label: "Hazard",
    voice: "hazard",
    say: "Hazard. Mat milao.",
    color: "#c2411c",
    ink: "#f4f0e6",
  },
  sanitary: {
    label: "Sanitary",
    voice: "sanitary",
    say: "Sanitary. Alag bin.",
    color: "#b4235a",
    ink: "#f4f0e6",
  },
  mixed: {
    label: "Mixed",
    voice: "mixed",
    say: "Mixed bin.",
    color: "#8a6230",
    ink: "#f4f0e6",
  },
};
