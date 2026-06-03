# Context State - KaamPay (June 2026)

This document serves as the project memory and architectural context repository. It describes the current layout, system architecture, feature status, and coding conventions of KaamPay folder-by-folder and feature-by-feature.

---

## 🏗️ 1. Complete System Architecture & Tech Stack

KaamPay is a freelancing marketplace consisting of a Next.js frontend, an Express API backend, and a PostgreSQL database mapped via Prisma ORM.

### Tech Stack Inventory

- **Frontend Framework**: Next.js 16 (React, App Router, TypeScript, Tailwind CSS)
- **Backend API**: Express 5 (TypeScript, NodeJS)
- **Database ORM**: Prisma 7 (PostgreSQL Client with pg adapter pooling)
- **Authentication**: Better Auth (Email/Password, OAuth session handling, Role-Based Access Control)
- **State Management**: Zustand (Shared frontend stores)
- **Validation**: Zod (Form validation & API request validation coercion)
- **Media Upload**: Cloudinary (Base64 image conversion, upload service, and asset storage)

---

## 📁 2. Folder-by-Folder Directory Analysis

The codebase is split into two primary components: Next.js Frontend (Root) and Express Backend (`backend/`).

### 🖥️ Next.js Frontend Structure

- **[app/](file:///d:/Repo/kaampay/app)**: Next.js App Router root directories. Folder names define routing.
  - `(auth)/`: Grouped authentication routes (login, signup, register, verify-email).
  - `dashboard/`: Logged-in user workspace dashboard (includes `/create-gig` for freelancers).
  - `onboarding/`: Profile creation wizard for new users (role selection, details setup).
  - `profile/`: Freelancer profile viewing and editing.
  - `find-work/`: **(NEW)** High-fidelity Client Discovery gig search.
  - `layout.tsx` / `globals.css`: Shared layout bindings, navbar placements, and global typography (Inter & Manrope).
- **[components/](file:///d:/Repo/kaampay/components)**: Reusable UI blocks.
  - `find-work/`: **(NEW)** Components for the client browsing flow:
    - [BookmarkBtn.tsx](file:///d:/Repo/kaampay/components/find-work/BookmarkBtn.tsx): Bookmark button with interactive ping burst animation and state toggles.
    - [FilterDrawer.tsx](file:///d:/Repo/kaampay/components/find-work/FilterDrawer.tsx): Side drawer containing sorting selections, category dropdown, price ranges, and delivery speed filters.
    - [FullModal.tsx](file:///d:/Repo/kaampay/components/find-work/FullModal.tsx): Overlay modal displaying expanded gig descriptions, seller profiles, and action triggers.
    - [GigCard.tsx](file:///d:/Repo/kaampay/components/find-work/GigCard.tsx): Standard listing cards with visual tags, delivery timelines, price banners, and title transitions. Includes `GigCardSkeleton`.
    - [GigDetailPanel.tsx](file:///d:/Repo/kaampay/components/find-work/GigDetailPanel.tsx): Dynamic right-side panel that updates asynchronously when a gig is selected. Contains detailed profiles, skill badges, and order call-to-actions.
    - [SavedEmpty.tsx](file:///d:/Repo/kaampay/components/find-work/SavedEmpty.tsx): Visual empty fallback state for the saved bookmarks list.
    - [utils.ts](file:///d:/Repo/kaampay/components/find-work/utils.ts): Shared client logic (price formatter in INR, date-to-relative time parser, local storage persistence).
  - `AppNavbar.tsx`: Custom navbar for authenticated users with dropdowns for Find Work, Deliver, Profile, and Sign Out.
  - `Footer.tsx` / `Hero.tsx` / `Features.tsx`: Main landing page UI sections.
  - `RoleGuard.tsx`: Role-based route guard preventing cross-access between Clients and Freelancers.
- **[hooks/](file:///d:/Repo/kaampay/hooks)**: Custom hooks.
  - `useAuth.ts`: Encapsulates social login integrations, email authentication triggers, and state resets.
- **[store/](file:///d:/Repo/kaampay/store)**: Zustand global state management.
  - `auth.store.ts`: Tracks active login sessions, user roles, and loading statuses.
- **[services/](file:///d:/Repo/kaampay/services)**: Outbound Axios API calls wrapper services (e.g., `auth.service.ts`).
- **[lib/](file:///d:/Repo/kaampay/lib)**: Configurations & helper libraries (Axios client config mapping, Better Auth bindings).
- **[types/](file:///d:/Repo/kaampay/types)**: TypeScript definitions.
  - [gig.ts](file:///d:/Repo/kaampay/types/gig.ts): **(NEW)** Data contracts for `Gig`, `GigDetail`, `GigFreelancer`, filters, and search response shapes.

### ⚙️ Express Backend Structure (`backend/src/`)

- **[server.ts](file:///d:/Repo/kaampay/backend/src/server.ts)**: API server bootstrapper listening on port 5000.
- **[app.ts](file:///d:/Repo/kaampay/backend/src/app.ts)**: Configures helmet protection, routing endpoints, error-handling middleware, and parsed body limits (upgraded to `10mb`).
- **[config/](file:///d:/Repo/kaampay/backend/src/config)**: Instantiates SDK wrapper clients (Prisma Client singleton, Cloudinary API, Better Auth core configs).
- **[modules/](file:///d:/Repo/kaampay/backend/src/modules)**: Domain-driven service groupings:
  - `auth/`: Handles token generations, logins, register, and signouts.
  - `users/`: Handles profile data fetch, onboarding inputs.
  - `gig/`: Handles gig creations, file upload pipes, rate limiters, and freelancer-specific listings.
  - `freelancer/`: Exposes profile metrics and reviews.
  - `client/`: **(NEW)** Express submodule supporting dynamic discovery:
    - [client.routes.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.routes.ts): Exposes public endpoints (`/gigs`, `/gigs/:id`, `/freelancers`, `/freelancers/:id`, `/categories`).
    - [client.controller.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.controller.ts): Coordinates Zod query parsing, handles controller actions via `catchAsync`, and replies via standard JSON responses.
    - [client.validation.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.validation.ts): Zod parsing rules using coercion filters (`z.preprocess`) to safely handle string-to-number types in queries.
    - [client.service.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.service.ts): Dynamic Prisma query engine joining models (User, Gig, Profile) and implementing robust text indexing, category comparisons, and sort switches.
- **[common/](file:///d:/Repo/kaampay/backend/src/common)**: Standard utility wrappers (`apiResponse.ts`, `catchAsync.ts`).
- **[error/](file:///d:/Repo/kaampay/backend/src/error)**: central `AppError` configuration and global handling block.

### 🗃️ Database & Seeding

- **[prisma/](file:///d:/Repo/kaampay/prisma)**: Contains the database schema (`schema.prisma`) and migration timeline scripts.
- **[scripts/](file:///d:/Repo/kaampay/scripts)**:
  - [seed-gigs.ts](file:///d:/Repo/kaampay/scripts/seed-gigs.ts): **(NEW)** Generates 3 mock freelancers with fully filled-out profiles and 10 realistic active gigs spanning standard PRD categories.

---

## 🛠️ 3. Feature-by-Feature Implementation State

### Feature A: Client Discovery & Browsing (Frontend + Backend)

- **Implementation Details**:
  - **Backend API**: Dynamic, unauthenticated Express endpoints filter active gigs and freelancers based on search tokens, categories, maximum delivery times, and price scopes.
  - **Dynamic SQL Coercion**: Query parameters undergo coercion filters inside the validation block to prevent crashes from invalid types.
  - **Search & Pagination**: The frontend (`/find-work`) triggers dynamic requests debounced by 400ms. It features pagination triggers, loading skeletons, and filter drawers.
  - **Split-Pane Layout**: The search results present a list-detail architecture. Clicking a card loads detailed seller statistics and order triggers in a persistent side panel.
  - **Bookmark Storage**: User bookmark selections are cached inside `localStorage` (key: `kp_saved_gigs`) and support offline hydration and toggling with interactive animations.
- **Relevant Files**:
  - Frontend: `app/find-work/page.tsx`, `components/find-work/*`
  - Backend: `backend/src/modules/client/*`
  - Types: `types/gig.ts`

### Feature B: Gig & Project Creation (Cloudinary + Rate Limiting)

- **Implementation Details**:
  - **Schema Extensions**: Added `images String[]` to model `Gig` and `education String?` to model `Profile`.
  - **Upload Pipeline**: Base64 file paths uploaded via drag-and-drop on the frontend are sent to Express, processed through `cloudinary.ts`, and converted to persistent URL strings.
  - **Rate Limiting**: Integrated `createGigRateLimiter` to throttle API calls to 3 gig creations per 1 minute per IP address.
  - **Payload Extensions**: Increased JSON parsing threshold limit on the Express engine to `10mb` to allow bulk base64 picture uploads.
- **Relevant Files**:
  - Frontend: `app/dashboard/create-gig/page.tsx`, `app/dashboard/page.tsx`
  - Backend: `backend/src/modules/gig/*`, `backend/src/config/cloudinary.ts`

### Feature C: Freelancer Profile Layout & Onboarding

- **Implementation Details**:
  - **Grid Layout**: Redesigned `/profile` header into a compact 3-column layout dividing bio details, rates, and external social anchors.
  - **Navbar/Footer Alignment**: Bound profile sections directly with `<AppNavbar />` and compacted the page `<Footer />` height metrics.
  - **Onboarding Wizard**: Step-by-step form capturing skills, hourly rates, experience metadata, and writing database changes on completion.
- **Relevant Files**:
  - Frontend: `app/profile/page.tsx`, `app/onboarding/page.tsx`
  - Backend: `backend/src/modules/users/user.controller.ts`

---

## 📊 4. Graphify Structural Insights (From `graphify-out/`)

- **God Nodes**:
  1. `AppError` (18 relations): Central backend error handler, imported by controllers and route catch loops.
  2. `compilerOptions` (14–16 relations): Central type resolution parameters defining frontend/backend boundaries.
  3. `KaamPay Stepwise Development Plan` (11 relations): Central implementation sequence.
- **Key Client Connections**:
  - `LoginPage` $\rightarrow$ `useAuth()` hook.
  - `RegisterForm` $\rightarrow$ `useAuth()` hook.
  - `DashboardPage` $\rightarrow$ `useAuth()` hook + `useAuthStore` Zustand store.
  - `ClientService` manages complex database joins linking `Gig`, `Profile`, and `User`.

---

## 📜 5. Operational Conventions & Development Rules

### Asynchronous Safety

1. All asynchronous actions MUST explicitly return a Promise or implement `async/await`.
2. Every `await` must be contained inside a localized `try/catch` block, or call standard bubble-up catch handlers (`catchAsync` on backend).

### Package Governance

1. Avoid raw dependency upgrades. Always matching packages via the current package manager (`npm install`).

### Version Control & Sanity Checks

1. Staged hooks configured inside `.husky/pre-commit` run `graphify update .` automatically upon commit to regenerate dependencies and update metadata graphs.
2. The compiler/lint parameters ignore `/kaampay/.obsidian` configurations to prevent formatting conflicts with Obsidian vault structures.
