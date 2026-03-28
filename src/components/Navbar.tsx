import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Bot, Building2, Heart, MapPin, Menu, Radar, Route, Shield, Target, X } from "lucide-react";
import { useState } from "react";

const consumerNavItems = [
  { to: "/", label: "Intake", icon: null },
  { to: "/dashboard", label: "Dashboard", icon: MapPin },
  { to: "/compare", label: "Compare", icon: BarChart3 },
  { to: "/favorites", label: "Saved", icon: Heart },
  { to: "/report", label: "Report", icon: Shield },
  { to: "/assistant", label: "Assistant", icon: Bot },
];

const businessNavItems = [
  { to: "/", label: "Overview", icon: Building2 },
  { to: "/business/dashboard", label: "Dashboard", icon: MapPin },
  { to: "/business/intelligence", label: "Intelligence", icon: Radar },
  { to: "/business/dna-match", label: "DNA Match", icon: Target },
  { to: "/business/campaign-planner", label: "Campaign", icon: Route },
  { to: "/business/pipeline", label: "Pipeline", icon: Building2 },
  { to: "/business/assistant", label: "Assistant", icon: Bot },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isBusinessRoute = location.pathname.startsWith("/business");
  const navItems = isBusinessRoute
    ? businessNavItems.map((item, idx) => (idx === 0 ? { ...item, to: "/business" } : item))
    : consumerNavItems;
  const brandName = isBusinessRoute ? "PulsePath Seattle" : "PulsePath";
  const brandBadge = isBusinessRoute ? "Business" : "Seattle";
  const brandTo = isBusinessRoute ? "/business" : "/";
  const primaryModeLabel = isBusinessRoute ? "Business" : "Consumer";
  const secondaryModeLabel = isBusinessRoute ? "Consumer" : "Business";
  const secondaryModeTo = isBusinessRoute ? "/" : "/business";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to={brandTo} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            {isBusinessRoute ? (
              <Building2 className="w-4 h-4 text-primary-foreground" />
            ) : (
              <MapPin className="w-4 h-4 text-primary-foreground" />
            )}
          </div>
          <span className="font-display font-bold text-lg text-foreground">{brandName}</span>
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{brandBadge}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-border/80 bg-card/80 p-1">
            <span className="px-2.5 py-1 text-xs font-semibold text-foreground">{primaryModeLabel}</span>
            <Link
              to={secondaryModeTo}
              className="px-2.5 py-1 text-xs font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {secondaryModeLabel}
            </Link>
          </div>

          <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-secondary rounded-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  {item.label}
                </span>
              </Link>
            );
          })}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-b border-border px-4 pb-4"
        >
          <div className="mb-3 inline-flex items-center rounded-full border border-border/80 bg-secondary/40 p-1">
            <span className="px-2.5 py-1 text-xs font-semibold text-foreground">{primaryModeLabel}</span>
            <Link
              to={secondaryModeTo}
              onClick={() => setMobileOpen(false)}
              className="px-2.5 py-1 text-xs font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {secondaryModeLabel}
            </Link>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-md ${
                location.pathname === item.to
                  ? "text-primary bg-secondary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
