# ══════════════════════════════════════════════════════════════
#              PRODUCT REQUIREMENT DOCUMENT (PRD)
#              SkillPay — India's Hyper-Local
#              Micro-Freelancing Web Platform
# ══════════════════════════════════════════════════════════════

---

## Document Control

| Field                | Details                                      |
|----------------------|----------------------------------------------|
| **Document Title**   | SkillPay — Product Requirement Document       |
| **Version**          | 1.0                                          |
| **Status**           | Draft → Under Review                        |
| **Author(s)**        | [Your Name / Team Name]                      |
| **Reviewer(s)**      | [Faculty / Mentor / Tech Lead]               |
| **Created Date**     | [DD-MM-YYYY]                                 |
| **Last Updated**     | [DD-MM-YYYY]                                 |
| **Confidentiality**  | Internal — Academic Major Project            |

### Revision History

| Version | Date       | Author       | Changes Made                    |
|---------|------------|--------------|---------------------------------|
| 0.1     | DD-MM-YYYY | [Name]       | Initial raw draft               |
| 1.0     | DD-MM-YYYY | [Name]       | Refined professional PRD v1.0   |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision, Mission & Goals](#3-product-vision-mission--goals)
4. [Target Audience & User Personas](#4-target-audience--user-personas)
5. [Scope Definition & MVP Boundary](#5-scope-definition--mvp-boundary)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [Technology Stack](#9-technology-stack)
10. [Database Design](#10-database-design)
11. [API Design & Endpoints](#11-api-design--endpoints)
12. [UI/UX Requirements & Wireframe Guidelines](#12-uiux-requirements--wireframe-guidelines)
13. [Security Requirements](#13-security-requirements)
14. [Payment Flow & Escrow Logic](#14-payment-flow--escrow-logic)
15. [Chat System Design](#15-chat-system-design)
16. [Testing Strategy](#16-testing-strategy)
17. [Deployment Strategy](#17-deployment-strategy)
18. [Development Roadmap & Sprint Plan](#18-development-roadmap--sprint-plan)
19. [Risk Assessment & Mitigation](#19-risk-assessment--mitigation)
20. [Success Metrics & KPIs](#20-success-metrics--kpis)
21. [Competitive Analysis](#21-competitive-analysis)
22. [Future Roadmap (Phase 2+)](#22-future-roadmap-phase-2)
23. [Glossary](#23-glossary)
24. [Appendices](#24-appendices)

---

## 1. Executive Summary

### 1.1 Product Name
**SkillPay**

### 1.2 Product Type
Responsive Web Application (Desktop + Mobile Web)

### 1.3 One-Line Description
India's first hyper-local, rupee-based micro-freelancing platform enabling students,
homemakers, hobbyists, and small businesses to monetize skills through
affordable gigs ranging from ₹50 to ₹5,000.

### 1.4 Summary
SkillPay addresses a critical gap in the Indian gig economy. While platforms
like Fiverr and Upwork dominate the global freelancing space, they are
dollar-denominated, oriented toward professional-grade work, and inaccessible
to millions of talented Indians — particularly college students in Tier 2/3
cities, homemakers with traditional or creative skills, and hobbyists seeking
to monetize micro-skills.

SkillPay provides a **localized**, **beginner-friendly**, and
**gamified** freelancing ecosystem that enables users to:

- Post and discover micro-gigs across diverse categories
- Transact securely in Indian Rupees (₹)
- Build credibility through ratings, badges, and certificates
- Communicate in real-time through order-based chat
- Receive payments through integrated Indian payment gateways

The MVP (Phase 1) focuses on core freelancing workflows: authentication,
gig management, order lifecycle, real-time chat, ratings/reviews, payment
simulation, and an admin panel.

---

## 2. Problem Statement

### 2.1 Problem Description
India currently lacks a dedicated, Indian-origin freelancing platform
designed for micro-gigs and beginner-level service providers. The existing
landscape presents the following barriers:

| Barrier                     | Description                                                              |
|-----------------------------|--------------------------------------------------------------------------|
| **Currency Mismatch**       | Major platforms operate in USD/EUR, creating friction for Indian users    |
| **Complexity**              | Fiverr/Upwork interfaces are overwhelming for first-time freelancers     |
| **High Entry Barrier**      | Professional portfolios and experience required to compete               |
| **No Localization**         | No support for Indian languages, cultural context, or local trust models |
| **Pricing Mismatch**        | Minimum gig prices are too high for Indian micro-services                |
| **Underserved Demographics**| Students, homemakers, and hobbyists are systematically excluded          |

### 2.2 Impact Analysis

**Who is affected?**

- **40M+ college students** who possess digital skills (video editing,
  content creation, tutoring) but have no platform to monetize them before
  graduation
- **Millions of homemakers** with traditional skills (tailoring, cooking,
  crafts, dance) who seek flexible income opportunities
- **Small businesses** in Tier 2/3 cities that cannot afford professional
  digital marketing agencies
- **Hobbyists and creatives** (photographers, musicians, designers) who want
  to offer micro-services

**Why must this be solved now?**

- India's gig economy is projected to reach **$455 billion by 2024**
  (NITI Aayog)
- Post-COVID shift toward remote/flexible work has accelerated
- Digital literacy and smartphone penetration in Tier 2/3 cities are at
  all-time highs
- Government initiatives (Digital India, Skill India) align with this
  platform's mission

### 2.3 Expected Outcomes

| Outcome                          | Description                                              |
|----------------------------------|----------------------------------------------------------|
| Accessible Freelancing Platform  | Fully Indian, rupee-based, beginner-friendly             |
| Localized User Experience        | Interface suitable for non-English and first-time users  |
| Skill Monetization               | Enable micro-gig earnings from ₹50 to ₹5,000            |
| Credibility System               | Badges, certificates, and ratings to build trust         |
| Scalable Architecture            | Designed to expand from campus to city to nationwide      |

---

## 3. Product Vision, Mission & Goals

### 3.1 Vision
> *Enable every Indian to monetize their skills and talent with ease,
> professionalism, and dignity.*

### 3.2 Mission
> *Build a trusted, engaging, and scalable micro-freelancing ecosystem
> tailored to Indian needs — starting with students, homemakers, and
> small businesses.*

### 3.3 Product Goals

| ID    | Goal                                                    | Priority  |
|-------|---------------------------------------------------------|-----------|
| G-01  | Launch a functional MVP with core freelancing workflows | P0 (Must) |
| G-02  | Enable secure user registration with role-based access  | P0        |
| G-03  | Support gig creation, discovery, and detailed viewing   | P0        |
| G-04  | Implement complete order lifecycle management           | P0        |
| G-05  | Provide real-time chat between clients and freelancers  | P0        |
| G-06  | Integrate ratings and review system                     | P0        |
| G-07  | Simulate/integrate payment processing (Razorpay)        | P0        |
| G-08  | Deliver a clean, responsive, modern UI                  | P0        |
| G-09  | Build an admin panel for platform moderation            | P1        |
| G-10  | Design for scalability toward Phase 2 features          | P1        |

### 3.4 Design Principles

1. **Simplicity First** — Every feature must be usable by a first-time
   freelancer with no prior platform experience
2. **Trust by Design** — Verification, escrow, and ratings create a
   safe ecosystem
3. **India-First** — Rupee-based pricing, Indian payment gateways,
   culturally relevant categories
4. **Progressive Complexity** — Start simple, unlock advanced features
   as users grow
5. **Mobile-First Responsive** — Designed for mobile web users first,
   scaling up to desktop

---

## 4. Target Audience & User Personas

### 4.1 Primary User Segments

| Segment              | Description                              | Key Needs                           |
|----------------------|------------------------------------------|-------------------------------------|
| College Students     | Ages 18–25, digital-native, Tier 1–3     | Earn income, build portfolio        |
| Homemakers           | Ages 25–50, traditional + creative skills| Flexible income, independence       |
| Small Businesses     | Local shops, startups, entrepreneurs     | Affordable digital services         |
| Hobbyists/Creatives  | All ages, part-time skill monetization   | Platform to showcase and sell       |

### 4.2 Detailed User Personas

#### Persona 1: Aarav — The College Student (Freelancer)

| Attribute       | Details                                                    |
|-----------------|------------------------------------------------------------|
| Age             | 20                                                         |
| Location        | Indore, MP (Tier 2 city)                                   |
| Education       | B.Tech 3rd year, Computer Science                          |
| Skills          | Video editing, social media management, basic web design   |
| Tech Comfort    | High — uses smartphone and laptop daily                    |
| Monthly Budget  | ₹2,000–5,000 (from family)                                |
| Goal            | Earn ₹3,000–10,000/month through freelancing               |
| Pain Points     | - Cannot compete on Fiverr with experienced professionals  |
|                 | - No rupee-based platform for small gigs                   |
|                 | - No way to build credible portfolio as a student          |
| Platform Need   | Easy gig posting, badges for credibility, quick payments   |

#### Persona 2: Sunita — The Homemaker (Freelancer)

| Attribute       | Details                                                    |
|-----------------|------------------------------------------------------------|
| Age             | 35                                                         |
| Location        | Jaipur, Rajasthan                                          |
| Education       | Graduate (B.A.)                                            |
| Skills          | Tailoring, mehendi design, cooking recipes, craft work     |
| Tech Comfort    | Medium — uses WhatsApp, YouTube on smartphone              |
| Goal            | Earn ₹5,000–15,000/month from home                         |
| Pain Points     | - No platform recognizes traditional skills as sellable    |
|                 | - Complex interfaces are intimidating                      |
|                 | - Trust and safety concerns with online transactions       |
| Platform Need   | Simple UI, verification for trust, local gig categories    |

#### Persona 3: Rohit — The Small Business Owner (Client)

| Attribute       | Details                                                    |
|-----------------|------------------------------------------------------------|
| Age             | 42                                                         |
| Location        | Lucknow, UP                                                |
| Business        | Local clothing store                                       |
| Need            | 30-second promotional video, social media posts, logo      |
| Budget          | ₹500–2,000 per task                                        |
| Pain Points     | - Cannot afford digital marketing agencies                 |
|                 | - Doesn't know how to find affordable creators             |
| Platform Need   | Browse affordable gigs, view ratings, secure payment       |

#### Persona 4: Admin — Platform Moderator

| Attribute       | Details                                                    |
|-----------------|------------------------------------------------------------|
| Role            | Platform administrator                                     |
| Responsibilities| User verification, content moderation, dispute resolution  |
| Need            | Dashboard with user/gig/order management capabilities      |

### 4.3 User Roles & Permissions

| Role        | Permissions                                                         |
|-------------|---------------------------------------------------------------------|
| Guest       | Browse gigs, view gig details, register                             |
| Freelancer  | Create/edit/delete own gigs, accept orders, chat, view earnings     |
| Client      | Browse/search gigs, place orders, chat, leave reviews               |
| Admin       | Full CRUD on users/gigs/orders, verify users, manage reports        |

---

## 5. Scope Definition & MVP Boundary

### 5.1 In-Scope (Phase 1 — MVP)

| Module                    | Features                                               |
|---------------------------|--------------------------------------------------------|
| Authentication            | Register, Login, Email OTP, Role Selection, ID Upload  |
| Profile Management        | Profile CRUD, Skills, Portfolio Links, Badges, Ratings |
| Gig Management            | Create, Edit, Delete, Browse, Search, Filter, Detail   |
| Order Lifecycle           | Place Order, Status Transitions, Order History         |
| Payment                   | Razorpay Test Mode Integration / Escrow Simulation     |
| Real-Time Chat            | Order-based messaging via Socket.io                    |
| Ratings & Reviews         | Post-order ratings (1–5 stars), text reviews           |
| Admin Panel               | User management, Gig moderation, Report management    |
| Responsive UI             | Mobile-first responsive design                         |

### 5.2 Out-of-Scope (Phase 2+)

| Feature                          | Planned Phase |
|----------------------------------|---------------|
| Digital Skill Wallet             | Phase 2       |
| Gamified Leaderboard             | Phase 2       |
| Referral & Ambassador System     | Phase 2       |
| Subscription Model (Premium)     | Phase 2       |
| AI-Powered Gig Matching          | Phase 3       |
| Multi-Language Support           | Phase 2       |
| LinkedIn Badge Export            | Phase 2       |
| Mobile Native App (React Native) | Phase 3       |
| Certificate Generation           | Phase 2       |
| Advanced Analytics Dashboard     | Phase 3       |

### 5.3 MVP Success Criteria

| Criteria                                   | Target                    |
|--------------------------------------------|---------------------------|
| User can register and select role          | ✅ Functional              |
| User can create and browse gigs            | ✅ Functional              |
| Client can place order on a gig            | ✅ Functional              |
| Order status transitions work correctly    | ✅ Functional              |
| Real-time chat works between order parties | ✅ Functional              |
| Post-order review can be submitted         | ✅ Functional              |
| Payment flow simulated via Razorpay test   | ✅ Functional              |
| Admin can manage users and gigs            | ✅ Functional              |
| UI is responsive on mobile and desktop     | ✅ Responsive              |
| Page load time                             | < 2 seconds               |

---

## 6. Functional Requirements

### 6.1 Module 1: User Authentication & Verification

#### FR-1.1: User Registration

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-1.1.1 | System SHALL provide a registration form with fields: Full Name, Email, Password, Confirm Password, Role (Freelancer/Client) | P0 |
| FR-1.1.2 | System SHALL validate email format and password strength (min 8 chars, 1 uppercase, 1 number, 1 special char) | P0 |
| FR-1.1.3 | System SHALL enforce unique email constraint                    | P0       |
| FR-1.1.4 | System SHALL hash passwords using bcrypt before storage         | P0       |
| FR-1.1.5 | System SHALL send OTP to registered email for verification      | P0       |
| FR-1.1.6 | System SHALL not allow login until email is verified            | P0       |

#### FR-1.2: User Login

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-1.2.1 | System SHALL authenticate users via email + password            | P0       |
| FR-1.2.2 | System SHALL issue JWT access token (15 min expiry) and refresh token (7 day expiry) on successful login | P0 |
| FR-1.2.3 | System SHALL return appropriate error messages for invalid credentials | P0 |
| FR-1.2.4 | System SHALL support "Forgot Password" flow via email OTP      | P1       |

#### FR-1.3: Identity Verification

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-1.3.1 | Students SHALL be able to upload College ID (image/PDF, max 5MB)| P0       |
| FR-1.3.2 | Non-students SHALL be able to upload Government ID proof        | P0       |
| FR-1.3.3 | Admin SHALL be able to review and approve/reject uploaded documents | P0   |
| FR-1.3.4 | System SHALL display verification badge on approved profiles    | P0       |

#### FR-1.4: Role-Based Access Control

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-1.4.1 | System SHALL enforce role-based route protection (Client, Freelancer, Admin) | P0 |
| FR-1.4.2 | Freelancer-only routes: Create Gig, Manage Gigs, View Earnings | P0       |
| FR-1.4.3 | Client-only routes: Place Order, Browse Gigs                   | P0       |
| FR-1.4.4 | Admin-only routes: User Management, Gig Moderation, Reports    | P0       |

---

### 6.2 Module 2: Profile Management

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-2.1   | Users SHALL be able to view and edit their profile              | P0       |
| FR-2.2   | Profile SHALL include: Profile Picture (upload), Display Name, Bio/Description, Skills (tags), Portfolio Links, Location | P0 |
| FR-2.3   | System SHALL display aggregate rating on profile (calculated from reviews) | P0 |
| FR-2.4   | System SHALL display badge level based on completed orders and ratings | P1 |
| FR-2.5   | Profile SHALL be publicly viewable by other users               | P0       |
| FR-2.6   | Profile picture upload SHALL support JPEG/PNG, max 2MB          | P0       |

**Badge Level Logic (Phase 1 — Basic):**

| Badge        | Criteria                                          |
|--------------|---------------------------------------------------|
| New Seller   | 0 completed orders                                |
| Rising Star  | 5+ completed orders, 4.0+ average rating          |
| Top Rated    | 20+ completed orders, 4.5+ average rating         |
| SkillPay Pro | 50+ completed orders, 4.8+ average rating         |

---

### 6.3 Module 3: Gig Management

#### FR-3.1: Create Gig (Freelancer Only)

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-3.1.1 | Freelancer SHALL be able to create a gig with: Title (max 80 chars), Description (max 2000 chars), Category (dropdown), Sub-category, Price (₹50–₹5000), Delivery Time (in days), Thumbnail Image, Tags | P0 |
| FR-3.1.2 | System SHALL validate all required fields before submission     | P0       |
| FR-3.1.3 | System SHALL allow up to 5 gigs per freelancer in MVP           | P1       |

#### FR-3.2: Gig Categories

| Category               | Example Sub-Categories                              |
|------------------------|-----------------------------------------------------|
| Video & Animation      | Video Editing, Reels/Shorts, Animated Explainers    |
| Graphic Design         | Logo Design, Social Media Posts, Posters            |
| Writing & Content      | Blog Posts, Copywriting, Resume Writing             |
| Digital Marketing      | Social Media Management, SEO, Ad Campaigns          |
| Programming & Tech     | Website Development, Bug Fixing, Data Entry         |
| Tutoring & Education   | Math Tutoring, Language Lessons, Exam Prep          |
| Traditional Skills     | Tailoring, Mehendi, Cooking Recipes, Crafts         |
| Music & Audio          | Voiceover, Music Production, Singing                |
| Photography            | Product Photography, Photo Editing, Portraits       |
| Business Services      | Presentations, Data Analysis, Virtual Assistance    |

#### FR-3.3: Browse & Search Gigs

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-3.3.1 | System SHALL display gigs in a responsive grid/card layout      | P0       |
| FR-3.3.2 | System SHALL support search by keyword (title, description, tags)| P0      |
| FR-3.3.3 | System SHALL support filtering by: Category, Price Range, Delivery Time, Seller Rating, Seller Badge Level | P0 |
| FR-3.3.4 | System SHALL support sorting by: Newest, Price (Low→High, High→Low), Rating, Most Orders | P0 |
| FR-3.3.5 | System SHALL implement pagination (12 gigs per page)            | P0       |

#### FR-3.4: Gig Detail Page

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-3.4.1 | System SHALL display: Title, Description, Price, Delivery Time, Category, Seller Info (name, photo, rating, badge), Reviews, Thumbnail | P0 |
| FR-3.4.2 | System SHALL display "Order Now" button for Clients             | P0       |
| FR-3.4.3 | System SHALL display "Contact Seller" button                    | P1       |

#### FR-3.5: Manage Gigs (Freelancer)

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-3.5.1 | Freelancer SHALL be able to edit their own gigs                 | P0       |
| FR-3.5.2 | Freelancer SHALL be able to delete their own gigs               | P0       |
| FR-3.5.3 | Freelancer SHALL be able to toggle gig active/paused status     | P1       |

---

### 6.4 Module 4: Order Lifecycle Management

#### FR-4.1: Order Placement

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-4.1.1 | Client SHALL be able to place an order on any active gig        | P0       |
| FR-4.1.2 | System SHALL create an order record with initial status "PENDING"| P0      |
| FR-4.1.3 | System SHALL trigger payment flow upon order placement          | P0       |
| FR-4.1.4 | System SHALL notify freelancer of new order (in-app notification)| P1      |

#### FR-4.2: Order Status State Machine
```
PENDING
 ├─ Accept → IN PROGRESS → SUBMITTED → APPROVED → COMPLETED
 └─ Decline → CANCELLED

SUBMITTED
 └─ Revision Requested → REVISION → Resubmit → SUBMITTED

 ┌──────────┐ Freelancer ┌─────────────┐ Freelancer ┌───────────┐
│ PENDING │─── Accepts ───→│ IN_PROGRESS │── Submits ───→ │ SUBMITTED │
└──────────┘ └─────────────┘ └───────────┘
│ │
│ Freelancer Client │
│ Declines Approves │
▼ ▼
┌──────────┐ ┌───────────┐
│ CANCELLED │ │ COMPLETED │
└──────────┘ └───────────┘
│
Client │
Requests │
Revision │
▼
┌───────────┐
│ REVISION │
└───────────┘
│
│ Freelancer
│ Resubmits
▼
┌───────────┐
│ SUBMITTED │
└───────────┘
```
 
**Order Statuses:**

| Status       | Description                                     | Triggered By  |
|--------------|-------------------------------------------------|---------------|
| PENDING      | Order placed, awaiting freelancer acceptance     | System        |
| IN_PROGRESS  | Freelancer accepted and working on delivery      | Freelancer    |
| SUBMITTED    | Freelancer submitted deliverables                | Freelancer    |
| REVISION     | Client requested changes                         | Client        |
| COMPLETED    | Client approved, payment released                | Client        |
| CANCELLED    | Order cancelled by either party or system        | Any           |
| DISPUTED     | Dispute raised, under admin review               | Client/Seller |

#### FR-4.3: Order Management

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-4.3.1 | Both parties SHALL be able to view order details and status     | P0       |
| FR-4.3.2 | Freelancer SHALL be able to upload deliverable files            | P0       |
| FR-4.3.3 | Client SHALL be able to approve or request revision             | P0       |
| FR-4.3.4 | System SHALL allow max 2 revision requests per order (MVP)      | P1       |
| FR-4.3.5 | System SHALL auto-complete order after 3 days if client doesn't respond to submission | P1 |
| FR-4.3.6 | Both parties SHALL have access to order history                 | P0       |

---

### 6.5 Module 5: Payment System

#### FR-5.1: Payment Integration

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-5.1.1 | System SHALL integrate Razorpay payment gateway (Test Mode for MVP) | P0   |
| FR-5.1.2 | System SHALL support UPI, Debit Card, Credit Card, Net Banking  | P0       |
| FR-5.1.3 | All prices SHALL be in Indian Rupees (₹)                        | P0       |

#### FR-5.2: Escrow Flow

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-5.2.1 | Client payment SHALL be held in escrow until order completion   | P0       |
| FR-5.2.2 | Payment SHALL be released to freelancer upon client approval     | P0       |
| FR-5.2.3 | Platform SHALL deduct commission (10–15%) before settlement     | P0       |
| FR-5.2.4 | System SHALL maintain transaction history for all users          | P0       |

**Payment Flow:**
```
+----------------------+
|  Client Places Order |
+----------------------+
           │
           ▼
+-------------------------------+
| Client Pays via Razorpay     |
| → Amount Held in Escrow      |
+-------------------------------+
           │
           ▼
+------------------------------+
| Freelancer Completes Work    |
+------------------------------+
           │
           ▼
+------------------------------+
| Client Approves Delivery     |
+------------------------------+
           │
           ▼
+--------------------------------------+
| Platform Deducts Commission (10–15%) |
+--------------------------------------+
           │
           ▼
+--------------------------------------+
| Amount Released to Freelancer Wallet |
+--------------------------------------+
           │
           ▼
+--------------------------------------+
| Freelancer Requests Payout           |
| → Bank Transfer                      |
+--------------------------------------+
```

> **Note for MVP:** Razorpay Test Mode will be used. Escrow will be
> simulated through order status logic and a virtual wallet balance in
> the database. Full escrow and payout integration is Phase 2.

---

### 6.6 Module 6: Real-Time Chat System

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-6.1   | System SHALL provide real-time messaging between client and freelancer within the context of an order | P0 |
| FR-6.2   | Chat SHALL be initiated automatically when an order is placed   | P0       |
| FR-6.3   | Messages SHALL be persisted in the database                     | P0       |
| FR-6.4   | System SHALL display message timestamps                         | P0       |
| FR-6.5   | System SHALL show online/offline indicator                      | P1       |
| FR-6.6   | System SHALL support text messages (file sharing in Phase 2)    | P0       |
| FR-6.7   | Chat SHALL be accessible from the order detail page             | P0       |

---

### 6.7 Module 7: Ratings & Reviews

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-7.1   | Client SHALL be able to rate a freelancer after order completion (1–5 stars) | P0 |
| FR-7.2   | Client SHALL be able to submit a text review (max 500 chars)    | P0       |
| FR-7.3   | System SHALL calculate and update freelancer's average rating automatically | P0 |
| FR-7.4   | Reviews SHALL be displayed on gig detail page and freelancer profile | P0   |
| FR-7.5   | Each order SHALL allow only one review                          | P0       |
| FR-7.6   | Reviews SHALL NOT be editable once submitted                    | P0       |
| FR-7.7   | Freelancer SHALL be able to rate client (Phase 2)               | P2       |

---

### 6.8 Module 8: Admin Panel

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-8.1   | Admin SHALL have a separate dashboard accessible via admin login| P0       |
| FR-8.2   | Admin SHALL be able to view all registered users with filters (role, status, verification) | P0 |
| FR-8.3   | Admin SHALL be able to verify/reject uploaded identity documents| P0       |
| FR-8.4   | Admin SHALL be able to view all gigs with ability to activate/deactivate | P0 |
| FR-8.5   | Admin SHALL be able to view all orders and their statuses       | P0       |
| FR-8.6   | Admin SHALL be able to view and act on reported content/users   | P1       |
| FR-8.7   | Admin dashboard SHALL display key metrics: Total Users, Active Gigs, Total Orders, Revenue | P1 |

---

### 6.9 Module 9: Notifications (Basic)

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| FR-9.1   | System SHALL show in-app toast notifications for key events     | P1       |
| FR-9.2   | Key events: New Order, Order Status Change, New Message, New Review | P1    |
| FR-9.3   | Email notifications for critical events (order placed, completed)| P2      |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID       | Requirement                                                     | Target       |
|----------|-----------------------------------------------------------------|--------------|
| NFR-1.1  | Initial page load time                                          | < 2 seconds  |
| NFR-1.2  | API response time (95th percentile)                             | < 500ms      |
| NFR-1.3  | Chat message delivery latency                                   | < 200ms      |
| NFR-1.4  | Image optimization (lazy loading, compression)                  | Implemented  |
| NFR-1.5  | Support concurrent users (MVP)                                  | 100+         |

### 7.2 Security

| ID       | Requirement                                                     | Priority |
|----------|-----------------------------------------------------------------|----------|
| NFR-2.1  | All passwords SHALL be hashed using bcrypt (salt rounds: 12)    | P0       |
| NFR-2.2  | All API routes SHALL be protected via JWT middleware             | P0       |
| NFR-2.3  | File uploads SHALL be validated for type and size               | P0       |
| NFR-2.4  | SQL injection prevention via parameterized queries (Prisma ORM) | P0       |
| NFR-2.5  | XSS prevention via input sanitization                           | P0       |
| NFR-2.6  | CORS configuration SHALL restrict origins                       | P0       |
| NFR-2.7  | Rate limiting on auth endpoints (max 5 attempts/minute)         | P1       |
| NFR-2.8  | HTTPS enforced in production                                    | P0       |
| NFR-2.9  | Razorpay webhook signature verification                         | P0       |

### 7.3 Scalability

| ID       | Requirement                                                     |
|----------|-----------------------------------------------------------------|
| NFR-3.1  | Modular architecture enabling independent service scaling       |
| NFR-3.2  | Database designed with proper indexing and normalization         |
| NFR-3.3  | Stateless API design for horizontal scaling                     |
| NFR-3.4  | Environment-based configuration (dev, staging, production)      |

### 7.4 Usability

| ID       | Requirement                                                     |
|----------|-----------------------------------------------------------------|
| NFR-4.1  | Mobile-first responsive design (breakpoints: 320px, 768px, 1024px, 1280px) |
| NFR-4.2  | WCAG 2.1 Level AA accessibility compliance (best effort)        |
| NFR-4.3  | Consistent design system with reusable components               |
| NFR-4.4  | Maximum 3-click depth to reach any feature                      |
| NFR-4.5  | Clear error messages and loading states throughout              |

### 7.5 Reliability

| ID       | Requirement                                                     | Target    |
|----------|-----------------------------------------------------------------|-----------|
| NFR-5.1  | Application uptime                                              | 99%       |
| NFR-5.2  | Graceful error handling (no white screens)                      | All pages |
| NFR-5.3  | Database backup frequency                                       | Daily     |

### 7.6 Maintainability

| ID       | Requirement                                                     |
|----------|-----------------------------------------------------------------|
| NFR-6.1  | Codebase SHALL follow consistent naming conventions and folder structure |
| NFR-6.2  | All modules SHALL have README documentation                     |
| NFR-6.3  | Environment variables managed via .env files (not hardcoded)    |
| NFR-6.4  | Git version control with conventional commit messages           |

---

## 8. System Architecture

### 8.1 Architecture Overview

SkillPay follows a **3-tier client-server architecture** with a separate
frontend, backend API server, database layer, and external service
integrations.
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT LAYER                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend Application                         │  │
│  │                (React + Tailwind CSS + Shadcn UI)                       │  │
│  │                                                                        │  │
│  │  Pages:                                                               │  │
│  │  • Landing   • Auth   • Dashboard   • Gigs   • Orders                  │  │
│  │  • Chat      • Profile   • Admin Panel                                 │  │
│  └───────────────────────────────┬────────────────────────────────────────┘  │
│                                  │                                           │
│                         HTTPS (REST API Calls)                               │
│                         WebSocket (Socket.io)                                │
└──────────────────────────────────┼───────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────┼───────────────────────────────────────────┐
│                                 SERVER LAYER                                 │
├──────────────────────────────────┼───────────────────────────────────────────┤
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                    Node.js + Express.js API Server                     │  │
│  │                                                                        │  │
│  │  Middleware:                                                           │  │
│  │  • Auth (JWT)  • CORS  • Rate Limiting                                 │  │
│  │  • Error Handling  • File Upload (Multer)                              │  │
│  │                                                                        │  │
│  │  Routes:                                                               │  │
│  │  /api/auth   /api/users   /api/gigs                                     │  │
│  │  /api/orders /api/reviews /api/chat                                     │  │
│  │  /api/admin  /api/payments                                              │  │
│  │                                                                        │  │
│  │  Services:                                                             │  │
│  │  • AuthService      • GigService      • OrderService                   │  │
│  │  • PaymentService   • ChatService     • EmailService                   │  │
│  │                                                                        │  │
│  │  Socket.io Server → Real-Time Chat                                     │  │
│  └───────────────┬───────────────────────────────┬────────────────────────┘  │
│                  │                               │                           │
└──────────────────┼───────────────────────────────┼───────────────────────────┘
                   │                               │
                   ▼                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  DATA LAYER                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────┐        ┌──────────────────────────────────┐   │
│  │        PostgreSQL         │        │           File Storage            │   │
│  │        (via Prisma)       │        │       (Local / Cloudinary)        │   │
│  │                           │        │                                  │   │
│  │  Tables:                  │        │  • Profile Images                │   │
│  │  • users                  │        │  • ID Documents                  │   │
│  │  • gigs                   │        │  • Gig Thumbnails                │   │
│  │  • orders                 │        │  • Deliverables                  │   │
│  │  • reviews                │        │                                  │   │
│  │  • messages               │        └──────────────────────────────────┘   │
│  │  • transactions           │                                               │
│  │  • notifications          │                                               │
│  └───────────────────────────┘                                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SERVICES                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│     ┌───────────────┐      ┌───────────────┐      ┌─────────────────────┐    │
│     │   Razorpay    │      │   Nodemailer  │      │     Cloudinary       │    │
│     │   Payments    │      │     Email     │      │    Image Storage     │    │
│     └───────────────┘      └───────────────┘      └─────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```



### 8.2 Architecture Decisions

| Decision                      | Rationale                                              |
|-------------------------------|--------------------------------------------------------|
| Separate Frontend & Backend   | Better separation of concerns, independent deployment, demonstrates architectural maturity |
| REST API over GraphQL         | Simpler for MVP scope, well-understood by team         |
| PostgreSQL over MongoDB       | Relational data model (users→gigs→orders→reviews) benefits from ACID compliance and joins |
| Prisma ORM                    | Type-safe queries, auto-generated types, easy migrations|
| Socket.io for Chat            | Industry-standard real-time communication, supports rooms/namespaces |
| JWT over Session-based Auth   | Stateless, scalable, suitable for API-based architecture|

---

## 9. Technology Stack

### 9.1 Complete Stack Overview

| Layer              | Technology                   | Version  | Purpose                          |
|--------------------|------------------------------|----------|----------------------------------|
| **Frontend**       | Next.js                      | 14.x     | React framework (SSR + Routing)  |
| **UI Library**     | React                        | 18.x     | Component-based UI               |
| **Styling**        | Tailwind CSS                 | 3.x      | Utility-first CSS framework      |
| **UI Components**  | Shadcn/UI                    | Latest   | Pre-built accessible components  |
| **Animations**     | Framer Motion                | 10.x     | Page transitions & micro-animations |
| **Forms**          | React Hook Form              | 7.x      | Performant form management       |
| **Validation**     | Zod                          | 3.x      | Schema validation (client + server) |
| **HTTP Client**    | Axios                        | 1.x      | API communication                |
| **Notifications**  | React Hot Toast              | 2.x      | Toast notifications              |
| **State Mgmt**     | Zustand / React Context      | 4.x      | Client-side state management     |
| **Backend**        | Node.js                      | 20.x LTS | JavaScript runtime               |
| **API Framework**  | Express.js                   | 4.x      | REST API framework               |
| **Database**       | PostgreSQL                   | 15.x     | Relational database              |
| **ORM**            | Prisma                       | 5.x      | Database toolkit & ORM           |
| **Authentication** | JWT (jsonwebtoken)           | 9.x      | Token-based authentication       |
| **Password Hash**  | bcryptjs                     | 2.x      | Password hashing                 |
| **Real-Time**      | Socket.io                    | 4.x      | WebSocket-based chat             |
| **File Upload**    | Multer                       | 1.x      | Multipart file handling          |
| **Image Storage**  | Cloudinary                   | 1.x      | Cloud image management           |
| **Email**          | Nodemailer                   | 6.x      | Email OTP & notifications        |
| **Payments**       | Razorpay Node SDK            | 2.x      | Payment gateway integration      |
| **Deployment (FE)**| Vercel                       | —        | Frontend hosting                 |
| **Deployment (BE)**| Render / Railway             | —        | Backend hosting                  |
| **Database Host**  | Supabase / Railway / Neon    | —        | Managed PostgreSQL               |
| **Version Control**| Git + GitHub                 | —        | Source code management           |

### 9.2 Development Tools

| Tool               | Purpose                                    |
|--------------------|--------------------------------------------|
| VS Code            | Primary IDE                                |
| Postman            | API testing & documentation                |
| pgAdmin / Prisma Studio | Database management & visualization  |
| GitHub Actions     | CI/CD pipeline (optional)                  |
| Figma              | UI/UX design & prototyping                 |
| ESLint + Prettier  | Code quality and formatting                |

### 9.3 Stack Justification

**Why Next.js?**
- Server-Side Rendering (SSR) for SEO (gig pages need to be indexable)
- File-based routing simplifies page management
- Built-in image optimization
- Production-ready with Vercel deployment
- Industry-standard React framework

**Why Separate Express Backend?**
- Demonstrates proper architectural separation (important for academic evaluation)
- Easier to implement Socket.io chat server
- Better control over middleware and API design
- Scalable independently from frontend

**Why PostgreSQL + Prisma?**
- Freelancing data is inherently relational (Users → Gigs → Orders → Reviews)
- ACID compliance ensures data integrity for payments
- Prisma provides type-safe database access and easy migrations
- PostgreSQL is production-grade and free on managed platforms

**Why Razorpay?**
- Native Indian payment gateway
- Supports UPI, cards, net banking, wallets
- Excellent test mode for development
- Well-documented API with Node.js SDK

---

## 10. Database Design

### 10.1 Entity-Relationship Diagram (Conceptual)
```
┌──────────────────┐        1:N        ┌──────────────────┐        1:N        ┌──────────────────┐
│      USERS       │──────────────────▶│       GIGS       │──────────────────▶│      ORDERS      │
├──────────────────┤                   ├──────────────────┤                   ├──────────────────┤
│ id (PK)          │                   │ id (PK)          │                   │ id (PK)          │
│ name             │                   │ user_id (FK)     │◀──────────────────│ gig_id (FK)      │
│ email            │                   │ title            │                   │ client_id (FK)   │
│ password         │                   │ description      │                   │ seller_id (FK)   │
│ role             │                   │ price            │                   │ status           │
│ verified         │                   │ category         │                   │ amount           │
│ avatar           │                   │ delivery_time    │                   │ paid             │
│ rating           │                   │ image            │                   │ created_at       │
│ badge            │                   │ active           │                   │ updated_at       │
│ bio              │                   │ tags             │                   └─────────┬────────┘
│ skills           │                   │ created_at       │                             │
│ location         │                   └──────────────────┘                             │1:1
│ created_at       │                                                                     │
│ updated_at       │        1:N                                                          │
└─────────┬────────┘────────────────────────────────────────────────────────────────────┘
          │
          │
          │
          ▼
┌──────────────────┐                          ┌──────────────────┐
│     MESSAGES     │                          │      REVIEWS     │
├──────────────────┤                          ├──────────────────┤
│ id (PK)          │                          │ id (PK)          │
│ order_id (FK)    │                          │ order_id (FK)    │
│ sender_id (FK)   │                          │ reviewer_id (FK) │
│ content          │                          │ rating           │
│ timestamp        │                          │ comment          │
└──────────────────┘                          │ created_at       │
                                              └──────────────────┘


                           ┌──────────────────────────────┐
                           │         TRANSACTIONS         │
                           ├──────────────────────────────┤
                           │ id (PK)                      │
                           │ order_id (FK)                │
                           │ payer_id (FK)                │
                           │ payee_id (FK)                │
                           │ amount                       │
                           │ commission                   │
                           │ net_amount                   │
                           │ razorpay_payment_id          │
                           │ status                       │
                           │ created_at                   │
                           └──────────────────────────────┘
```


### 10.2 Detailed Schema (Prisma Schema)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────
// ENUMS
// ─────────────────────────────────────

enum UserRole {
  CLIENT
  FREELANCER
  ADMIN
}

enum VerificationStatus {
  UNVERIFIED
  PENDING
  VERIFIED
  REJECTED
}

enum BadgeLevel {
  NEW_SELLER
  RISING_STAR
  TOP_RATED
  SKILLPAY_PRO
}

enum GigCategory {
  VIDEO_ANIMATION
  GRAPHIC_DESIGN
  WRITING_CONTENT
  DIGITAL_MARKETING
  PROGRAMMING_TECH
  TUTORING_EDUCATION
  TRADITIONAL_SKILLS
  MUSIC_AUDIO
  PHOTOGRAPHY
  BUSINESS_SERVICES
}

enum OrderStatus {
  PENDING
  IN_PROGRESS
  SUBMITTED
  REVISION
  COMPLETED
  CANCELLED
  DISPUTED
}

enum PaymentStatus {
  PENDING
  HELD
  RELEASED
  REFUNDED
  FAILED
}

// ─────────────────────────────────────
// MODELS
// ─────────────────────────────────────

model User {
  id                  String             @id @default(cuid())
  email               String             @unique
  password            String
  name                String
  role                UserRole           @default(CLIENT)
  avatar              String?
  bio                 String?            @db.Text
  skills              String[]           @default([])
  portfolioLinks      String[]           @default([])
  location            String?
  phone               String?
  emailVerified       Boolean            @default(false)
  verificationStatus  VerificationStatus @default(UNVERIFIED)
  idDocumentUrl       String?
  badgeLevel          BadgeLevel         @default(NEW_SELLER)
  averageRating       Float              @default(0)
  totalReviews        Int                @default(0)
  totalCompletedOrders Int               @default(0)
  walletBalance       Float              @default(0)
  totalEarnings       Float              @default(0)
  isActive            Boolean            @default(true)
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  // Relations
  gigs                Gig[]
  ordersAsClient      Order[]            @relation("ClientOrders")
  ordersAsFreelancer  Order[]            @relation("FreelancerOrders")
  reviewsGiven        Review[]           @relation("ReviewsGiven")
  reviewsReceived     Review[]           @relation("ReviewsReceived")
  messagesSent        Message[]
  transactionsAsPayer Transaction[]      @relation("PayerTransactions")
  transactionsAsPayee Transaction[]      @relation("PayeeTransactions")

  @@index([role])
  @@index([verificationStatus])
  @@index([averageRating])
  @@map("users")
}

model Gig {
  id            String      @id @default(cuid())
  title         String      @db.VarChar(80)
  description   String      @db.Text
  category      GigCategory
  subCategory   String?
  price         Float
  deliveryDays  Int
  thumbnailUrl  String?
  tags          String[]    @default([])
  isActive      Boolean     @default(true)
  totalOrders   Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relations
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders        Order[]

  @@index([category])
  @@index([price])
  @@index([isActive])
  @@index([userId])
  @@map("gigs")
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique @default(cuid())
  status          OrderStatus   @default(PENDING)
  amount          Float
  platformFee     Float         @default(0)
  netAmount       Float         @default(0)
  paymentStatus   PaymentStatus @default(PENDING)
  deliveryDeadline DateTime?
  deliverableUrl  String?
  revisionCount   Int           @default(0)
  maxRevisions    Int           @default(2)
  requirements    String?       @db.Text
  completedAt     DateTime?
  cancelledAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  gigId           String
  gig             Gig           @relation(fields: [gigId], references: [id])
  clientId        String
  client          User          @relation("ClientOrders", fields: [clientId], references: [id])
  freelancerId    String
  freelancer      User          @relation("FreelancerOrders", fields: [freelancerId], references: [id])
  review          Review?
  messages        Message[]
  transaction     Transaction?

  @@index([status])
  @@index([clientId])
  @@index([freelancerId])
  @@index([paymentStatus])
  @@map("orders")
}

model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  comment     String?  @db.VarChar(500)
  createdAt   DateTime @default(now())

  // Relations
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])
  reviewerId  String
  reviewer    User     @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  revieweeId  String
  reviewee    User     @relation("ReviewsReceived", fields: [revieweeId], references: [id])

  @@index([revieweeId])
  @@map("reviews")
}

model Message {
  id        String   @id @default(cuid())
  content   String   @db.Text
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  // Relations
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id])

  @@index([orderId])
  @@index([senderId])
  @@map("messages")
}

model Transaction {
  id             String        @id @default(cuid())
  amount         Float
  commission     Float
  netAmount      Float
  razorpayOrderId   String?
  razorpayPaymentId String?
  razorpaySignature String?
  status         PaymentStatus @default(PENDING)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relations
  orderId        String        @unique
  order          Order         @relation(fields: [orderId], references: [id])
  payerId        String
  payer          User          @relation("PayerTransactions", fields: [payerId], references: [id])
  payeeId        String
  payee          User          @relation("PayeeTransactions", fields: [payeeId], references: [id])

  @@index([status])
  @@map("transactions")
}

model OtpVerification {
  id        String   @id @default(cuid())
  email     String
  otp       String
  expiresAt DateTime
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([email])
  @@map("otp_verifications")
}
```
| **Table**        | **Indexed Columns**                           | **Rationale**                                                  |
| ---------------- | --------------------------------------------- | -------------------------------------------------------------- |
| **users**        | role, verificationStatus, averageRating       | Used for filtering users and sorting freelancers by rating     |
| **gigs**         | category, price, isActive, userId             | Improves search, filtering, and browsing of gigs               |
| **orders**       | status, clientId, freelancerId, paymentStatus | Speeds up order tracking and management queries                |
| **reviews**      | revieweeId                                    | Optimizes retrieval of reviews for profile rating calculations |
| **messages**     | orderId, senderId                             | Enables faster chat message retrieval for specific orders      |
| **transactions** | status                                        | Helps in payment reconciliation and financial tracking         |


# 11. API Design & Endpoints

## 11.1 API Conventions

| Convention | Standard |
|---|---|
| **Base URL** | `/api/v1` |
| **Data Format** | JSON |
| **Authentication** | Bearer Token (JWT) in `Authorization` header |
| **Error Response** | `{ "success": false, "error": { "code": "...", "message": "..." } }` |
| **Success Response** | `{ "success": true, "data": { ... } }` |
| **Pagination** | `?page=1&limit=12` |
| **HTTP Methods** | GET (read), POST (create), PUT (update), DELETE (remove), PATCH (partial update) |

---

# 11.2 API Endpoint Inventory

---

# Authentication API
Base Path: `/api/v1/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register new user | No |
| POST | `/verify-otp` | Verify email OTP | No |
| POST | `/resend-otp` | Resend OTP to email | No |
| POST | `/login` | Login and receive access/refresh tokens | No |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/forgot-password` | Send password reset OTP | No |
| POST | `/reset-password` | Reset password using OTP | No |
| POST | `/logout` | Invalidate refresh token | Yes |

---

# Users API
Base Path: `/api/v1/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/me` | Get current authenticated user profile | Yes |
| PUT | `/me` | Update user profile | Yes |
| PUT | `/me/avatar` | Upload or update profile picture | Yes |
| PUT | `/me/verify-id` | Upload identity verification document | Yes |
| GET | `/:id` | Get public user profile | No |
| GET | `/:id/gigs` | Get user's public gigs | No |
| GET | `/:id/reviews` | Get reviews received by user | No |

---

# Gigs API
Base Path: `/api/v1/gigs`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/` | Create a new gig | Freelancer |
| GET | `/` | Browse or search gigs (paginated) | No |
| GET | `/:id` | Retrieve gig details | No |
| PUT | `/:id` | Update gig (owner only) | Freelancer |
| DELETE | `/:id` | Delete gig (owner only) | Freelancer |
| PATCH | `/:id/toggle` | Toggle gig active status | Freelancer |
| GET | `/my-gigs` | Retrieve freelancer’s own gigs | Freelancer |
| GET | `/categories` | Get all gig categories | No |

### Query Parameters for `GET /gigs`

| Parameter | Type | Description |
|---|---|---|
| search | string | Keyword search in title or description |
| category | enum | Filter gigs by category |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| deliveryDays | number | Maximum delivery time |
| minRating | number | Minimum freelancer rating |
| sortBy | string | Sorting (`newest`, `price_asc`, `price_desc`, `rating`) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12) |

---

# Orders API
Base Path: `/api/v1/orders`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/` | Place a new order | Client |
| GET | `/my-orders` | Get user orders (client or freelancer) | Yes |
| GET | `/:id` | Retrieve order details | Order Party |
| PATCH | `/:id/accept` | Freelancer accepts order | Freelancer |
| PATCH | `/:id/decline` | Freelancer declines order | Freelancer |
| PATCH | `/:id/submit` | Freelancer submits deliverable | Freelancer |
| PATCH | `/:id/approve` | Client approves delivery | Client |
| PATCH | `/:id/request-revision` | Client requests revision | Client |
| PATCH | `/:id/cancel` | Cancel order | Order Party |

---

# Reviews API
Base Path: `/api/v1/reviews`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/` | Submit review for completed order | Client |
| GET | `/gig/:gigId` | Get reviews for a gig | No |
| GET | `/user/:userId` | Get reviews for a user | No |

---

# Chat API
Base Path: `/api/v1/chat`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/order/:orderId` | Retrieve chat history for an order | Order Party |
| POST | `/order/:orderId` | Send message (REST fallback for chat) | Order Party |

---

# Payments API
Base Path: `/api/v1/payments`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/create-order` | Create Razorpay payment order | Client |
| POST | `/verify` | Verify Razorpay payment signature | Yes |
| GET | `/transactions` | Retrieve user's transaction history | Yes |
| GET | `/wallet` | Get freelancer wallet balance | Freelancer |

---

# Admin API
Base Path: `/api/v1/admin`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/dashboard` | Retrieve admin dashboard metrics | Admin |
| GET | `/users` | List all users (paginated) | Admin |
| PATCH | `/users/:id/verify` | Approve or reject user verification | Admin |
| PATCH | `/users/:id/status` | Activate or deactivate user | Admin |
| GET | `/gigs` | List all gigs | Admin |
| PATCH | `/gigs/:id/status` | Activate or deactivate gig | Admin |
| GET | `/orders` | List all orders | Admin |
| GET | `/reports` | Retrieve reported content | Admin |
| PATCH | `/reports/:id` | Resolve reported content | Admin |

---

# 11.3 Standard API Response Formats
### Success Response:

```JSON

{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```
### Error Response:

```JSON

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Price must be between ₹50 and ₹5000",
    "details": [ ... ]
  }
}
```
# 12. UI/UX Requirements & Wireframe Guidelines

---

# 12.1 Design System

| Element | Specification |
|---|---|
| **Primary Color** | Indigo `#4F46E5` — Trust, professionalism |
| **Secondary Color** | Emerald `#10B981` — Success, money, growth |
| **Accent Color** | Amber `#F59E0B` — Ratings, highlights |
| **Error Color** | Red `#EF4444` |
| **Background** | White `#FFFFFF`, Gray-50 `#F9FAFB` |
| **Text Primary** | Gray-900 `#111827` |
| **Text Secondary** | Gray-600 `#4B5563` |
| **Font Family** | Inter (headings), System font stack (body) |
| **Border Radius** | 8px (cards), 6px (buttons), 12px (modals) |
| **Shadow** | Tailwind `shadow-sm`, `shadow-md`, `shadow-lg` |

---

# 12.2 Page Inventory

| Page | Route | Access | Description |
|---|---|---|---|
| **Landing Page** | `/` | Public | Hero section, platform features, categories, call-to-action |
| **Register** | `/register` | Public | User registration form with role selection |
| **Login** | `/login` | Public | Login form for existing users |
| **OTP Verification** | `/verify` | Public | Email OTP verification screen |
| **Forgot Password** | `/forgot-password` | Public | Password recovery flow |
| **Browse Gigs** | `/gigs` | Public | Gig listing with search and filters |
| **Gig Detail** | `/gigs/[id]` | Public | Detailed gig page with order CTA |
| **Dashboard** | `/dashboard` | Authenticated | Role-based dashboard overview |
| **Create Gig** | `/dashboard/gigs/new` | Freelancer | Form for creating a new gig |
| **Edit Gig** | `/dashboard/gigs/[id]` | Freelancer | Gig editing interface |
| **My Gigs** | `/dashboard/my-gigs` | Freelancer | Freelancer gig management |
| **My Orders** | `/dashboard/orders` | Authenticated | List of orders (client or freelancer view) |
| **Order Detail** | `/dashboard/orders/[id]` | Order Party | Order details with actions and chat |
| **Profile** | `/profile/[id]` | Public | Public user profile page |
| **Edit Profile** | `/dashboard/profile` | Authenticated | Profile editing page |
| **Wallet** | `/dashboard/wallet` | Freelancer | Earnings overview and transaction history |
| **Admin Dashboard** | `/admin` | Admin | Platform metrics and insights |
| **Admin Users** | `/admin/users` | Admin | User management interface |
| **Admin Gigs** | `/admin/gigs` | Admin | Gig moderation panel |
| **Admin Orders** | `/admin/orders` | Admin | Order monitoring and oversight |
| **404 Page** | `/404` | Public | Not found error page |

---
# 12.3 Key Page Layouts

## Landing Page Structure


```
┌─────────────────────────────────────────────────────────────────────┐
│                              NAVBAR                                 │
│  Logo | Browse Gigs | Categories | How It Works | Login | Sign Up   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            HERO SECTION                             │
│                                                                     │
│               "Monetize Your Skills, Your Way"                      │
│         Find work, sell services, and grow your income              │
│                                                                     │
│            [ Get Started ]      [ Browse Gigs ]                     │
│                                                                     │
│                   (Illustration / Hero Graphic)                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           HOW IT WORKS                              │
│                                                                     │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│   │ 1. Register │ --> │ 2. Post or  │ --> │ 3. Get Paid │           │
│   │             │     │ Browse Gigs │     │  Securely   │           │
│   └─────────────┘     └─────────────┘     └─────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSE BY CATEGORY                           │
│                                                                     │
│  [Design]   [Development]   [Writing]   [Video Editing]             │
│  [AI Tools] [Marketing]     [Music]     [Tutoring]                  │
│                                                                     │
│                (Grid of category cards with icons)                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         FEATURED GIGS                               │
│                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│   │ Gig Card    │  │ Gig Card    │  │ Gig Card    │                 │
│   │ Image       │  │ Image       │  │ Image       │                 │
│   │ Title       │  │ Title       │  │ Title       │                 │
│   │ Price ₹     │  │ Price ₹     │  │ Price ₹     │                 │
│   └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                     │
│                       (Carousel Slider)                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         WHY SKILLPAY                                │
│                                                                     │
│   ✓ Rupee-based Marketplace                                         │
│   ✓ Beginner Friendly                                               │
│   ✓ Verified Freelancers                                            │
│   ✓ Secure Payments (Escrow)                                        │
│   ✓ Fast Payouts                                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          TESTIMONIALS                               │
│                                                                     │
│  "Great platform for students to start freelancing!"                │
│  - User Review                                                      │
│                                                                     │
│  (Slider with user feedback cards)                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                               FOOTER                                │
│                                                                     │
│  About | Careers | Help Center | Privacy | Terms                    │
│  Social Media Icons                                                 │
│  © 2026 SkillPay. All rights reserved.                              │
└─────────────────────────────────────────────────────────────────────┘
```
## Gig Card Component
```
┌──────────────────────────────┐
│ ┌──────────────────────────┐ │
│ │      Thumbnail Image     │ │
│ └──────────────────────────┘ │
│                              │
│ Gig Title (2 lines max)      │
│ Example: Logo design service │
│                              │
│ ┌──────┐                     │
│ │Avatar│ Seller Name         │
│ └──────┘ ⭐ 4.8 (23)         │
│                              │
│ ──────────────────────────── │
│ Starting at           ₹500   │
└──────────────────────────────┘
```
## 12.4 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|---|---|---|
| **Mobile** | < 768px | Single column layout, hamburger navigation menu, stacked cards |
| **Tablet** | 768px | 2-column grid layout, collapsible sidebar |
| **Desktop** | 1024px | 3–4 column grid layout, full sidebar, expanded navigation |
| **Large Screens** | 1280px+ | Max-width container with optimized spacing |

---

# 13. Security Requirements

---

## 13.1 Authentication Security

| Requirement | Implementation |
|---|---|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Access Token Expiry** | 15 minutes |
| **JWT Refresh Token Expiry** | 7 days |
| **Token Storage (Client-side)** | httpOnly cookies (preferred) or secure localStorage |
| **OTP Expiry** | 10 minutes |
| **OTP Length** | 6 digits |
| **Max Login Attempts Before Throttling** | 5 attempts per minute |

---

## 13.2 API Security

| Requirement | Implementation |
|---|---|
| **Input Validation** | Zod schemas on all endpoints |
| **SQL Injection Prevention** | Prisma parameterized queries |
| **XSS Prevention** | Input sanitization, Content Security Policy (CSP) headers |
| **CORS Policy** | Whitelist frontend origin only |
| **Rate Limiting** | express-rate-limit (100 req/min general, 5 req/min for auth endpoints) |
| **HTTP Security Headers** | Helmet.js middleware |
| **File Upload Validation** | Type checking (image/pdf) and file size limits (5MB) |

---

## 13.3 Payment Security

| Requirement | Implementation |
|---|---|
| **Webhook Signature Verification** | Razorpay HMAC SHA256 signature validation |
| **Payment Amount Verification** | Compare payment amount with order value stored in database |
| **Sensitive Payment Data Handling** | No card data stored locally; handled by Razorpay |
| **Transaction Logging** | All payment events recorded in database |

---

## 13.4 Data Privacy

| Requirement | Implementation |
|---|---|
| **Sensitive Data Encryption** | PostgreSQL encryption and secure environment variables |
| **ID Document Access Restriction** | Admin-only access using signed URLs |
| **User Data Deletion Capability** | Account deactivation (soft delete mechanism) |
| **Environment Variables** | Stored in `.env` files and never committed to Git |

---
# 14. Payment Flow & Escrow Logic

## 14.1 End-to-End Payment Flow

```text
Step 1: Client clicks "Order Now" on a gig
            │
            ▼
Step 2: System creates an Order (status: PENDING, payment: PENDING)
            │
            ▼
Step 3: System creates Razorpay Order via API
        (amount = gig.price × 100 [paise])
            │
            ▼
Step 4: Razorpay checkout modal opens on frontend
        Client completes payment (UPI/Card/Net Banking)
            │
            ▼
Step 5: Razorpay returns: razorpay_order_id, razorpay_payment_id,
        razorpay_signature
            │
            ▼
Step 6: Frontend sends payment details to backend for verification
            │
            ▼
Step 7: Backend verifies signature using HMAC SHA256
        ┌─── Verification FAILS → Order cancelled, error shown
        │
        └─── Verification SUCCEEDS ↓
            │
            ▼
Step 8: Order updated (payment_status: HELD)
        Transaction record created
        Notification sent to Freelancer
            │
            ▼
Step 9: Freelancer completes work → submits deliverable
            │
            ▼
Step 10: Client reviews and approves delivery
            │
            ▼
Step 11: System calculates:
         - Platform Commission: amount × 0.10 (10%)
         - Net Amount: amount - commission
            │
            ▼
Step 12: Freelancer wallet balance += net_amount
         Transaction status: RELEASED
         Order status: COMPLETED
         
 ```

 ## 14.2 MVP Payment Simplification

 | Aspect          | Production Version         | MVP Version                  |
| --------------- | -------------------------- | ---------------------------- |
| Payment Gateway | Razorpay Live Mode         | Razorpay Test Mode           |
| Escrow          | Actual fund holding        | Simulated via DB status      |
| Payout          | Bank transfer via Razorpay | Virtual wallet balance in DB |
| Commission      | Auto-deducted              | Calculated and stored        |
 ---

# 15.Chat System Design
```
Client A (Browser)                    Client B (Browser)
      │                                      │
      │    Socket.io Connection              │
      └──────────┐              ┌────────────┘
                 │              │
          ┌──────▼──────────────▼──────┐
          │    Socket.io Server        │
          │    (Node.js + Express)     │
          │                            │
          │  - Authentication via JWT  │
          │  - Room: order_{orderId}   │
          │  - Events:                 │
          │    • join_room             │
          │    • send_message          │
          │    • receive_message       │
          │    • typing                │
          │    • user_online           │
          │                            │
          └────────────┬───────────────┘
                       │
                       ▼
               ┌───────────────┐
               │  PostgreSQL   │
               │  (messages)   │
               └───────────────┘
```

## 15.2 Socket Events

| Event           | Direction       | Payload                              | Description                |
| --------------- | --------------- | ------------------------------------ | -------------------------- |
| join_room       | Client → Server | { orderId }                          | Join order chat room       |
| leave_room      | Client → Server | { orderId }                          | Leave order chat room      |
| send_message    | Client → Server | { orderId, content }                 | Send a message             |
| receive_message | Server → Client | { id, senderId, content, timestamp } | Broadcast message to room  |
| typing          | Client → Server | { orderId, userId }                  | User is typing indicator   |
| user_typing     | Server → Client | { userId }                           | Broadcast typing indicator |
| error           | Server → Client | { message }                          | Error notification         |
---
## 15.3 Chat Rules

- Chat is only accessible between the two parties of an order

- Chat is created automatically when an order is placed

- All messages are persisted to the database

- Chat history is loadable via REST API (GET /api/v1/chat/order/:orderId)

- Messages are ordered by timestamp (ascending)

# 16. Testing Strategy
## 16.1 Testing Levels
| Level               | Scope                      | Tools                      | Coverage Target |
| ------------------- | -------------------------- | -------------------------- | --------------- |
| Unit Testing        | Individual functions/utils | Jest                       | 60%+            |
| Integration Testing | API endpoints              | Jest + Supertest           | All endpoints   |
| Manual Testing      | UI flows, cross-browser    | Manual + Checklist         | All user flows  |
| E2E Testing         | Critical user journeys     | Cypress (optional/Phase 2) | 5 core flows    |
---

## 16.2 Critical Test Scenarios

| ID    | Scenario                                    | Expected Result                   |
| ----- | ------------------------------------------- | --------------------------------- |
| TC-01 | Register with valid data                    | Account created, OTP sent         |
| TC-02 | Register with duplicate email               | Error: Email already exists       |
| TC-03 | Login with correct credentials              | JWT tokens returned               |
| TC-04 | Login with wrong password                   | Error: Invalid credentials        |
| TC-05 | Create gig with valid data (as Freelancer)  | Gig created successfully          |
| TC-06 | Create gig as Client                        | Error: Unauthorized               |
| TC-07 | Browse gigs with search keyword             | Filtered results returned         |
| TC-08 | Place order on a gig                        | Order created, payment initiated  |
| TC-09 | Complete full order lifecycle               | Order completed, payment released |
| TC-10 | Submit review after order completion        | Review saved, rating updated      |
| TC-11 | Chat message sent and received in real-time | Message appears for both parties  |
| TC-12 | Admin verifies user ID document             | User verification status updated  |
| TC-13 | Access admin route as non-admin             | Error: Forbidden                  |
| TC-14 | Upload file exceeding size limit            | Error: File too large             |
| TC-15 | Payment signature verification fails        | Order cancelled, error shown      |
---
# 17. Deployment Strategy
## 17.1 Environment Configuration
| Environment | Purpose                | URL                               |
| ----------- | ---------------------- | --------------------------------- |
| Development | Local development      | localhost:3000 / localhost:5000   |
| Staging     | Testing before release | staging.skillpay.in (optional)    |
| Production  | Live application       | skillpay.in / skillpay.vercel.app |
---

## 17.2 Deployment Architecture

```text
┌──────────────────────┐     ┌──────────────────────┐
│   Vercel             │     │   Render / Railway    │
│   (Frontend)         │     │   (Backend)           │
│                      │     │                       │
│   Next.js App        │────→│   Express.js API      │
│   Static + SSR       │     │   Socket.io Server    │
│                      │     │                       │
│   Custom Domain:     │     │   Custom Domain:      │
│   skillpay.in        │     │   api.skillpay.in     │
└──────────────────────┘     └──────────┬────────────┘
                                        │
                              ┌─────────▼──────────┐
                              │  Supabase / Neon    │
                              │  (PostgreSQL)       │
                              │                     │
                              │  Managed Database   │
                              │  Auto Backups       │
                              └─────────────────────┘

                              ┌─────────────────────┐
                              │  Cloudinary         │
                              │  (Image CDN)        │
                              └─────────────────────┘
```
## 17.3 Environment Variables
```env
# ─── Backend (.env) ───
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/skillpay
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (CORS)
CLIENT_URL=https://skillpay.in

# ─── Frontend (.env.local) ───
NEXT_PUBLIC_API_URL=https://api.skillpay.in/api/v1
NEXT_PUBLIC_SOCKET_URL=https://api.skillpay.in
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
```
# 18. Development Roadmap & Sprint Plan
## 18.1 Overview

| Phase | Duration | Focus Area |
|---|---|---|
| Phase 1 | 6 weeks | MVP Development |
| Phase 2 | 4 weeks | Enhancement & Polish |
| Phase 3 | Ongoing | Scale & Advanced Features |

---
## 18.2 Sprint Breakdown (Phase 1 — MVP)

### Sprint 1: Foundation (Week 1)

| Task | Priority | Effort |
|---|---|---|
| Project setup (Next.js + Express + Prisma) | P0 | 4 hours |
| Database schema design and migration | P0 | 4 hours |
| User registration API | P0 | 6 hours |
| Email OTP verification | P0 | 4 hours |
| User login API with JWT | P0 | 4 hours |
| Auth middleware (JWT verification + RBAC) | P0 | 3 hours |
| Frontend: Register & Login pages | P0 | 6 hours |
| Frontend: OTP verification page | P0 | 3 hours |
| **Sprint 1 Total** |  | 34 hours |
---
### Sprint 2: Profiles & Gigs (Week 2)

| Task | Priority | Effort |
|---|---|---|
| Profile API (GET, PUT, avatar upload) | P0 | 6 hours |
| ID document upload API | P0 | 3 hours |
| Gig CRUD API (create, read, update, delete) | P0 | 8 hours |
| Gig search & filter API | P0 | 4 hours |
| Frontend: Profile page (view + edit) | P0 | 5 hours |
| Frontend: Create Gig form | P0 | 5 hours |
| Frontend: Browse Gigs page (grid + filters) | P0 | 6 hours |
| Frontend: Gig Detail page | P0 | 4 hours |
| **Sprint 2 Total** |  | 41 hours |
---
### Sprint 3: Orders & Workflow (Week 3)

| Task | Priority | Effort |
|---|---|---|
| Order placement API | P0 | 4 hours |
| Order status transition API | P0 | 6 hours |
| Order management API (list, detail) | P0 | 4 hours |
| Deliverable upload functionality | P0 | 3 hours |
| Frontend: Order placement flow | P0 | 4 hours |
| Frontend: My Orders page | P0 | 5 hours |
| Frontend: Order Detail page + actions | P0 | 6 hours |
| Frontend: Dashboard (role-based) | P0 | 5 hours |
| **Sprint 3 Total** |  | 37 hours |
---
### Sprint 4: Chat & Reviews (Week 4)

| Task | Priority | Effort |
|---|---|---|
| Socket.io server setup and integration | P0 | 4 hours |
| Chat API (history, room management) | P0 | 4 hours |
| Message persistence in database | P0 | 3 hours |
| Frontend: Chat UI component | P0 | 6 hours |
| Review submission API | P0 | 4 hours |
| Rating calculation logic | P0 | 2 hours |
| Badge level auto-update logic | P1 | 2 hours |
| Frontend: Review form + display | P0 | 4 hours |
| **Sprint 4 Total** |  | 29 hours |
---
### Sprint 5: Payments & Admin (Week 5)

| Task | Priority | Effort |
|---|---|---|
| Razorpay integration (order + verify) | P0 | 6 hours |
| Payment flow (frontend checkout) | P0 | 4 hours |
| Transaction history API | P0 | 3 hours |
| Wallet balance logic | P0 | 2 hours |
| Admin Dashboard API (metrics) | P0 | 4 hours |
| Admin User Management API | P0 | 4 hours |
| Admin Gig Management API | P0 | 3 hours |
| Frontend: Admin Panel pages | P0 | 6 hours |
| Frontend: Wallet/Earnings page | P1 | 3 hours |
| **Sprint 5 Total** |  | 35 hours |
---
### Sprint 6: Polish & Deploy (Week 6)

| Task | Priority | Effort |
|---|---|---|
| Landing page design and implementation | P0 | 6 hours |
| Responsive design audit & fixes | P0 | 4 hours |
| Error handling & loading states | P0 | 4 hours |
| Performance optimization (images, lazy load) | P1 | 3 hours |
| Security audit (CORS, rate limiting, etc.) | P0 | 3 hours |
| End-to-end testing of all user flows | P0 | 4 hours |
| Bug fixes | P0 | 4 hours |
| Deployment (Vercel + Render + DB) | P0 | 4 hours |
| Documentation (README, API docs) | P0 | 3 hours |
| **Sprint 6 Total** |  | 35 hours |
---

## 18.3 Total Estimated Effort

| Sprint | Hours |
|---|---|
| Sprint 1 | 34 |
| Sprint 2 | 41 |
| Sprint 3 | 37 |
| Sprint 4 | 29 |
| Sprint 5 | 35 |
| Sprint 6 | 35 |
| **Total** | **211 hours** |
---
# 19. Risk Assessment & Mitigation

| ID | Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|---|
| R-01 | Razorpay integration complexity | Medium | High | Use test mode for MVP; follow official documentation; implement fallback mock payment |
| R-02 | Socket.io connection instability | Medium | Medium | Implement reconnection logic; REST fallback for messages; connection state management |
| R-03 | Database performance degradation | Low | High | Proper indexing; pagination on all list endpoints; query optimization |
| R-04 | Scope creep (adding Phase 2 features) | High | High | Strict MVP boundary; feature freeze after Sprint 4; log enhancement requests for Phase 2 |
| R-05 | File upload security vulnerabilities | Medium | High | File type validation; size limits; virus scanning (Phase 2); Cloudinary for processing |
| R-06 | JWT token theft/security breach | Low | High | Short-lived access tokens; httpOnly cookies; refresh token rotation; HTTPS enforcement |
| R-07 | Third-party service downtime | Low | Medium | Graceful error handling; retry logic; status page monitoring |
| R-08 | Development timeline overrun | Medium | Medium | Buffer time in Sprint 6; prioritize P0 features; cut P1 features if needed |
| R-09 | Cross-browser compatibility issues | Medium | Low | Test on Chrome, Firefox, Safari; use well-supported CSS; polyfills if needed |
| R-10 | Data loss or corruption | Low | High | Daily database backups; transaction support for critical operations |
---

# 20. Success Metrics & KPIs

## 20.1 MVP Launch Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| All P0 functional requirements implemented | 100% | Feature checklist |
| All critical user flows working end-to-end | 100% | Manual testing |
| Page load time (LCP) | < 2 seconds | Lighthouse |
| Mobile responsiveness | All pages | Manual testing |
| Zero critical/high-severity bugs | 0 | Bug tracker |
| API response time (p95) | < 500ms | Postman/Load test |
| Successful deployment on cloud | Live URL | Deployment check |
---
## 20.2 Post-Launch KPIs (For Production)
| KPI                     | Target (Month 1) | Target (Month 3) |
| ----------------------- | ---------------- | ---------------- |
| Registered Users        | 100              | 1,000            |
| Active Gigs             | 50               | 500              |
| Orders Completed        | 20               | 200              |
| Average Order Value     | ₹300             | ₹500             |
| User Retention (30-day) | 30%              | 40%              |
| Average Rating          | 4.0+             | 4.2+             |
| Platform Uptime         | 99%              | 99.5%            |
---
# 21. Competitive Analysis
## 21.1 Competitive Landscape
| Feature            | Fiverr                   | Upwork                   | UrbanClap             | SkillPay                           |
| ------------------ | ------------------------ | ------------------------ | --------------------- | ---------------------------------- |
| Target Market      | Global                   | Global                   | India (Services)      | India (Digital + Traditional)      |
| Currency           | USD                      | USD                      | INR                   | INR                                |
| Min Gig Price      | $5 (~₹400)               | $15+                     | ₹200+                 | ₹50                                |
| User Type          | Professional Freelancers | Professional Freelancers | Service Professionals | Students, Homemakers, Hobbyists    |
| Skill Types        | Digital Services Only    | Digital Services Only    | Home & Local Services | Digital + Traditional Skills       |
| Verification       | Basic Verification       | Extensive Screening      | Background Check      | College ID / Government ID         |
| Gamification       | Seller Levels            | None                     | None                  | Badges, Leaderboards, Certificates |
| Learning Curve     | Medium                   | High                     | Low                   | Very Low                           |
| Community Features | None                     | None                     | None                  | Ambassadors, Referrals             |
| Entry Barrier      | High                     | Very High                | Medium                | Very Low                           |
---
## 21.2 SkillPay's Competitive Advantages
1. **"Meesho of Freelancing"** — Democratizes freelancing for non-professionals

2. **Ultra-Low Entry Point** — ₹50 minimum gig price enables micro-services

3. **Inclusive Skill Categories** — Recognizes traditional skills (tailoring, cooking, crafts) alongside digital

4. **Gamified Growth** — Badges, certificates, and leaderboards drive engagement

5. **Trust Architecture** — College ID and local ID verification builds community trust

6. **India-First Design** — Rupee-based, Indian payment gateways, culturally relevant UX


# 22. Future Roadmap (Phase 2+)

## Phase 2 (Post-MVP — 4 Weeks)

| Feature | Description |
|---|---|
| Digital Skill Wallet | Track earnings, payouts, transaction history in one place |
| Gamified Leaderboard | Monthly top performers highlighted on homepage |
| Referral System | Invite friends → earn credits on their first order |
| Multi-Language Support | Hindi, Tamil, Telugu, Bengali, Marathi UI translations |
| LinkedIn Badge Export | Shareable skill badges for professional profiles |
| Certificate Generation | Auto-generated PDF certificates for milestone achievements |
| Advanced Search | AI-powered search suggestions, auto-complete |
| Email Notifications | Transactional emails for all order events |
| File Sharing in Chat | Send images and documents within order chat |
| Freelancer Analytics | Views, conversion rate, earnings trends dashboard |

## Phase 3 (Scale — Ongoing)

| Feature | Description |
|---|---|
| AI Gig Matching | Algorithm matches clients with best-fit freelancers |
| Premium Subscriptions | ₹199–₹499/month for featured gigs, analytics, early access |
| Corporate Partnerships | Sponsored gigs, bulk campaign tools for businesses |
| Mobile Native App | React Native app for iOS and Android |
| Video Gig Previews | Freelancers can add video introductions to gigs |
| Dispute Resolution System | Automated mediation with admin escalation |
| Payout System | Automated bank transfers via Razorpay Route |
| Advanced Admin Dashboard | Revenue analytics, user behavior insights, fraud detection |
| Offline Skills Marketplace | Location-based matching for in-person services |
| API for Third-Party Apps | Public API for integrations |
---

# 23. Glossary

| Term | Definition |
|---|---|
| Gig | A service offering posted by a freelancer with defined scope and price |
| Order | An instance of a client purchasing a gig from a freelancer |
| Escrow | A payment holding mechanism where funds are held until service delivery is confirmed |
| MVP | Minimum Viable Product — the smallest version with core functionality |
| OTP | One-Time Password — a temporary code sent via email for verification |
| JWT | JSON Web Token — a compact token format for secure authentication |
| RBAC | Role-Based Access Control — restricting access based on user roles |
| SSR | Server-Side Rendering — generating HTML on the server for faster initial load |
| ORM | Object-Relational Mapping — a tool to interact with databases using code objects |
| CRUD | Create, Read, Update, Delete — the four basic database operations |
| WebSocket | A protocol for full-duplex real-time communication over a single TCP connection |
| Webhook | An HTTP callback that notifies your application of external events (e.g., payment confirmation) |
| LCP | Largest Contentful Paint — a Core Web Vital measuring perceived load speed |
---

# 24. Appendices

## Appendix A: Folder Structure

```text
skillpay/
├── client/                          # Next.js Frontend
│   ├── public/
│   │   ├── images/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── verify/
│   │   │   ├── (main)/
│   │   │   │   ├── gigs/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── [id]/
│   │   │   │   └── page.tsx         # Landing page
│   │   │   ├── dashboard/
│   │   │   │   ├── gigs/
│   │   │   │   ├── orders/
│   │   │   │   ├── profile/
│   │   │   │   ├── wallet/
│   │   │   │   └── page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   ├── gigs/
│   │   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                  # Shadcn components
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── gigs/
│   │   │   │   ├── GigCard.tsx
│   │   │   │   ├── GigForm.tsx
│   │   │   │   └── GigFilters.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   └── OrderTimeline.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   └── MessageBubble.tsx
│   │   │   └── common/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   └── useDebounce.ts
│   │   ├── lib/
│   │   │   ├── axios.ts             # Axios instance
│   │   │   ├── socket.ts            # Socket.io client
│   │   │   └── utils.ts
│   │   ├── store/
│   │   │   ├── authStore.ts         # Zustand store
│   │   │   └── chatStore.ts
│   │   └── types/
│   │       └── index.ts             # TypeScript types
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Express.js Backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── cloudinary.ts
│   │   │   ├── razorpay.ts
│   │   │   └── email.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   ├── rbac.ts              # Role-based access
│   │   │   ├── validate.ts          # Zod validation
│   │   │   ├── upload.ts            # Multer config
│   │   │   ├── rateLimiter.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── gig.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── review.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── gig.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── gig.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── chat.service.ts
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── gig.validator.ts
│   │   │   ├── order.validator.ts
│   │   │   └── review.validator.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── otp.ts
│   │   │   └── helpers.ts
│   │   ├── socket/
│   │   │   └── chat.socket.ts
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts               # Entry point
│   ├── tsconfig.json
│   └── package.json
│
├── docs/
│   ├── PRD.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT_GUIDE.md
│
├── .gitignore
├── README.md
└── docker-compose.yml               # Optional
```

## Appendix B: User Flow Diagrams
### B.1: Registration Flow
```
Landing Page → Click "Sign Up"
    → Registration Form (Name, Email, Password, Role) 
    → Submit → Validate → Create User → Send OTP
    → OTP Verification Page
    → Enter OTP → Verify → Redirect to Dashboard
    → Upload ID Document (optional, prompted)
```

### B.2: Gig Purchase Flow
```
Browse Gigs → Select Gig → View Gig Detail
    → Click "Order Now"
    → Confirm Order Details
    → Razorpay Checkout Opens
    → Complete Payment
    → Payment Verified → Order Created (PENDING)
    → Freelancer Notified
    → Freelancer Accepts (IN_PROGRESS)
    → Freelancer Submits Deliverable (SUBMITTED)
    → Client Reviews
        → Approve → Order COMPLETED → Payment Released → Review Prompt
        → Request Revision → Order REVISION → Freelancer Resubmits
```
### B.3: Freelancer Earning Flow
```
Create Profile → Add Skills → Create Gig
    → Gig Goes Live → Client Places Order
    → Accept Order → Complete Work → Submit
    → Client Approves → Payment Released to Wallet
    → View Wallet Balance → Request Payout (Phase 2)
```
## Appendix C: Revenue Model Summary
| Revenue Stream            | Model                    | MVP | Phase 2 |
| ------------------------- | ------------------------ | --- | ------- |
| Platform Commission       | 10–15% per completed gig | ✅   | ✅       |
| Premium Subscriptions     | ₹199–₹499/month          | ❌   | ✅       |
| Featured Gig Placement    | Pay to boost visibility  | ❌   | ✅       |
| Corporate Partnerships    | Sponsored gigs/campaigns | ❌   | ✅       |
| Contest/Challenge Hosting | Brand-sponsored contests | ❌   | ✅       |
---
## Appendix D: Acceptance Criteria Template
```
Each user story should be verified against acceptance criteria:
GIVEN [precondition]
WHEN  [action]
THEN  [expected result]
Example:

GIVEN a registered and email-verified user with role FREELANCER
WHEN  they submit the Create Gig form with all required fields filled
THEN  a new gig should be created in the database
AND   the gig should appear in the user's "My Gigs" list
AND   the gig should be visible on the public Browse Gigs page
AND   a success toast notification should be displayed
```





