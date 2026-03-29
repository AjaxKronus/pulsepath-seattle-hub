export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  medianRent: number;
  transitScore: number; // 0-100
  walkScore: number; // 0-100
  bikeScore: number; // 0-100
  wellnessScore: number; // 0-100
  safetyScore: number; // 0-100
  nightlifeScore: number; // 0-100
  greenSpaceScore: number; // 0-100
  commuteToUW: number; // minutes
  commuteToDT: number; // minutes to downtown
  coordinates: { x: number; y: number }; // relative map position (0-100)
  lat?: number;  // WGS84 latitude for ArcGIS
  lng?: number;  // WGS84 longitude for ArcGIS
  highlights: string[];
  wellnessSpots: string[];
  avgStudioRent: number;
  avg1BRRent: number;
  resilienceScore?: number; // computed
}

export interface UserPreferences {
  workLocation: string;
  rentBudget: number;
  maxCommute: number;
  wellnessPriorities: string[];
}

export interface CommutePreference {
  maxMinutes: number | null;
  preferredModes: string[];
}

export interface CriteriaPriorityWeights {
  affordability: number;
  commute: number;
  wellness: number;
  socialScene: number;
}

export interface SearchCriteria {
  // --- core fields (used by scoring engine) ---
  workLocation: string;
  targetNeighborhoods: string[];
  maxRent: number | null;
  commutePreference: CommutePreference;
  wellnessPriorities: string[];
  lifestylePreferences: string[];
  mustHaves: string[];
  niceToHaves: string[];
  excludedAreas: string[];
  priorityWeights: CriteriaPriorityWeights;
  confidenceScore: number;
  missingFields: string[];

  // --- extended MVP fields (Gemini NLU-populated) ---
  intent?: string;                    // free-text user goal summary
  locationAnchor?: string;           // canonical anchor (e.g. "uw", "slu", "downtown")
  geography?: string;                 // city / region scope (default "Seattle, WA")
  housingType?: string;               // "apartment" | "studio" | "house" | ...
  bedrooms?: number;                  // 0 = studio, 1, 2, ...
  maxBudget?: number;                 // alias for maxRent, preferred by Gemini extraction
  bufferMeters?: number;              // proximity radius around anchor
  transitPreference?: string[];       // e.g. ["bus", "light-rail", "walk"]
  wellnessPreference?: string[];      // alias / supplement to wellnessPriorities
  safetyPriority?: number;            // 0–1 normalized importance
  affordabilityPriority?: number;     // 0–1 normalized importance
  transitPriority?: number;           // 0–1 normalized importance
  lifestylePriority?: number;         // 0–1 normalized importance
  userNotes?: string;                 // any extra user context verbatim
}

export interface ConversationMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: number;
}

export interface CriteriaExtractionResult {
  criteria: SearchCriteria;
  assistantReply: string;
  identifiedSignals: string[];
}

export interface FavoriteNeighborhood {
  id: string;
  addedAt: Date;
}

export type WellnessPriority = 
  | 'gym'
  | 'yoga'
  | 'parks'
  | 'mental-health'
  | 'healthy-food'
  | 'running-trails';

export interface BusinessLead {
  neighborhood: string;
  opportunityScore: number;
  targetDemographic: string;
  suggestedOffer: string;
}
