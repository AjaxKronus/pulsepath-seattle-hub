import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessApp } from "@/context/BusinessAppContext";
import { businessNeighborhoods, getSortedNeighborhoods, opportunitiesPipeline } from "@/data/business/mockData";

function statusVariant(status: string) {
  if (status === "high fit") return "bg-score-high/20 text-score-high border border-score-high/40";
  if (status === "underserved") return "bg-score-medium/20 text-score-medium border border-score-medium/40";
  if (status === "high transit exposure") return "bg-primary/15 text-primary border border-primary/30";
  return "bg-accent/15 text-accent border border-accent/30";
}

export default function OpportunitiesPipelinePage() {
  const { filters } = useBusinessApp();

  const rankedMap = useMemo(() => {
    return new Map(getSortedNeighborhoods(filters).map((item) => [item.id, item.opportunityScore]));
  }, [filters]);

  const rows = opportunitiesPipeline
    .map((item) => {
      const neighborhood = businessNeighborhoods.find((zone) => zone.id === item.neighborhoodId);
      if (!neighborhood) return null;

      return {
        ...item,
        neighborhood,
        opportunityScore: rankedMap.get(item.neighborhoodId) ?? 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.opportunityScore ?? 0) - (a?.opportunityScore ?? 0));

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold">Opportunities Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked neighborhood pipeline with fit tags and ownership for growth execution.
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">High-Opportunity Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((item) => {
              if (!item) return null;

              return (
                <div key={`${item.neighborhoodId}-${item.status}`} className="rounded-xl border border-border p-4 bg-card">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{item.owner}</p>
                      <h2 className="text-lg font-display font-semibold">{item.neighborhood.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{item.nextAction}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusVariant(item.status)}>{item.status}</Badge>
                      <div className="rounded-lg bg-secondary px-3 py-2 text-center min-w-20">
                        <div className="text-[10px] uppercase text-muted-foreground">Score</div>
                        <div className="text-lg font-display font-bold text-primary">{item.opportunityScore}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-secondary px-2.5 py-2">Audience {item.neighborhood.targetAudienceDensity}</div>
                    <div className="rounded-lg bg-secondary px-2.5 py-2">Transit {item.neighborhood.transitAccess}</div>
                    <div className="rounded-lg bg-secondary px-2.5 py-2">Confidence {item.confidence}%</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
