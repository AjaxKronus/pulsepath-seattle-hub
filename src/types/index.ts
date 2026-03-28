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
