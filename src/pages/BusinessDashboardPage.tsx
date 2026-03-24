import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Building2, TrendingUp, Users, Tag } from "lucide-react";

const offers = [
  { business: "CorePower Yoga", type: "Wellness Studio", neighborhood: "Capitol Hill", offer: "First month free for new residents", fit: 92 },
  { business: "PCC Community Markets", type: "Grocery", neighborhood: "Fremont", offer: "10% off first 3 months", fit: 88 },
  { business: "Beacon Yoga", type: "Wellness Studio", neighborhood: "Beacon Hill", offer: "Free trial week + neighborhood welcome pack", fit: 85 },
  { business: "West Seattle Runner", type: "Retail", neighborhood: "West Seattle", offer: "20% new neighbor discount", fit: 78 },
  { business: "Ballard Health Club", type: "Gym", neighborhood: "Ballard", offer: "Waived enrollment fee", fit: 90 },
];

export default function BusinessDashboardPage() {
  const { scoredNeighborhoods } = useApp();
  const topZones = scoredNeighborhoods.slice(0, 5);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-3">
            <Building2 className="w-3 h-3" />
            Business Dashboard (B2B)
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Local Business Insights</h1>
          <p className="text-sm text-muted-foreground">Understand where your customers are moving and how to reach them.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-sm">High-Opportunity Zones</h3>
            </div>
            <div className="space-y-2">
              {topZones.map((n, i) => (
                <div key={n.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{i + 1}.</span> {n.name}
                  </span>
                  <span className={`font-display font-bold ${
                    n.resilienceScore >= 70 ? "score-high" : "score-medium"
                  }`}>
                    {n.resilienceScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-sm">Customer-Fit Clusters</h3>
            </div>
            <div className="space-y-3">
              {[
                { cluster: "Budget-conscious students", pct: 38, color: "bg-primary" },
                { cluster: "Young professionals", pct: 32, color: "bg-accent" },
                { cluster: "Wellness-focused movers", pct: 20, color: "bg-score-medium" },
                { cluster: "Remote workers", pct: 10, color: "bg-muted-foreground" },
              ].map((c) => (
                <div key={c.cluster}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{c.cluster}</span>
                    <span className="font-medium">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Tag className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-sm">Key Metrics</h3>
            </div>
            <div className="space-y-4 mt-2">
              {[
                { label: "Avg new-mover budget", value: "$1,650/mo" },
                { label: "Top wellness need", value: "Gym & Fitness" },
                { label: "Peak relocation month", value: "August" },
                { label: "Avg commute tolerance", value: "22 min" },
              ].map((m) => (
                <div key={m.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-medium">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Offers */}
        <div>
          <h2 className="font-display font-semibold mb-4">Sample "New Neighbor" Offers</h2>
          <div className="space-y-3">
            {offers.map((o, i) => (
              <motion.div
                key={o.business}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-semibold text-sm">{o.business}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-secondary-foreground">{o.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{o.neighborhood} · "{o.offer}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Customer Fit</span>
                  <span className={`font-display font-bold text-sm ${
                    o.fit >= 85 ? "score-high" : "score-medium"
                  }`}>
                    {o.fit}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
