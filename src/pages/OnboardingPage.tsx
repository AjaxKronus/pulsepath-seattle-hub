import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, MapPin, DollarSign, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/context/AppContext";
import { workLocations, wellnessOptions } from "@/data/neighborhoods";

const stepMeta = [
  { icon: Sparkles, label: "Welcome", color: "text-primary" },
  { icon: MapPin, label: "Work", color: "text-primary" },
  { icon: DollarSign, label: "Budget", color: "text-score-medium" },
  { icon: Clock, label: "Commute", color: "text-accent" },
  { icon: Heart, label: "Wellness", color: "text-destructive" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setPreferences, setUserName, userName } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(userName);
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
    setUserName(name);
    setPreferences({ workLocation, rentBudget, maxCommute, wellnessPriorities });
    navigate("/dashboard");
  };

  const firstName = name.split(" ")[0];

  const steps = [
    // Step 0: Welcome / Name
    <div key="welcome" className="space-y-6">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-hero-gradient flex items-center justify-center mb-5">
          <MapPin className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">
          Welcome to PulsePath
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We'll ask a few quick questions to find Seattle neighborhoods that fit your life — not just your budget.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">What should we call you?</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className="max-w-xs"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">This personalizes your experience.</p>
      </div>
    </div>,

    // Step 1: Work location
    <div key="work" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">
          {firstName ? `${firstName}, where` : "Where"} will you work?
        </h2>
        <p className="text-muted-foreground text-sm">We'll optimize commute times from your work location.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setWorkLocation(loc.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              workLocation === loc.id
                ? "border-primary bg-secondary text-foreground ring-1 ring-primary/20"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <span className="font-medium text-sm">{loc.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Budget
    <div key="budget" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">
          {firstName ? `${firstName}'s` : "Your"} rent budget
        </h2>
        <p className="text-muted-foreground text-sm">Monthly budget for a 1-bedroom apartment.</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="text-center">
          <span className="text-5xl font-display font-bold text-primary">${rentBudget.toLocaleString()}</span>
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
        <div className="text-xs text-center text-muted-foreground">
          {rentBudget <= 1200 && "💡 You'll find the best deals in U-District & Beacon Hill."}
          {rentBudget > 1200 && rentBudget <= 1800 && "💡 Most Seattle neighborhoods are within reach."}
          {rentBudget > 1800 && "💡 You can explore premium areas like Capitol Hill & SLU."}
        </div>
      </div>
    </div>,

    // Step 3: Commute
    <div key="commute" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Max commute time?</h2>
        <p className="text-muted-foreground text-sm">One-way, via public transit or bike.</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="text-center">
          <span className="text-5xl font-display font-bold text-primary">{maxCommute}</span>
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
        <div className="text-xs text-center text-muted-foreground">
          {maxCommute <= 15 && "🚶 You prefer living close — great walkable options exist."}
          {maxCommute > 15 && maxCommute <= 30 && "🚇 Most Light Rail-connected neighborhoods work for you."}
          {maxCommute > 30 && "🚴 All of Seattle opens up at this range."}
        </div>
      </div>
    </div>,

    // Step 4: Wellness
    <div key="wellness" className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">
          {firstName ? `${firstName}'s` : "Your"} wellness priorities
        </h2>
        <p className="text-muted-foreground text-sm">
          Select what matters most — we'll weight these in your score.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {wellnessOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggleWellness(opt.id)}
            className={`p-4 rounded-xl border text-center transition-all ${
              wellnessPriorities.includes(opt.id)
                ? "border-primary bg-secondary ring-1 ring-primary/20"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="text-xs font-medium">{opt.label}</div>
          </button>
        ))}
      </div>
      {wellnessPriorities.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          ✨ {wellnessPriorities.length} priorit{wellnessPriorities.length === 1 ? "y" : "ies"} selected — these will boost matching neighborhoods.
        </p>
      )}
    </div>,
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {stepMeta.map((s, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < step ? "bg-primary" : i === step ? "bg-hero-gradient" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step label */}
        <div className="flex items-center gap-2 mb-4">
          {(() => {
            const Icon = stepMeta[step].icon;
            return <Icon className={`w-4 h-4 ${stepMeta[step].color}`} />;
          })()}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Step {step + 1} of {steps.length} · {stepMeta[step].label}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

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
              See My Results <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
