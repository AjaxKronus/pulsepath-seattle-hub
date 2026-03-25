import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Heart, BarChart3, Building2, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: null },
  { to: "/dashboard", label: "Dashboard", icon: MapPin },
  { to: "/compare", label: "Compare", icon: BarChart3 },
  { to: "/favorites", label: "Saved", icon: Heart },
  { to: "/business", label: "B2B", icon: Building2 },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">PulsePath</span>
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Seattle</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
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
