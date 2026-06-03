# 💼 KaamPay — Professional Freelance Marketplace for India

**KaamPay** is a premium, localized freelancing marketplace tailored for Indian students and small businesses. It connects clients looking for talent with student freelancers offering specialized services (gigs) under a secured transaction and escrow workflow.

```
                  ┌──────────────────────────────────────────┐
                  │          Next.js Client (:3000)          │
                  └────────────────────┬─────────────────────┘
                                       │
                         HTTP REST API │ (Axios Client)
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │         Express API Server (:5000)       │
                  └────────────────────┬─────────────────────┘
                                       │
                      Prisma ORM Client│ (pg connection pool)
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │              PostgreSQL DB               │
                  └──────────────────────────────────────────┘
```

---

## 🚀 Core Features

### 🔍 1. Client Discovery & Marketplace (`/find-work`)
* **Dynamic Search & Filtering**: Client-side marketplace allowing instant, debounced (400ms) full-text query matching across titles and descriptions, category tags, price ranges (Min/Max ₹), and maximum delivery timelines (1, 3, 7, 14, or 30 days).
* **Split-Pane Master-Detail View**: Optimized grid layout that loads list items on the left and updates a detailed seller and gig view panel on the right asynchronously upon selection. 
* **Expanded Full Modal View**: Allows deep-dive reading of gig details, category alignments, delivery periods, seller bio metrics, and contact routes.
* **Offline Bookmarking Sync**: Syncs bookmarked gigs to local storage (`kp_saved_gigs`) and supports instant toggling animations with scale ping bursts.
* **Skeleton Loaders**: Provides elegant, layout-consistent skeletons for card grids and details panels to ensure high perceived speed.

### 🎨 2. Freelancer Workspace & Gig Creation (`/dashboard/create-gig`)
* **Multi-Step Gig Wizard**: Streamlined submission form featuring drag-and-drop file inputs, base64 reader pipelines, category selection, and instant database listings.
* **Rate Limiting Protection**: Mounts backend middleware throttling gig submissions to 3 creation requests per minute per IP address.
* **Payload Extensions**: Increased Express JSON parser payload limitations to `10mb` to fully support high-fidelity base64 image transfers.
* **Cloudinary Pipeline**: Serves and optimizes media assets by receiving raw base64 arrays, piping them to Cloudinary SDK buckets, and persisting returned URLs.

### 👤 3. Profile Customization & Onboarding (`/profile` & `/onboarding`)
* **Onboarding Wizard**: Multi-step wizard capturing freelancer skills, biographies, experience scopes, and pricing.
* **Compact Grid Profile**: Redesigned `/profile` layout into a balanced 3-column deck separating bio tags, credentials, portfolio grids, and links (LinkedIn, GitHub, Portfolio).

### 🔑 4. Session & Authentication Core
* **Better Auth Integration**: Secured endpoint protection handles logins, signups, and sign-outs via cookie-based sessions.
* **Role-Based Redirections**: Shielded page routes and layouts verify user roles and redirect accordingly (e.g. preventing clients from executing freelancer-scoped actions).
* **Session Storage**: Syncs user data globally using lightweight Zustand stores (`auth.store.ts`).

---

## 📁 Repository Directory Structure

```text
KaamPay/
├── app/                          # Next.js 16 Client Pages & Routing
│   ├── (auth)/                   # Login, Registration, Signup, and Email verification
│   ├── dashboard/                # User dashboard & Gig Creation (/create-gig)
│   ├── onboarding/               # Onboarding wizard
│   ├── profile/                  # Redesigned Profile page
│   ├── find-work/                # Marketplace search & client browsing deck
│   └── layout.tsx                # App shell, Navbar placement, global font-bindings
│
├── components/                   # Reusable React UI Elements
│   ├── find-work/                # Gig listing, Filter drawers, Modals, Bookmarks, and Skeletons
│   ├── AppNavbar.tsx             # Logged-in header with search bar, notifications, and avatar dropdowns
│   ├── Footer.tsx / Hero.tsx     # Landing sections
│   └── RoleGuard.tsx             # Authentication guard wrappers
│
├── backend/src/                  # Express 5 API Server Source
│   ├── config/                   # Prisma client, Cloudinary SDK, and Better Auth server configurations
│   ├── error/                    # Unified AppError classes and global middleware handlers
│   ├── common/                   # Shared Express utils (catchAsync, apiResponse)
│   └── modules/                  # Feature Modules
│       ├── auth/                 # Sign-in, sign-up, and session endpoints
│       ├── users/                # Onboarding metrics updates
│       ├── gig/                  # Gig creation routes, validations, and rate-limiting
│       └── client/               # Client Discovery queries (Search, Categories, Freelancers)
│
├── prisma/                       # Database Configurations
│   ├── schema.prisma             # Core models: User, Profile, Gig, Order, Payment, Chat
│   └── migrations/               # PostgreSQL schema migrations
│
├── scripts/                      # Utility CLI scripts
│   └── seed-gigs.ts              # Seeding script populating mock accounts and active gigs
│
├── types/                        # Shared typescript definitions (gig.ts, user.ts)
└── graphify-out/                 # Auto-generated knowledge base index maps
```

---

## 🛠️ Technology Stack

| Library/Framework | Layer | Responsibility |
|---|---|---|
| **Next.js 16** | Frontend | Core framework, App routing, SSR, layout structures |
| **Express 5** | Backend | REST API endpoints, routing, error interception |
| **Prisma 7** | Database | Database Client mapping & migrations (PostgreSQL) |
| **Better Auth 1.6** | Authentication | Client-side & Server-side session guards |
| **Zustand 5.0** | State Management | User state cache, local storage persistence |
| **Tailwind CSS 4** | Styling | Utility classes, responsive grids, and transitions |
| **Zod 4.4** | Validation | Type coercion, query validation, and schema definitions |
| **Cloudinary** | Media Storage | Asset uploads and base64 conversion |

---

## ⚡ Setup & Installation

### Prerequisites
* **Node.js** (v20+ recommended)
* **PostgreSQL** database running locally or hosted on the cloud

### 1. Configure Environment Variables
Create a `.env` file in the root directory mapping the following keys:

```env
# ─── Database configuration (Prisma) ───────────────────────────
DATABASE_URL="postgresql://postgres:password@localhost:5432/kaampay?schema=public"

# ─── Better Auth Configurations ──────────────────────────────
BETTER_AUTH_SECRET="your-better-auth-secret-here"
BETTER_AUTH_URL="http://localhost:5000" # Express backend port

# ─── Cloudinary API Keys ──────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ─── App Configuration ────────────────────────────────────────
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### 2. Install Dependencies
Run the install command using NPM:
```bash
npm install
```

### 3. Initialize Database Migrations & Seeds
Run database migrations and seed default freelancers/active gigs:
```bash
# Push schema structure to database
npx prisma db push

# Generate Prisma Client classes
npx prisma generate

# Seed mock freelancers and gigs
npx tsx scripts/seed-gigs.ts
```

### 4. Run Development Servers
Start both the client and the backend server in parallel:

```bash
# Terminal 1 — Frontend Client (Port 3000)
npm run dev

# Terminal 2 — Express API Backend (Port 5000)
npm run dev:backend
```

Navigate to `http://localhost:3000/find-work` to test the client discovery flow.

---

## 📝 Code Standards & Development Workflow

### Asynchronous Execution Rules
* Every asynchronous function must explicitly return a Promise or use the `async/await` keyword.
* Every `await` must be caught locally inside a `try/catch` block, or handled using `catchAsync` wrappers on the backend to prevent unhandled rejection crashes.

### Knowledge Graph Updates (Graphify)
The project includes a Git pre-commit hook that automatically runs linter checks, formats modifications, and regenerates the Graphify knowledge graph upon commits.
To trigger the graphify compilation manual fallback, run:
```bash
python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```
This updates the HTML visualization maps under [graphify-out/graph.html](file:///d:/Repo/kaampay/graphify-out/graph.html).
