import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Building2, TrendingUp, Users, Tag, BarChart3, Target, Zap, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const offers = [
  { business: "CorePower Yoga", type: "Wellness Studio", neighborhood: "Capitol Hill", offer: "First month free for new residents", fit: 92, leads: 47 },
  { business: "PCC Community Markets", type: "Grocery", neighborhood: "Fremont", offer: "10% off first 3 months", fit: 88, leads: 63 },
  { business: "Beacon Yoga", type: "Wellness Studio", neighborhood: "Beacon Hill", offer: "Free trial week + welcome pack", fit: 85, leads: 31 },
  { business: "West Seattle Runner", type: "Retail", neighborhood: "West Seattle", offer: "20% new neighbor discount", fit: 78, leads: 22 },
  { business: "Ballard Health Club", type: "Gym", neighborhood: "Ballard", offer: "Waived enrollment fee", fit: 90, leads: 55 },
];

const PIE_COLORS = [
  "hsl(195, 80%, 25%)",
  "hsl(160, 55%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(210, 10%, 60%)",
];

const clusterData = [
  { name: "Budget students", value: 38 },
  { name: "Young pros", value: 32 },
  { name: "Wellness-focused", value: 20 },
  { name: "Remote workers", value: 10 },
];

const kpiCards = [
  { label: "Monthly Active Movers", value: "1,247", change: "+12%", icon: Users },
  { label: "Avg New-Mover Budget", value: "$1,650/mo", change: "+3%", icon: DollarSign },
  { label: "Offer Conversion Rate", value: "18.4%", change: "+2.1%", icon: Target },
  { label: "Top Relocation Month", value: "August", change: "Stable", icon: TrendingUp },
];

function DollarSign(props: any) {
  return <Tag {...props} />;
}

export default function BusinessDashboardPage() {
  const { scoredNeighborhoods } = useApp();
  const topZones = scoredNeighborhoods.slice(0, 6);
  const barData = topZones.map((n) => ({
    name: n.name.length > 10 ? n.name.slice(0, 10) + "…" : n.name,
    score: n.resilienceScore,
    rent: Math.round(n.avg1BRRent / 100),
  }));

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-3">
            <Zap className="w-3 h-3" />
            Market Intelligence · Seattle
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Business Dashboard</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Real-time insights on where Seattle's newest residents are moving, what they need, and how to reach them.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <kpi.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-accent flex items-center gap-0.5">
                  {kpi.change} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-xl font-display font-bold">{kpi.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Opportunity Zones Bar Chart */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-sm">High-Opportunity Zones</h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(210, 10%, 45%)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(210, 10%, 45%)" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(200, 20%, 88%)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(195, 80%, 25%)" radius={[4, 4, 0, 0]} name="Resilience Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Segments Pie */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-sm">Customer-Fit Segments</h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-44 w-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clusterData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                      strokeWidth={2}
                    >
                      {clusterData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5">
                {clusterData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="font-display font-bold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-sm">"New Neighbor" Offer Placements</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sample offers auto-targeted to incoming residents.</p>
          </div>
          <div className="divide-y divide-border">
            {offers.map((o, i) => (
              <motion.div
                key={o.business}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-semibold text-sm">{o.business}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-secondary-foreground">{o.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{o.neighborhood} · "{o.offer}"</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Leads</div>
                    <div className="font-display font-bold text-sm">{o.leads}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Fit</div>
                    <div className={`font-display font-bold text-sm ${
                      o.fit >= 85 ? "score-high" : "score-medium"
                    }`}>
                      {o.fit}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
