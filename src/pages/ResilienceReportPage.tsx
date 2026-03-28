import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Shield, TrendingUp, MapPin, DollarSign, Heart, ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import CriteriaSummaryCard from "@/components/chat/CriteriaSummaryCard";

function ScoreRing({ score, label, size = 56 }: { score: number; label: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? "hsl(160, 55%, 40%)" : score >= 45 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(200, 20%, 88%)" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="font-display font-bold text-sm">{score}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ResilienceReportPage() {
  const { scoredNeighborhoods, preferences, userName, shortlist, criteria } = useApp();
  const reportNeighborhoods = shortlist.length > 0
    ? scoredNeighborhoods.filter((n) => shortlist.includes(n.id))
    : scoredNeighborhoods.slice(0, 3);

  const firstName = userName?.split(" ")[0] || "Explorer";
  const hasPrefs = !!preferences;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Report Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-3">
            <Shield className="w-3 h-3" />
            Resilience Report · Preview
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            {firstName}'s Seattle Resilience Report
          </h1>
          <p className="text-sm text-muted-foreground">
            A personalized analysis of your top neighborhood matches based on
            {hasPrefs ? ` a $${preferences.rentBudget.toLocaleString()}/mo budget and ${preferences.maxCommute}-min commute.` : " default scoring."}
          </p>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Refine Criteria</Link>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <CriteriaSummaryCard criteria={criteria} />
        </div>

        {/* Summary Cards */}
        {hasPrefs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              {
                icon: MapPin,
                label: "Work Location",
                value:
                  preferences.workLocation === "uw"
                    ? "UW"
                    : preferences.workLocation === "downtown"
                      ? "Downtown"
                      : preferences.workLocation === "slu"
                        ? "SLU"
                        : "Remote / Other",
              },
              { icon: DollarSign, label: "Budget", value: `$${preferences.rentBudget.toLocaleString()}` },
              { icon: TrendingUp, label: "Max Commute", value: `${preferences.maxCommute} min` },
              { icon: Heart, label: "Wellness", value: `${preferences.wellnessPriorities.length} priorities` },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-xl border border-border p-3 text-center">
                <item.icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="font-display font-bold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Neighborhood Reports */}
        <div className="space-y-6 mb-10">
          {reportNeighborhoods.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="p-5 border-b border-border flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-hero-gradient flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <h3 className="font-display font-bold text-lg">{n.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-lg">{n.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className={`text-3xl font-display font-bold ${
                    n.resilienceScore >= 70 ? "score-high" : n.resilienceScore >= 45 ? "score-medium" : "score-low"
                  }`}>
                    {n.resilienceScore}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Resilience Score</div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap justify-center gap-6 mb-5">
                  <ScoreRing score={n.transitScore} label="Transit" />
                  <ScoreRing score={n.walkScore} label="Walk" />
                  <ScoreRing score={n.safetyScore} label="Safety" />
                  <ScoreRing score={n.wellnessScore} label="Wellness" />
                  <ScoreRing score={n.greenSpaceScore} label="Green" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Studio rent</span>
                      <span className="font-medium">${n.avgStudioRent.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1BR rent</span>
                      <span className="font-medium">${n.avg1BRRent.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Commute to UW</span>
                      <span className="font-medium">{n.commuteToUW} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Commute to DT</span>
                      <span className="font-medium">{n.commuteToDT} min</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Wellness Spots</div>
                    <div className="space-y-1">
                      {n.wellnessSpots.map((s) => (
                        <div key={s} className="flex items-center gap-1.5 text-xs">
                          <Check className="w-3 h-3 text-accent" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Gate CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-hero-gradient opacity-90" />
          <div className="relative p-8 sm:p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-primary-foreground mb-3">
              Unlock the Full Report
            </h2>
            <p className="text-primary-foreground/80 text-sm max-w-md mx-auto mb-4">
              Get detailed safety breakdowns, rent trend forecasts, personalized commute maps, and a downloadable PDF report.
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-primary-foreground/70 mb-6">
              {["Rent trend analysis", "Safety heatmaps", "PDF export", "Commute optimization"].map((f) => (
                <span key={f} className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {f}
                </span>
              ))}
            </div>
            <Button size="lg" variant="secondary" className="font-medium">
              Coming Soon <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
