import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import NeighborhoodCard from "@/components/NeighborhoodCard";
import SeattleMap from "@/components/SeattleMap";
import { Link } from "react-router-dom";
import { SlidersHorizontal, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function getZillowUrl(name: string) {
  const query = encodeURIComponent(`${name}, Seattle, WA rentals`);
  return `https://www.zillow.com/homes/for_rent/${query}`;
}

export default function DashboardPage() {
  const { scoredNeighborhoods, favorites, toggleFavorite, preferences } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(scoredNeighborhoods[0]?.id ?? null);

  const selectedNeighborhood = scoredNeighborhoods.find((n) => n.id === selectedId);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">
              {preferences ? "Your Recommendations" : "Explore Seattle Neighborhoods"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {preferences
                ? `Budget $${preferences.rentBudget}/mo · ${preferences.maxCommute} min commute`
                : "Complete the quiz for personalized results"}
            </p>
          </div>
          <div className="flex gap-2">
            {!preferences && (
              <Button asChild size="sm" variant="outline">
                <Link to="/onboarding">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Set Preferences
                </Link>
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link to="/compare">
                Compare <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <SeattleMap
              neighborhoods={scoredNeighborhoods}
              selectedId={selectedId}
              onSelect={setSelectedId}
              favorites={favorites}
            />
            {/* Selected detail */}
            {selectedNeighborhood && (
              <motion.div
                key={selectedNeighborhood.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-card rounded-xl border border-border p-5"
              >
                <h3 className="font-display font-bold text-lg mb-1">{selectedNeighborhood.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedNeighborhood.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {[
                    { label: "Transit", value: selectedNeighborhood.transitScore },
                    { label: "Walk", value: selectedNeighborhood.walkScore },
                    { label: "Wellness", value: selectedNeighborhood.wellnessScore },
                    { label: "Safety", value: selectedNeighborhood.safetyScore },
                  ].map((s) => (
                    <div key={s.label} className="bg-secondary rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                      <div className={`text-lg font-display font-bold ${
                        s.value >= 70 ? "score-high" : s.value >= 45 ? "score-medium" : "score-low"
                      }`}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Wellness Spots</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNeighborhood.wellnessSpots.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <a
                    href={getZillowUrl(selectedNeighborhood.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Browse Rentals on Zillow <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rankings list */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Rankings
            </h2>
            {scoredNeighborhoods.map((n, i) => (
              <NeighborhoodCard
                key={n.id}
                neighborhood={n}
                rank={i + 1}
                isFavorite={favorites.includes(n.id)}
                onToggleFavorite={() => toggleFavorite(n.id)}
                onClick={() => setSelectedId(n.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
