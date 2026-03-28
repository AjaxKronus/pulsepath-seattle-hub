import { BusinessNeighborhood } from "@/data/business/mockData";

interface BusinessMapProps {
  neighborhoods: Array<BusinessNeighborhood & { opportunityScore: number }>;
  selectedId: string;
  onSelect: (id: string) => void;
}

function zoneClass(score: number) {
  if (score >= 85) return "bg-score-high/40 border-score-high";
  if (score >= 70) return "bg-score-medium/35 border-score-medium";
  return "bg-score-low/30 border-score-low";
}

export default function BusinessMap({ neighborhoods, selectedId, onSelect }: BusinessMapProps) {
  return (
    <div className="relative w-full min-h-[460px] rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--secondary))_0%,_transparent_58%),linear-gradient(160deg,_#f8fbfd_0%,_#eef4f8_65%,_#eaf3f7_100%)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-35" preserveAspectRatio="none">
        <path d="M5,7 L18,10 L22,28 L13,42 L18,58 L12,80 L5,96" stroke="hsl(var(--primary))" strokeWidth="0.7" fill="none" />
        <path d="M68,5 L76,16 L74,30 L79,41 L75,61 L81,78 L75,96" stroke="hsl(var(--primary))" strokeWidth="0.7" fill="none" />
        <path d="M26,20 L38,34 L42,46 L35,62 L43,75" stroke="hsl(var(--accent))" strokeWidth="0.7" fill="none" />
        <path d="M44,18 L55,28 L60,40 L57,57 L65,71" stroke="hsl(var(--accent))" strokeWidth="0.7" fill="none" />
      </svg>

      {neighborhoods.map((item) => {
        const selected = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
          >
            <div
              className={`h-16 w-16 rounded-full border-2 backdrop-blur-sm transition-all duration-200 ${zoneClass(item.opportunityScore)} ${selected ? "scale-125 shadow-lg" : "hover:scale-110"}`}
            />
            <div className={`mt-1 rounded-lg px-2 py-1 text-[11px] border ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
              <div className="font-medium leading-tight">{item.name}</div>
              <div className="text-[10px] opacity-80">{item.opportunityScore}</div>
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-card/90 px-3 py-2 text-[11px]">
        <p className="font-medium">Opportunity Heat</p>
        <p className="text-muted-foreground">Higher intensity = stronger expansion or campaign fit</p>
      </div>
    </div>
  );
}
