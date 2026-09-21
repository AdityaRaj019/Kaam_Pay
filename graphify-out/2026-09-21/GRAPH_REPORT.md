# Graph Report - kaampay  (2026-09-21)

## Corpus Check
- 171 files · ~50,357 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1320 nodes · 2112 edges · 130 communities (101 shown, 29 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8978609a`
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
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 118|Community 118]]
- [[_COMMUNITY_Community 119|Community 119]]
- [[_COMMUNITY_Community 120|Community 120]]
- [[_COMMUNITY_Community 121|Community 121]]
- [[_COMMUNITY_Community 122|Community 122]]
- [[_COMMUNITY_Community 140|Community 140]]
- [[_COMMUNITY_Community 143|Community 143]]

## God Nodes (most connected - your core abstractions)
1. `AppError` - 25 edges
2. `AppError` - 25 edges
3. `Gig` - 21 edges
4. `compilerOptions` - 16 edges
5. `compilerOptions` - 16 edges
6. `compilerOptions` - 15 edges
7. `ErrorCode` - 15 edges
8. `api` - 15 edges
9. `ErrorCode` - 15 edges
10. `useAuth()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/login/page.tsx → hooks/useAuth.ts
- `RegisterForm()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/register/page.tsx → hooks/useAuth.ts
- `DashboardPage()` --calls--> `useAuthStore`  [EXTRACTED]
  app/dashboard/page.tsx → store/auth.store.ts
- `AttachmentPreviewProps` --references--> `Attachment`  [EXTRACTED]
  components/chat/AttachmentPreview.tsx → hooks/useChat.ts
- `MessageBubbleProps` --references--> `ChatMessage`  [EXTRACTED]
  components/chat/MessageBubble.tsx → hooks/useChat.ts

## Communities (130 total, 29 thin omitted)

### Community 0 - "page.tsx"
Cohesion: 0.09
Nodes (44): FindWorkPage(), BookmarkBtn(), BookmarkBtnProps, DEFAULT_FILTERS, FilterDrawer(), FilterDrawerProps, Filters, FullModal() (+36 more)

### Community 1 - "AppError"
Cohesion: 0.13
Nodes (15): AppError, ErrorCode, STATUS_TO_CODE, errorHandler(), ErrorResponse, handleJwtExpiredError(), handleJwtInvalidError(), createGig (+7 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, better-auth, cors, dotenv, express, framer-motion, helmet, @hookform/resolvers (+19 more)

### Community 3 - "prisma.ts"
Cohesion: 0.05
Nodes (42): ensureKafkaTopics(), kafka, kafkaConsumer, kafkaProducer, pubClient, subClient, ChatService, AttachmentPayload (+34 more)

### Community 4 - "page.tsx"
Cohesion: 0.07
Nodes (19): OnboardingData, SplitScreenLayout(), SplitScreenLayoutProps, STEP_INFOS, RULES, Step1_Rules(), Step1Props, Step1Props (+11 more)

### Community 5 - "page.tsx"
Cohesion: 0.17
Nodes (8): Home(), categories, Features(), Hero(), Navbar(), Search(), SearchProps, testimonials

### Community 6 - "auth.middleware.ts"
Cohesion: 0.13
Nodes (18): allowedOrigins, app, authorize(), requireAuth(), Auth, getMe, router, router (+10 more)

### Community 7 - "useAuth.ts"
Cohesion: 0.05
Nodes (47): Conversation, MessagesContent(), OtherUser, AttachmentPreview(), AttachmentPreviewProps, ChatWindow(), ChatWindowProps, OtherUser (+39 more)

### Community 8 - "devDependencies"
Cohesion: 0.09
Nodes (22): husky.sh script, devDependencies, eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier, husky, lint-staged (+14 more)

### Community 9 - "client.controller.ts"
Cohesion: 0.13
Nodes (12): getCategoriesController, getFreelancerDetailsController, getGigDetailsController, searchFreelancersController, searchGigsController, ClientService, FreelancerSearchFilters, GigSearchFilters (+4 more)

### Community 10 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "chat.controller.ts"
Cohesion: 0.27
Nodes (8): ALLOWED_MIMES, CloudinaryResult, fileFilter(), getFileType(), getResourceType(), uploadMiddleware, uploadToCloudinary(), cloudinary

### Community 12 - "compilerOptions"
Cohesion: 0.12
Nodes (17): compilerOptions, baseUrl, esModuleInterop, lib, module, moduleResolution, noEmit, outDir (+9 more)

### Community 13 - "💼 KaamPay — Professional Freelance Marketplace for India"
Cohesion: 0.11
Nodes (17): 🔍 1. Client Discovery & Marketplace (`/find-work`), 1. Configure Environment Variables, 🎨 2. Freelancer Workspace & Gig Creation (`/dashboard/create-gig`), 2. Install Dependencies, 3. Initialize Database Migrations & Seeds, 👤 3. Profile Customization & Onboarding (`/profile` & `/onboarding`), 4. Run Development Servers, 🔑 4. Session & Authentication Core (+9 more)

### Community 14 - "Context State - KaamPay (June 2026)"
Cohesion: 0.11
Nodes (16): 🏗️ 1. Complete System Architecture & Tech Stack, 📁 2. Folder-by-Folder Directory Analysis, 🛠️ 3. Feature-by-Feature Implementation State, 📊 4. Graphify Structural Insights (From `graphify-out/`), 📜 5. Operational Conventions & Development Rules, Asynchronous Safety, Context State - KaamPay (June 2026), 🗃️ Database & Seeding (+8 more)

### Community 15 - "auth.service.ts"
Cohesion: 0.29
Nodes (7): AuthService, toPublicUser(), AuthenticatedUser, PublicUser, UserRole, Express, Request

### Community 16 - "seed-gigs.ts"
Cohesion: 0.33
Nodes (9): adapter, fakeHash(), FREELANCERS, FreelancerSeed, GIGS, GigSeed, main(), pool (+1 more)

### Community 17 - "Action Register"
Cohesion: 0.29
Nodes (5): [2026-05-29] Freelancer Profile Page Redesign & Git Setup Fixes, [2026-05-29] Gig & Project Creation Feature (Backend, Cloudinary, and Frontend), [2026-09-18] Real-Time Chat Debugging & Media Download Enhancements, [2026-09-18] Real-Time Messaging, Notification Integration & Messages Page, Action Register

### Community 18 - "layout.tsx"
Cohesion: 0.53
Nodes (4): inter, manrope, metadata, RootLayout()

### Community 19 - "auth.validation.ts"
Cohesion: 0.40
Nodes (4): LoginInput, loginSchema, RegisterInput, registerSchema

### Community 20 - "server.ts"
Cohesion: 0.40
Nodes (4): { config }, envPath, { resolve }, result

### Community 61 - "order.controller.ts"
Cohesion: 0.23
Nodes (10): ErrorBody, sendSuccess(), SuccessResponse, AsyncHandler, catchAsync(), downloadChatAttachment, getChatHistory, getConversations (+2 more)

### Community 62 - "AppError"
Cohesion: 0.22
Nodes (3): globalForPrisma, seedChatOrder(), main()

### Community 63 - "useAuth"
Cohesion: 0.06
Nodes (32): LoginPage(), RegisterForm(), SessionUser, DashboardPage(), SessionUser, FullUser, Gig, UserProfile (+24 more)

### Community 64 - "AppError.ts"
Cohesion: 0.05
Nodes (36): `app/` — Pages & Routes, ⚙️ BACKEND — Express API (`backend/`), code:block1 (Kaam_Pay/), code:block10 (Browser Request), code:ts (// Example usage), code:block12 (Frontend (Next.js :3000)), code:bash (# Terminal 1 — Frontend), code:block2 (app/) (+28 more)

### Community 65 - "notification.controller.ts"
Cohesion: 0.36
Nodes (6): getNotifications, markAllRead, markOneRead, getNotificationsQuerySchema, MarkOneReadParamsInput, markOneReadParamsSchema

### Community 66 - "user.controller.ts"
Cohesion: 0.31
Nodes (4): globalForPrisma, UserService, FreelancerOnboardingInput, freelancerOnboardingSchema

### Community 67 - "Community 67"
Cohesion: 0.06
Nodes (14): OnboardingData, SplitScreenLayoutProps, STEP_INFOS, RULES, Step1Props, Step1Props, EXPERIENCE_OPTIONS, Step2Props (+6 more)

### Community 68 - "Community 68"
Cohesion: 0.06
Nodes (31): audio-recorder, backlink, bases, bookmarks, canvas, command-palette, daily-notes, editor-status (+23 more)

### Community 69 - "Community 69"
Cohesion: 0.06
Nodes (31): active, bases:Create new base, canvas:Create new canvas, command-palette:Open command palette, daily-notes:Open today's daily note, graph:Open graph view, smart-context:Smart Context: Copy to Clipboard (select depth), smart-context:Smart Context: List Named Contexts (+23 more)

### Community 70 - "Community 70"
Cohesion: 0.07
Nodes (29): dependencies, axios, better-auth, cloudinary, cors, dotenv, express, framer-motion (+21 more)

### Community 71 - "Community 71"
Cohesion: 0.08
Nodes (24): 🔍 1. Client Discovery & Marketplace (`/find-work`), 1. Configure Environment Variables, 🎨 2. Freelancer Workspace & Gig Creation (`/dashboard/create-gig`), 2. Install Dependencies, 3. Initialize Database Migrations & Seeds, 👤 3. Profile Customization & Onboarding (`/profile` & `/onboarding`), 4. Run Development Servers, 🔑 4. Session & Authentication Core (+16 more)

### Community 72 - "Community 72"
Cohesion: 0.52
Nodes (3): OrderService, CreateOrderInput, createOrderSchema

### Community 73 - "Community 73"
Cohesion: 0.10
Nodes (20): centerStrength, close, collapse-color-groups, collapse-display, collapse-filter, collapse-forces, colorGroups, hideUnresolved (+12 more)

### Community 74 - "Community 74"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier, husky, lint-staged, prettier (+13 more)

### Community 75 - "Community 75"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 77 - "Community 77"
Cohesion: 0.14
Nodes (13): router, Auth, updateFreelancerProfile, rateLimitStore, router, authorize(), requireAuth(), router (+5 more)

### Community 78 - "Community 78"
Cohesion: 0.11
Nodes (14): getMe, createGig, getAllGigs, getMyGigs, rateLimitStore, router, GigService, CreateGigInput (+6 more)

### Community 80 - "Community 80"
Cohesion: 0.13
Nodes (16): downloadChatAttachment, getChatHistory, getConversations, initChat, uploadChatFiles, router, DownloadAttachmentQueryInput, downloadAttachmentQuerySchema (+8 more)

### Community 82 - "Community 82"
Cohesion: 0.27
Nodes (8): getNotifications, markAllRead, markOneRead, router, GetNotificationsQueryInput, getNotificationsQuerySchema, MarkOneReadParamsInput, markOneReadParamsSchema

### Community 83 - "Community 83"
Cohesion: 0.05
Nodes (34): ChatService, AttachmentPayload, ChatMessagePayload, ChatUserSummary, ConversationCard, DownloadAttachmentQuery, InitChatInput, ensureKafkaTopics() (+26 more)

### Community 87 - "Community 87"
Cohesion: 0.52
Nodes (3): FreelancerService, FreelancerProfileUpdateInput, freelancerProfileUpdateSchema

### Community 89 - "Community 89"
Cohesion: 0.13
Nodes (13): getCategoriesController, getFreelancerDetailsController, getGigDetailsController, searchFreelancersController, searchGigsController, router, ClientService, FreelancerSearchFilters (+5 more)

### Community 92 - "Community 92"
Cohesion: 0.33
Nodes (6): AuthService, toPublicUser(), AuthenticatedUser, PublicUser, UserRole, Request

### Community 93 - "Community 93"
Cohesion: 0.25
Nodes (8): AppError, ErrorCode, STATUS_TO_CODE, errorHandler(), ErrorResponse, handleJwtExpiredError(), handleJwtInvalidError(), ALLOWED_ORDER_TRANSITIONS

### Community 95 - "Community 95"
Cohesion: 0.22
Nodes (8): embedding_models, default_model_key, is_obsidian_vault, language, new_user, re_import_wait_time, smart_notices, version

### Community 96 - "Community 96"
Cohesion: 0.22
Nodes (9): adapter, transformers, smart_sources, embed_model, excluded_headings, file_exclusions, folder_exclusions, min_chars (+1 more)

### Community 97 - "Community 97"
Cohesion: 0.52
Nodes (3): UserService, FreelancerOnboardingInput, freelancerOnboardingSchema

### Community 98 - "Community 98"
Cohesion: 0.11
Nodes (19): cancelOrder, createOrder, failPayment, getOrder, markPaid, markPaymentPending, transitionOrderStatus, router (+11 more)

### Community 99 - "Community 99"
Cohesion: 0.29
Nodes (6): lint-staged, *.{js,jsx,ts,tsx}, *.{json,css,md}, name, private, version

### Community 100 - "Community 100"
Cohesion: 0.29
Nodes (7): scripts, build, dev, dev:backend, lint, prepare, start

### Community 101 - "Community 101"
Cohesion: 0.29
Nodes (6): lint-staged, *.{js,jsx,ts,tsx}, *.{json,css,md}, name, private, version

### Community 102 - "Community 102"
Cohesion: 0.29
Nodes (7): scripts, build, dev, dev:backend, lint, prepare, start

### Community 104 - "Community 104"
Cohesion: 0.33
Nodes (6): event_logs, native_notice_attention, native_notice_error, native_notice_info, native_notice_milestone, native_notice_warning

### Community 105 - "Community 105"
Cohesion: 0.40
Nodes (4): LoginInput, loginSchema, RegisterInput, registerSchema

### Community 106 - "Community 106"
Cohesion: 0.40
Nodes (3): main(), NOTE: In production, users should register through the auth flow., NOTE: This is a placeholder hash. In real usage, Better Auth

### Community 107 - "Community 107"
Cohesion: 0.50
Nodes (4): adapter, ollama, smart_chat_threads, chat_model

### Community 108 - "Community 108"
Cohesion: 0.50
Nodes (4): context_items, template_after, template_before, template_preset

### Community 109 - "Community 109"
Cohesion: 0.50
Nodes (4): lookup_lists, results_collection_key, results_limit, score_algo_key

### Community 110 - "Community 110"
Cohesion: 0.50
Nodes (4): smart_contexts, template_after, template_before, template_preset

### Community 111 - "Community 111"
Cohesion: 0.50
Nodes (4): smart_view_filter, expanded_view, render_markdown, show_full_path

### Community 113 - "Community 113"
Cohesion: 0.67
Nodes (3): models, chat_completion_platform, embedding_platform

### Community 114 - "Community 114"
Cohesion: 0.67
Nodes (3): smart_blocks, embed_blocks, min_chars

### Community 143 - "Community 143"
Cohesion: 0.52
Nodes (3): FreelancerService, FreelancerProfileUpdateInput, freelancerProfileUpdateSchema

## Knowledge Gaps
- **489 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+484 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `chat.controller.ts`, `Community 101`, `useAuth.ts`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `axios` connect `useAuth.ts` to `dependencies`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Why does `cloudinary` connect `chat.controller.ts` to `dependencies`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _491 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08509615384615385 - nodes in this community are weakly interconnected._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.13054187192118227 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._