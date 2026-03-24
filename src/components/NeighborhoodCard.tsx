import { Neighborhood } from "@/types";
import { Heart } from "lucide-react";

interface Props {
  neighborhood: Neighborhood & { resilienceScore: number };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick?: () => void;
  rank?: number;
}

function scoreColor(score: number) {
  if (score >= 70) return "score-high";
  if (score >= 45) return "score-medium";
  return "score-low";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-score-high";
  if (score >= 45) return "bg-score-medium";
  return "bg-score-low";
}

export default function NeighborhoodCard({ neighborhood: n, isFavorite, onToggleFavorite, onClick, rank }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl border border-border p-5 hover:border-primary/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {rank && (
            <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
              {rank}
            </span>
          )}
          <h3 className="font-display font-semibold">{n.name}</h3>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`p-1.5 rounded-full transition-colors ${
            isFavorite ? "text-destructive" : "text-muted-foreground hover:text-destructive"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{n.description}</p>

      <div className="flex items-center gap-3 mb-4">
        <div className={`px-3 py-1.5 rounded-lg ${scoreBg(n.resilienceScore)}`}>
          <span className={`text-lg font-display font-bold ${scoreColor(n.resilienceScore)}`}>
            {n.resilienceScore}
          </span>
          <span className="text-[10px] text-muted-foreground ml-1">/ 100</span>
        </div>
        <div className="text-xs text-muted-foreground">
          <div>1BR from <span className="font-medium text-foreground">${n.avg1BRRent.toLocaleString()}</span>/mo</div>
          <div>{n.commuteToUW} min to UW · {n.commuteToDT} min to DT</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {n.highlights.slice(0, 3).map((h) => (
          <span key={h} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
