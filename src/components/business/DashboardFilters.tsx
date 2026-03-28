import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessType, DashboardFilters } from "@/data/business/mockData";

const businessTypes: Array<BusinessType | "All"> = [
  "All",
  "Premium Grocery",
  "Healthy Fast-Casual",
  "Gym",
  "Yoga Studio",
  "Climbing Gym",
  "Wellness Studio",
  "Multi-Location Operator",
];

interface DashboardFiltersProps {
  value: DashboardFilters;
  onChange: (value: DashboardFilters) => void;
}

export default function DashboardFiltersPanel({ value, onChange }: DashboardFiltersProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Business Type</p>
        <Select value={value.businessType} onValueChange={(selected) => onChange({ ...value, businessType: selected as BusinessType | "All" })}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((item) => (
              <SelectItem value={item} key={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Min Transit Access</span>
          <span className="font-semibold">{value.minTransitAccess}</span>
        </div>
        <Slider
          value={[value.minTransitAccess]}
          min={50}
          max={95}
          step={1}
          onValueChange={(next) => onChange({ ...value, minTransitAccess: next[0] })}
        />
      </div>

      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Max Competitor Presence</span>
          <span className="font-semibold">{value.maxCompetitorPresence}</span>
        </div>
        <Slider
          value={[value.maxCompetitorPresence]}
          min={35}
          max={95}
          step={1}
          onValueChange={(next) => onChange({ ...value, maxCompetitorPresence: next[0] })}
        />
      </div>

      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Min Target Audience</span>
          <span className="font-semibold">{value.minAudienceDensity}</span>
        </div>
        <Slider
          value={[value.minAudienceDensity]}
          min={50}
          max={95}
          step={1}
          onValueChange={(next) => onChange({ ...value, minAudienceDensity: next[0] })}
        />
      </div>
    </section>
  );
}
