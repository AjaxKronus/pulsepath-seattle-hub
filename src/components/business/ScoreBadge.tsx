interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: "sm" | "md";
}

function scoreClass(score: number) {
  if (score >= 85) return "text-score-high bg-score-high";
  if (score >= 70) return "text-score-medium bg-score-medium";
  return "text-score-low bg-score-low";
}

export default function ScoreBadge({ score, label = "Score", size = "md" }: ScoreBadgeProps) {
  return (
    <div className={`rounded-xl ${scoreClass(score)} ${size === "sm" ? "px-2.5 py-1" : "px-3 py-2"}`}>
      <div className="text-[10px] uppercase tracking-wide text-foreground/70">{label}</div>
      <div className={`${size === "sm" ? "text-sm" : "text-lg"} font-display font-bold text-foreground`}>{score}</div>
    </div>
  );
}
