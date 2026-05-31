# Action Register

## [2026-06-01] Custom Agent Framework & Client Discovery Backend

- **Agent Framework Migration ([.agents/](file:///d:/Repo/kaampay/.agents))**:
  - Integrated custom agent framework containing always-on rules (`agent.md`, `rules.md`, `stack.md`, `context.md`, `workflow.md`), workflows (`bug-fixing.md`, `deployment-flow.md`, `feature-development.md`, `hotfix-rollback.md`), and 12 helper skills.
  - Updated [.graphifyignore](file:///d:/Repo/kaampay/.graphifyignore) to ignore the `.agents/` folder.
- **Client Discovery Module ([backend/src/modules/client](file:///d:/Repo/kaampay/backend/src/modules/client))**:
  - Created a new Express sub-module for client-side queries.
  - **Service Layer ([client.service.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.service.ts))**: Implemented static methods for querying gig and freelancer search with dynamic text matching, relational filters (user profiles, categories), price range filtering, skill tagging, and pagination.
  - **Validation Layer ([client.validation.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.validation.ts))**: Defined strict Zod schemas for query parameters, using `z.preprocess` to coerce parameters into their correct primitive types.
  - **Controller Layer ([client.controller.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.controller.ts))**: Implemented handlers utilizing standard helpers `catchAsync`, `safeParse`, and `sendSuccess`.
  - **Routing Layer ([client.routes.ts](file:///d:/Repo/kaampay/backend/src/modules/client/client.routes.ts))**: Exposed 5 public GET routes: `/gigs`, `/gigs/:id`, `/freelancers`, `/freelancers/:id`, and `/categories`.
  - **Module Entry Point ([backend/src/modules/index.ts](file:///d:/Repo/kaampay/backend/src/modules/index.ts))**: Mounted the client router under the `/client` prefix.

## [2026-05-29] Freelancer Profile Page Redesign & Git Setup Fixes

- **Freelancer Profile Layout ([app/profile/page.tsx](file:///d:/Repo/kaampay/app/profile/page.tsx))**: Refactored top header into a compact 3-column grid. Left card shows profile, bio, tags, and reviews/edit button. Right card replaces rate and resume upload with social links (GitHub, LinkedIn, Portfolio). Adjusted margins/paddings to prevent vertical stretching.
- **Navigation & Footer ([app/profile/page.tsx](file:///d:/Repo/kaampay/app/profile/page.tsx))**: Replaced inline header with the modular `<AppNavbar />` component (featuring "Find Work", "Deliver", and "Messages" on the left; search bar, notifications, and avatar dropdown on the right). Added the consistent landing page `<Footer />` component to the bottom, which was compacted (reduced padding, spacing, and element sizes) to fit neatly.
- **ESLint Config ([eslint.config.mjs](file:///d:/Repo/kaampay/eslint.config.mjs))**: Ignored `kaampay/**` to prevent linting of Obsidian files and plugins.
- **Git Setup ([.gitignore](file:///d:/Repo/kaampay/.gitignore))**: Removed `.agents/` and `.graphifyignore` from ignores to ensure they are tracked.

## [2026-05-29] Gig & Project Creation Feature (Backend, Cloudinary, and Frontend)

- **Database Updates ([prisma/schema.prisma](file:///d:/Repo/kaampay/prisma/schema.prisma))**: Added `images String[]` to `Gig` and `education String?` to `Profile`. Synced Postgres with `npx prisma db push` and regenerated typescript definitions.
- **Backend API & Cloudinary Configuration ([backend/src/modules/gig](file:///d:/Repo/kaampay/backend/src/modules/gig))**:
  - Configured Cloudinary SDK inside [cloudinary.ts](file:///d:/Repo/kaampay/backend/src/config/cloudinary.ts).
  - Created validation schemas (Zod), controllers, and services inside the new `gig` module to process, validate, upload base64 images to Cloudinary, and persist gig records with the returned URLs.
  - Implemented the `createGigRateLimiter` middleware on the API route to throttle creations to 3 requests per minute per IP.
  - Added query methods to retrieve a freelancer's own gigs (`GET /api/gigs/my-gigs`) and all active gigs (`GET /api/gigs`).
- **Frontend Implementation & Gig Rendering**:
  - Built a premium creation form incorporating drag-and-drop file inputs, base64 reader hooks, validation warnings, and publish triggers inside [create-gig/page.tsx](file:///d:/Repo/kaampay/app/dashboard/create-gig/page.tsx). Added the "Create Gig" CTA to the main [dashboard/page.tsx](file:///d:/Repo/kaampay/app/dashboard/page.tsx).
  - Updated [profile/page.tsx](file:///d:/Repo/kaampay/app/profile/page.tsx) to query the database and render the user's real gigs (showing Cloudinary-stored portfolio images) with a fallback to mock gigs if none are found.
- **Type Safety & Linter Fixes**: Removed caught `: any` types and implemented robust `unknown` type-checking/narrowing in [create-gig/page.tsx](file:///d:/Repo/kaampay/app/dashboard/create-gig/page.tsx) and [gig.service.ts](file:///d:/Repo/kaampay/backend/src/modules/gig/gig.service.ts) to satisfy ESLint. Escaped raw JSX double quotes on line 221 of [create-gig/page.tsx](file:///d:/Repo/kaampay/app/dashboard/create-gig/page.tsx) to resolve the `react/no-unescaped-entities` rule.
- **Payload Limit Increase ([backend/src/app.ts](file:///d:/Repo/kaampay/backend/src/app.ts))**: Increased Express body parsing limit to `10mb` (from `10kb`) for JSON and URL-encoded payloads to support uploading base64 gig portfolio images.
- **Git Hooks**: Moved the automatic graphify rebuild to the `pre-commit` hook (in [.husky/pre-commit](file:///.husky/pre-commit)) and configured it to automatically run `git add graphify-out/` right after updating. Overwrote `.husky/post-commit` and `.husky/post-checkout` with empty shims. This ensures the graph updates are included in the same commit, resolving the dirty working directory and double-push issues.
- **OAuth Error Handling Fix ([hooks/useAuth.ts](file:///d:/Repo/kaampay/hooks/useAuth.ts))**: Fixed `loginWithSocial` by capturing the returned result of `signIn.social` and throwing if `result?.error` is present. Included a `finally` block to reset the loading state, allowing the error to render in a toast and unlock the button.
