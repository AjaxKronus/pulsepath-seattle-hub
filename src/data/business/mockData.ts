export type BusinessType =
  | "Premium Grocery"
  | "Healthy Fast-Casual"
  | "Gym"
  | "Yoga Studio"
  | "Climbing Gym"
  | "Wellness Studio"
  | "Multi-Location Operator";

export interface BusinessNeighborhood {
  id: string;
  name: string;
  overview: string;
  coordinates: { x: number; y: number };
  transitAccess: number;
  avgRentIndex: number;
  avgOneBedroomRent: number;
  lifestyleWellnessDensity: number;
  competitorPresence: number;
  targetAudienceDensity: number;
  transitFootfallPotential: number;
  wellnessSpendingProxy: number;
  expansionSuitability: number;
  campaignFitScore: number;
  tags: string[];
  topCorridors: string[];
  recommendation: string;
}

export interface DnaProfile {
  id: string;
  name: string;
  businessType: BusinessType;
  preferredTransit: number;
  preferredRentIndex: number;
  preferredWellnessDensity: number;
  preferredCompetitorPresence: number;
  preferredAudienceDensity: number;
  notes: string;
}

export interface NewNeighborOffer {
  title: string;
  offerType: "Discount" | "Trial" | "Bundle" | "Membership";
  baseConversionRate: number;
  averageOrderValue: number;
}

export interface PipelineItem {
  neighborhoodId: string;
  status: "high fit" | "underserved" | "high transit exposure" | "premium audience";
  owner: string;
  nextAction: string;
  confidence: number;
}

export const businessNeighborhoods: BusinessNeighborhood[] = [
  {
    id: "u-district",
    name: "U-District",
    overview: "Dense student ecosystem with frequent light rail movement and high trial behavior for new local brands.",
    coordinates: { x: 58, y: 24 },
    transitAccess: 93,
    avgRentIndex: 68,
    avgOneBedroomRent: 1920,
    lifestyleWellnessDensity: 79,
    competitorPresence: 71,
    targetAudienceDensity: 94,
    transitFootfallPotential: 90,
    wellnessSpendingProxy: 74,
    expansionSuitability: 82,
    campaignFitScore: 91,
    tags: ["high transit exposure", "high fit"],
    topCorridors: ["University Way", "Brooklyn Ave", "45th St"],
    recommendation: "Best for quick customer acquisition plays, pop-up offers, and student-to-professional lifecycle campaigns.",
  },
  {
    id: "capitol-hill",
    name: "Capitol Hill",
    overview: "Premium lifestyle demand and walkable density make this a strong market for high-frequency wellness and food formats.",
    coordinates: { x: 52, y: 42 },
    transitAccess: 88,
    avgRentIndex: 82,
    avgOneBedroomRent: 2380,
    lifestyleWellnessDensity: 91,
    competitorPresence: 86,
    targetAudienceDensity: 83,
    transitFootfallPotential: 84,
    wellnessSpendingProxy: 90,
    expansionSuitability: 76,
    campaignFitScore: 84,
    tags: ["premium audience", "high transit exposure"],
    topCorridors: ["Broadway", "Pike/Pine", "15th Ave"],
    recommendation: "Best for premium offers, subscription memberships, and retention-focused campaigns.",
  },
  {
    id: "south-lake-union",
    name: "South Lake Union",
    overview: "Young professionals and tech workers drive high spending and daytime demand near employment clusters.",
    coordinates: { x: 45, y: 36 },
    transitAccess: 85,
    avgRentIndex: 88,
    avgOneBedroomRent: 2560,
    lifestyleWellnessDensity: 80,
    competitorPresence: 78,
    targetAudienceDensity: 80,
    transitFootfallPotential: 87,
    wellnessSpendingProxy: 93,
    expansionSuitability: 79,
    campaignFitScore: 82,
    tags: ["premium audience", "high fit"],
    topCorridors: ["Westlake Ave", "Dexter Ave", "Fairview Ave"],
    recommendation: "Best for higher ticket wellness services and healthy lunch plus post-work conversion funnels.",
  },
  {
    id: "roosevelt",
    name: "Roosevelt",
    overview: "Transit-upgraded neighborhood with strong relocation momentum and balanced competition for growth brands.",
    coordinates: { x: 53, y: 18 },
    transitAccess: 84,
    avgRentIndex: 72,
    avgOneBedroomRent: 2080,
    lifestyleWellnessDensity: 74,
    competitorPresence: 58,
    targetAudienceDensity: 77,
    transitFootfallPotential: 81,
    wellnessSpendingProxy: 76,
    expansionSuitability: 85,
    campaignFitScore: 86,
    tags: ["underserved", "high transit exposure"],
    topCorridors: ["Roosevelt Way", "65th St", "12th Ave NE"],
    recommendation: "Best for expansion pilots where lower saturation can produce strong first-mover lift.",
  },
  {
    id: "northgate",
    name: "Northgate",
    overview: "Redevelopment and rail connectivity are pulling new households, with room for wellness-led neighborhood anchors.",
    coordinates: { x: 50, y: 12 },
    transitAccess: 86,
    avgRentIndex: 63,
    avgOneBedroomRent: 1840,
    lifestyleWellnessDensity: 66,
    competitorPresence: 44,
    targetAudienceDensity: 69,
    transitFootfallPotential: 78,
    wellnessSpendingProxy: 68,
    expansionSuitability: 88,
    campaignFitScore: 80,
    tags: ["underserved", "high fit"],
    topCorridors: ["Northgate Way", "1st Ave NE", "5th Ave NE"],
    recommendation: "Best for long-term footprint plays and commuter capture programs around transit nodes.",
  },
  {
    id: "ballard",
    name: "Ballard",
    overview: "Affluent and active neighborhood with dependable demand for premium groceries, fitness, and boutique wellness.",
    coordinates: { x: 30, y: 23 },
    transitAccess: 67,
    avgRentIndex: 79,
    avgOneBedroomRent: 2290,
    lifestyleWellnessDensity: 88,
    competitorPresence: 81,
    targetAudienceDensity: 78,
    transitFootfallPotential: 71,
    wellnessSpendingProxy: 88,
    expansionSuitability: 73,
    campaignFitScore: 79,
    tags: ["premium audience"],
    topCorridors: ["Market St", "22nd Ave NW", "Ballard Ave"],
    recommendation: "Best for brand-building and premium loyalty programs rather than broad discount acquisition.",
  },
  {
    id: "fremont",
    name: "Fremont",
    overview: "Lifestyle-centric district with strong wellness culture and mid-level competition suitable for targeted campaigns.",
    coordinates: { x: 39, y: 28 },
    transitAccess: 74,
    avgRentIndex: 76,
    avgOneBedroomRent: 2210,
    lifestyleWellnessDensity: 85,
    competitorPresence: 67,
    targetAudienceDensity: 75,
    transitFootfallPotential: 73,
    wellnessSpendingProxy: 84,
    expansionSuitability: 81,
    campaignFitScore: 83,
    tags: ["high fit", "premium audience"],
    topCorridors: ["Fremont Ave", "N 36th St", "Stone Way"],
    recommendation: "Best for hybrid fitness and food operators testing bundled offers for active young professionals.",
  },
];

export const successfulProfiles: DnaProfile[] = [
  {
    id: "organic-grocery-core",
    name: "Urban Organic Grocery Core",
    businessType: "Premium Grocery",
    preferredTransit: 78,
    preferredRentIndex: 74,
    preferredWellnessDensity: 82,
    preferredCompetitorPresence: 62,
    preferredAudienceDensity: 83,
    notes: "Top stores over-index where high-transit renters and wellness-focused buyers overlap.",
  },
  {
    id: "performance-fitness",
    name: "Performance Fitness Studio",
    businessType: "Gym",
    preferredTransit: 80,
    preferredRentIndex: 79,
    preferredWellnessDensity: 88,
    preferredCompetitorPresence: 70,
    preferredAudienceDensity: 76,
    notes: "High conversion in neighborhoods where premium spend is sustained and routine behavior is strong.",
  },
  {
    id: "recovery-yoga",
    name: "Recovery and Yoga Collective",
    businessType: "Yoga Studio",
    preferredTransit: 74,
    preferredRentIndex: 77,
    preferredWellnessDensity: 90,
    preferredCompetitorPresence: 64,
    preferredAudienceDensity: 79,
    notes: "Retention improves when audience wellness intent and neighborhood habit loops are already established.",
  },
  {
    id: "multi-location-growth",
    name: "Multi-Location Growth Blueprint",
    businessType: "Multi-Location Operator",
    preferredTransit: 82,
    preferredRentIndex: 69,
    preferredWellnessDensity: 75,
    preferredCompetitorPresence: 52,
    preferredAudienceDensity: 81,
    notes: "Expansion works best in transit-first neighborhoods with lower saturation and strong relocation inflow.",
  },
];

export const newNeighborOffers: NewNeighborOffer[] = [
  {
    title: "Welcome Bundle - 20 percent off first 30 days",
    offerType: "Discount",
    baseConversionRate: 7.4,
    averageOrderValue: 41,
  },
  {
    title: "14-day Starter Membership",
    offerType: "Trial",
    baseConversionRate: 9.2,
    averageOrderValue: 54,
  },
  {
    title: "Neighborhood Partner Pack",
    offerType: "Bundle",
    baseConversionRate: 6.8,
    averageOrderValue: 63,
  },
  {
    title: "Founding Member Locked Rate",
    offerType: "Membership",
    baseConversionRate: 8.5,
    averageOrderValue: 76,
  },
];

export const opportunitiesPipeline: PipelineItem[] = [
  {
    neighborhoodId: "roosevelt",
    status: "underserved",
    owner: "Growth Strategy",
    nextAction: "Run 4-week test campaign around station corridor",
    confidence: 88,
  },
  {
    neighborhoodId: "u-district",
    status: "high fit",
    owner: "Marketing Ops",
    nextAction: "Launch student-to-professional offer funnel before summer move window",
    confidence: 92,
  },
  {
    neighborhoodId: "northgate",
    status: "high transit exposure",
    owner: "Expansion Team",
    nextAction: "Evaluate small-footprint pilot near mixed-use developments",
    confidence: 85,
  },
  {
    neighborhoodId: "capitol-hill",
    status: "premium audience",
    owner: "CRM",
    nextAction: "Introduce premium welcome package with retention perks",
    confidence: 81,
  },
  {
    neighborhoodId: "fremont",
    status: "high fit",
    owner: "Local Partnerships",
    nextAction: "Bundle offers with neighborhood events and employer wellness partners",
    confidence: 79,
  },
];

export interface DashboardFilters {
  minTransitAccess: number;
  maxCompetitorPresence: number;
  minAudienceDensity: number;
  businessType: BusinessType | "All";
}

export const defaultFilters: DashboardFilters = {
  minTransitAccess: 70,
  maxCompetitorPresence: 85,
  minAudienceDensity: 70,
  businessType: "All",
};

function businessTypeWeight(type: BusinessType | "All", neighborhood: BusinessNeighborhood): number {
  if (type === "All") {
    return 1;
  }

  if (type === "Premium Grocery") {
    return (neighborhood.wellnessSpendingProxy * 0.55 + neighborhood.targetAudienceDensity * 0.45) / 100;
  }

  if (type === "Healthy Fast-Casual") {
    return (neighborhood.transitFootfallPotential * 0.6 + neighborhood.targetAudienceDensity * 0.4) / 100;
  }

  if (type === "Gym" || type === "Climbing Gym" || type === "Yoga Studio" || type === "Wellness Studio") {
    return (neighborhood.lifestyleWellnessDensity * 0.6 + neighborhood.wellnessSpendingProxy * 0.4) / 100;
  }

  return (neighborhood.expansionSuitability * 0.55 + (100 - neighborhood.competitorPresence) * 0.45) / 100;
}

export function calculateOpportunityScore(
  neighborhood: BusinessNeighborhood,
  filters: DashboardFilters,
): number {
  const baseScore =
    neighborhood.targetAudienceDensity * 0.22 +
    neighborhood.transitFootfallPotential * 0.2 +
    neighborhood.wellnessSpendingProxy * 0.16 +
    neighborhood.expansionSuitability * 0.2 +
    neighborhood.transitAccess * 0.14 +
    (100 - neighborhood.competitorPresence) * 0.08;

  const filterPenalty =
    (neighborhood.transitAccess < filters.minTransitAccess ? 8 : 0) +
    (neighborhood.competitorPresence > filters.maxCompetitorPresence ? 6 : 0) +
    (neighborhood.targetAudienceDensity < filters.minAudienceDensity ? 10 : 0);

  const weighted = (baseScore - filterPenalty) * businessTypeWeight(filters.businessType, neighborhood);
  return Math.max(40, Math.min(99, Math.round(weighted)));
}

export function getSortedNeighborhoods(filters: DashboardFilters): Array<BusinessNeighborhood & { opportunityScore: number }> {
  return businessNeighborhoods
    .map((neighborhood) => ({
      ...neighborhood,
      opportunityScore: calculateOpportunityScore(neighborhood, filters),
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function calculateDnaSimilarity(profile: DnaProfile, neighborhood: BusinessNeighborhood): number {
  const differences = [
    Math.abs(profile.preferredTransit - neighborhood.transitAccess),
    Math.abs(profile.preferredRentIndex - neighborhood.avgRentIndex),
    Math.abs(profile.preferredWellnessDensity - neighborhood.lifestyleWellnessDensity),
    Math.abs(profile.preferredCompetitorPresence - neighborhood.competitorPresence),
    Math.abs(profile.preferredAudienceDensity - neighborhood.targetAudienceDensity),
  ];

  const averageDifference = differences.reduce((sum, value) => sum + value, 0) / differences.length;
  return Math.max(45, Math.min(98, Math.round(100 - averageDifference)));
}

export function estimateCampaignResult(
  neighborhood: BusinessNeighborhood,
  offer: NewNeighborOffer,
  budget: number,
  weeks: number,
): { estimatedReach: number; estimatedLeads: number; estimatedConversions: number; estimatedRevenue: number; fitScore: number } {
  const estimatedReach = Math.round((budget / 12) * (neighborhood.transitFootfallPotential / 100) * (1 + weeks / 10));
  const fitScore = Math.round((neighborhood.campaignFitScore * 0.7 + neighborhood.targetAudienceDensity * 0.3));
  const conversionRate = (offer.baseConversionRate / 100) * (fitScore / 100);
  const estimatedConversions = Math.round(estimatedReach * conversionRate);
  const estimatedLeads = Math.round(estimatedConversions * 1.8);
  const estimatedRevenue = Math.round(estimatedConversions * offer.averageOrderValue * 4.2);

  return {
    estimatedReach,
    estimatedLeads,
    estimatedConversions,
    estimatedRevenue,
    fitScore,
  };
}
