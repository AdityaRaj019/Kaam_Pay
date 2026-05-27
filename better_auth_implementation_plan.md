# Better Auth Implementation Architecture Plan

This document outlines an industry-grade, highly decoupled architecture for replacing the existing custom JWT authentication with **Better Auth** (using session-based HTTP-only cookies). This plan strictly adheres to a clean separation of concerns between the Next.js frontend, the Express backend, and the Prisma database layer.

## User Review Required

> [!IMPORTANT]
> **Database Restructuring**: We are migrating from a custom `User` table to a standardized Better Auth schema. This requires running Prisma migrations. If there is existing user data that must be preserved, a custom data migration script will be required to map old users to the new schema format.
>
> **OAuth Credentials**: To support OAuth (e.g., Google, GitHub), you must create OAuth applications on their developer consoles and provide the `CLIENT_ID` and `CLIENT_SECRET` in the backend `.env` file.

## Architecture Overview

The authentication flow will operate across three isolated layers:

1.  **Database Layer (`prisma/`)**: Manages the schema for users, OAuth accounts, secure sessions, and 2FA secrets.
2.  **Backend Layer (`backend/`)**: Acts as the single source of truth for authentication. It configures the Better Auth instance, handles rate limiting, and issues secure HTTP-only cookies.
3.  **Frontend Layer (`app/` & `lib/`)**: Purely presentational. It uses the Better Auth client library to trigger authentication flows and read session states, communicating exclusively with the Backend Layer.

---

## 1. Database Logic & Schema

Better Auth requires a specific set of tables to function securely and handle OAuth linking and sessions.

### Proposed Schema Additions (`prisma/schema.prisma`)

```prisma
// Core Better Auth Models
model User {
  id               String    @id @default(cuid())
  name             String
  email            String    @unique
  emailVerified    Boolean   @default(false)
  image            String?
  twoFactorEnabled Boolean   @default(false)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  // Relationships to Better Auth tables
  sessions         Session[]
  accounts         Account[]

  // Existing business logic relationships
  profile          Profile?
  gigs             Gig[]     @relation("FreelancerGigs")
  // ... other existing relations
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String // e.g., 'google', 'github', 'credential'
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String? // Hashed password for credential provider
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model TwoFactor {
  id          String   @id @default(cuid())
  secret      String
  backupCodes String
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 2. Backend Architecture (Express API)

The backend will be responsible for defining security rules, issuing HTTP-Only cookies, and protecting API routes.

### Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── auth.ts              # Better Auth configuration & instance creation
│   ├── middlewares/
│   │   └── requireAuth.ts       # Global middleware to protect private routes
│   └── modules/
│       └── auth/
│           └── auth.routes.ts   # Express router mounting the Better Auth handler
```

### Implementation Details

1.  **Configuration (`backend/src/config/auth.ts`)**:
    - Initialize `betterAuth()` with the Prisma adapter.
    - Inject the **Rate Limiter Plugin** (e.g., max 5 failed login attempts per minute per IP).
    - Inject the **Two Factor Plugin** (TOTP based).
    - Inject the **Email Verification Plugin** (configured to use NodeMailer or Resend).
    - Configure OAuth providers (Google, GitHub) using environment variables.

2.  **Routing (`backend/src/modules/auth/auth.routes.ts`)**:
    - Convert the Better Auth instance to an Express handler using `toNodeHandler(auth)`.
    - Mount it at `app.use('/api/auth', toNodeHandler(auth))`. This single line automatically generates all secure endpoints (`/api/auth/sign-in`, `/api/auth/verify-email`, etc.).
    - _Delete the old custom JWT/Bcrypt controller logic entirely._

3.  **Security Middleware (`backend/src/middlewares/requireAuth.ts`)**:
    - Create a middleware that intercepts incoming requests, reads the HTTP-Only cookie, and validates the session using `auth.api.getSession({ headers: req.headers })`. If invalid, it returns `401 Unauthorized`.

---

## 3. Frontend Architecture (Next.js)

The frontend will act as a thin client. It will never touch tokens directly; it relies on the browser to automatically send the secure HTTP-Only cookies to the backend.

### Folder Structure

```text
app/
├── (auth)/                      # Grouped auth routes
│   ├── login/page.tsx           # Login UI (Email/Password + OAuth buttons)
│   ├── register/page.tsx        # Registration UI
│   ├── verify-email/page.tsx    # Email verification pending/success screen
│   └── 2fa/page.tsx             # 2FA code entry screen
├── dashboard/                   # Protected routes
│   └── layout.tsx               # Frontend route guard checking session state
lib/
└── auth/
    └── auth-client.ts           # Better Auth client initialization
```

### Implementation Details

1.  **Client Initialization (`lib/auth/auth-client.ts`)**:
    - Initialize `createAuthClient()` pointing to the backend URL (`http://localhost:5000/api/auth`).
    - Export the generated React hooks and methods (e.g., `useSession`, `signIn`, `signUp`).

2.  **UI & Interactions**:
    - **Login**: Calling `signIn.email({ email, password })` will instruct the backend to validate credentials and set the HTTP-Only cookie.
    - **OAuth**: Calling `signIn.social({ provider: 'google' })` will redirect the user to Google, and upon return, the backend issues the cookie.
    - **State Management**: Use the `useSession()` hook across the application to conditionally render UI (e.g., showing user avatar in the navbar).
    - **Route Guards**: In Next.js layouts or middleware, use the session state to redirect unauthenticated users to the `/login` page.

---

## Verification Plan

Once implemented, the architecture must be verified against these security checks:

1.  **Cookie Security Check**: Open browser DevTools -> Application -> Cookies. Verify that the `better-auth.session_token` cookie is present and has the `HttpOnly` and `Secure` flags set to true.
2.  **XSS Resilience Check**: Open the browser console and type `document.cookie`. Verify that the session token is _not_ visible (confirming it is immune to XSS theft).
3.  **Rate Limit Check**: Intentionally fail the login multiple times in rapid succession. Verify that a `429 Too Many Requests` status is returned.
4.  **2FA Flow Check**: Enable 2FA on a test account. Attempt to log in and verify that the system blocks access and prompts for the TOTP code before issuing the final session cookie.
