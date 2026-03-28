import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  calculateDnaSimilarity,
  businessNeighborhoods,
  successfulProfiles,
} from "@/data/business/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DnaMatchPage() {
  const [profileId, setProfileId] = useState(successfulProfiles[0].id);
  const profile = successfulProfiles.find((item) => item.id === profileId) ?? successfulProfiles[0];

  const matches = useMemo(() => {
    return businessNeighborhoods
      .map((neighborhood) => {
        const score = calculateDnaSimilarity(profile, neighborhood);
        const reasons = [
          neighborhood.transitAccess >= profile.preferredTransit - 8 ? "Transit profile aligns" : null,
          Math.abs(neighborhood.avgRentIndex - profile.preferredRentIndex) <= 10 ? "Rent profile resembles customer base" : null,
          neighborhood.lifestyleWellnessDensity >= profile.preferredWellnessDensity - 10 ? "Wellness behavior is a strong match" : null,
          neighborhood.targetAudienceDensity >= profile.preferredAudienceDensity - 8 ? "Audience density matches proven demand" : null,
        ].filter(Boolean) as string[];

        return {
          neighborhood,
          score,
          reasons: reasons.length > 0 ? reasons.slice(0, 3) : ["Competitive fit with acceptable variance"],
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [profile]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Neighborhood DNA Match</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select a successful business profile and discover Seattle neighborhoods with strongest similarity.
            </p>
          </div>
          <div className="w-full md:w-96">
            <Select value={profile.id} onValueChange={setProfileId}>
              <SelectTrigger>
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                {successfulProfiles.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="rounded-2xl mb-4">
          <CardHeader>
            <CardTitle className="text-base">Selected Success Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display font-semibold text-lg">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.businessType}</p>
            <p className="text-sm text-muted-foreground mt-2">{profile.notes}</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {matches.map((match, index) => (
            <Card key={match.neighborhood.id} className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Top match #{index + 1}</p>
                    <h2 className="text-lg font-display font-semibold">{match.neighborhood.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{match.neighborhood.overview}</p>
                  </div>
                  <div className="rounded-xl bg-secondary px-4 py-3 text-center min-w-28">
                    <div className="text-xs uppercase text-muted-foreground">Similarity</div>
                    <div className="text-2xl font-display font-bold text-primary">{match.score}</div>
                  </div>
                </div>
                <div className="mt-4 grid md:grid-cols-3 gap-2">
                  {match.reasons.map((reason) => (
                    <div key={reason} className="rounded-lg border border-border bg-card px-3 py-2 text-xs flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      {reason}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
