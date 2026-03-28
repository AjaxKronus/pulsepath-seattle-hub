import { SearchCriteria } from "@/types";
import { neighborhoods, wellnessOptions, workLocations } from "@/data/neighborhoods";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const lifestyleOptions = [
  { id: "walkable", label: "Walkable" },
  { id: "quiet", label: "Quiet" },
  { id: "nightlife", label: "Nightlife" },
  { id: "waterfront", label: "Waterfront" },
  { id: "arts", label: "Arts & Culture" },
  { id: "familyFriendly", label: "Family-friendly" },
];

interface CriteriaSummaryCardProps {
  criteria: SearchCriteria;
  editable?: boolean;
  onChange?: (patch: Partial<SearchCriteria>) => void;
}

function toggleListValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function CriteriaSummaryCard({ criteria, editable = false, onChange }: CriteriaSummaryCardProps) {
  const confidencePercent = Math.round(criteria.confidenceScore * 100);
  const identifiedCount = 4 - criteria.missingFields.length;

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Derived Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-border bg-secondary/35 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Profile confidence</span>
            <span>{confidencePercent}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-hero-gradient transition-all"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            We’ve identified {identifiedCount} of 4 core decision inputs.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Still Missing</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {criteria.missingFields.length === 0 ? (
              <span className="rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">Ready to generate</span>
            ) : (
              criteria.missingFields.map((field) => (
                <span key={field} className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                  {field}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Work Location</Label>
            {editable ? (
              <select
                value={criteria.workLocation}
                onChange={(event) => onChange?.({ workLocation: event.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select one</option>
                {workLocations.map((location) => (
                  <option key={location.id} value={location.id}>{location.label}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm">{criteria.workLocation || "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Max Rent</Label>
            {editable ? (
              <Input
                type="number"
                value={criteria.maxRent ?? ""}
                onChange={(event) => onChange?.({ maxRent: event.target.value ? Number(event.target.value) : null })}
                placeholder="1800"
              />
            ) : (
              <p className="text-sm">{criteria.maxRent ? `$${criteria.maxRent.toLocaleString()}` : "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Max Commute</Label>
            {editable ? (
              <Input
                type="number"
                value={criteria.commutePreference.maxMinutes ?? ""}
                onChange={(event) =>
                  onChange?.({
                    commutePreference: {
                      ...criteria.commutePreference,
                      maxMinutes: event.target.value ? Number(event.target.value) : null,
                    },
                  })
                }
                placeholder="25"
              />
            ) : (
              <p className="text-sm">
                {criteria.commutePreference.maxMinutes ? `${criteria.commutePreference.maxMinutes} min` : "Not set"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Preferred Modes</Label>
            {editable ? (
              <div className="flex flex-wrap gap-2">
                {["walk", "bike", "bus", "lightRail", "drive"].map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={criteria.commutePreference.preferredModes.includes(mode) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      onChange?.({
                        commutePreference: {
                          ...criteria.commutePreference,
                          preferredModes: toggleListValue(criteria.commutePreference.preferredModes, mode),
                        },
                      })
                    }
                    className="h-8"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm">
                {criteria.commutePreference.preferredModes.length > 0
                  ? criteria.commutePreference.preferredModes.join(", ")
                  : "No mode preference"}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Wellness Priorities</Label>
          {editable ? (
            <div className="flex flex-wrap gap-2">
              {wellnessOptions.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={criteria.wellnessPriorities.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange?.({ wellnessPriorities: toggleListValue(criteria.wellnessPriorities, option.id) })}
                  className="h-8"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm">
              {criteria.wellnessPriorities.length > 0 ? criteria.wellnessPriorities.join(", ") : "Not specified"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Lifestyle Preferences</Label>
          {editable ? (
            <div className="flex flex-wrap gap-2">
              {lifestyleOptions.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={criteria.lifestylePreferences.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange?.({ lifestylePreferences: toggleListValue(criteria.lifestylePreferences, option.id) })}
                  className="h-8"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm">
              {criteria.lifestylePreferences.length > 0 ? criteria.lifestylePreferences.join(", ") : "Not specified"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Target Neighborhoods</Label>
          {editable ? (
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((neighborhood) => (
                <Button
                  key={neighborhood.id}
                  type="button"
                  variant={criteria.targetNeighborhoods.includes(neighborhood.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange?.({ targetNeighborhoods: toggleListValue(criteria.targetNeighborhoods, neighborhood.id) })}
                  className="h-8"
                >
                  {neighborhood.name}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm">
              {criteria.targetNeighborhoods.length > 0 ? criteria.targetNeighborhoods.join(", ") : "No specific neighborhoods selected"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Excluded Areas</Label>
          <div className="flex flex-wrap gap-2">
            {criteria.excludedAreas.length > 0 ? (
              criteria.excludedAreas.map((area) => (
                <span key={area} className="rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive">
                  {area}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">None specified</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
