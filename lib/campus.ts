import type { BinId } from "./streams";

export type LatLng = { lat: number; lng: number };

export type CampusBin = LatLng & {
  id: string;
  code: string;
  name: string;
  zone: string;
  fill: number;
  stream: BinId | "mixed";
  kgPerDay: number;
};

export const DEPOT: LatLng & { id: string; code: string; name: string } = {
  id: "depot",
  code: "DP",
  name: "Sanitation depot",
  lat: 29.8642,
  lng: 77.8934,
};

// Approximate campus points so the round length is in kilometres.
// They are not a survey.
export const BINS: CampusBin[] = [
  { id: "cbc", code: "CB", name: "CBC canteen", zone: "Food", lat: 29.8648, lng: 77.8948, fill: 95, stream: "wet", kgPerDay: 85 },
  { id: "rajendra", code: "RJ", name: "Rajendra Bhawan", zone: "Hostel", lat: 29.8674, lng: 77.8988, fill: 92, stream: "wet", kgPerDay: 180 },
  { id: "himalaya", code: "HM", name: "Himalaya Bhawan", zone: "Hostel", lat: 29.8704, lng: 77.897, fill: 88, stream: "mixed", kgPerDay: 130 },
  { id: "cautley", code: "CU", name: "Cautley Bhawan", zone: "Hostel", lat: 29.8696, lng: 77.8952, fill: 86, stream: "wet", kgPerDay: 160 },
  { id: "kasturba", code: "KB", name: "Kasturba Bhawan", zone: "Hostel", lat: 29.8622, lng: 77.8946, fill: 83, stream: "wet", kgPerDay: 70 },
  { id: "govind", code: "GV", name: "Govind Bhawan", zone: "Hostel", lat: 29.8664, lng: 77.901, fill: 81, stream: "dry", kgPerDay: 90 },
  { id: "sac", code: "SC", name: "SAC", zone: "Campus", lat: 29.8618, lng: 77.8972, fill: 79, stream: "reject", kgPerDay: 65 },
  { id: "rajiv", code: "RV", name: "Rajiv Bhawan", zone: "Hostel", lat: 29.8652, lng: 77.9022, fill: 77, stream: "dry", kgPerDay: 100 },
  { id: "ganga", code: "GG", name: "Ganga Bhawan", zone: "Hostel", lat: 29.8692, lng: 77.8984, fill: 74, stream: "mixed", kgPerDay: 150 },
  { id: "ece", code: "EC", name: "ECE department", zone: "Academic", lat: 29.8656, lng: 77.8982, fill: 73, stream: "ewaste", kgPerDay: 15 },
  { id: "ravindra", code: "RA", name: "Ravindra Bhawan", zone: "Hostel", lat: 29.8634, lng: 77.9014, fill: 71, stream: "wet", kgPerDay: 110 },
  { id: "jawahar", code: "JW", name: "Jawahar Bhawan", zone: "Hostel", lat: 29.8678, lng: 77.9002, fill: 64, stream: "mixed", kgPerDay: 120 },
  { id: "mgcl", code: "LB", name: "MGCL", zone: "Academic", lat: 29.8646, lng: 77.8964, fill: 61, stream: "dry", kgPerDay: 40 },
  { id: "rkb", code: "RK", name: "Radhakrishnan Bhawan", zone: "Hostel", lat: 29.8666, lng: 77.8966, fill: 58, stream: "mixed", kgPerDay: 140 },
  { id: "sarojini", code: "SB", name: "Sarojini Bhawan", zone: "Hostel", lat: 29.8626, lng: 77.8938, fill: 49, stream: "dry", kgPerDay: 55 },
];
