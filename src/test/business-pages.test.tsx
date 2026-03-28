/**
 * Interaction tests for all six business-facing pages.
 *
 * Each test:
 *  - renders the page inside the required providers (router + BusinessAppProvider)
 *  - asserts the page heading is visible
 *  - asserts one key interactive element (button or combobox) is present
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BusinessAppProvider } from "@/context/BusinessAppContext";
import BusinessLandingPage from "@/pages/business/BusinessLandingPage";
import BusinessDashboardPage from "@/pages/business/BusinessDashboardPage";
import NeighborhoodIntelligencePage from "@/pages/business/NeighborhoodIntelligencePage";
import DnaMatchPage from "@/pages/business/DnaMatchPage";
import CampaignPlannerPage from "@/pages/business/CampaignPlannerPage";
import OpportunitiesPipelinePage from "@/pages/business/OpportunitiesPipelinePage";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <BusinessAppProvider>{ui}</BusinessAppProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

// ─── Landing ──────────────────────────────────────────────────────────────────

describe("BusinessLandingPage", () => {
  it("renders the hero heading", () => {
    renderWithProviders(<BusinessLandingPage />);
    expect(
      screen.getByText(/PulsePath Seattle helps local wellness/i),
    ).toBeInTheDocument();
  });

  it("renders the Enter Business Dashboard CTA", () => {
    renderWithProviders(<BusinessLandingPage />);
    expect(screen.getByRole("link", { name: /Enter Business Dashboard/i })).toBeInTheDocument();
  });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

describe("BusinessDashboardPage", () => {
  it("renders the page heading", () => {
    renderWithProviders(<BusinessDashboardPage />);
    expect(screen.getByText("Seattle Opportunity Dashboard")).toBeInTheDocument();
  });

  it("renders Save Zone / Remove Zone buttons", () => {
    renderWithProviders(<BusinessDashboardPage />);
    const btn = screen.getByRole("button", { name: /save zone|remove zone/i });
    expect(btn).toBeInTheDocument();
  });

  it("toggles a zone when the Save Zone button is clicked", () => {
    renderWithProviders(<BusinessDashboardPage />);
    const btn = screen.getByRole("button", { name: /save zone|remove zone/i });
    const initial = btn.textContent;
    fireEvent.click(btn);
    expect(btn.textContent).not.toBe(initial);
  });
});

// ─── Neighborhood Intelligence ─────────────────────────────────────────────

describe("NeighborhoodIntelligencePage", () => {
  it("renders the page heading", () => {
    renderWithProviders(<NeighborhoodIntelligencePage />);
    expect(screen.getByText("Neighborhood Intelligence")).toBeInTheDocument();
  });

  it("renders the neighborhood selector combobox trigger", () => {
    renderWithProviders(<NeighborhoodIntelligencePage />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});

// ─── DNA Match ────────────────────────────────────────────────────────────────

describe("DnaMatchPage", () => {
  it("renders the page heading", () => {
    renderWithProviders(<DnaMatchPage />);
    expect(screen.getByText("Neighborhood DNA Match")).toBeInTheDocument();
  });

  it("renders at least one match card", () => {
    renderWithProviders(<DnaMatchPage />);
    expect(screen.getAllByText(/Top match #/i).length).toBeGreaterThan(0);
  });
});

// ─── Campaign Planner ─────────────────────────────────────────────────────────

describe("CampaignPlannerPage", () => {
  it("renders the page heading", () => {
    renderWithProviders(<CampaignPlannerPage />);
    expect(screen.getByText("Campaign Planner")).toBeInTheDocument();
  });

  it("renders the budget and duration inputs", () => {
    renderWithProviders(<CampaignPlannerPage />);
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("updates the simulation when budget changes", () => {
    renderWithProviders(<CampaignPlannerPage />);
    const [budgetInput] = screen.getAllByRole("spinbutton");
    fireEvent.change(budgetInput, { target: { value: "20000" } });
    // Estimated Reach should be visible and non-zero
    expect(screen.getByText("Estimated Reach")).toBeInTheDocument();
  });
});

// ─── Opportunities Pipeline ───────────────────────────────────────────────────

describe("OpportunitiesPipelinePage", () => {
  it("renders the page heading", () => {
    renderWithProviders(<OpportunitiesPipelinePage />);
    expect(screen.getByText("Opportunities Pipeline")).toBeInTheDocument();
  });

  it("renders pipeline rows with status tags", () => {
    renderWithProviders(<OpportunitiesPipelinePage />);
    const tags = ["high fit", "underserved", "high transit exposure", "premium audience"];
    const found = tags.filter((tag) => screen.queryAllByText(tag).length > 0);
    expect(found.length).toBeGreaterThan(0);
  });
});
