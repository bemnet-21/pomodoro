<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

<h1 align="center"> Pomodoro — Focus Analytics Platform</h1>

<p align="center">
  <strong>A production-grade, full-stack focus-tracking platform that turns the Pomodoro Technique into a data-driven productivity system.</strong>
</p>

<p align="center">
  <a href="https://pomodoro-t90v.onrender.com/api-docs"> Live API Docs</a> ·
  <a href="https://pomodoro-six-green.vercel.app/"> Live Demo</a> ·
  <a href="#architecture"> Architecture</a> ·
  <a href="#key-engineering-decisions"> Engineering Decisions</a>
</p>

---

##  This Is Not Another Pomodoro Timer


Most Pomodoro apps treat focus like a stopwatch problem. This one treats it like a **data engineering problem**. The timer is just the input device. The real product is the analytics pipeline that transforms raw session data into actionable insights about *how you actually work*.

Here's what makes this architecturally distinct:

| What Others Build | What This Project Does |
|---|---|
| A client-side timer with `localStorage` | A full REST API with JWT auth, persisted sessions in MongoDB, and a decoupled client |
| A single-page countdown | 6 pages: Timer → Analytics → Session Logs → Profile → Settings → Security |
| No data after refresh | MongoDB aggregation pipelines computing heatmaps, weekly trends, streak tracking, and productivity scores |
| Static timer durations | Per-user configurable durations synced to the backend, surviving across devices |
| No concept of identity | Full auth system: signup → login → JWT middleware → route guards → password change |

**The question this project answers isn't "Can I build a timer?"** — it's *"Can I architect a multi-layer full-stack system with proper separation of concerns, data aggregation, state management, and production deployment?"*

---

## Architecture

```
pomodoro/
├── client/                          # Next.js 16 (App Router) + React 19
│   ├── app/
│   │   ├── api/                     # Typed API service layer (Axios + interceptors)
│   │   ├── analytics/               # Analytics dashboard page
│   │   ├── components/
│   │   │   ├── analytics/           # HeatMap, ProductivityTrend, StreakStats, RecentLogs
│   │   │   ├── auth/                # AuthGuard (route protection)
│   │   │   ├── history/             # HistoryDashboard, ManualLogForm
│   │   │   ├── profile/             # AccountDetails, TimerSettings, AutomationSettings
│   │   │   └── ui/                  # ConfirmModal, AlertModal (reusable primitives)
│   │   ├── store/                   # Zustand state management (persisted auth)
│   │   ├── types/                   # Shared TypeScript interfaces
│   │   └── login/ signup/ profile/  # Route pages
│   └── util/                        # Date + formatting utilities
│
└── server/                          # Express 5 (ES Modules)
    ├── controller/                  # Request handling + Zod validation
    ├── service/                     # Business logic layer
    ├── model/                       # Mongoose schemas (User, Session, Category)
    ├── middleware/                   # JWT authentication middleware
    ├── routes/                      # RESTful route definitions + Swagger JSDoc
    ├── utils/                       # AppError class, token generation
    └── swagger.js                   # OpenAPI 3.0 specification (308 lines)
```

### System Flow

```
┌─────────────┐     JWT Bearer      ┌──────────────┐     Mongoose      ┌──────────┐
│  Next.js    │ ──────────────────►  │  Express 5   │ ────────────────► │ MongoDB  │
│  Client     │ ◄────────────────── │  REST API    │ ◄──────────────── │ Atlas    │
│             │     JSON Responses   │              │   Aggregation     │          │
└─────────────┘                      └──────────────┘   Pipelines       └──────────┘
       │                                    │
   Zustand                            Swagger UI
   (Persisted                        /api-docs
    Auth State)
```

---

## Key Engineering Decisions

### Why These Choices Matter

| Decision | Rationale |
|---|---|
| **Zustand over Context API** | Auth state needs `localStorage` persistence and hydration awareness. Zustand's `persist` middleware + `onRehydrateStorage` handles SSR hydration race conditions that raw Context doesn't. |
| **SWR for data fetching** | Stale-while-revalidate pattern gives instant UI on navigation with background revalidation. Analytics data is read-heavy — SWR's caching model fits perfectly. |
| **Zod on the backend** | Every endpoint validates incoming payloads with Zod schemas *before* touching business logic. Schema-first validation catches malformed data at the controller layer, not the database layer. |
| **Service layer pattern** | Controllers don't touch Mongoose directly. A dedicated service layer isolates business logic from HTTP concerns, making each layer independently testable. |
| **MongoDB Aggregation Pipelines** | The analytics engine uses `$match`, `$group`, `$dateToString`, `$dayOfWeek`, `$unwind`, and `$sort` — 4 separate aggregation pipelines handle heatmap generation, weekly stats, tag distribution, and productivity scoring. This isn't just CRUD. |
| **Custom AppError class** | A domain-specific error class with `statusCode` propagation enables consistent error handling across all controller methods without repetitive try/catch boilerplate. |
| **Web Audio API for alarms** | Timer completion sounds use the Web Audio API (`AudioContext` + oscillator synthesis) — no audio file dependencies, cross-browser compatible, and programmatic tone control. |
| **AuthGuard with hydration awareness** | The client-side route guard waits for Zustand's `onRehydrateStorage` before checking auth state, preventing flash-of-unauthenticated-content on hard refresh. |

---

## Feature Breakdown

### Focus Timer
- Three configurable modes: **Focus**, **Short Break**, **Long Break**
- Automatic mode cycling with configurable long-break intervals (e.g., every 4th session)
- Task name is required before starting — sessions are *labeled data*, not anonymous ticks
- Confirmation modals prevent accidental mode switches mid-session
- Session payloads (start/end timestamps, actual vs. planned duration) are computed and persisted to MongoDB on completion

### Analytics Dashboard
- **GitHub-style Heatmap** — custom-built SVG grid (53 weeks × 7 days) with O(1) lookups via a pre-computed data map. Interactive tooltips on hover
- **Weekly Productivity Trend** — hand-drawn SVG chart with Bézier curve interpolation (no charting library)
- **Streak & Momentum Tracker** — current streak, total hours, session count, with a progress bar targeting a 30-day streak
- **Recent Session Feed** — last 5 sessions rendered inline with duration formatting

###  Session History
- Full CRUD on session logs with paginated table view (10 per page)
- Search by task name, sort by date or duration
- **Manual log entry** — backfill sessions you forgot to track
- Delete with confirmation modal and optimistic UI updates

###  User Profile & Settings
- View account details (username, email, member since)
- **Timer settings panel** — configure work/break durations and long-break intervals, persisted per-user
- **Change password** — secure flow with current password verification and bcrypt rehashing

### Authentication System
- JWT-based auth with 7-day token expiry
- `Bearer` token injected via Axios request interceptors
- Client-side `AuthGuard` component protects all private routes
- Signup auto-authenticates and fetches profile in a single flow

###  API Documentation
- Complete **OpenAPI 3.0** spec with 20+ schema definitions
- Interactive Swagger UI at `/api-docs`
- Every endpoint documented with request/response shapes, auth requirements, and examples

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | Next.js (App Router) | 16.2 |
| **UI Library** | React | 19.2 |
| **Styling** | Tailwind CSS | v4 |
| **State Management** | Zustand (with persist middleware) | 5.x |
| **Data Fetching** | SWR | 2.4 |
| **HTTP Client** | Axios | 1.17 |
| **Icons** | Lucide React | 1.18 |
| **Backend Framework** | Express | 5.2 |
| **Database** | MongoDB (Mongoose ODM) | 9.7 |
| **Authentication** | JWT (jsonwebtoken) + bcrypt | — |
| **Validation** | Zod | 4.4 |
| **API Docs** | Swagger (swagger-jsdoc + swagger-ui-express) | — |
| **Language** | TypeScript (client) + JavaScript ESM (server) | 5.x |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/bemnet-21/pomodoro.git
cd pomodoro
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pomodoro
JWT_SECRET=your-secret-key
PORT=5000
```

Start the server:

```bash
npm run dev
```

The API will be live at `http://localhost:5000` with Swagger docs at `http://localhost:5000/api-docs`.

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client will be live at `http://localhost:3000`.

> **Note:** The production client is pre-configured to point at the deployed backend on Render. To develop locally, update the `baseURL` in `app/api/client.ts`.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Create a new account | ✗ |
| `POST` | `/api/auth/login` | Authenticate and receive JWT | ✗ |
| `GET` | `/api/auth/me` | Get current user profile | ✓ |
| `POST` | `/api/auth/change-password` | Update password | ✓ |
| `POST` | `/api/session` | Log a completed session | ✓ |
| `GET` | `/api/session` | List all user sessions | ✓ |
| `GET` | `/api/session/:sessionId` | Get session by ID | ✓ |
| `DELETE` | `/api/session/:sessionId` | Delete a session | ✓ |
| `GET` | `/api/user/settings` | Get timer settings | ✓ |
| `PUT` | `/api/user/settings` | Update timer settings | ✓ |
| `GET` | `/api/user/summary` | Get user stats summary | ✓ |
| `GET` | `/api/analytics/heatmap` | Session heatmap (365 days) | ✓ |
| `GET` | `/api/analytics/weekly-stats` | Weekly focus minutes breakdown | ✓ |
| `GET` | `/api/analytics/distribution` | Focus distribution by tags | ✓ |
| `GET` | `/api/analytics/productivity-score` | Completion rate score | ✓ |

Full interactive documentation: [`/api-docs`](https://pomodoro-t90v.onrender.com/api-docs)

---

## What This Demonstrates

This project is a deliberate showcase of **production engineering skills**, not a feature checklist:

- **Full-stack ownership** — designed, built, and deployed both the client and API from scratch
- **Layered architecture** — controller → service → model separation with cross-cutting error handling
- **Schema-first validation** — Zod on the server, TypeScript interfaces on the client
- **Data pipeline design** — MongoDB aggregation pipelines that compute derived analytics from raw session data
- **State management maturity** — Zustand with persistence, hydration-aware auth guards, SWR caching
- **Custom data visualization** — SVG heatmaps and Bézier curve charts built from scratch (zero charting libraries)
- **Security fundamentals** — bcrypt password hashing, JWT middleware, route protection, input sanitization
- **API documentation** — 300+ line OpenAPI spec with Swagger UI
- **Production deployment** — backend deployed on Render with MongoDB Atlas

---

<p align="center">
  <sub>Built by <a href="https://github.com/bemnet-21">Bemnet</a> — because shipping production software is the best portfolio piece.</sub>
</p>
