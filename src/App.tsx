import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { BusinessAppProvider } from "@/context/BusinessAppContext";
import Navbar from "@/components/Navbar";
import NotFound from "@/pages/NotFound";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ConsumerIntakePage = lazy(() => import("@/pages/ConsumerIntakePage"));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const ResilienceReportPage = lazy(() => import("@/pages/ResilienceReportPage"));
const AssistantPage = lazy(() => import("@/pages/AssistantPage"));

const BusinessLandingPage = lazy(() => import("@/pages/business/BusinessLandingPage"));
const BusinessDashboardPage = lazy(() => import("@/pages/business/BusinessDashboardPage"));
const NeighborhoodIntelligencePage = lazy(() => import("@/pages/business/NeighborhoodIntelligencePage"));
const DnaMatchPage = lazy(() => import("@/pages/business/DnaMatchPage"));
const CampaignPlannerPage = lazy(() => import("@/pages/business/CampaignPlannerPage"));
const OpportunitiesPipelinePage = lazy(() => import("@/pages/business/OpportunitiesPipelinePage"));
const BusinessAssistantPage = lazy(() => import("@/pages/business/BusinessAssistantPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BusinessAppProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm text-muted-foreground">Loading...</div>}>
              <Routes>
                <Route path="/" element={<ConsumerIntakePage />} />
                <Route path="/welcome" element={<HomePage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/report" element={<ResilienceReportPage />} />
                <Route path="/assistant" element={<AssistantPage />} />

                <Route path="/business" element={<BusinessLandingPage />} />
                <Route path="/business/dashboard" element={<BusinessDashboardPage />} />
                <Route path="/business/intelligence" element={<NeighborhoodIntelligencePage />} />
                <Route path="/business/dna-match" element={<DnaMatchPage />} />
                <Route path="/business/campaign-planner" element={<CampaignPlannerPage />} />
                <Route path="/business/pipeline" element={<OpportunitiesPipelinePage />} />
                <Route path="/business/assistant" element={<BusinessAssistantPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </BusinessAppProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
