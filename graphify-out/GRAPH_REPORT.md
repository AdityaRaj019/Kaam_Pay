# Graph Report - kaampay  (2026-05-30)

## Corpus Check
- 120 files · ~22,556 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 759 nodes · 844 edges · 95 communities (84 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cbce89be`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 125|Community 125]]
- [[_COMMUNITY_Community 131|Community 131]]
- [[_COMMUNITY_Community 132|Community 132]]
- [[_COMMUNITY_Community 135|Community 135]]
- [[_COMMUNITY_Community 147|Community 147]]
- [[_COMMUNITY_Community 153|Community 153]]
- [[_COMMUNITY_Community 171|Community 171]]
- [[_COMMUNITY_Community 172|Community 172]]
- [[_COMMUNITY_Community 173|Community 173]]
- [[_COMMUNITY_Community 174|Community 174]]
- [[_COMMUNITY_Community 175|Community 175]]
- [[_COMMUNITY_Community 197|Community 197]]
- [[_COMMUNITY_Community 198|Community 198]]
- [[_COMMUNITY_Community 224|Community 224]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `AppError` - 16 edges
3. `compilerOptions` - 14 edges
4. `══════════════════════════════════════════════════════════════` - 13 edges
5. `hiddenItems` - 11 edges
6. `KaamPay Stepwise Development Plan` - 11 edges
7. `useAuth()` - 10 edges
8. `6. Functional Requirements` - 10 edges
9. `ErrorCode` - 8 edges
10. `KaamPay – Development Roadmap (Step-by-Step)` - 8 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/login/page.tsx → hooks/useAuth.ts
- `RegisterForm()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/register/page.tsx → hooks/useAuth.ts
- `DashboardPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/dashboard/page.tsx → hooks/useAuth.ts
- `DashboardPage()` --calls--> `useAuthStore`  [EXTRACTED]
  app/dashboard/page.tsx → store/auth.store.ts
- `RegisterForm()` --calls--> `useAuth()`  [EXTRACTED]
  components/RegisterForm.tsx → hooks/useAuth.ts

## Communities (95 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.50
Nodes (4): 9.1 Complete Stack Overview, 9.2 Development Tools, 9.3 Stack Justification, 9. Technology Stack

### Community 1 - "Community 1"
Cohesion: 0.50
Nodes (4): ══════════════════════════════════════════════════════════════, Document Control, Revision History, Table of Contents

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (32): active, bases:Create new base, canvas:Create new canvas, command-palette:Open command palette, daily-notes:Open today's daily note, graph:Open graph view, smart-context:Smart Context: Copy to Clipboard (select depth), smart-context:Smart Context: List Named Contexts (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (31): audio-recorder, backlink, bases, bookmarks, canvas, command-palette, daily-notes, editor-status (+23 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (20): centerStrength, close, collapse-color-groups, collapse-display, collapse-filter, collapse-forces, colorGroups, hideUnresolved (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (32): code:block1 (✅ MVP Features (Build First):), code:block10 (Build Sequence:), code:block11 (├── Axios for API calls), code:block12 (├── Test all API endpoints using Postman), code:block13 (Deployment Stack:), code:block14 (Day 1-2:  Finalize MVP feature list (what to build, what to ), code:block2 (Collections:), code:block3 (Key Screens to Design:) (+24 more)

### Community 21 - "Community 21"
Cohesion: 0.11
Nodes (17): ══════════════════════════════════════════════════════════════, 11.2 API Endpoint Inventory, 12.1 Design System, 12.2 Page Inventory, 12. UI/UX Requirements & Wireframe Guidelines, 19. Risk Assessment & Mitigation, 23. Glossary, Admin API (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.09
Nodes (21): 1. Cleanup Redundant Code (Backend), 2. Frontend Login Redirection (Next.js), 3. Unified Dashboard Architecture (Frontend), 4. Frontend Security & Authorization Popups, 5. Backend RBAC Middleware (Express), Automated / Manual Testing, code:typescript (import { toNodeHandler } from 'better-auth/node';), code:typescript (const handleLogin = async () => {) (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.09
Nodes (22): dependencies, axios, better-auth, cloudinary, cors, dotenv, express, framer-motion (+14 more)

### Community 26 - "Community 26"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (6): AuthService, toPublicUser(), AuthenticatedUser, PublicUser, UserRole, Request

### Community 29 - "Community 29"
Cohesion: 0.06
Nodes (32): devDependencies, eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier, husky, lint-staged, prettier (+24 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, esModuleInterop, lib, module, moduleResolution, noEmit, outDir (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (17): 1. UI Architecture & Theme, 2. The Onboarding Steps Flow, 3. Backend Integration, Automated / Manual Testing, Freelancer Onboarding Implementation Plan, [MODIFY] `prisma/schema.prisma`, [NEW] `app/onboarding/page.tsx`, [NEW] `backend/src/modules/users/user.controller.ts` (+9 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (15): 1. Database Logic & Schema, 2. Backend Architecture (Express API), 3. Frontend Architecture (Next.js), Architecture Overview, Better Auth Implementation Architecture Plan, code:prisma (// Core Better Auth Models), code:text (backend/), code:text (app/) (+7 more)

### Community 37 - "Community 37"
Cohesion: 0.06
Nodes (14): OnboardingData, SplitScreenLayoutProps, STEP_INFOS, RULES, Step1Props, Step1Props, EXPERIENCE_OPTIONS, Step2Props (+6 more)

### Community 38 - "Community 38"
Cohesion: 0.12
Nodes (16): authClient, RegisterForm(), RoleGuardProps, DashboardPage(), SessionUser, LoginPayload, RegisterPayload, useAuth() (+8 more)

### Community 40 - "Community 40"
Cohesion: 0.16
Nodes (8): createGig, getAllGigs, getMyGigs, rateLimitStore, router, GigService, CreateGigInput, createGigSchema

### Community 41 - "Community 41"
Cohesion: 0.15
Nodes (13): 24. Appendices, Appendix A: Folder Structure, Appendix B: User Flow Diagrams, Appendix C: Revenue Model Summary, Appendix D: Acceptance Criteria Template, B.1: Registration Flow, B.2: Gig Purchase Flow, B.3: Freelancer Earning Flow (+5 more)

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (11): 10. Performance, Refinement & Deployment, 1. Project Setup & Environment Configuration, 2. Database Schema & Data Models Design, 3. Backend Authentication & Authorization Core, 4. Frontend Foundation & Authentication UI, 5. Gig Management (Freelancer Flow), 6. Client Discovery & Ordering Flow, 7. Order Lifecycle, Revisions & Submissions (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.18
Nodes (10): 1. Overview, 2. Objectives, 3.1. Public Profile View, 3.2. Edit Profile Flow (Owner Only), 3.3. Backend Integration (API Route), 3. Features & Requirements, 4. Technical Stack, 5. UI/UX Guidelines (+2 more)

### Community 51 - "Community 51"
Cohesion: 0.20
Nodes (10): 18.1 Overview, 18.2 Sprint Breakdown (Phase 1 — MVP), 18.3 Total Estimated Effort, 18. Development Roadmap & Sprint Plan, Sprint 1: Foundation (Week 1), Sprint 2: Profiles & Gigs (Week 2), Sprint 3: Orders & Workflow (Week 3), Sprint 4: Chat & Reviews (Week 4) (+2 more)

### Community 52 - "Community 52"
Cohesion: 0.08
Nodes (26): 6.1 Module 1: User Authentication & Verification, 6.2 Module 2: Profile Management, 6.3 Module 3: Gig Management, 6.4 Module 4: Order Lifecycle Management, 6.5 Module 5: Payment System, 6.6 Module 6: Real-Time Chat System, 6.7 Module 7: Ratings & Reviews, 6.8 Module 8: Admin Panel (+18 more)

### Community 57 - "Community 57"
Cohesion: 0.32
Nodes (7): AppError, ErrorCode, STATUS_TO_CODE, errorHandler(), ErrorResponse, handleJwtExpiredError(), handleJwtInvalidError()

### Community 58 - "Community 58"
Cohesion: 0.25
Nodes (8): 4.1 Primary User Segments, 4.2 Detailed User Personas, 4.3 User Roles & Permissions, 4. Target Audience & User Personas, Persona 1: Aarav — The College Student (Freelancer), Persona 2: Sunita — The Homemaker (Freelancer), Persona 3: Rohit — The Small Business Owner (Client), Persona 4: Admin — Platform Moderator

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (7): code:bash (npm run dev), code:bash (app/page.tsx), Deployment, Development, Getting Started, Learn More, Next.js Application

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (5): { config }, envPath, PORT, { resolve }, result

### Community 65 - "Community 65"
Cohesion: 0.29
Nodes (7): 7.1 Performance, 7.2 Security, 7.3 Scalability, 7.4 Usability, 7.5 Reliability, 7.6 Maintainability, 7. Non-Functional Requirements

### Community 70 - "Community 70"
Cohesion: 0.20
Nodes (5): Auth, globalForPrisma, allowedOrigins, app, handler

### Community 71 - "Community 71"
Cohesion: 0.33
Nodes (6): 12.3 Key Page Layouts, 12.4 Responsive Breakpoints, code:block8 (┌───────────────────────────────────────────────────────────), code:block9 (┌──────────────────────────────┐), Gig Card Component, Landing Page Structure

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (6): 17.1 Environment Configuration, 17.2 Deployment Architecture, 17.3 Environment Variables, 17. Deployment Strategy, code:text (┌──────────────────────┐     ┌──────────────────────┐), code:env (# ─── Backend (.env) ───)

### Community 73 - "Community 73"
Cohesion: 0.20
Nodes (7): updateFreelancerProfile, rateLimitStore, router, requireAuth(), router, completeFreelancerOnboarding, router

### Community 74 - "Community 74"
Cohesion: 0.08
Nodes (20): AppNavbar(), AppNavbarProps, categories, Features(), Footer(), Hero(), Navbar(), Search() (+12 more)

### Community 75 - "Community 75"
Cohesion: 0.40
Nodes (3): inter, manrope, metadata

### Community 76 - "Community 76"
Cohesion: 0.40
Nodes (4): LoginInput, loginSchema, RegisterInput, registerSchema

### Community 77 - "Community 77"
Cohesion: 0.40
Nodes (5): 13.1 Authentication Security, 13.2 API Security, 13.3 Payment Security, 13.4 Data Privacy, 13. Security Requirements

### Community 78 - "Community 78"
Cohesion: 0.40
Nodes (5): 11.3 Standard API Response Formats, code:JSON, code:JSON, Error Response:, Success Response:

### Community 79 - "Community 79"
Cohesion: 0.40
Nodes (5): 10.1 Entity-Relationship Diagram (Conceptual), 10.2 Detailed Schema (Prisma Schema), 10. Database Design, code:block4 (┌──────────────────┐        1:N        ┌──────────────────┐ ), code:prisma (// schema.prisma)

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (5): 1.1 Product Name, 1.2 Product Type, 1.3 One-Line Description, 1.4 Summary, 1. Executive Summary

### Community 81 - "Community 81"
Cohesion: 0.40
Nodes (5): 3.1 Vision, 3.2 Mission, 3.3 Product Goals, 3.4 Design Principles, 3. Product Vision, Mission & Goals

### Community 88 - "Community 88"
Cohesion: 0.22
Nodes (8): embedding_models, default_model_key, is_obsidian_vault, language, new_user, re_import_wait_time, smart_notices, version

### Community 91 - "Community 91"
Cohesion: 0.50
Nodes (4): 15.2 Socket Events, 15.3 Chat Rules, 15.Chat System Design, code:block11 (Client A (Browser)                    Client B (Browser))

### Community 92 - "Community 92"
Cohesion: 0.50
Nodes (4): 2.1 Problem Description, 2.2 Impact Analysis, 2.3 Expected Outcomes, 2. Problem Statement

### Community 93 - "Community 93"
Cohesion: 0.50
Nodes (4): 5.1 In-Scope (Phase 1 — MVP), 5.2 Out-of-Scope (Phase 2+), 5.3 MVP Success Criteria, 5. Scope Definition & MVP Boundary

### Community 94 - "Community 94"
Cohesion: 0.50
Nodes (4): 8.1 Architecture Overview, 8.2 Architecture Decisions, 8. System Architecture, code:block3 (┌───────────────────────────────────────────────────────────)

### Community 97 - "Community 97"
Cohesion: 0.22
Nodes (9): adapter, transformers, smart_sources, embed_model, excluded_headings, file_exclusions, folder_exclusions, min_chars (+1 more)

### Community 100 - "Community 100"
Cohesion: 0.67
Nodes (3): 16.1 Testing Levels, 16.2 Critical Test Scenarios, 16. Testing Strategy

### Community 101 - "Community 101"
Cohesion: 0.67
Nodes (3): 20.1 MVP Launch Criteria, 20.2 Post-Launch KPIs (For Production), 20. Success Metrics & KPIs

### Community 102 - "Community 102"
Cohesion: 0.67
Nodes (3): 21.1 Competitive Landscape, 21.2 SkillPay's Competitive Advantages, 21. Competitive Analysis

### Community 103 - "Community 103"
Cohesion: 0.67
Nodes (3): 14.1 End-to-End Payment Flow, 14. Payment Flow & Escrow Logic, code:text (Step 1: Client clicks "Order Now" on a gig)

### Community 104 - "Community 104"
Cohesion: 0.67
Nodes (3): 22. Future Roadmap (Phase 2+), Phase 2 (Post-MVP — 4 Weeks), Phase 3 (Scale — Ongoing)

### Community 125 - "Community 125"
Cohesion: 0.52
Nodes (3): UserService, FreelancerOnboardingInput, freelancerOnboardingSchema

### Community 135 - "Community 135"
Cohesion: 0.32
Nodes (5): getMe, router, ErrorBody, sendSuccess(), SuccessResponse

### Community 147 - "Community 147"
Cohesion: 0.33
Nodes (5): FreelancerService, FreelancerProfileUpdateInput, freelancerProfileUpdateSchema, AsyncHandler, catchAsync()

### Community 153 - "Community 153"
Cohesion: 0.33
Nodes (6): event_logs, native_notice_attention, native_notice_error, native_notice_info, native_notice_milestone, native_notice_warning

### Community 171 - "Community 171"
Cohesion: 0.50
Nodes (4): adapter, ollama, smart_chat_threads, chat_model

### Community 172 - "Community 172"
Cohesion: 0.50
Nodes (4): context_items, template_after, template_before, template_preset

### Community 173 - "Community 173"
Cohesion: 0.50
Nodes (4): lookup_lists, results_collection_key, results_limit, score_algo_key

### Community 174 - "Community 174"
Cohesion: 0.50
Nodes (4): smart_contexts, template_after, template_before, template_preset

### Community 175 - "Community 175"
Cohesion: 0.50
Nodes (4): smart_view_filter, expanded_view, render_markdown, show_full_path

### Community 197 - "Community 197"
Cohesion: 0.67
Nodes (3): models, chat_completion_platform, embedding_platform

### Community 198 - "Community 198"
Cohesion: 0.67
Nodes (3): smart_blocks, embed_blocks, min_chars

### Community 224 - "Community 224"
Cohesion: 0.50
Nodes (3): [2026-05-29] Freelancer Profile Page Redesign & Git Setup Fixes, [2026-05-29] Gig & Project Creation Feature (Backend, Cloudinary, and Frontend), Action Register

## Knowledge Gaps
- **440 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+435 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `══════════════════════════════════════════════════════════════` connect `Community 1` to `Community 0`, `Community 65`, `Community 79`, `Community 80`, `Community 81`, `Community 52`, `Community 21`, `Community 58`, `Community 92`, `Community 93`, `Community 94`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `6. Functional Requirements` connect `Community 52` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `24. Appendices` connect `Community 41` to `Community 21`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _440 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Community 9` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._