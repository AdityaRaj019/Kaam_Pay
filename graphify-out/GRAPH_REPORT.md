# Graph Report - Kaam_Pay (2026-09-18)

## Corpus Check

- 160 files · ~45,322 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 578 nodes · 872 edges · 61 communities (38 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `a9248a17`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_AppError|AppError]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_prisma.ts|prisma.ts]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_auth.middleware.ts|auth.middleware.ts]]
- [[_COMMUNITY_useAuth.ts|useAuth.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_client.controller.ts|client.controller.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_chat.controller.ts|chat.controller.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_💼 KaamPay — Professional Freelance Marketplace for India|💼 KaamPay — Professional Freelance Marketplace for India]]
- [[_COMMUNITY_Context State - KaamPay (June 2026)|Context State - KaamPay (June 2026)]]
- [[_COMMUNITY_auth.service.ts|auth.service.ts]]
- [[_COMMUNITY_seed-gigs.ts|seed-gigs.ts]]
- [[_COMMUNITY_Action Register|Action Register]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_auth.validation.ts|auth.validation.ts]]
- [[_COMMUNITY_server.ts|server.ts]]
- [[_COMMUNITY_Button.tsx|Button.tsx]]
- [[_COMMUNITY_h|h]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_applypatch-msg|applypatch-msg]]
- [[_COMMUNITY_commit-msg|commit-msg]]
- [[_COMMUNITY_post-applypatch|post-applypatch]]
- [[_COMMUNITY_post-checkout|post-checkout]]
- [[_COMMUNITY_post-checkout|post-checkout]]
- [[_COMMUNITY_post-commit|post-commit]]
- [[_COMMUNITY_post-commit|post-commit]]
- [[_COMMUNITY_post-merge|post-merge]]
- [[_COMMUNITY_post-rewrite|post-rewrite]]
- [[_COMMUNITY_pre-applypatch|pre-applypatch]]
- [[_COMMUNITY_pre-auto-gc|pre-auto-gc]]
- [[_COMMUNITY_pre-commit|pre-commit]]
- [[_COMMUNITY_pre-merge-commit|pre-merge-commit]]
- [[_COMMUNITY_pre-push|pre-push]]
- [[_COMMUNITY_pre-rebase|pre-rebase]]
- [[_COMMUNITY_prepare-commit-msg|prepare-commit-msg]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]
- [[_COMMUNITY_sendResponse|sendResponse]]
- [[_COMMUNITY_{ signIn, signUp, signOut, useSession }|{ signIn, signUp, signOut, useSession }]]

## God Nodes (most connected - your core abstractions)

1. `AppError` - 21 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 14 edges
4. `api` - 14 edges
5. `ErrorCode` - 12 edges
6. `Gig` - 11 edges
7. `useAuth()` - 10 edges
8. `requireAuth()` - 8 edges
9. `getSocket()` - 8 edges
10. `connectSocket()` - 8 edges

## Surprising Connections (you probably didn't know these)

- `LoginPage()` --calls--> `useAuth()` [EXTRACTED]
  app/(auth)/login/page.tsx → hooks/useAuth.ts
- `RegisterForm()` --calls--> `useAuth()` [EXTRACTED]
  app/(auth)/register/page.tsx → hooks/useAuth.ts
- `BookmarkBtnProps` --references--> `Gig` [EXTRACTED]
  components/find-work/BookmarkBtn.tsx → types/gig.ts
- `GigCardProps` --references--> `Gig` [EXTRACTED]
  components/find-work/GigCard.tsx → types/gig.ts
- `DashboardPage()` --calls--> `useAuth()` [EXTRACTED]
  app/dashboard/page.tsx → hooks/useAuth.ts

## Import Cycles

- None detected.

## Communities (61 total, 23 thin omitted)

### Community 0 - "page.tsx"

Cohesion: 0.06
Nodes (58): FindWorkPage(), Conversation, MessagesContent(), OtherUser, AppNavbar(), AppNavbarProps, AttachmentPreview(), AttachmentPreviewProps (+50 more)

### Community 1 - "AppError"

Cohesion: 0.08
Nodes (29): ErrorBody, sendSuccess(), SuccessResponse, AsyncHandler, catchAsync(), AppError, ErrorCode, STATUS_TO_CODE (+21 more)

### Community 2 - "dependencies"

Cohesion: 0.05
Nodes (41): dependencies, axios, better-auth, cors, dotenv, express, framer-motion, helmet (+33 more)

### Community 3 - "prisma.ts"

Cohesion: 0.07
Nodes (20): kafka, kafkaConsumer, kafkaProducer, globalForPrisma, pubClient, subClient, AttachmentPayload, ChatMessagePayload (+12 more)

### Community 4 - "page.tsx"

Cohesion: 0.07
Nodes (19): OnboardingData, SplitScreenLayout(), SplitScreenLayoutProps, STEP_INFOS, RULES, Step1_Rules(), Step1Props, Step1Props (+11 more)

### Community 5 - "page.tsx"

Cohesion: 0.09
Nodes (15): SessionUser, FullUser, Gig, UserProfile, categories, Features(), Footer(), Hero() (+7 more)

### Community 6 - "auth.middleware.ts"

Cohesion: 0.11
Nodes (20): allowedOrigins, app, authorize(), requireAuth(), Auth, getMe, router, router (+12 more)

### Community 7 - "useAuth.ts"

Cohesion: 0.16
Nodes (14): LoginPage(), RegisterForm(), DashboardPage(), SessionUser, RegisterForm(), LoginPayload, RegisterPayload, useAuth() (+6 more)

### Community 8 - "devDependencies"

Cohesion: 0.09
Nodes (21): husky.sh script, devDependencies, eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier, husky, lint-staged (+13 more)

### Community 9 - "client.controller.ts"

Cohesion: 0.13
Nodes (12): getCategoriesController, getFreelancerDetailsController, getGigDetailsController, searchFreelancersController, searchGigsController, ClientService, FreelancerSearchFilters, GigSearchFilters (+4 more)

### Community 10 - "compilerOptions"

Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "chat.controller.ts"

Cohesion: 0.21
Nodes (13): ALLOWED_MIMES, CloudinaryResult, fileFilter(), getFileType(), getResourceType(), uploadMiddleware, uploadToCloudinary(), downloadChatAttachment() (+5 more)

### Community 12 - "compilerOptions"

Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, esModuleInterop, lib, module, moduleResolution, noEmit, outDir (+9 more)

### Community 13 - "💼 KaamPay — Professional Freelance Marketplace for India"

Cohesion: 0.11
Nodes (17): 🔍 1. Client Discovery & Marketplace (`/find-work`), 1. Configure Environment Variables, 🎨 2. Freelancer Workspace & Gig Creation (`/dashboard/create-gig`), 2. Install Dependencies, 3. Initialize Database Migrations & Seeds, 👤 3. Profile Customization & Onboarding (`/profile` & `/onboarding`), 4. Run Development Servers, 🔑 4. Session & Authentication Core (+9 more)

### Community 14 - "Context State - KaamPay (June 2026)"

Cohesion: 0.12
Nodes (16): 🏗️ 1. Complete System Architecture & Tech Stack, 📁 2. Folder-by-Folder Directory Analysis, 🛠️ 3. Feature-by-Feature Implementation State, 📊 4. Graphify Structural Insights (From `graphify-out/`), 📜 5. Operational Conventions & Development Rules, Asynchronous Safety, Context State - KaamPay (June 2026), 🗃️ Database & Seeding (+8 more)

### Community 15 - "auth.service.ts"

Cohesion: 0.29
Nodes (7): AuthService, toPublicUser(), AuthenticatedUser, PublicUser, UserRole, Express, Request

### Community 16 - "seed-gigs.ts"

Cohesion: 0.20
Nodes (7): adapter, FREELANCERS, FreelancerSeed, GIGS, GigSeed, pool, prisma

### Community 17 - "Action Register"

Cohesion: 0.33
Nodes (5): [2026-05-29] Freelancer Profile Page Redesign & Git Setup Fixes, [2026-05-29] Gig & Project Creation Feature (Backend, Cloudinary, and Frontend), [2026-09-18] Real-Time Chat Debugging & Media Download Enhancements, [2026-09-18] Real-Time Messaging, Notification Integration & Messages Page, Action Register

### Community 18 - "layout.tsx"

Cohesion: 0.40
Nodes (3): inter, manrope, metadata

### Community 19 - "auth.validation.ts"

Cohesion: 0.40
Nodes (4): LoginInput, loginSchema, RegisterInput, registerSchema

### Community 20 - "server.ts"

Cohesion: 0.40
Nodes (4): { config }, envPath, { resolve }, result

## Knowledge Gaps

- **202 isolated node(s):** `husky.sh script`, `SessionUser`, `SessionUser`, `manrope`, `inter` (+197 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `chat.controller.ts`?**
  _High betweenness centrality (0.280) - this node is a cross-community bridge._
- **Why does `axios` connect `dependencies` to `page.tsx`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **Why does `cloudinary` connect `chat.controller.ts` to `dependencies`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `SessionUser`, `SessionUser` to the rest of the system?**
  _204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.055651176133103844 - nodes in this community are weakly interconnected._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.0780399274047187 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
