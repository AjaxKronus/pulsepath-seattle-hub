import { Neighborhood } from "@/types";

interface Props {
  neighborhoods: (Neighborhood & { resilienceScore: number })[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  favorites: string[];
}

function dotColor(score: number) {
  if (score >= 70) return "bg-score-high";
  if (score >= 45) return "bg-score-medium";
  return "bg-score-low";
}

export default function SeattleMap({ neighborhoods, selectedId, onSelect, favorites }: Props) {
  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-square bg-secondary/50 rounded-2xl border border-border overflow-hidden">
      {/* Water features */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Puget Sound (west) */}
          <path d="M0,0 L15,0 L12,30 L8,50 L15,70 L10,100 L0,100 Z" fill="hsl(195, 60%, 85%)" opacity="0.5" />
          {/* Lake Union */}
          <ellipse cx="45" cy="38" rx="8" ry="5" fill="hsl(195, 60%, 85%)" opacity="0.5" />
          {/* Lake Washington (east) */}
          <path d="M75,0 L100,0 L100,100 L80,100 L82,70 L78,50 L80,30 L75,15 Z" fill="hsl(195, 60%, 85%)" opacity="0.4" />
        </svg>
      </div>

      {/* Neighborhood dots */}
      {neighborhoods.map((n) => {
        const isSelected = selectedId === n.id;
        const isFav = favorites.includes(n.id);
        return (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group/dot z-10"
            style={{ left: `${n.coordinates.x}%`, top: `${n.coordinates.y}%` }}
          >
            <div className={`relative flex items-center justify-center`}>
              <div
                className={`w-4 h-4 rounded-full ${dotColor(n.resilienceScore)} border-2 transition-all ${
                  isSelected
                    ? "border-primary scale-150 shadow-lg"
                    : "border-card hover:scale-125"
                } ${isFav ? "ring-2 ring-destructive/40" : ""}`}
              />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
              )}
            </div>
            {/* Label */}
            <div
              className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-medium transition-opacity ${
                isSelected
                  ? "bg-primary text-primary-foreground opacity-100"
                  : "bg-card text-foreground opacity-0 group-hover/dot:opacity-100 border border-border"
              }`}
            >
              {n.name}
              <span className="ml-1 font-bold">{n.resilienceScore}</span>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-2 text-[10px]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-2 h-2 rounded-full bg-score-high" />
          <span className="text-muted-foreground">70+ Great fit</span>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-2 h-2 rounded-full bg-score-medium" />
          <span className="text-muted-foreground">45-69 Decent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-score-low" />
          <span className="text-muted-foreground">&lt;45 Less ideal</span>
        </div>
      </div>
    </div>
  );
}
