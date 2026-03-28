import { describe, expect, it } from "vitest";
import { createEmptyCriteria, finalizeCriteria, isCriteriaReady, processIntakeTurn } from "@/lib/criteriaExtraction";

describe("criteria extraction", () => {
  it("extracts core criteria from a natural language prompt", () => {
    const result = processIntakeTurn(
      "I work near UW, need rent under $1800, want a 20 minute commute, and care about parks plus walkability.",
      createEmptyCriteria(),
    );

    expect(result.criteria.workLocation).toBe("uw");
    expect(result.criteria.maxRent).toBe(1800);
    expect(result.criteria.commutePreference.maxMinutes).toBe(20);
    expect(result.criteria.wellnessPriorities).toContain("parks");
    expect(result.criteria.lifestylePreferences).toContain("walkable");
  });

  it("marks criteria ready when all core fields are present", () => {
    const criteria = finalizeCriteria({
      ...createEmptyCriteria(),
      workLocation: "downtown",
      maxRent: 2000,
      commutePreference: {
        maxMinutes: 25,
        preferredModes: ["lightRail"],
      },
      wellnessPriorities: ["parks"],
      lifestylePreferences: ["walkable"],
    });

    expect(isCriteriaReady(criteria)).toBe(true);
    expect(criteria.missingFields).toHaveLength(0);
  });
});
