import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ComparePage() {
  const { scoredNeighborhoods } = useApp();
  const [selected, setSelected] = useState<string[]>(
    scoredNeighborhoods.slice(0, 3).map((n) => n.id)
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compared = scoredNeighborhoods.filter((n) => selected.includes(n.id));

  const metrics = [
    { key: "resilienceScore", label: "Resilience Score" },
    { key: "avg1BRRent", label: "1BR Rent", format: (v: number) => `$${v.toLocaleString()}` },
    { key: "commuteToUW", label: "Commute to UW", format: (v: number) => `${v} min` },
    { key: "commuteToDT", label: "Commute to DT", format: (v: number) => `${v} min` },
    { key: "transitScore", label: "Transit Score" },
    { key: "walkScore", label: "Walk Score" },
    { key: "bikeScore", label: "Bike Score" },
    { key: "wellnessScore", label: "Wellness Score" },
    { key: "safetyScore", label: "Safety Score" },
    { key: "greenSpaceScore", label: "Green Space" },
    { key: "nightlifeScore", label: "Nightlife" },
  ] as const;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl font-display font-bold mb-2">Compare Neighborhoods</h1>
        <p className="text-sm text-muted-foreground mb-6">Select up to 4 neighborhoods to compare.</p>

        {/* Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {scoredNeighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => toggle(n.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selected.includes(n.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {selected.includes(n.id) && <Check className="w-3 h-3 inline mr-1" />}
              {n.name}
            </button>
          ))}
        </div>

        {/* Comparison table */}
        {compared.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Metric</th>
                  {compared.map((n) => (
                    <th key={n.id} className="text-center py-3 px-3 font-display font-semibold">{n.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => {
                  const values = compared.map((n) => (n as any)[m.key] as number);
                  const best = m.key === "avg1BRRent" || m.key === "commuteToUW" || m.key === "commuteToDT"
                    ? Math.min(...values)
                    : Math.max(...values);

                  return (
                    <tr key={m.key} className="border-b border-border/50">
                      <td className="py-3 pr-4 text-muted-foreground font-medium">{m.label}</td>
                      {compared.map((n) => {
                        const val = (n as any)[m.key] as number;
                        const isBest = val === best && compared.length > 1;
                        const formatted = m.format ? m.format(val) : val;
                        return (
                          <td key={n.id} className={`text-center py-3 px-3 ${isBest ? "font-bold text-accent" : ""}`}>
                            {formatted}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
