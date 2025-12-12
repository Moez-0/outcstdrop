# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This is a single-page web app built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui. It implements an OUTCST-branded drop experience with a 3D T-shirt viewer, pre-order flow, and a small Supabase-backed dashboard for viewing pre-orders.

Key technologies:
- Vite + React + TypeScript (`package.json`)
- Tailwind CSS with custom theme (`tailwind.config.ts`, `src/index.css`)
- shadcn-ui style component primitives (`src/components/ui`)
- React Router for routing (`src/App.tsx`)
- TanStack Query setup for data fetching (`src/App.tsx`)
- Supabase for persistence (`src/integrations/supabase` and `supabase/`)

The `@` import alias maps to `./src` (see `vite.config.ts`).

## Commands & workflows

All commands are intended to be run from the repo root (`/home/moez/Desktop/dev/outcst-drop`). The project currently uses npm (see `README.md`, `package-lock.json`).

### Install dependencies

```bash
npm install
```

### Run the dev server

Vite dev server (configured to listen on all interfaces on port 8080):

```bash
npm run dev
```

By default this serves the app at `http://localhost:8080`.

### Build

Standard production build:

```bash
npm run build
```

Development-mode build (uses Vite `--mode development`):

```bash
npm run build:dev
```

### Preview built app

Build and preview the production bundle locally:

```bash
npm run build
npm run preview
```

### Linting

ESLint is configured via `eslint.config.js` and targets TypeScript/React files:

```bash
npm run lint
```

### Testing

There are currently **no test scripts** or test runner configuration defined (no `test` script in `package.json`, and no Vitest/Jest config found). If you add a test runner, also add the appropriate `npm test` / `npm run test:...` scripts so future agents can invoke them.

## High-level architecture

### Entry point and app shell

- `src/main.tsx` is the Vite/React entry point. It imports global styles from `src/index.css` and renders `<App />` into the `#root` element.
- `src/App.tsx` defines the top-level application shell:
  - Creates a shared `QueryClient` and wraps the app in `QueryClientProvider` for TanStack Query.
  - Wraps the UI with `TooltipProvider` and two toast systems: shadcn `Toaster` and Sonner `Toaster` (aliased as `Sonner`).
  - Sets up React Router routes via `BrowserRouter` / `Routes` / `Route`:
    - `/` → `Store` page (main landing + product experience).
    - `/info` → `Info` page (brand/story content).
    - `/success` → `Success` page (post pre-order confirmation).
    - `/dashboard` → `Dashboard` page (Supabase-powered pre-order overview).
    - `*` → `NotFound` page.

The `@` alias is used heavily (e.g. `@/components/...`, `@/integrations/...`) and is configured in both `vite.config.ts` and `tsconfig.json`.

### Pages and navigation

- `src/pages/Store.tsx`
  - Composes the main drop experience: `Navbar`, `GrainOverlay`, `HeroSection`, `TShirtViewer`, `ProductDetails`, `SizeSelector`, and `Footer`.
  - Manages `isSizeSelectorOpen` local state and scrolls to the product section when the hero CTA is clicked.
- `src/pages/Info.tsx`
  - Uses `Navbar`, `GrainOverlay`, and `Footer`.
  - Renders a sequence of large typographic statements with framer-motion scroll animations (`StatementBlock` component within the file).
  - Includes a contact section linking to `mailto:info@outcst.io`.
- `src/pages/Success.tsx`
  - Fullscreen confirmation screen shown after a successful pre-order.
  - Uses framer-motion for staged entrance animations.
  - Provides a CTA link back to `/`.
- `src/pages/Dashboard.tsx`
  - Supabase-backed admin-style dashboard for viewing pre-orders.
  - Fetches rows from the `pre_orders` table via the shared Supabase client (`@/integrations/supabase/client`).
  - Aggregates counts per size and displays summary tiles (`TOTAL`, `XS`, `S`, `M`, `L`, `XL`).
  - Renders a table of pre-orders (name, email, size, formatted `created_at`) with animated row entries.
  - Includes a manual refresh button which re-triggers the fetch.
- `src/pages/NotFound.tsx`
  - Simple animated 404 page with a link back to `/`.

Navigation is handled entirely via React Router `<Link>` components (see `src/components/Navbar.tsx`, `Success.tsx`, `NotFound.tsx`).

### Components

- `src/components/Navbar.tsx`
  - Fixed, animated top navigation bar.
  - Tracks scroll position (`scrolled` state) to toggle background/blur and border.
  - Uses `useLocation` from React Router to highlight the active route ("STORE" vs "INFO").
- `src/components/SizeSelector.tsx`
  - Pre-order modal that collects `name`, `email`, and `size` and writes to Supabase.
  - Uses `@/integrations/supabase/client` to insert into the `pre_orders` table.
  - Uses the global toast system via `toast` from `@/hooks/use-toast` for validation and error messages.
  - On success, resets internal state, closes the modal, and navigates to `/success`.
- `src/components/GrainOverlay.tsx`, `HeroSection.tsx`, `TShirtViewer.tsx`, `ProductDetails.tsx`, `Footer.tsx`
  - Compose the visual/3D product experience and layout; they build on the design system and animation patterns configured elsewhere.
- `src/components/ui/*`
  - shadcn-ui style primitive components (e.g., `button`, `input`, `toast`, `sonner`, `accordion`, `dialog`, `drawer`, `sheet`, `table`, etc.).
  - These are the building blocks for higher-level components and should be preferred over ad-hoc HTML wherever possible.

### Hooks and utilities

- `src/hooks/use-toast.ts`
  - Internal toast state manager used by the shadcn `Toaster`.
  - Exports `useToast` (hook returning current toasts and helper actions) and `toast` (imperative helper used by components like `SizeSelector`).
  - To show a toast, import `toast` from `@/hooks/use-toast` and call `toast({ title, description, variant, ... })`.
- `src/hooks/use-mobile.tsx`
  - `useIsMobile` hook that returns a boolean based on a `max-width: 767px` media query.
  - Uses `window.matchMedia` and listens to `change` events to keep state in sync.
- `src/lib/utils.ts`
  - Exposes the `cn` utility, which combines `clsx` and `tailwind-merge` to merge Tailwind class names without conflicts. This is used in components like `Navbar`.

### Styling and theming

- `tailwind.config.ts`
  - Enables `darkMode: ["class"]` and points `content` at `./src/**/*.{ts,tsx}` and other relevant directories.
  - Configures global layout via `theme.container`.
  - Defines custom fonts `display` and `mono` and a design token-based color system (e.g., `primary`, `secondary`, `muted`, `accent`, `card`, `steel`, `void`, `smoke`) wired to CSS variables (`hsl(var(--...))`).
  - Adds custom keyframes and animations used across the UI (e.g., `accordion-down`, `accordion-up`, `slow-spin`, `fade-up`, `pulse-glow`).
- `src/index.css`
  - Global styles and Tailwind layers (not detailed here, but this is where CSS variables and base typography/layout are typically defined for this project).

### Supabase integration and data model

- `src/integrations/supabase/client.ts`
  - **Auto-generated file** (note at the top: "This file is automatically generated. Do not edit it directly.").
  - Creates a typed Supabase client using `createClient<Database>` from `@supabase/supabase-js`.
  - Reads credentials from Vite environment variables:
    - `import.meta.env.VITE_SUPABASE_URL`
    - `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`
  - Auth configuration uses `localStorage` with session persistence and auto-refresh.
  - Import pattern: `import { supabase } from "@/integrations/supabase/client";` (already used in `Dashboard` and `SizeSelector`).
- `src/integrations/supabase/types.ts`
  - Generated typed representation of the Supabase schema.
  - Currently defines the `public.pre_orders` table with `id`, `name`, `email`, `size`, and `created_at` fields, along with `Insert` and `Update` types.
  - Also exports generic helper types (`Tables`, `TablesInsert`, `TablesUpdate`, `Enums`, `CompositeTypes`).
  - **Do not hand-edit this file**; regenerate it via Supabase tooling if the database schema changes.
- `supabase/`
  - Contains `config.toml` (with `project_id`) and a `migrations/` directory for Supabase migrations (not detailed here). These are used by the Supabase CLI and should be updated through that workflow.

### Environment configuration

Runtime Supabase configuration is expected via Vite env variables (not committed here):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These need to be set in the environment (e.g., `.env` file at the project root or environment variables in your deployment) for Supabase operations in `Dashboard` and `SizeSelector` to work.

## Notes for future agents

- Prefer using the existing `@` path alias (`@/components/...`, `@/hooks/...`, `@/integrations/...`) rather than relative paths when adding new modules.
- When extending Supabase-backed features (e.g., adding new columns to `pre_orders` or new tables), update the database via migrations/CLI and then regenerate `src/integrations/supabase/types.ts` instead of editing it manually.
- To display notifications, use the existing toast infrastructure (`@/hooks/use-toast` and the `Toaster` already mounted in `App.tsx`) rather than introducing a parallel system.
- For responsive logic, reuse `useIsMobile` from `src/hooks/use-mobile.tsx` to keep behavior consistent across components.
