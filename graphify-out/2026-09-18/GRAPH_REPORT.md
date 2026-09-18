# Graph Report - Kaam_Pay (2026-09-18)

## Corpus Check

- 169 files · ~47,625 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 627 nodes · 1008 edges · 67 communities (44 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `0a489306`
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
- [[_COMMUNITY_order.controller.ts|order.controller.ts]]
- [[_COMMUNITY_AppError|AppError]]
- [[_COMMUNITY_useAuth|useAuth]]
- [[_COMMUNITY_AppError.ts|AppError.ts]]
- [[_COMMUNITY_notification.controller.ts|notification.controller.ts]]
- [[_COMMUNITY_user.controller.ts|user.controller.ts]]

## God Nodes (most connected - your core abstractions)

1. `AppError` - 25 edges
2. `compilerOptions` - 16 edges
3. `ErrorCode` - 15 edges
4. `compilerOptions` - 14 edges
5. `api` - 14 edges
6. `ChatService` - 11 edges
7. `NotificationService` - 11 edges
8. `Gig` - 11 edges
9. `sendSuccess()` - 9 edges
10. `catchAsync()` - 9 edges

## Surprising Connections (you probably didn't know these)

- `LoginPage()` --calls--> `useAuth()` [EXTRACTED]
  app/(auth)/login/page.tsx → hooks/useAuth.ts
- `RegisterForm()` --calls--> `useAuth()` [EXTRACTED]
  app/(auth)/register/page.tsx → hooks/useAuth.ts
- `DashboardPage()` --calls--> `useAuthStore` [EXTRACTED]
  app/dashboard/page.tsx → store/auth.store.ts
- `testConnections()` --references--> `kafka` [EXTRACTED]
  test/test-connections.ts → backend/src/config/kafka.ts
- `verifyAndCreateTopics()` --references--> `kafka` [EXTRACTED]
  test/test-kafka-topics.ts → backend/src/config/kafka.ts

## Import Cycles

- None detected.

## Communities (67 total, 23 thin omitted)

### Community 0 - "page.tsx"

Cohesion: 0.14
Nodes (26): FindWorkPage(), BookmarkBtn(), BookmarkBtnProps, DEFAULT_FILTERS, FilterDrawer(), FilterDrawerProps, Filters, FullModal() (+18 more)

### Community 1 - "AppError"

Cohesion: 0.20
Nodes (7): createGig, getAllGigs, getMyGigs, rateLimitStore, GigService, CreateGigInput, createGigSchema

### Community 2 - "dependencies"

Cohesion: 0.07
Nodes (29): dependencies, axios, better-auth, cloudinary, cors, dotenv, express, framer-motion (+21 more)

### Community 3 - "prisma.ts"

Cohesion: 0.06
Nodes (36): ensureKafkaTopics(), kafka, kafkaConsumer, kafkaProducer, pubClient, subClient, ChatService, AttachmentPayload (+28 more)

### Community 4 - "page.tsx"

Cohesion: 0.07
Nodes (19): OnboardingData, SplitScreenLayout(), SplitScreenLayoutProps, STEP_INFOS, RULES, Step1_Rules(), Step1Props, Step1Props (+11 more)

### Community 5 - "page.tsx"

Cohesion: 0.19
Nodes (7): categories, Features(), Hero(), Navbar(), Search(), SearchProps, testimonials

### Community 6 - "auth.middleware.ts"

Cohesion: 0.17
Nodes (14): allowedOrigins, app, authorize(), requireAuth(), Auth, router, router, router (+6 more)

### Community 7 - "useAuth.ts"

Cohesion: 0.05
Nodes (47): SessionUser, DashboardPage(), SessionUser, Conversation, MessagesContent(), OtherUser, FullUser, Gig (+39 more)

### Community 8 - "devDependencies"

Cohesion: 0.06
Nodes (34): husky.sh script, devDependencies, eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier, husky, lint-staged (+26 more)

### Community 9 - "client.controller.ts"

Cohesion: 0.13
Nodes (12): getCategoriesController, getFreelancerDetailsController, getGigDetailsController, searchFreelancersController, searchGigsController, ClientService, FreelancerSearchFilters, GigSearchFilters (+4 more)

### Community 10 - "compilerOptions"

Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "chat.controller.ts"

Cohesion: 0.15
Nodes (18): ALLOWED_MIMES, CloudinaryResult, fileFilter(), getFileType(), getResourceType(), uploadMiddleware, uploadToCloudinary(), downloadChatAttachment (+10 more)

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

Cohesion: 0.11
Nodes (11): globalForPrisma, AuthService, toPublicUser(), AuthenticatedUser, PublicUser, UserRole, Express, Request (+3 more)

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

### Community 61 - "order.controller.ts"

Cohesion: 0.21
Nodes (9): ErrorBody, sendSuccess(), SuccessResponse, AsyncHandler, catchAsync(), getMe, OrderService, CreateOrderInput (+1 more)

### Community 62 - "AppError"

Cohesion: 0.23
Nodes (7): AppError, updateFreelancerProfile, rateLimitStore, router, FreelancerService, FreelancerProfileUpdateInput, freelancerProfileUpdateSchema

### Community 63 - "useAuth"

Cohesion: 0.26
Nodes (7): LoginPage(), RegisterForm(), RegisterForm(), useAuth(), COUNTRIES, formatFullName(), getDisplayRole()

### Community 64 - "AppError.ts"

Cohesion: 0.38
Nodes (6): ErrorCode, STATUS_TO_CODE, errorHandler(), ErrorResponse, handleJwtExpiredError(), handleJwtInvalidError()

### Community 65 - "notification.controller.ts"

Cohesion: 0.31
Nodes (7): getNotifications, markAllRead, markOneRead, router, getNotificationsQuerySchema, MarkOneReadParamsInput, markOneReadParamsSchema

### Community 66 - "user.controller.ts"

Cohesion: 0.52
Nodes (3): UserService, FreelancerOnboardingInput, freelancerOnboardingSchema

## Knowledge Gaps

- **208 isolated node(s):** `husky.sh script`, `SessionUser`, `SessionUser`, `manrope`, `inter` (+203 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Why does `axios` connect `dependencies` to `useAuth.ts`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `SessionUser`, `SessionUser` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `prisma.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061016949152542375 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07258064516129033 - nodes in this community are weakly interconnected._
