# PulsePath Seattle - Business Intelligence Prototype

PulsePath Seattle is a business-facing geospatial intelligence dashboard for wellness and lifestyle operators evaluating where to grow in Seattle.

The prototype helps premium grocery, healthy fast-casual, gyms, yoga studios, climbing gyms, wellness operators, and multi-location teams identify high-potential neighborhoods near transit where UW students, recent graduates, and young professionals are likely to relocate.

## Product Goals

- Visualize Seattle neighborhood opportunity zones in a map-first dashboard
- Rank neighborhoods by business potential and campaign fit
- Compare neighborhoods using transit, rent profile, wellness density, and competitor saturation
- Surface a Neighborhood DNA Match score based on successful business profiles
- Simulate targeted new-neighbor offers with mock conversion potential
- Track opportunity areas in a pipeline with decision tags

## Core Screens

1. Overview landing page
- Business positioning and value proposition
- CTA into the dashboard and DNA match

2. Main dashboard
- Left filter panel
- Center map with heat zones
- Right insights panel
- Opportunity score cards and ranking chart
- Saved target zones

3. Neighborhood intelligence
- Transit accessibility
- Average rent profile
- Lifestyle and wellness infrastructure density
- Competitor density
- Target-customer fit

4. Neighborhood DNA match
- Select successful business profile
- View top matching neighborhoods
- See similarity score and rationale highlights

5. Campaign planner
- Choose neighborhood and offer format
- Simulate reach, leads, conversions, and mock revenue
- Preview campaign corridors

6. Opportunities pipeline
- Ranked list of priority neighborhoods
- Status tags: high fit, underserved, high transit exposure, premium audience
- Next actions and ownership context

## Mock Neighborhood Coverage

- U-District
- Capitol Hill
- South Lake Union
- Roosevelt
- Northgate
- Ballard
- Fremont

## Mock Metrics Included

- Target audience density
- Transit-connected footfall potential
- Wellness spending proxy
- Competitor saturation
- Expansion suitability
- Campaign fit score

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS + shadcn/ui primitives
- Recharts for analytics visualizations
- Local mock data and deterministic scoring helpers

## Project Structure

- src/data/business: mock business datasets and scoring utilities
- src/components/business: reusable business dashboard components
- src/pages/business: business-facing route screens
- src/context/BusinessAppContext.tsx: shared state for filters, selected zone, and saved target zones

## Local Development

Install and run:

```bash
npm install
npm run dev
```

Build and test:

```bash
npm run build
npm run test
```

## Demo Flow

1. Open Overview and enter the dashboard.
2. Adjust filter sliders in Dashboard and inspect map heat zones.
3. Save one or more target zones and open Neighborhood Intelligence.
4. Use DNA Match to select a successful profile and review top neighborhood matches.
5. Simulate a New Neighbor offer in Campaign Planner.
6. Review recommended zones and statuses in Opportunities Pipeline.

## Notes

- This prototype is intentionally business-only.
- No backend, auth, payments, or production integrations are included in first pass.
- Data and architecture are structured to allow future API and persistence extensions.
