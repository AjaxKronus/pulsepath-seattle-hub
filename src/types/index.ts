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
