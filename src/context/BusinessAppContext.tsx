import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { DashboardFilters, defaultFilters } from "@/data/business/mockData";

const STORAGE_ZONES_KEY = "pp_saved_zones";
const STORAGE_FILTERS_KEY = "pp_filters";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — silently skip
  }
}

interface BusinessAppContextValue {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  selectedNeighborhoodId: string;
  setSelectedNeighborhoodId: (id: string) => void;
  savedZoneIds: string[];
  toggleSavedZone: (id: string) => void;
}

const BusinessAppContext = createContext<BusinessAppContextValue | null>(null);

export function BusinessAppProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<DashboardFilters>(() =>
    readStorage<DashboardFilters>(STORAGE_FILTERS_KEY, defaultFilters),
  );

  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>("u-district");

  const [savedZoneIds, setSavedZoneIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_ZONES_KEY, ["roosevelt", "u-district"]),
  );

  const setFilters = (next: DashboardFilters) => {
    writeStorage(STORAGE_FILTERS_KEY, next);
    setFiltersState(next);
  };

  const toggleSavedZone = (id: string) => {
    setSavedZoneIds((previous) => {
      const next = previous.includes(id)
        ? previous.filter((zoneId) => zoneId !== id)
        : [...previous, id];
      writeStorage(STORAGE_ZONES_KEY, next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      selectedNeighborhoodId,
      setSelectedNeighborhoodId,
      savedZoneIds,
      toggleSavedZone,
    }),
    [filters, selectedNeighborhoodId, savedZoneIds],
  );

  return <BusinessAppContext.Provider value={value}>{children}</BusinessAppContext.Provider>;
}

export function useBusinessApp() {
  const context = useContext(BusinessAppContext);
  if (!context) {
    throw new Error("useBusinessApp must be used within BusinessAppProvider");
  }
  return context;
}
