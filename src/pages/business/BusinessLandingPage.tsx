import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPinned, Radar, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const valueCards = [
  {
    title: "Expansion Signal Detection",
    description: "Identify relocation-driven demand pockets where your next location or campaign can scale faster.",
    icon: Radar,
  },
  {
    title: "Transit-Led Opportunity Mapping",
    description: "Prioritize neighborhoods near major transit flows where UW grads and young professionals are moving.",
    icon: TrainFront,
  },
  {
    title: "Neighborhood DNA Matching",
    description: "Match Seattle neighborhoods to your proven customer profile and de-risk expansion decisions.",
    icon: MapPinned,
  },
];

export default function BusinessLandingPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <section className="container mx-auto px-4 pt-14">
        <div className="rounded-3xl border border-border bg-[linear-gradient(165deg,#ffffff_0%,#f2f8fc_60%,#ecf5fb_100%)] p-8 md:p-14 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              B2B Geospatial Marketplace Intelligence
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl leading-tight font-display font-bold">
              PulsePath Seattle helps local wellness and lifestyle operators find the right neighborhood to grow.
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
              Built for premium grocery, healthy fast-casual, gyms, yoga, climbing, and multi-location brands. Use map-first neighborhood intelligence to decide where to expand, advertise, and launch new-neighbor offers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                <Link to="/business/dashboard">
                  Enter Business Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/business/dna-match">View DNA Match</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-3 gap-4">
          {valueCards.map((item) => (
            <Card key={item.title} className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-display font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
