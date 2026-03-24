import { useApp } from "@/context/AppContext";
import NeighborhoodCard from "@/components/NeighborhoodCard";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { scoredNeighborhoods, favorites, toggleFavorite } = useApp();
  const favorited = scoredNeighborhoods.filter((n) => favorites.includes(n.id));

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-2xl font-display font-bold mb-2">Saved Neighborhoods</h1>
        <p className="text-sm text-muted-foreground mb-6">Your shortlist for quick comparison.</p>

        {favorited.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">No saved neighborhoods yet.</p>
            <Button asChild variant="outline">
              <Link to="/dashboard">Explore Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Link>
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
            {favorited.length >= 2 && (
              <div className="pt-4 text-center">
                <Button asChild variant="outline">
                  <Link to="/compare">Compare These <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
