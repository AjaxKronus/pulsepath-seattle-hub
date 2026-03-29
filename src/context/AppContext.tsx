import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  ConversationMessage,
  Neighborhood,
  SearchCriteria,
  UserPreferences,
} from "@/types";
import { neighborhoods } from "@/data/neighborhoods";
import {
  createAssistantMessage,
  createEmptyCriteria,
  createInitialConversation,
  finalizeCriteria,
  isCriteriaReady,
  processIntakeTurn,
} from "@/lib/criteriaExtraction";
import { processIntakeTurnWithGemini } from "@/lib/criteriaExtraction";
import { computeCriteriaDrivenScore, derivePreferencesFromCriteria } from "@/lib/criteriaScoring";

interface AppState {
  criteria: SearchCriteria;
  updateCriteria: (patch: Partial<SearchCriteria>) => void;
  conversation: ConversationMessage[];
  sendIntakeMessage: (message: string) => Promise<void>;
  isSending: boolean;
  resetIntake: () => void;
  criteriaReady: boolean;
  hasEnteredApp: boolean;
  continueToApp: () => void;
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
const SESSION_STORAGE_KEY = "pulsepath.consumer.session";

interface SessionSnapshot {
  criteria: SearchCriteria;
  conversation: ConversationMessage[];
  userName: string;
  favorites: string[];
  shortlist: string[];
  hasEnteredApp: boolean;
}

function makeUserMessage(content: string): ConversationMessage {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "user",
    content,
    createdAt: Date.now(),
  };
}

function getInitialSnapshot(): SessionSnapshot {
  return {
    criteria: createEmptyCriteria(),
    conversation: createInitialConversation(),
    userName: "",
    favorites: [],
    shortlist: [],
    hasEnteredApp: false,
  };
}

function loadSnapshot(): SessionSnapshot {
  if (typeof window === "undefined") {
    return getInitialSnapshot();
  }

  const rawValue = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawValue) {
    return getInitialSnapshot();
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<SessionSnapshot>;
    return {
      ...getInitialSnapshot(),
      ...parsed,
      criteria: finalizeCriteria({
        ...createEmptyCriteria(),
        ...parsed.criteria,
        commutePreference: {
          ...createEmptyCriteria().commutePreference,
          ...parsed.criteria?.commutePreference,
        },
        priorityWeights: {
          ...createEmptyCriteria().priorityWeights,
          ...parsed.criteria?.priorityWeights,
        },
      }),
      conversation: parsed.conversation?.length ? parsed.conversation : createInitialConversation(),
      favorites: parsed.favorites || [],
      shortlist: parsed.shortlist || [],
      userName: parsed.userName || "",
      hasEnteredApp: !!parsed.hasEnteredApp,
    };
  } catch {
    return getInitialSnapshot();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initialSnapshot = useMemo(() => loadSnapshot(), []);
  const [criteria, setCriteria] = useState<SearchCriteria>(initialSnapshot.criteria);
  const [conversation, setConversation] = useState<ConversationMessage[]>(initialSnapshot.conversation);
  const [favorites, setFavorites] = useState<string[]>(initialSnapshot.favorites);
  const [shortlist, setShortlist] = useState<string[]>(initialSnapshot.shortlist);
  const [userName, setUserNameState] = useState(initialSnapshot.userName);
  const [hasEnteredApp, setHasEnteredApp] = useState(initialSnapshot.hasEnteredApp);
  const [isSending, setIsSending] = useState(false);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as string ?? "";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot: SessionSnapshot = {
      criteria,
      conversation,
      userName,
      favorites,
      shortlist,
      hasEnteredApp,
    };
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  }, [criteria, conversation, favorites, shortlist, userName, hasEnteredApp]);

  const updateCriteria = (patch: Partial<SearchCriteria>) => {
    setCriteria((currentCriteria) =>
      finalizeCriteria({
        ...currentCriteria,
        ...patch,
        commutePreference: {
          ...currentCriteria.commutePreference,
          ...patch.commutePreference,
        },
        priorityWeights: {
          ...currentCriteria.priorityWeights,
          ...patch.priorityWeights,
        },
        targetNeighborhoods: patch.targetNeighborhoods ?? currentCriteria.targetNeighborhoods,
        wellnessPriorities: patch.wellnessPriorities ?? currentCriteria.wellnessPriorities,
        lifestylePreferences: patch.lifestylePreferences ?? currentCriteria.lifestylePreferences,
        mustHaves: patch.mustHaves ?? currentCriteria.mustHaves,
        niceToHaves: patch.niceToHaves ?? currentCriteria.niceToHaves,
        excludedAreas: patch.excludedAreas ?? currentCriteria.excludedAreas,
      }),
    );
  };

  const preferences = useMemo(() => derivePreferencesFromCriteria(criteria), [criteria]);
  const criteriaReady = useMemo(() => isCriteriaReady(criteria), [criteria]);

  const setPreferences = (preferencesInput: UserPreferences) => {
    updateCriteria({
      workLocation: preferencesInput.workLocation,
      maxRent: preferencesInput.rentBudget,
      commutePreference: {
        maxMinutes: preferencesInput.maxCommute,
        preferredModes: criteria.commutePreference.preferredModes,
      },
      wellnessPriorities: preferencesInput.wellnessPriorities,
    });
    setHasEnteredApp(true);
  };

  const setUserName = (name: string) => setUserNameState(name);

  const sendIntakeMessage = async (message: string): Promise<void> => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    const userMessage = makeUserMessage(trimmed);
    // Show user message immediately with a pending indicator
    setConversation((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      let result;
      if (geminiApiKey.trim()) {
        result = await processIntakeTurnWithGemini(trimmed, criteria, geminiApiKey);
      } else {
        result = processIntakeTurn(trimmed, criteria);
      }
      setConversation((prev) => [...prev, createAssistantMessage(result.assistantReply)]);
      setCriteria(result.criteria);
    } catch (err) {
      console.error("[PulsePath] sendIntakeMessage error:", err);
      const fallback = processIntakeTurn(trimmed, criteria);
      setConversation((prev) => [...prev, createAssistantMessage(fallback.assistantReply)]);
      setCriteria(fallback.criteria);
    } finally {
      setIsSending(false);
    }
  };

  const continueToApp = () => setHasEnteredApp(true);

  const resetIntake = () => {
    const snapshot = getInitialSnapshot();
    setCriteria(snapshot.criteria);
    setConversation(snapshot.conversation);
    setFavorites(snapshot.favorites);
    setShortlist(snapshot.shortlist);
    setUserNameState(snapshot.userName);
    setHasEnteredApp(false);
  };

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

  const scoredNeighborhoods = useMemo(
    () =>
      neighborhoods
        .map((neighborhood) => ({
          ...neighborhood,
          resilienceScore: computeCriteriaDrivenScore(neighborhood, criteria, preferences),
        }))
        .sort((a, b) => b.resilienceScore - a.resilienceScore),
    [criteria, preferences],
  );

  return (
    <AppContext.Provider
      value={{
        criteria,
        updateCriteria,
        conversation,
        sendIntakeMessage,
        isSending,
        resetIntake,
        criteriaReady,
        hasEnteredApp,
        continueToApp,
        preferences,
        setPreferences,
        userName,
        setUserName,
        favorites,
        toggleFavorite,
        shortlist,
        toggleShortlist,
        scoredNeighborhoods,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
