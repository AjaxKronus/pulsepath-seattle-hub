import { useMemo } from "react";
import { Bookmark, CircleCheckBig, Lightbulb, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";import BusinessMap from "@/components/business/BusinessMap";
import DashboardFiltersPanel from "@/components/business/DashboardFilters";
import OpportunityCard from "@/components/business/OpportunityCard";
import ScoreBadge from "@/components/business/ScoreBadge";
import { useBusinessApp } from "@/context/BusinessAppContext";
import { businessNeighborhoods, getSortedNeighborhoods } from "@/data/business/mockData";
import { Button } from "@/components/ui/button";

export default function BusinessDashboardPage() {
  const { filters, setFilters, selectedNeighborhoodId, setSelectedNeighborhoodId, savedZoneIds, toggleSavedZone } = useBusinessApp();

  const rankedNeighborhoods = useMemo(() => getSortedNeighborhoods(filters), [filters]);

  const selected =
    rankedNeighborhoods.find((item) => item.id === selectedNeighborhoodId) ?? rankedNeighborhoods[0];

  const chartData = rankedNeighborhoods.slice(0, 6).map((item) => ({
    neighborhood: item.name,
    opportunity: item.opportunityScore,
    transit: item.transitAccess,
  }));

  const savedZones = businessNeighborhoods.filter((item) => savedZoneIds.includes(item.id));

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Seattle Opportunity Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Map-first ranking for expansion, targeting, and new-neighbor campaign decisions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CircleCheckBig className="w-4 h-4 text-accent" />
            Live demo data - March 2026 scenario
          </div>
        </div>

        <div className="grid xl:grid-cols-12 gap-4">
          <div className="xl:col-span-3 space-y-4">
            <DashboardFiltersPanel value={filters} onChange={setFilters} />

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-display font-semibold flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" />
                Saved Target Zones
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {savedZones.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedNeighborhoodId(item.id)}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs"
                  >
                    {item.name}
                  </button>
                ))}
                {savedZones.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No zones saved yet.</p>
                ) : null}
              </div>
            </section>
          </div>

          <div className="xl:col-span-6">
            <BusinessMap
              neighborhoods={rankedNeighborhoods}
              selectedId={selected.id}
              onSelect={setSelectedNeighborhoodId}
            />
          </div>

          <div className="xl:col-span-3 space-y-4">
            <section className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-display font-semibold">{selected.name}</h2>
                <ScoreBadge score={selected.opportunityScore} label="Opportunity" size="sm" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{selected.overview}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="rounded-lg bg-secondary px-2 py-2">Transit access: {selected.transitAccess}</div>
                <div className="rounded-lg bg-secondary px-2 py-2">Rent index: {selected.avgRentIndex}</div>
                <div className="rounded-lg bg-secondary px-2 py-2">Wellness density: {selected.lifestyleWellnessDensity}</div>
                <div className="rounded-lg bg-secondary px-2 py-2">Competitors: {selected.competitorPresence}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => toggleSavedZone(selected.id)}>
                  {savedZoneIds.includes(selected.id) ? "Remove Zone" : "Save Zone"}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/business/intelligence">Open Intelligence</Link>
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-display font-semibold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Recommendation
              </h3>
              <p className="text-xs text-muted-foreground mt-2">{selected.recommendation}</p>
            </section>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-4 mt-4">
          <section className="lg:col-span-7 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-display font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              Opportunity Ranking Snapshot
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="neighborhood" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="opportunity" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="lg:col-span-5 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-display font-semibold mb-3">Top Neighborhood Cards</h3>
            <div className="space-y-3 max-h-72 overflow-auto pr-1">
              {rankedNeighborhoods.slice(0, 4).map((item, index) => (
                <OpportunityCard
                  key={item.id}
                  neighborhood={item}
                  rank={index + 1}
                  onSelect={setSelectedNeighborhoodId}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
