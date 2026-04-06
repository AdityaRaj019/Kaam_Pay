# KaamPay Stepwise Development Plan

Based on the Product Requirement Document (PRD) and initial Roadmap, here is the detailed ladder-type implementation plan broken into 10 main sections. Each section includes exactly 10 step-by-step implementation tasks to guide the development from start to scale.

---

## 1. Project Setup & Environment Configuration
**Goal:** Establish the foundational architecture, repositories, and development environment.

- [ ] **1.1. Backend Scaffolding:** Initialize Node.js & Express API backend with basic folder structure (controllers, routes, models).
- [ ] **1.2. Database Provisioning:** Setup PostgreSQL (or MongoDB) cluster and configure connection strings.
- [ ] **1.3. Environment Variables:** Manage secrets `.env` (Database URI, API keys, JWT secrets) for dev/prod.
- [ ] **1.4. Linting & Formatting:** Configure ESLint, Prettier, and Git Hooks (Husky) to ensure code consistency.
- [ ] **1.5. Storage Configuration:** Setup Cloudinary or AWS S3 for profile pictures, thumbnails, and document uploads.
- [ ] **1.6. Payment Gateway Test Env:** Create Razorpay Test Keys and configure them in the environment.
- [ ] **1.7. CI/CD Pipeline:** Setup GitHub Actions to run tests and basic builds on push/PR.
- [ ] **1.8. Basic Server Health Check:** Create `/api/health` route and ensure frontend can successfully fetch it.

---

## 2. Database Schema & Data Models Design
**Goal:** Build robust schemas mapping to the PRD specifications.

- [ ] **2.1. User Model:** Define schema for users (Name, Email, Password Hash, Role, Verification Status).
- [ ] **2.2. Profile Model:** Define nested/relational profile schema (Skills, Bio, Portfolio Links, Hourly Rate).
- [ ] **2.3. Gig Model:** Define gig attributes (Title, Description, Category, Price, Delivery Time, Status).
- [ ] **2.4. Order Model:** Define order mapping (Client ID, Freelancer ID, Gig ID, Amount, Status).
- [ ] **2.5. Deliverables Model:** Define schema for submitted work (File URLs, Text proof, Revision counts).
- [ ] **2.6. Payment Model:** Define transaction records (Razorpay Order ID, Escrow Status, Platform Fee deductions).
- [ ] **2.7. Chat/Message Model:** Define schema for order-associated chat rooms and individual messages.
- [ ] **2.8. Review Model:** Define rating schema (1-5 stars, Comment text, Target User ID, Order ID).
- [ ] **2.9. Notification Model:** Define push notification entities (Type, Message, Read Status, User ID).
- [ ] **2.10. Seeding & Migrations:** Write scripts to seed initial admin accounts and dummy gigs for testing.

---

## 3. Backend Authentication & Authorization Core
**Goal:** Secure the platform and manage user identities.

- [ ] **3.1. Auth Routes Initialization:** Set up `/api/auth` controller structure.
- [ ] **3.2. User Registration:** Implement email/password signup logic with input validation (Zod/Joi).
- [ ] **3.3. Password Encryption:** Integrate `bcrypt` for secure password hashing.
- [ ] **3.4. Email OTP Verification:** Integrate Nodemailer/SendGrid to send email verification codes.
- [ ] **3.5. Login & JWT Generation:** Issue Access Tokens (short-lived) and Refresh Tokens on login.
- [ ] **3.6. RBAC Middleware:** Create custom middleware to shield routes (`isClient`, `isFreelancer`, `isAdmin`).
- [ ] **3.7. Password Reset Flow:** Build endpoints for "Forgot Password" to send secure reset links.
- [ ] **3.8. Profile Update Endpoint:** Allow authenticated users to patch their profile details.
- [ ] **3.9. Identity Document Upload:** Build API supporting secure file uploads for verification (ID/Collage ID).
- [ ] **3.10. Verification Status Tracking:** Logic to update `isVerified` states based on admin approval.

---

## 4. Frontend Foundation & Authentication UI
**Goal:** Create a stunning, responsive aesthetic and functional auth flow.

- [ ] **4.1. Global Styling & Theme:** Configure `globals.css`, fonts (Inter/Outfit), standard colors, and Dark/Light mode tokens.
- [ ] **4.2. Base UI Components:** Ensure base Shadcn UI components (Buttons, Inputs, Cards, Dialogs) are customized.
- [ ] **4.3. Landing Page Structure:** Build responsive Hero Section, Value Proposition, Categories preview, and Footer.
- [ ] **4.4. Registration Form UI:** Step-by-step form for user creation with inline validation.
- [ ] **4.5. Login Form UI:** Simple, secure login page matching theme standards.
- [ ] **4.6. Auth State Management:** Implement Context/Zustand logic to hold logged-in user state across app.
- [ ] **4.7. Role Selection Screen:** Onboarding flow where users select "I want to hire" or "I want to work".
- [ ] **4.8. Protected Routes logic:** Build higher-order components/wrappers to catch unauthenticated users attempting to view secure pages.
- [ ] **4.9. Document Upload UI:** File droppers for Freelancers to submit verification IDs to Admin.
- [ ] **4.10. Account Settings Page:** UI for changing passwords, managing emails, and updating basic profile details.

---

## 5. Gig Management (Freelancer Flow)
**Goal:** Allow freelancers to create, edit, and exhibit their services.

- [ ] **5.1. Create Gig API:** Build backend endpoint accepting complete gig details and saving to DB.
- [ ] **5.2. Gig Retrieval API:** Endpoints to fetch single gig, user specific gigs, and list all active gigs.
- [ ] **5.3. Update/Delete Gig API:** Logic for a freelancer to pause, edit, or remove their own active gigs.
- [ ] **5.4. Gig Form UI:** Multi-step wizard UI for inputting gig details (`Overview` -> `Pricing` -> `Gallery`).
- [ ] **5.5. Image Cropper/Uploader:** UI component to ensure gig thumbnails meet size and aspect ratio guidelines.
- [ ] **5.6. Freelancer Dashboard UI:** Interface displaying created gigs, active statuses, and overall stats profile.
- [ ] **5.7. Gig Details Page UI:** Consumer-facing display showing the Service details, pricing, delivery timeline.
- [ ] **5.8. Tags & Category Selection:** Dropdowns and autocomplete components for selecting the gig’s category/sub-category.
- [ ] **5.9. Gig Verification Logic:** Auto-approve or queue gigs for admin approval based on platform rules.
- [ ] **5.10. Portfolio Showcase:** Allow freelancers to attach distinct portfolio links/images connected to a specific Gig.

---

## 6. Client Discovery & Ordering Flow
**Goal:** Enable clients to find gigs, execute payments, and track orders.

- [ ] **6.1. Discovery Feed & Search API:** Backend logic allowing full-text search, filtering (by price, rating) and pagination.
- [ ] **6.2. Discovery Page UI (Marketplace):** Grid view of all gig result cards including skeleton loading states.
- [ ] **6.3. Search & Filter Sidebars:** Implement functioning UI to allow clients to refine query parameters.
- [ ] **6.4. Order Initiation API:** Backend endpoint mapping order requests from client to the corresponding gig details.
- [ ] **6.5. Checkout Interface:** UI Page outlining order summary, total cost, timeframe, and payment button.
- [ ] **6.6. Razorpay API Integration:** Connect Razorpay on the backend to generate `order_id` based on total amount.
- [ ] **6.7. Frontend Razorpay SDK:** Embed the Razorpay checkout script modal to process Test payments.
- [ ] **6.8. Escrow Logic Update:** Update order status from `Payment Pending` to `In Progress (Escrow)` upon Razorpay webhook success.
- [ ] **6.9. Client Dashboard:** UI allowing the client to view list of "Active Orders" and "Past Orders".
- [ ] **6.10. Freelancer Order Dashboard:** Corresponding view for Freelancer showing "To-Do" assignments queue.

---

## 7. Order Lifecycle, Revisions & Submissions
**Goal:** Handle the workflow between payment and final delivery.

- [ ] **7.1. Order State Machine Logic:** Backend enforcer to ensure transition safety (`Pending` -> `Progress` -> `Submitted` -> `Complete`).
- [ ] **7.2. Order Detail Management UI:** Mutual workspace UI for Client & Freelancer showing exactly where the order stands.
- [ ] **7.3. Submit Deliverables API:** Allow freelancer to POST final zip files/links along with a completion message.
- [ ] **7.4. Deliverables UI:** Upload widget on the freelancer end to attach final outcomes to the order.
- [ ] **7.5. Revision Request API:** Logic allowing client to mark a submission as `Revision Needed` (decrementing revision allowance).
- [ ] **7.6. Revision Flow UI:** Interface allowing client to clearly list feedback and reject early submissions.
- [ ] **7.7. Order Completion API:** Endpoint triggered when client clicks "Approve", finalizing the order.
- [ ] **7.8. Revenue Splitting & Settlement Simulation:** Backend calculation taking platform cut (e.g., 10%) and adding the rest to Freelancer Virtual Wallet.
- [ ] **7.9. Auto-Completion Cron Job:** Script that auto-approves orders `3 days` after submission if client goes inactive.
- [ ] **7.10. Order Cancellation & Refund:** Logic to handle dispute/cancellation, returning money from Escrow to Client.

---

## 8. Real-time Communication (Chat & Notifications)
**Goal:** Enable seamless communication and immediate platform feedback.

- [ ] **8.1. Socket.IO Server Setup:** Mount WebSocket server on Node endpoint, configuring CORS correctly.
- [ ] **8.2. Auth & Socket Mapping:** Logic to tie connected Socket IDs to authenticated user profiles.
- [ ] **8.3. Order Room Logic:** Isolate chats so client and freelancer only broadcast privately within their specific `Order_ID` room.
- [ ] **8.4. Send Message API:** Persistent storage mechanism logging every sent text message.
- [ ] **8.5. Chat Interface UI:** Build Chat bubbles, input box, and real-time scroll-to-bottom mechanics inside the Order page.
- [ ] **8.6. Online/Presence Indication:** WebSocket logic to show a green dot when the counterparty is currently browsing the order.
- [ ] **8.7. Typing Indicators:** Broadcast typing events to let users know the other party is active.
- [ ] **8.8. Notification Tracking API:** Polling/Socket endpoints to deliver systemic alerts (e.g. "Your order was approved!").
- [ ] **8.9. Toast Notification UI:** Global notification consumer component firing visual popups for events.
- [ ] **8.10. Unread Badges Interface:** Render red notification badges on navigation tabs based on unread counts.

---

## 9. Trust System: Ratings, Reviews & Admin Panel
**Goal:** Moderate the ecosystem and establish credibility metrics.

- [ ] **9.1. Review Mechanism API:** Endpoint permitting a client to submit exactly 1 review post-completion.
- [ ] **9.2. Average Rating Recalculation:** Trigger functions to update freelancer’s aggregate profile rating based on new reviews.
- [ ] **9.3. Review Form UI:** Modal appearing after order completion requesting 1-5 stars & textual comments.
- [ ] **9.4. Profile Review Display:** UI rendering list of past reviews natively on the Gig & Profile pages.
- [ ] **9.5. Gamification / Badges Calculation:** Logic mapping total completed orders and ratings to internal badge levels (e.g. `Top Rated`).
- [ ] **9.6. Admin Auth Space:** Segregated UI layout (`/admin`) exclusively for SuperUsers to moderate the platform.
- [ ] **9.7. Identity Approval Pipeline UI:** Admin dash to view submitted student IDs/Gov IDs and toggle `Verified` flags.
- [ ] **9.8. Content Moderation List:** Admin view pulling all Active Gigs for screening against platform policies.
- [ ] **9.9. Dispute Resolution Queue:** Interface for Admins to step into an order and force cancellation/refund.
- [ ] **9.10. Platform Analytics Dashboard:** Basic Chart.js/Recharts implementation tracking GMV (Gross Merchandise Value) and User registrations natively on Admin end.

---

## 10. Performance, Refinement & Deployment
**Goal:** Make the application production-ready, highly aesthetic, and globally available.

- [ ] **10.1. Frontend Optimization:** Implement Next.js Image Optimization and Lazy loading components heavily to ensure sub 2-sec loads.
- [ ] **10.2. SEO Metadata Injector:** Add dynamic `<title>` and `<meta>` tags ensuring gigs share well on Social Media.
- [ ] **10.3. Aesthetic Polish Phase:** Review spacing, micro-animations (Framer Motion), hover states, and color harmony globally.
- [ ] **10.4. Edge-case QA:** Intensive testing of forms (invalid data, large files, network drops) and responsive mobile views.
- [ ] **10.5. Automated Testing Core:** Write basic Jest/Supertest units for the Payment Calculation & Auth pathways to prevent regression.
- [ ] **10.6. Database Indexing:** Add indexes to MongoDB/Postgres for frequent queries (Gig Categories, Owner IDs).
- [ ] **10.7. Backend Hosting Deployment:** Deploy Express API logic to Railway, Render, or similar PaaS.
- [ ] **10.8. Frontend Hosting Deployment:** Deploy Next.js Web App to Vercel/Netlify connected to the main branch.
- [ ] **10.9. CORS and Secret Finalization:** Ensure Production Origin matches and environment secrets are secured.
- [ ] **10.10. Final Walkthrough & Soft Launch:** Complete an end-to-end user registration and order simulation on the production URL before official announcement.
