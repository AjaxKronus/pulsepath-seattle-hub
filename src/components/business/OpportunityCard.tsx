import { Building2, Footprints, Sparkles, TrainFront } from "lucide-react";
import ScoreBadge from "@/components/business/ScoreBadge";
import { BusinessNeighborhood } from "@/data/business/mockData";

interface OpportunityCardProps {
  neighborhood: BusinessNeighborhood & { opportunityScore: number };
  rank: number;
  onSelect?: (id: string) => void;
}

export default function OpportunityCard({ neighborhood, rank, onSelect }: OpportunityCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(neighborhood.id)}
      className="w-full text-left rounded-2xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Rank #{rank}</p>
          <h3 className="text-base font-display font-semibold leading-tight mt-1">{neighborhood.name}</h3>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{neighborhood.overview}</p>
        </div>
        <ScoreBadge score={neighborhood.opportunityScore} label="Opportunity" size="sm" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="rounded-lg bg-secondary/70 px-2.5 py-2 flex items-center gap-1.5">
          <TrainFront className="w-3.5 h-3.5 text-primary" />
          Transit {neighborhood.transitAccess}
        </div>
        <div className="rounded-lg bg-secondary/70 px-2.5 py-2 flex items-center gap-1.5">
          <Footprints className="w-3.5 h-3.5 text-primary" />
          Footfall {neighborhood.transitFootfallPotential}
        </div>
        <div className="rounded-lg bg-secondary/70 px-2.5 py-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Wellness {neighborhood.lifestyleWellnessDensity}
        </div>
        <div className="rounded-lg bg-secondary/70 px-2.5 py-2 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          Competitors {neighborhood.competitorPresence}
        </div>
      </div>
    </button>
  );
}
