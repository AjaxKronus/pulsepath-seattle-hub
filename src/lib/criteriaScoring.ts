import { Neighborhood, SearchCriteria, UserPreferences } from "@/types";
import { computeResilienceScore } from "@/data/neighborhoods";

function includesAny(haystack: string[], needles: string[]) {
  return needles.some((needle) => haystack.includes(needle));
}

function normalizedWeight(value: number) {
  return value / 100;
}

export function derivePreferencesFromCriteria(criteria: SearchCriteria): UserPreferences | null {
  if (!criteria.workLocation && !criteria.maxRent && !criteria.commutePreference.maxMinutes) {
    return null;
  }

  return {
    workLocation: criteria.workLocation || "other",
    rentBudget: criteria.maxRent || 1800,
    maxCommute: criteria.commutePreference.maxMinutes || 25,
    wellnessPriorities: criteria.wellnessPriorities,
  };
}

export function computeCriteriaDrivenScore(
  neighborhood: Neighborhood,
  criteria: SearchCriteria,
  preferences: UserPreferences | null,
): number {
  const fallbackBase = Math.round(
    (neighborhood.transitScore + neighborhood.walkScore + neighborhood.wellnessScore + neighborhood.safetyScore) / 4,
  );
  const baseScore = preferences ? computeResilienceScore(neighborhood, preferences) : fallbackBase;

  const affordabilityBoost = criteria.maxRent
    ? neighborhood.avg1BRRent <= criteria.maxRent
      ? 8 * normalizedWeight(criteria.priorityWeights.affordability)
      : -10 * normalizedWeight(criteria.priorityWeights.affordability)
    : 0;

  const commuteValue = criteria.workLocation === "uw" ? neighborhood.commuteToUW : neighborhood.commuteToDT;
  const commuteBoost = criteria.commutePreference.maxMinutes
    ? commuteValue <= criteria.commutePreference.maxMinutes
      ? 8 * normalizedWeight(criteria.priorityWeights.commute)
      : -8 * normalizedWeight(criteria.priorityWeights.commute)
    : 0;

  const wellnessBoost = includesAny(criteria.wellnessPriorities, ["parks", "running-trails"])
    ? ((neighborhood.greenSpaceScore - 60) / 10) * normalizedWeight(criteria.priorityWeights.wellness)
    : ((neighborhood.wellnessScore - 60) / 10) * normalizedWeight(criteria.priorityWeights.wellness);

  const socialBoost = criteria.lifestylePreferences.includes("nightlife")
    ? ((neighborhood.nightlifeScore - 55) / 8) * normalizedWeight(criteria.priorityWeights.socialScene)
    : criteria.lifestylePreferences.includes("quiet")
      ? ((neighborhood.safetyScore + neighborhood.greenSpaceScore - neighborhood.nightlifeScore - 90) / 10) * normalizedWeight(criteria.priorityWeights.socialScene)
      : 0;

  const targetBoost = criteria.targetNeighborhoods.includes(neighborhood.id) ? 6 : 0;
  const exclusionPenalty = criteria.excludedAreas.includes(neighborhood.id) ? -20 : 0;
  const walkabilityBoost = criteria.lifestylePreferences.includes("walkable") ? (neighborhood.walkScore - 60) / 6 : 0;
  const waterfrontBoost = criteria.lifestylePreferences.includes("waterfront")
    ? neighborhood.highlights.some((item) => /beach|water|canal|lake/i.test(item))
      ? 5
      : 0
    : 0;

  const finalScore = Math.round(
    baseScore +
      affordabilityBoost +
      commuteBoost +
      wellnessBoost +
      socialBoost +
      targetBoost +
      exclusionPenalty +
      walkabilityBoost +
      waterfrontBoost,
  );

  return Math.max(0, Math.min(100, finalScore));
}
