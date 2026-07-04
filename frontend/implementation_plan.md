# UnveilEarth Frontend Implementation Plan

This document outlines the approach for building the UnveilEarth frontend based on the Next.js App Router and the requested feature-first architecture.

## User Review Required

- **Directory Structure:** The Next.js project in the workspace is currently initialized with a `src/` directory. I will move the `app` directory and other root-level folders outside of `src` to match the exact structure requested (`frontend/app`, `frontend/components`, etc.) and delete `src`. Is this okay, or would you prefer keeping everything inside `src/` while following the feature-folder pattern?
- **Map Provider:** I plan to use Mapbox GL JS (`react-map-gl` + `mapbox-gl`) as it offers excellent performance and immersive visualization for a travel app. (Requires a Mapbox token eventually, but I can mock it or leave a placeholder). Is this acceptable, or should I use Leaflet?
- **AI Content Stream:** I will mock the streaming AI response for the destination details since a backend isn't connected yet, but the architecture will be ready to accept a real ReadableStream.
- **Theme/Styling:** I will use Tailwind CSS with standard `shadcn/ui` initialization and set up a base dark/light theme with a premium aesthetic (curated typography like Inter/Outfit and sophisticated color scales).

## Proposed Changes

### 1. Project Reconfiguration
- Move `src/app` to `./app` and remove the `src` directory.
- Update `tsconfig.json` to support the new paths (e.g., `@/*` mapped to `./*`).
- Install necessary dependencies: `@tanstack/react-query`, `framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`, `mapbox-gl`, `react-map-gl`, `next-themes`.
- Initialize `shadcn-ui`.

### 2. Scaffold Feature-First Structure
- Create the requested directory structure:
  - `components/ui`, `components/layout`, `components/shared`
  - `features/discovery`, `features/destination-detail`, `features/events`, `features/experiences`, `features/chat`, `features/auth`
  - `hooks/`, `providers/`, `lib/`, `types/`, `styles/`

### 3. Implement Base Providers & Layout
- Set up `ThemeProvider` (next-themes), `QueryProvider` (React Query), and `AuthProvider`.
- Build the root `layout.tsx` with a responsive `Navbar` and `Footer`.
- Configure custom fonts (e.g., `Outfit` and `Inter` via `next/font/google`).

### 4. Build Core Shared Components
- Add shadcn primitives (Button, Card, Skeleton, Dialog, Input, Badge).
- Build `AiContentTag`, `VerifiedBadge`, `RatingStars`, and `EmptyState`.

### 5. Build Landing Page & Discovery Feature (End-to-End)
- **Landing Page (`/`)**: Immersive hero section with Framer Motion scroll parallax, value proposition, and featured destinations.
- **Discovery Page (`/discover`)**: Destination discovery with mock data. Includes `DestinationCard`, `DiscoveryFilters`, and `RecommendationFeed`.
- **Destination Detail (`/destinations/[slug]`)**: Immersive storytelling, `StorytellingPanel` with mock streaming AI text, Map placeholder, and image gallery.

### 6. Polish and Responsive Verification
- Ensure all built components are fully responsive across 360px, 768px, 1024px, and 1440px breakpoints.
- Ensure accessible markup (WCAG 2.1 AA target).

## Verification Plan

### Automated Tests
- The build process (`npm run build`) will act as our initial type-checking and build verification step.
- ESLint will be run to ensure clean code (`npm run lint`).

### Manual Verification
- We will start the development server (`npm run dev`) and visually inspect the landing page, discovery page, and a destination detail page across different viewport sizes.
- Verify that hover states, Framer Motion animations, and responsive layouts function correctly.
- Ensure that the dark/light mode toggle works correctly and the application maintains a premium feel in both modes.
