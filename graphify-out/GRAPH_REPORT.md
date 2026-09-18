# Graph Report - Kaam_Pay  (2026-09-18)

## Corpus Check
- 151 files · ~37,442 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 995 nodes · 1330 edges · 119 communities (89 shown, 30 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7e4097d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_post-merge|post-merge]]
- [[_COMMUNITY_post-rewrite|post-rewrite]]
- [[_COMMUNITY_pre-applypatch|pre-applypatch]]
- [[_COMMUNITY_pre-auto-gc|pre-auto-gc]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_pre-commit|pre-commit]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_pre-merge-commit|pre-merge-commit]]
- [[_COMMUNITY_pre-push|pre-push]]
- [[_COMMUNITY_pre-rebase|pre-rebase]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 125|Community 125]]
- [[_COMMUNITY_Community 131|Community 131]]
- [[_COMMUNITY_Community 132|Community 132]]
- [[_COMMUNITY_Community 147|Community 147]]
- [[_COMMUNITY_Community 224|Community 224]]

## God Nodes (most connected - your core abstractions)
1. `AppError` - 22 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 16 edges
4. `compilerOptions` - 15 edges
5. `useAuth()` - 13 edges
6. `══════════════════════════════════════════════════════════════` - 13 edges
7. `══════════════════════════════════════════════════════════════` - 13 edges
8. `ErrorCode` - 12 edges
9. `Gig` - 11 edges
10. `hiddenItems` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ChatWindow()` --calls--> `useChat()`  [EXTRACTED]
  components/chat/ChatWindow.tsx → hooks/useChat.ts
- `BookmarkBtnProps` --references--> `Gig`  [EXTRACTED]
  components/find-work/BookmarkBtn.tsx → types/gig.ts
- `GigCardProps` --references--> `Gig`  [EXTRACTED]
  components/find-work/GigCard.tsx → types/gig.ts
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/login/page.tsx → hooks/useAuth.ts
- `RegisterForm()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/register/page.tsx → hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (119 total, 30 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (26): FindWorkPage(), BookmarkBtn(), BookmarkBtnProps, DEFAULT_FILTERS, FilterDrawer(), FilterDrawerProps, Filters, FullModal() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (21): AttachmentPreview(), AttachmentPreviewProps, ChatWindow(), ChatWindowProps, OtherUser, MessageBubble(), MessageBubbleProps, PresenceDot() (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.20
Nodes (10): 6.2 Module 2: Profile Management, 6.5 Module 5: Payment System, 6.7 Module 7: Ratings & Reviews, 6.8 Module 8: Admin Panel, 6.9 Module 9: Notifications (Basic), code:block2 (+----------------------+), FR-5.2: Escrow Flow, 6.6 Module 6: Real-Time Chat System (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (27): active, bases:Create new base, canvas:Create new canvas, command-palette:Open command palette, daily-notes:Open today's daily note, graph:Open graph view, smart-context:Smart Context: Copy to Clipboard (select depth), smart-context:Smart Context: List Named Contexts (+19 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (31): audio-recorder, backlink, bases, bookmarks, canvas, command-palette, daily-notes, editor-status (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.27
Nodes (9): getCategoriesController, getFreelancerDetailsController, getGigDetailsController, searchFreelancersController, searchGigsController, FreelancerSearchInput, freelancerSearchSchema, GigSearchInput (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (29): dependencies, axios, better-auth, cloudinary, cors, dotenv, express, framer-motion (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (20): centerStrength, close, collapse-color-groups, collapse-display, collapse-filter, collapse-forces, colorGroups, hideUnresolved (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (15): kafka, kafkaConsumer, kafkaProducer, pubClient, subClient, AttachmentPayload, ChatMessagePayload, handleChatMessage() (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (11): 10. Performance, Refinement & Deployment, 1. Project Setup & Environment Configuration, 2. Database Schema & Data Models Design, 3. Backend Authentication & Authorization Core, 4. Frontend Foundation & Authentication UI, 5. Gig Management (Freelancer Flow), 6. Client Discovery & Ordering Flow, 7. Order Lifecycle, Revisions & Submissions (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (32): code:block1 (✅ MVP Features (Build First):), code:block10 (Build Sequence:), code:block11 (├── Axios for API calls), code:block12 (├── Test all API endpoints using Postman), code:block13 (Deployment Stack:), code:block14 (Day 1-2:  Finalize MVP feature list (what to build, what to ), code:block2 (Collections:), code:block3 (Key Screens to Design:) (+24 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (10): 18.1 Overview, Sprint 1: Foundation (Week 1), Sprint 3: Orders & Workflow (Week 3), Sprint 4: Chat & Reviews (Week 4), Sprint 5: Payments & Admin (Week 5), Sprint 6: Polish & Deploy (Week 6), 18.2 Sprint Breakdown (Phase 1 — MVP), 18.3 Total Estimated Effort (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.27
Nodes (10): ALLOWED_MIMES, CloudinaryResult, fileFilter(), getFileType(), getResourceType(), uploadMiddleware, uploadToCloudinary(), getChatHistory() (+2 more)

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (7): 7.1 Performance, 7.4 Usability, 7.5 Reliability, 7.6 Maintainability, 7. Non-Functional Requirements, 7.2 Security, 7.3 Scalability

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (7): adapter, FREELANCERS, FreelancerSeed, GIGS, GigSeed, pool, prisma

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (4): globalForPrisma, FreelancerSearchFilters, GigSearchFilters, prisma

### Community 18 - "Community 18"
Cohesion: 0.40
Nodes (5): 10.1 Entity-Relationship Diagram (Conceptual), 10.2 Detailed Schema (Prisma Schema), code:prisma (// schema.prisma), 10. Database Design, code:block4 (┌──────────────────┐        1:N        ┌──────────────────┐ )

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (20): ══════════════════════════════════════════════════════════════, 11. API Design & Endpoints, 12. UI/UX Requirements & Wireframe Guidelines, 23. Glossary, PRODUCT REQUIREMENT DOCUMENT (PRD), Reviews API, SkillPay — India's Hyper-Local, Users API (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.09
Nodes (21): 1. Cleanup Redundant Code (Backend), 2. Frontend Login Redirection (Next.js), 3. Unified Dashboard Architecture (Frontend), 4. Frontend Security & Authorization Popups, 5. Backend RBAC Middleware (Express), Automated / Manual Testing, code:typescript (import { toNodeHandler } from 'better-auth/node';), code:typescript (const handleLogin = async () => {) (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.06
Nodes (36): husky.sh script, lint-staged, lint-staged, devDependencies, eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier (+28 more)

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (5): 1.2 Product Type, 1.3 One-Line Description, 1.4 Summary, 1. Executive Summary, 1.1 Product Name

### Community 25 - "Community 25"
Cohesion: 0.40
Nodes (5): 3.2 Mission, 3.3 Product Goals, 3.4 Design Principles, 3.1 Vision, 3. Product Vision, Mission & Goals

### Community 26 - "Community 26"
Cohesion: 0.07
Nodes (32): compilerOptions, esModuleInterop, lib, module, moduleResolution, noEmit, paths, resolveJsonModule (+24 more)

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (4): 15.2 Socket Events, 15.3 Chat Rules, 15.Chat System Design, code:block11 (Client A (Browser)                    Client B (Browser))

### Community 28 - "Community 28"
Cohesion: 0.32
Nodes (7): AuthService, toPublicUser(), AuthenticatedUser, PublicUser, UserRole, Express, Request

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (17): compilerOptions, baseUrl, esModuleInterop, lib, module, moduleResolution, noEmit, outDir (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (17): 1. UI Architecture & Theme, 2. The Onboarding Steps Flow, 3. Backend Integration, Automated / Manual Testing, Freelancer Onboarding Implementation Plan, [MODIFY] `prisma/schema.prisma`, [NEW] `app/onboarding/page.tsx`, [NEW] `backend/src/modules/users/user.controller.ts` (+9 more)

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (17): 8. System Architecture, ══════════════════════════════════════════════════════════════, 9.2 Development Tools, 9.3 Stack Justification, code:block3 (┌───────────────────────────────────────────────────────────), Document Control, 2.1 Problem Description, 2.2 Impact Analysis (+9 more)

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (6): 6.3 Module 3: Gig Management, FR-3.4: Gig Detail Page, FR-3.5: Manage Gigs (Freelancer), FR-3.1: Create Gig (Freelancer Only), FR-3.2: Gig Categories, FR-3.3: Browse & Search Gigs

### Community 36 - "Community 36"
Cohesion: 0.16
Nodes (13): 1. Database Logic & Schema, 2. Backend Architecture (Express API), 3. Frontend Architecture (Next.js), Architecture Overview, Better Auth Implementation Architecture Plan, code:prisma (// Core Better Auth Models), code:text (backend/), code:text (app/) (+5 more)

### Community 37 - "Community 37"
Cohesion: 0.09
Nodes (20): OnboardingData, OnboardingPage(), SplitScreenLayout(), SplitScreenLayoutProps, STEP_INFOS, RULES, Step1_Rules(), Step1Props (+12 more)

### Community 38 - "Community 38"
Cohesion: 0.08
Nodes (34): LoginPage(), RegisterForm(), RegisterPage(), CreateGigPage(), SessionUser, DashboardPage(), SessionUser, FreelancerProfileContent() (+26 more)

### Community 40 - "Community 40"
Cohesion: 0.20
Nodes (7): createGig, getAllGigs, getMyGigs, rateLimitStore, GigService, CreateGigInput, createGigSchema

### Community 41 - "Community 41"
Cohesion: 0.15
Nodes (13): 24. Appendices, Appendix A: Folder Structure, Appendix D: Acceptance Criteria Template, B.1: Registration Flow, code:text (skillpay/), Appendix B: User Flow Diagrams, Appendix C: Revenue Model Summary, B.2: Gig Purchase Flow (+5 more)

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (11): 10. Performance, Refinement & Deployment, 1. Project Setup & Environment Configuration, 2. Database Schema & Data Models Design, 3. Backend Authentication & Authorization Core, 4. Frontend Foundation & Authentication UI, 5. Gig Management (Freelancer Flow), 6. Client Discovery & Ordering Flow, 7. Order Lifecycle, Revisions & Submissions (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): 14.2 MVP Payment Simplification, 14. Payment Flow & Escrow Logic, 14.1 End-to-End Payment Flow, code:text (Step 1: Client clicks "Order Now" on a gig)

### Community 46 - "Community 46"
Cohesion: 0.18
Nodes (10): 1. Overview, 2. Objectives, 3.1. Public Profile View, 3.2. Edit Profile Flow (Owner Only), 3.3. Backend Integration (API Route), 3. Features & Requirements, 4. Technical Stack, 5. UI/UX Guidelines (+2 more)

### Community 47 - "Community 47"
Cohesion: 0.67
Nodes (3): 21.2 SkillPay's Competitive Advantages, 21. Competitive Analysis, 21.1 Competitive Landscape

### Community 48 - "Community 48"
Cohesion: 0.67
Nodes (3): 22. Future Roadmap (Phase 2+), Phase 3 (Scale — Ongoing), Phase 2 (Post-MVP — 4 Weeks)

### Community 50 - "Community 50"
Cohesion: 0.40
Nodes (5): 6.4 Module 4: Order Lifecycle Management, FR-4.1: Order Placement, code:block1 (PENDING), FR-4.2: Order Status State Machine, FR-4.3: Order Management

### Community 52 - "Community 52"
Cohesion: 0.40
Nodes (5): FR-1.1: User Registration, 6.1 Module 1: User Authentication & Verification, FR-1.2: User Login, FR-1.3: Identity Verification, FR-1.4: Role-Based Access Control

### Community 57 - "Community 57"
Cohesion: 0.33
Nodes (7): AppError, ErrorCode, STATUS_TO_CODE, errorHandler(), ErrorResponse, handleJwtExpiredError(), handleJwtInvalidError()

### Community 58 - "Community 58"
Cohesion: 0.25
Nodes (8): 4. Target Audience & User Personas, Persona 1: Aarav — The College Student (Freelancer), Persona 3: Rohit — The Small Business Owner (Client), 4.1 Primary User Segments, 4.2 Detailed User Personas, 4.3 User Roles & Permissions, Persona 2: Sunita — The Homemaker (Freelancer), Persona 4: Admin — Platform Moderator

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (7): code:bash (npm run dev), code:bash (app/page.tsx), Deployment, Development, Getting Started, Learn More, Next.js Application

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (5): { config }, envPath, PORT, { resolve }, result

### Community 70 - "Community 70"
Cohesion: 0.13
Nodes (17): allowedOrigins, app, handler, requireAuth(), Auth, router, router, updateFreelancerProfile (+9 more)

### Community 71 - "Community 71"
Cohesion: 0.33
Nodes (6): 12.3 Key Page Layouts, Landing Page Structure, 12.4 Responsive Breakpoints, code:block8 (┌───────────────────────────────────────────────────────────), code:block9 (┌──────────────────────────────┐), Gig Card Component

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (6): 17.1 Environment Configuration, 17.2 Deployment Architecture, 17.3 Environment Variables, 17. Deployment Strategy, code:text (┌──────────────────────┐     ┌──────────────────────┐), code:env (# ─── Backend (.env) ───)

### Community 74 - "Community 74"
Cohesion: 0.26
Nodes (8): Home(), categories, Features(), Hero(), Navbar(), Search(), SearchProps, testimonials

### Community 75 - "Community 75"
Cohesion: 0.53
Nodes (4): inter, manrope, metadata, RootLayout()

### Community 76 - "Community 76"
Cohesion: 0.40
Nodes (4): LoginInput, loginSchema, RegisterInput, registerSchema

### Community 77 - "Community 77"
Cohesion: 0.40
Nodes (5): 13.3 Payment Security, 13.4 Data Privacy, 13.1 Authentication Security, 13.2 API Security, 13. Security Requirements

### Community 78 - "Community 78"
Cohesion: 0.40
Nodes (6): 11.3 Standard API Response Formats, code:JSON, code:JSON, code:JSON, Error Response:, Success Response:

### Community 88 - "Community 88"
Cohesion: 0.05
Nodes (44): adapter, ollama, context_items, template_before, template_preset, transformers, embedding_models, default_model_key (+36 more)

### Community 93 - "Community 93"
Cohesion: 0.50
Nodes (4): 5.3 MVP Success Criteria, 5. Scope Definition & MVP Boundary, 5.1 In-Scope (Phase 1 — MVP), 5.2 Out-of-Scope (Phase 2+)

### Community 100 - "Community 100"
Cohesion: 0.67
Nodes (3): 16.1 Testing Levels, 16.2 Critical Test Scenarios, 16. Testing Strategy

### Community 101 - "Community 101"
Cohesion: 0.67
Nodes (3): 20. Success Metrics & KPIs, 20.1 MVP Launch Criteria, 20.2 Post-Launch KPIs (For Production)

### Community 125 - "Community 125"
Cohesion: 0.21
Nodes (9): ErrorBody, sendSuccess(), SuccessResponse, AsyncHandler, catchAsync(), getMe, UserService, FreelancerOnboardingInput (+1 more)

### Community 147 - "Community 147"
Cohesion: 0.52
Nodes (3): FreelancerService, FreelancerProfileUpdateInput, freelancerProfileUpdateSchema

### Community 224 - "Community 224"
Cohesion: 0.40
Nodes (4): [2026-05-29] Freelancer Profile Page Redesign & Git Setup Fixes, [2026-05-29] Gig & Project Creation Feature (Backend, Cloudinary, and Frontend), [2026-06-01] Custom Agent Framework & Client Discovery Backend, Action Register

## Knowledge Gaps
- **447 isolated node(s):** `husky.sh script`, `app`, `allowedOrigins`, `CloudinaryResult`, `SuccessResponse` (+442 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 8` to `Community 23`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `axios` connect `Community 8` to `Community 38`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `app`, `allowedOrigins` to the rest of the system?**
  _449 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08465608465608465 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._