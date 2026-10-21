import type { RoutePlan } from "./route";

export const ASSUMPTIONS = {
  people: 8000,
  kgPerPerson: 0.3,
  recyclableShare: 0.35,
  contaminationNow: 0.45,
  contaminationWith: 0.18,
  tripsPerDay: 2,
  kmPerLitre: 15,
  kgCo2PerLitre: 2.68,
};

export type Impact = {
  campusKgDay: number;
  cleanerKgDay: number;
  kmYear: number;
  litresYear: number;
  co2Year: number;
  savedKm: number;
  roundKm: number;
  baselineKm: number;
};

export function projectImpact(plan: RoutePlan): Impact {
  const campusKgDay = ASSUMPTIONS.people * ASSUMPTIONS.kgPerPerson;
  const cleanerKgDay =
    campusKgDay * ASSUMPTIONS.recyclableShare * (ASSUMPTIONS.contaminationNow - ASSUMPTIONS.contaminationWith);
  const kmYear = plan.savedKm * ASSUMPTIONS.tripsPerDay * 365;
  const litresYear = kmYear / ASSUMPTIONS.kmPerLitre;
  const co2Year = litresYear * ASSUMPTIONS.kgCo2PerLitre;
  return {
    campusKgDay,
    cleanerKgDay,
    kmYear,
    litresYear,
    co2Year,
    savedKm: plan.savedKm,
    roundKm: plan.km,
    baselineKm: plan.baselineKm,
  };
}
