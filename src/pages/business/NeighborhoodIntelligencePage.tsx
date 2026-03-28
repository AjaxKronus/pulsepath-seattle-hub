import { useMemo } from "react";
import { Compass, Navigation, TrainFront, Warehouse } from "lucide-react";
import { useBusinessApp } from "@/context/BusinessAppContext";
import { businessNeighborhoods, getSortedNeighborhoods } from "@/data/business/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreBadge from "@/components/business/ScoreBadge";

export default function NeighborhoodIntelligencePage() {
  const { selectedNeighborhoodId, setSelectedNeighborhoodId, filters } = useBusinessApp();
  const ranked = useMemo(() => getSortedNeighborhoods(filters), [filters]);
  const selected = ranked.find((item) => item.id === selectedNeighborhoodId) ?? ranked[0];

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Neighborhood Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Deep profile on transit accessibility, rent profile, wellness infrastructure, and local competition.
            </p>
          </div>
          <div className="w-full md:w-80">
            <Select value={selected.id} onValueChange={setSelectedNeighborhoodId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose neighborhood" />
              </SelectTrigger>
              <SelectContent>
                {businessNeighborhoods.map((item) => (
                  <SelectItem value={item.id} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrainFront className="w-4 h-4 text-primary" />
                Transit Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-display font-bold">{selected.transitAccess}</p>
              <p className="text-xs text-muted-foreground mt-2">Strong connectivity to UW and Seattle employment corridors.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-primary" />
                Average Rent Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-display font-bold">${selected.avgOneBedroomRent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Relative rent index {selected.avgRentIndex} vs Seattle urban average.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                Target-Customer Fit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreBadge score={selected.opportunityScore} label="DNA Fit" />
              <p className="text-xs text-muted-foreground mt-2">Composite fit for UW-adjacent movers and young professionals.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Lifestyle and Wellness Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-secondary p-3 text-sm flex justify-between">
                <span>Wellness Density</span>
                <strong>{selected.lifestyleWellnessDensity}</strong>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-sm flex justify-between">
                <span>Wellness Spending Proxy</span>
                <strong>{selected.wellnessSpendingProxy}</strong>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2">Best Corridors</p>
                <div className="flex flex-wrap gap-2">
                  {selected.topCorridors.map((corridor) => (
                    <span key={corridor} className="rounded-full border border-border bg-card px-3 py-1 text-xs">
                      {corridor}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Competitor and Expansion Outlook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-secondary p-3 text-sm flex justify-between">
                <span>Competitor Density</span>
                <strong>{selected.competitorPresence}</strong>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-sm flex justify-between">
                <span>Expansion Suitability</span>
                <strong>{selected.expansionSuitability}</strong>
              </div>
              <div className="rounded-xl border border-border p-3 text-sm">
                <p className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-primary mt-0.5" />
                  <span>{selected.recommendation}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
