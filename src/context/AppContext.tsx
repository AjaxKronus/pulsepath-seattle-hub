import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserPreferences, Neighborhood } from "@/types";
import { neighborhoods, computeResilienceScore } from "@/data/neighborhoods";

interface AppState {
  preferences: UserPreferences | null;
  setPreferences: (p: UserPreferences) => void;
  userName: string;
  setUserName: (name: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  scoredNeighborhoods: (Neighborhood & { resilienceScore: number })[];
}

const AppContext = createContext<AppState | null>(null);

const MAX_SHORTLIST = 3;

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<UserPreferences | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  const setPreferences = (p: UserPreferences) => setPreferencesState(p);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleShortlist = (id: string) => {
    setShortlist((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : prev.length < MAX_SHORTLIST
        ? [...prev, id]
        : prev
    );
  };

  const scoredNeighborhoods = neighborhoods.map((n) => ({
    ...n,
    resilienceScore: preferences
      ? computeResilienceScore(n, preferences)
      : Math.round((n.transitScore + n.walkScore + n.wellnessScore + n.safetyScore) / 4),
  })).sort((a, b) => b.resilienceScore - a.resilienceScore);

  return (
    <AppContext.Provider value={{ preferences, setPreferences, userName, setUserName, favorites, toggleFavorite, shortlist, toggleShortlist, scoredNeighborhoods }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
