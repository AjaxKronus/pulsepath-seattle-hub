import { useMemo, useState } from "react";
import { Megaphone, Target } from "lucide-react";
import {
  businessNeighborhoods,
  estimateCampaignResult,
  newNeighborOffers,
} from "@/data/business/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CampaignPlannerPage() {
  const [neighborhoodId, setNeighborhoodId] = useState(businessNeighborhoods[0].id);
  const [offerTitle, setOfferTitle] = useState(newNeighborOffers[0].title);
  const [budget, setBudget] = useState(8500);
  const [weeks, setWeeks] = useState(6);

  const neighborhood = businessNeighborhoods.find((item) => item.id === neighborhoodId) ?? businessNeighborhoods[0];
  const offer = newNeighborOffers.find((item) => item.title === offerTitle) ?? newNeighborOffers[0];

  const simulation = useMemo(
    () => estimateCampaignResult(neighborhood, offer, budget, weeks),
    [neighborhood, offer, budget, weeks],
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold">Campaign Planner</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Simulate neighborhood-level new-neighbor offers and estimate conversion potential.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          <Card className="lg:col-span-5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary" />
                Configure Offer Campaign
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Neighborhood</Label>
                <Select value={neighborhood.id} onValueChange={setNeighborhoodId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose neighborhood" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessNeighborhoods.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>New Neighbor Offer</Label>
                <Select value={offer.title} onValueChange={setOfferTitle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose offer" />
                  </SelectTrigger>
                  <SelectContent>
                    {newNeighborOffers.map((item) => (
                      <SelectItem key={item.title} value={item.title}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Campaign Budget (USD)</Label>
                <Input type="number" min={1000} step={500} value={budget} className="mt-2" onChange={(event) => setBudget(Number(event.target.value))} />
              </div>

              <div>
                <Label>Campaign Duration (weeks)</Label>
                <Input type="number" min={2} max={12} value={weeks} className="mt-2" onChange={(event) => setWeeks(Number(event.target.value))} />
              </div>

              <div className="rounded-xl border border-border p-3 text-xs text-muted-foreground">
                Coverage zone preview: {neighborhood.topCorridors.join(" - ")}.
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Simulation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Audience Fit Score</p>
                  <p className="text-2xl font-display font-bold">{simulation.fitScore}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Estimated Reach</p>
                  <p className="text-2xl font-display font-bold">{simulation.estimatedReach.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Estimated Leads</p>
                  <p className="text-2xl font-display font-bold">{simulation.estimatedLeads.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Estimated Conversions</p>
                  <p className="text-2xl font-display font-bold">{simulation.estimatedConversions.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-secondary p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Mock Revenue Potential</p>
                  <p className="text-2xl font-display font-bold">${simulation.estimatedRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border p-4 text-sm">
                <p className="font-medium">Planner Summary</p>
                <p className="text-muted-foreground mt-1">
                  For {neighborhood.name}, the selected {offer.offerType.toLowerCase()} offer is projected to perform best in transit-adjacent corridors with incoming renter concentration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
