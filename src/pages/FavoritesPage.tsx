import { useApp } from "@/context/AppContext";
import NeighborhoodCard from "@/components/NeighborhoodCard";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, ListChecks, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const { scoredNeighborhoods, favorites, toggleFavorite, shortlist, toggleShortlist } = useApp();
  const favorited = scoredNeighborhoods.filter((n) => favorites.includes(n.id));
  const shortlisted = scoredNeighborhoods.filter((n) => shortlist.includes(n.id));

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/">Refine Criteria</Link>
          </Button>
        </div>

        {/* Shortlist Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-display font-bold">Top 3 Shortlist</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Pin up to 3 neighborhoods for quick comparison. {shortlist.length}/3 selected.
          </p>

          {shortlisted.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-8 text-center">
              <ListChecks className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground mb-3">
                No neighborhoods pinned yet. Explore the dashboard and tap the pin icon.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <AnimatePresence mode="popLayout">
                  {shortlisted.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative bg-card rounded-xl border-2 border-primary/30 p-4"
                    >
                      <button
                        onClick={() => toggleShortlist(n.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-secondary text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-lg font-display font-bold text-primary mb-1">{n.resilienceScore}</div>
                      <h3 className="font-display font-semibold text-sm mb-1">{n.name}</h3>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div>${n.avg1BRRent.toLocaleString()}/mo</div>
                        <div>{n.commuteToUW}min UW · {n.commuteToDT}min DT</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {Array.from({ length: 3 - shortlisted.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="border border-dashed border-border rounded-xl p-4 flex items-center justify-center min-h-[120px]"
                  >
                    <span className="text-xs text-muted-foreground">Slot {shortlisted.length + i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {shortlisted.length >= 2 && (
                  <Button asChild size="sm">
                    <Link to="/compare">Compare These <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </Button>
                )}
                {shortlisted.length >= 1 && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/report">
                      <Lock className="w-3.5 h-3.5 mr-1" />
                      View Resilience Report
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Favorites Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-display font-bold">All Favorites</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Your saved neighborhoods.</p>

          {favorited.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground mb-4">No saved neighborhoods yet.</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">Explore Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {favorited.map((n, i) => (
                <NeighborhoodCard
                  key={n.id}
                  neighborhood={n}
                  rank={i + 1}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(n.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
