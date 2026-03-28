import { neighborhoods, wellnessOptions } from "@/data/neighborhoods";
import {
  ConversationMessage,
  CriteriaExtractionResult,
  SearchCriteria,
} from "@/types";

const WELLNESS_LOOKUP = new Map(
  wellnessOptions.map((option) => [option.id, option.label.toLowerCase()]),
);

const WORK_LOCATION_ALIASES: Record<string, string[]> = {
  uw: ["uw", "university of washington", "campus", "u district", "u-district"],
  downtown: ["downtown", "downtown seattle", "city center"],
  slu: ["slu", "south lake union", "amazon", "amazon hq"],
  other: ["remote", "work from home", "wfh", "other"],
};

const MODE_HINTS = {
  greeting:
    "I’m your PulsePath decision guide. Tell me where you need to commute, what rent feels realistic, and what kind of neighborhood life you want.",
};

const LIFESTYLE_KEYWORDS: Record<string, string[]> = {
  nightlife: ["nightlife", "bars", "social", "late night"],
  quiet: ["quiet", "calm", "peaceful"],
  walkable: ["walkable", "walkability", "walk everywhere"],
  waterfront: ["waterfront", "beach", "water views"],
  arts: ["arts", "culture", "creative"],
  familyFriendly: ["family", "family-friendly", "safe for kids"],
};

const MUST_HAVE_PATTERNS = [/must have ([^.!,\n]+)/i, /need ([^.!,\n]+)/i];
const NICE_TO_HAVE_PATTERNS = [/nice to have ([^.!,\n]+)/i, /would love ([^.!,\n]+)/i, /bonus if ([^.!,\n]+)/i];

function normalizeNumber(rawValue: string): number {
  const trimmed = rawValue.trim().toLowerCase();
  if (trimmed.endsWith("k")) {
    return Math.round(Number.parseFloat(trimmed.slice(0, -1)) * 1000);
  }

  return Number.parseInt(trimmed.replace(/[^\d]/g, ""), 10);
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function toTitleCase(value: string) {
  return value
    .split(/[-\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createEmptyCriteria(): SearchCriteria {
  return {
    workLocation: "",
    targetNeighborhoods: [],
    maxRent: null,
    commutePreference: {
      maxMinutes: null,
      preferredModes: [],
    },
    wellnessPriorities: [],
    lifestylePreferences: [],
    mustHaves: [],
    niceToHaves: [],
    excludedAreas: [],
    priorityWeights: {
      affordability: 25,
      commute: 25,
      wellness: 25,
      socialScene: 25,
    },
    confidenceScore: 0,
    missingFields: ["workLocation", "maxRent", "commutePreference.maxMinutes", "preferences"],
  };
}

export function createAssistantMessage(content: string): ConversationMessage {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "assistant",
    content,
    createdAt: Date.now(),
  };
}

export function createInitialConversation(): ConversationMessage[] {
  return [createAssistantMessage(MODE_HINTS.greeting)];
}

function extractWorkLocation(input: string, criteria: SearchCriteria) {
  for (const [workLocation, aliases] of Object.entries(WORK_LOCATION_ALIASES)) {
    if (aliases.some((alias) => input.includes(alias))) {
      criteria.workLocation = workLocation;
      return `work near ${workLocation === "uw" ? "UW" : workLocation === "slu" ? "South Lake Union" : workLocation === "downtown" ? "downtown" : "home"}`;
    }
  }

  return "";
}

function extractMaxRent(rawInput: string, criteria: SearchCriteria) {
  const rentPatterns = [
    /(under|below|max|maximum|budget(?: is| around)?|rent(?: is| under)?|up to)\s*\$?\s*(\d(?:[\d,.]*|(?:\.\d)?k))/i,
    /\$\s*(\d(?:[\d,.]*|(?:\.\d)?k))\s*(?:for rent|rent|budget)/i,
  ];

  for (const pattern of rentPatterns) {
    const match = rawInput.match(pattern);
    if (match) {
      const numberCandidate = match[2] || match[1];
      const parsed = normalizeNumber(numberCandidate);
      if (!Number.isNaN(parsed)) {
        criteria.maxRent = parsed;
        return `budget around $${parsed.toLocaleString()}`;
      }
    }
  }

  return "";
}

function extractCommute(rawInput: string, criteria: SearchCriteria) {
  const commuteMatch = rawInput.match(/(\d{1,2})\s*(?:min|minutes)/i);
  if (commuteMatch) {
    const parsed = Number.parseInt(commuteMatch[1], 10);
    if (!Number.isNaN(parsed)) {
      criteria.commutePreference.maxMinutes = parsed;
      return `${parsed}-minute max commute`;
    }
  }

  return "";
}

function extractModes(input: string, criteria: SearchCriteria) {
  const modeMap: Record<string, string[]> = {
    walk: ["walk", "walking"],
    bike: ["bike", "biking", "cycling"],
    bus: ["bus"],
    lightRail: ["light rail", "train", "rail"],
    drive: ["drive", "car"],
  };

  const modes = Object.entries(modeMap)
    .filter(([, aliases]) => aliases.some((alias) => input.includes(alias)))
    .map(([mode]) => mode);

  if (modes.length > 0) {
    criteria.commutePreference.preferredModes = unique([...criteria.commutePreference.preferredModes, ...modes]);
    return `preferred commute via ${criteria.commutePreference.preferredModes.join(", ")}`;
  }

  return "";
}

function extractNeighborhoodLists(rawInput: string, criteria: SearchCriteria) {
  const lowerInput = rawInput.toLowerCase();
  const foundTargets: string[] = [];
  const foundExclusions: string[] = [];

  neighborhoods.forEach((neighborhood) => {
    const aliases = [neighborhood.name.toLowerCase(), neighborhood.id.replace(/-/g, " ")];
    const matched = aliases.some((alias) => lowerInput.includes(alias));
    if (!matched) {
      return;
    }

    const excludeHint = new RegExp(`(?:avoid|not|exclude|no)\\s+${aliases[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    if (excludeHint.test(lowerInput)) {
      foundExclusions.push(neighborhood.id);
    } else {
      foundTargets.push(neighborhood.id);
    }
  });

  if (foundTargets.length > 0) {
    criteria.targetNeighborhoods = unique([...criteria.targetNeighborhoods, ...foundTargets]);
  }

  if (foundExclusions.length > 0) {
    criteria.excludedAreas = unique([...criteria.excludedAreas, ...foundExclusions]);
  }

  return {
    targetSignal: foundTargets.length > 0 ? `targeting ${foundTargets.map(toTitleCase).join(", ")}` : "",
    exclusionSignal: foundExclusions.length > 0 ? `excluding ${foundExclusions.map(toTitleCase).join(", ")}` : "",
  };
}

function extractWellnessAndLifestyle(input: string, criteria: SearchCriteria) {
  const matchedWellness = [...WELLNESS_LOOKUP.entries()]
    .filter(([id, label]) => input.includes(id) || input.includes(label))
    .map(([id]) => id);

  if (matchedWellness.length > 0) {
    criteria.wellnessPriorities = unique([...criteria.wellnessPriorities, ...matchedWellness]);
  }

  const matchedLifestyle = Object.entries(LIFESTYLE_KEYWORDS)
    .filter(([, aliases]) => aliases.some((alias) => input.includes(alias)))
    .map(([key]) => key);

  if (matchedLifestyle.length > 0) {
    criteria.lifestylePreferences = unique([...criteria.lifestylePreferences, ...matchedLifestyle]);
  }

  return {
    wellnessSignal:
      matchedWellness.length > 0
        ? `wellness focus on ${matchedWellness.map((value) => WELLNESS_LOOKUP.get(value) || value).join(", ")}`
        : "",
    lifestyleSignal:
      matchedLifestyle.length > 0 ? `lifestyle leaning ${matchedLifestyle.join(", ")}` : "",
  };
}

function extractPreferenceLists(rawInput: string, criteria: SearchCriteria) {
  MUST_HAVE_PATTERNS.forEach((pattern) => {
    const match = rawInput.match(pattern);
    if (match?.[1]) {
      criteria.mustHaves = unique([...criteria.mustHaves, match[1].trim()]);
    }
  });

  NICE_TO_HAVE_PATTERNS.forEach((pattern) => {
    const match = rawInput.match(pattern);
    if (match?.[1]) {
      criteria.niceToHaves = unique([...criteria.niceToHaves, match[1].trim()]);
    }
  });
}

function recalculatePriorityWeights(criteria: SearchCriteria) {
  const weights = {
    affordability: criteria.maxRent ? 28 : 20,
    commute: criteria.commutePreference.maxMinutes ? (criteria.commutePreference.maxMinutes <= 20 ? 34 : 26) : 20,
    wellness: criteria.wellnessPriorities.length > 0 ? 30 : 20,
    socialScene: criteria.lifestylePreferences.includes("nightlife") ? 28 : 20,
  };

  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);

  criteria.priorityWeights = {
    affordability: Math.round((weights.affordability / total) * 100),
    commute: Math.round((weights.commute / total) * 100),
    wellness: Math.round((weights.wellness / total) * 100),
    socialScene: Math.max(
      0,
      100 -
        Math.round((weights.affordability / total) * 100) -
        Math.round((weights.commute / total) * 100) -
        Math.round((weights.wellness / total) * 100),
    ),
  };
}

export function finalizeCriteria(criteria: SearchCriteria): SearchCriteria {
  const nextCriteria: SearchCriteria = {
    ...criteria,
    targetNeighborhoods: unique(criteria.targetNeighborhoods),
    wellnessPriorities: unique(criteria.wellnessPriorities),
    lifestylePreferences: unique(criteria.lifestylePreferences),
    mustHaves: unique(criteria.mustHaves),
    niceToHaves: unique(criteria.niceToHaves),
    excludedAreas: unique(criteria.excludedAreas),
    commutePreference: {
      ...criteria.commutePreference,
      preferredModes: unique(criteria.commutePreference.preferredModes),
    },
  };

  const missingFields: string[] = [];
  if (!nextCriteria.workLocation) {
    missingFields.push("workLocation");
  }
  if (!nextCriteria.maxRent) {
    missingFields.push("maxRent");
  }
  if (!nextCriteria.commutePreference.maxMinutes) {
    missingFields.push("commutePreference.maxMinutes");
  }
  if (nextCriteria.wellnessPriorities.length === 0 && nextCriteria.lifestylePreferences.length === 0) {
    missingFields.push("preferences");
  }

  nextCriteria.missingFields = missingFields;
  const filledFieldCount = 4 - missingFields.length;
  nextCriteria.confidenceScore = Math.max(0.25, Math.min(0.98, (filledFieldCount / 4) * 0.8 + (nextCriteria.targetNeighborhoods.length > 0 ? 0.1 : 0) + (nextCriteria.mustHaves.length > 0 ? 0.08 : 0)));
  recalculatePriorityWeights(nextCriteria);

  return nextCriteria;
}

export function isCriteriaReady(criteria: SearchCriteria) {
  return criteria.missingFields.length === 0 && criteria.confidenceScore >= 0.65;
}

function getFollowUpQuestion(criteria: SearchCriteria) {
  if (!criteria.workLocation) {
    return "What area do you expect to commute to most often: UW, downtown, South Lake Union, or mostly remote?";
  }

  if (!criteria.maxRent) {
    return "What monthly max rent feels comfortable for you for a one-bedroom?";
  }

  if (!criteria.commutePreference.maxMinutes) {
    return "What is the longest one-way commute you’d realistically accept?";
  }

  if (criteria.wellnessPriorities.length === 0 && criteria.lifestylePreferences.length === 0) {
    return "What matters more day to day: parks, gyms, walkability, safety, nightlife, or a quieter vibe?";
  }

  if (criteria.targetNeighborhoods.length === 0 && criteria.excludedAreas.length === 0) {
    return "Are there any neighborhoods you already like, or any areas you want to avoid?";
  }

  return "I have enough to rank neighborhoods. If you want, tell me any must-haves or exclusions before we generate recommendations.";
}

function buildAssistantReply(criteria: SearchCriteria, identifiedSignals: string[]) {
  const identified = identifiedSignals.length > 0
    ? `We’ve identified ${identifiedSignals.join(", ")}.`
    : "I’m still building your criteria profile.";

  const missing = criteria.missingFields.length > 0
    ? ` Still missing: ${criteria.missingFields.join(", ")}.`
    : " Your core criteria looks complete.";

  return `${identified}${missing} ${getFollowUpQuestion(criteria)}`;
}

export function processIntakeTurn(message: string, currentCriteria: SearchCriteria): CriteriaExtractionResult {
  const nextCriteria: SearchCriteria = {
    ...currentCriteria,
    commutePreference: {
      ...currentCriteria.commutePreference,
      preferredModes: [...currentCriteria.commutePreference.preferredModes],
    },
    targetNeighborhoods: [...currentCriteria.targetNeighborhoods],
    wellnessPriorities: [...currentCriteria.wellnessPriorities],
    lifestylePreferences: [...currentCriteria.lifestylePreferences],
    mustHaves: [...currentCriteria.mustHaves],
    niceToHaves: [...currentCriteria.niceToHaves],
    excludedAreas: [...currentCriteria.excludedAreas],
    priorityWeights: { ...currentCriteria.priorityWeights },
    missingFields: [...currentCriteria.missingFields],
  };

  const normalized = message.toLowerCase();
  const identifiedSignals = [
    extractWorkLocation(normalized, nextCriteria),
    extractMaxRent(message, nextCriteria),
    extractCommute(normalized, nextCriteria),
    extractModes(normalized, nextCriteria),
  ].filter(Boolean);

  const { targetSignal, exclusionSignal } = extractNeighborhoodLists(message, nextCriteria);
  const { wellnessSignal, lifestyleSignal } = extractWellnessAndLifestyle(normalized, nextCriteria);
  extractPreferenceLists(message, nextCriteria);

  if (targetSignal) {
    identifiedSignals.push(targetSignal);
  }
  if (exclusionSignal) {
    identifiedSignals.push(exclusionSignal);
  }
  if (wellnessSignal) {
    identifiedSignals.push(wellnessSignal);
  }
  if (lifestyleSignal) {
    identifiedSignals.push(lifestyleSignal);
  }
  if (nextCriteria.mustHaves.length > currentCriteria.mustHaves.length) {
    identifiedSignals.push("must-have constraints");
  }
  if (nextCriteria.niceToHaves.length > currentCriteria.niceToHaves.length) {
    identifiedSignals.push("nice-to-have preferences");
  }

  const finalized = finalizeCriteria(nextCriteria);

  return {
    criteria: finalized,
    assistantReply: buildAssistantReply(finalized, identifiedSignals),
    identifiedSignals,
  };
}
