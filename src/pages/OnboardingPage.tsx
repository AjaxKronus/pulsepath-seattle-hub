import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/context/AppContext";
import { workLocations, wellnessOptions } from "@/data/neighborhoods";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setPreferences } = useApp();
  const [step, setStep] = useState(0);
  const [workLocation, setWorkLocation] = useState("uw");
  const [rentBudget, setRentBudget] = useState(1600);
  const [maxCommute, setMaxCommute] = useState(25);
  const [wellnessPriorities, setWellnessPriorities] = useState<string[]>([]);

  const toggleWellness = (id: string) => {
    setWellnessPriorities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setPreferences({ workLocation, rentBudget, maxCommute, wellnessPriorities });
    navigate("/dashboard");
  };

  const steps = [
    // Step 0: Work location
    <div key="work" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Where will you work?</h2>
        <p className="text-muted-foreground text-sm">We'll optimize commute times from your work location.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setWorkLocation(loc.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              workLocation === loc.id
                ? "border-primary bg-secondary text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <span className="font-medium text-sm">{loc.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Budget
    <div key="budget" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">What's your rent budget?</h2>
        <p className="text-muted-foreground text-sm">Monthly budget for a 1-bedroom apartment.</p>
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-display font-bold text-primary">${rentBudget}</span>
          <span className="text-muted-foreground text-sm">/mo</span>
        </div>
        <Slider
          value={[rentBudget]}
          onValueChange={(v) => setRentBudget(v[0])}
          min={800}
          max={3000}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$800</span>
          <span>$3,000</span>
        </div>
      </div>
    </div>,

    // Step 2: Commute
    <div key="commute" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Max commute time?</h2>
        <p className="text-muted-foreground text-sm">One-way, via public transit or bike.</p>
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-display font-bold text-primary">{maxCommute}</span>
          <span className="text-muted-foreground text-sm"> min</span>
        </div>
        <Slider
          value={[maxCommute]}
          onValueChange={(v) => setMaxCommute(v[0])}
          min={5}
          max={60}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5 min</span>
          <span>60 min</span>
        </div>
      </div>
    </div>,

    // Step 3: Wellness
    <div key="wellness" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Wellness priorities</h2>
        <p className="text-muted-foreground text-sm">Select what matters most to your wellbeing.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {wellnessOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggleWellness(opt.id)}
            className={`p-4 rounded-xl border text-center transition-all ${
              wellnessPriorities.includes(opt.id)
                ? "border-primary bg-secondary"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="text-xs font-medium">{opt.label}</div>
          </button>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-lg">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps[step]}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-hero-gradient text-primary-foreground hover:opacity-90">
              See Results <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
