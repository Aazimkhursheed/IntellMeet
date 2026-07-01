# CONTEXT.md — IntellMeet Project

> **Single Source of Truth** — Generated from a complete codebase analysis on 2026-07-01.
> This document reflects **only what is currently implemented** in the repository. Planned features are clearly marked as such.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current Implementation Status](#2-current-implementation-status)
3. [Folder Structure](#3-folder-structure)
4. [Tech Stack](#4-tech-stack)
5. [Architecture Overview](#5-architecture-overview)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend Architecture](#7-backend-architecture)
8. [Database Structure](#8-database-structure)
9. [Authentication Implementation](#9-authentication-implementation)
10. [API Endpoints](#10-api-endpoints)
11. [Environment Variables](#11-environment-variables)
12. [Dependencies](#12-dependencies)
13. [Design Decisions](#13-design-decisions)
14. [Coding Conventions](#14-coding-conventions)
15. [Development Workflow](#15-development-workflow)
16. [Known Issues & Technical Debt](#16-known-issues--technical-debt)
17. [Roadmap](#17-roadmap)
18. [Next Recommended Task](#18-next-recommended-task)
19. [Testing Status](#19-testing-status)
20. [Deployment Status](#20-deployment-status)

---

## 1. Project Overview

**IntellMeet** is a MERN-stack enterprise meeting and collaboration platform being developed by Zidio Development (March 2026). The long-term vision is an AI-powered video conferencing and meeting intelligence system featuring real-time WebRTC video, Socket.io signalling, AI-based meeting summaries, and Cloudinary media storage.

The project is currently in its **foundational phase**. Only the project scaffold and the complete Authentication module have been implemented. No meeting, dashboard business logic, WebRTC, AI, or Cloudinary functionality exists yet.

- **Client**: React 19 SPA served by Vite on port `5173`
- **Server**: Express.js REST API + Socket.io stub on port `5001`
- **Database**: MongoDB Atlas (cloud-hosted), connected via Mongoose

---

## 2. Current Implementation Status

### ✅ Completed Modules

| Module | Status | Notes |
|---|---|---|
| Project scaffold (monorepo) | ✅ Complete | Root workspace with `concurrently` for parallel dev |
| Server foundation (Express, Helmet, Morgan, CORS) | ✅ Complete | Production-ready middleware stack |
| Database connection (MongoDB Atlas via Mongoose) | ✅ Complete | Graceful warning if DB unreachable |
| Socket.io server stub | ✅ Complete | Basic connect/disconnect logging only |
| Authentication — Backend | ✅ Complete | Full JWT access + refresh token cycle |
| Authentication — Frontend | ✅ Complete | Zustand store, protected routes, Login/Signup pages |
| Global error handling | ✅ Complete | 404 notFound + errorHandler middleware |
| Vite dev proxy | ✅ Complete | `/api` and `/socket.io` proxied to port 5001 |

### ⏳ Partially Implemented

| Module | Status | Notes |
|---|---|---|
| Dashboard page | ⚠️ Stub | Exists only to display authenticated user profile; no meeting features |

### ❌ Not Yet Implemented (Planned)

| Module | Notes |
|---|---|
| Meeting creation & management | Core feature — not started |
| WebRTC video/audio streaming | Peer-to-peer video calls — not started |
| Real-time Socket.io signalling | Room management, offer/answer, ICE — not started |
| AI meeting summarisation | AI transcript/summary integration — not started |
| Cloudinary media upload | Avatar uploads, meeting recordings — not started |
| User profile editing | Update name, avatar, password — not started |
| Admin panel | User management, role assignment — not started |
| Password reset / forgot password | Email-based reset flow — not started |
| Email verification | Post-registration email confirmation — not started |
| Notifications system | In-app or push notifications — not started |

---

## 3. Folder Structure

```
IntellMeet/                          ← Monorepo root
├── .gitignore
├── .prettierrc                      ← Shared Prettier config (2-space, single quotes, LF)
├── package.json                     ← Root workspace: runs client+server concurrently
├── package-lock.json
│
├── client/                          ← React 19 SPA (Vite)
│   ├── index.html                   ← App entry HTML (title: IntellMeet - AI-Powered...)
│   ├── components.json              ← shadcn/ui configuration (CSS variables, @/ alias)
│   ├── vite.config.js               ← Vite config: React plugin, Tailwind v4, proxy rules, @/ alias
│   ├── eslint.config.js             ← ESLint for React (react-hooks, react-refresh)
│   ├── package.json
│   └── src/
│       ├── main.jsx                 ← React root: ReactDOM, QueryClientProvider, Toaster
│       ├── App.jsx                  ← Router, AppContent (checkAuth on mount), routes, nav header
│       ├── index.css                ← Tailwind v4 @import, CSS custom properties design system
│       │
│       ├── pages/                   ← Full-page route components
│       │   ├── Login.jsx            ← Login form with validation and Zustand integration
│       │   └── Signup.jsx           ← Signup form with real-time password criteria checklist
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   └── ProtectedRoute.jsx  ← React Router Outlet guard (redirects to /login)
│       │   └── ui/                  ← Reserved for shadcn/ui components (empty, .gitkeep)
│       │
│       ├── store/
│       │   └── useAuthStore.js      ← Zustand: user, isAuthenticated, isCheckingAuth, error;
│       │                               actions: login, register, logout, checkAuth
│       │
│       ├── lib/
│       │   ├── api-client.js        ← Axios instance (baseURL /api, withCredentials, 401 interceptor)
│       │   └── utils.js             ← cn() helper using clsx + twMerge (reserved for shadcn/ui)
│       │
│       ├── hooks/                   ← Reserved for custom React hooks (empty, .gitkeep)
│       ├── contexts/                ← Reserved for React Context providers (empty, .gitkeep)
│       ├── routes/                  ← Reserved for route definitions (empty, .gitkeep)
│       └── utils/                   ← Reserved for client utility functions (empty, .gitkeep)
│
└── server/                          ← Express.js + Socket.io API
    ├── .env                         ← Active environment config (gitignored)
    ├── .env.example                 ← Environment variable template
    ├── eslint.config.js             ← ESLint for Node.js (no-unused-vars warn, no-console off)
    ├── package.json
    └── src/
        ├── server.js                ← Entry point: dotenv, connectDB, http server, Socket.io init
        ├── app.js                   ← Express app: middleware stack, route mounting, error fallbacks
        │
        ├── config/
        │   └── db.js                ← Mongoose connection with graceful error handling
        │
        ├── models/
        │   └── User.js              ← Mongoose User schema (fullName, email, password, role, refreshToken)
        │
        ├── controllers/
        │   └── authController.js    ← register, login, logout, refreshToken, getCurrentUser, getUserProfile
        │
        ├── middleware/
        │   ├── authMiddleware.js    ← protect (JWT verify), admin (role check) middleware
        │   └── errorHandler.js      ← notFound (404) + errorHandler (global) middleware
        │
        ├── routes/
        │   └── authRoutes.js        ← Express Router for /api/v1/auth/* endpoints
        │
        ├── validators/
        │   └── authValidator.js     ← validateRegister and validateLogin middleware functions
        │
        ├── utils/
        │   └── token.js             ← generateAccessToken, generateRefreshToken, sendTokenCookies, clearTokenCookies
        │
        ├── services/                ← Reserved for business logic services (empty, .gitkeep)
        ├── socket/                  ← Reserved for Socket.io event handlers (empty, .gitkeep)
        └── uploads/                 ← Reserved for local file upload staging (empty)
```

---

## 4. Tech Stack

### Backend

| Technology | Version | Role |
|---|---|---|
| Node.js | Runtime | JavaScript server runtime |
| Express.js | ^4.19.2 | HTTP REST API framework |
| Mongoose | ^8.2.1 | MongoDB ODM (schema, validation, hooks) |
| jsonwebtoken | ^9.0.2 | JWT signing and verification |
| bcrypt | ^5.1.1 | Password hashing (bcrypt, salt rounds: 10) |
| cookie-parser | ^1.4.6 | Parse HTTP cookies from requests |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |
| helmet | ^7.1.0 | Security HTTP headers |
| morgan | ^1.10.0 | HTTP request logging (dev/combined) |
| dotenv | ^16.4.5 | Load `.env` variables into `process.env` |
| express-rate-limit | ^7.2.0 | Installed, **not yet applied to any route** |
| socket.io | ^4.7.4 | WebSocket server (stub only — connect/disconnect) |
| cloudinary | ^2.0.0 | Installed, **not yet configured or used** |
| multer | ^1.4.5-lts.1 | Installed, **not yet configured or used** |
| multer-storage-cloudinary | ^4.0.0 | Installed, **not yet configured or used** |
| nodemon | ^3.1.0 | Dev file watcher for auto-restart |

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | ^19.0.0 | UI component library |
| Vite | ^5.1.6 | Build tool and dev server |
| Tailwind CSS | ^4.0.0 | Utility-first CSS (via `@tailwindcss/vite` plugin) |
| react-router-dom | ^6.22.3 | Client-side routing |
| Zustand | ^4.5.2 | Global client state management |
| Axios | ^1.6.8 | HTTP client (with interceptors for token refresh) |
| @tanstack/react-query | ^5.25.0 | Installed; used only for health-check in the original scaffold; not currently used in auth flows |
| react-hot-toast | ^2.4.1 | Toast notifications |
| lucide-react | ^0.359.0 | Icon library |
| clsx | ^2.1.0 | Conditional class merging |
| tailwind-merge | ^2.2.2 | Conflict-aware Tailwind class merging |
| socket.io-client | ^4.7.4 | Installed, **not yet connected** |
| class-variance-authority | ^0.7.0 | Installed for shadcn/ui, **not yet used** |

### Infrastructure

| Technology | Role |
|---|---|
| MongoDB Atlas | Cloud-hosted MongoDB database |
| shadcn/ui | UI component system configured (`components.json`) but no components installed yet |

---

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (port 5173)                       │
│   React 19 SPA  ←→  Vite Dev Server                        │
│   - Vite proxies /api/* → http://localhost:5001             │
│   - Vite proxies /socket.io/* → ws://localhost:5001         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (proxied)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Express Server (port 5001)                     │
│  Middleware stack:                                           │
│   helmet → morgan → cors → json → urlencoded → cookieParser │
│                                                              │
│  Routes:                                                     │
│   GET  /api/health               ← Health check             │
│   POST /api/v1/auth/register     ← Auth routes              │
│   POST /api/v1/auth/login                                    │
│   POST /api/v1/auth/logout                                   │
│   POST /api/v1/auth/refresh-token                            │
│   GET  /api/v1/auth/me                                       │
│   GET  /api/v1/auth/profile                                  │
│                                                              │
│  Socket.io:  connection/disconnect stub only                 │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (cloud)                           │
│   Database: intellmeet                                       │
│   Collections: users                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Frontend Architecture

### Entry Point Flow

```
index.html → main.jsx
  └── React.StrictMode
      └── QueryClientProvider (TanStack Query)
          └── App.jsx
              └── BrowserRouter
                  └── AppContent
                      ├── useEffect → checkAuth() on mount
                      ├── if isCheckingAuth → global spinner
                      ├── sticky nav header (context-aware: auth vs anon links)
                      ├── <Routes>
                      │   ├── /           → <WelcomeScreen>
                      │   ├── /login      → <Login>
                      │   ├── /signup     → <Signup>
                      │   └── <ProtectedRoute>  (Outlet guard)
                      │       └── /dashboard  → <Dashboard>
                      └── footer
```

### State Management

All authentication state is managed via **Zustand** in `useAuthStore`:

| State | Type | Purpose |
|---|---|---|
| `user` | `object \| null` | Authenticated user object (`id`, `fullName`, `email`, `role`, `createdAt`) |
| `isAuthenticated` | `boolean` | Whether a valid session exists |
| `isLoading` | `boolean` | Loading state for login/register/logout operations |
| `isCheckingAuth` | `boolean` | `true` during initial `checkAuth()` call on app mount; prevents flash of login screen |
| `error` | `string \| null` | Last authentication error message from the server |

### Axios Client (`api-client.js`)

- Base URL: `import.meta.env.VITE_API_URL || '/api'` (defaults to Vite proxy)
- `withCredentials: true` — sends cookies with every request
- **Response interceptor**: On 401, attempts `POST /api/v1/auth/refresh-token`. If successful, retries the original request. If the refresh also fails, calls `useAuthStore.getState().logout()` via dynamic import and rejects the error. The interceptor guards against infinite loops by skipping the retry if the failing request was itself the refresh endpoint.

### Routing

| Route | Component | Access |
|---|---|---|
| `/` | `WelcomeScreen` | Public |
| `/login` | `Login` | Public (redirects to `/dashboard` if already authenticated) |
| `/signup` | `Signup` | Public (redirects to `/dashboard` if already authenticated) |
| `/dashboard` | `Dashboard` | **Protected** — redirects to `/login` if not authenticated |

### Design System

- Dark theme: `zinc-950` background, `zinc-900` cards, `zinc-800` borders
- Primary accent: Violet (`violet-600`, `violet-500`, `violet-400`)
- Success: `emerald-400` | Error: `red-400` | Warning: `amber-500`
- Font: Inter (system fallback chain)
- Border radius: `0.75rem` (`rounded-xl` / `rounded-2xl`)
- Defined as CSS custom properties in `index.css` under `@layer base`

---

## 7. Backend Architecture

### Middleware Stack (in order)

```
Request
  → helmet()            [Security HTTP headers]
  → morgan()            [Request logging]
  → cors()              [Cross-origin, credentials: true]
  → express.json()      [JSON body parsing]
  → express.urlencoded() [Form body parsing]
  → cookieParser()      [Cookie parsing]
  → Route handlers
  → notFound()          [404 fallback]
  → errorHandler()      [Global error handler]
```

### Server Entry Point (`server.js`)

1. Loads `.env` via `dotenv.config()`
2. Calls `connectDB()` (non-blocking — server starts even if DB fails)
3. Creates `http.Server` from Express `app`
4. Initialises `socket.io` on the same HTTP server with CORS config
5. Registers `connection`/`disconnect` Socket.io events (stub)
6. Starts listening on `PORT` (default `5001`)

### Error Handling Pattern

Controllers use `try/catch` with `next(error)` to forward unhandled errors to the global `errorHandler` middleware. Known error conditions (duplicate email, invalid credentials, etc.) return explicit JSON responses directly without throwing.

### Route Versioning

All API routes use the prefix `/api/v1/`. Future modules (meetings, users, etc.) should follow the same `api/v1/<resource>` convention.

---

## 8. Database Structure

### Database: `intellmeet` (MongoDB Atlas)

### Collection: `users`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | MongoDB primary key |
| `fullName` | String | Required, trimmed | User's display name |
| `email` | String | Required, unique, lowercase, trimmed | Validated with `/^\S+@\S+\.\S+$/` |
| `password` | String | Required, `select: false` | bcrypt hashed (salt rounds: 10). Never returned in queries by default |
| `role` | String | Enum: `['member', 'admin']`, default: `'member'` | Role-based access control |
| `refreshToken` | String | `select: false` | Stored plain JWT string; used for refresh token rotation and session validation |
| `createdAt` | Date | Auto (timestamps) | Mongoose `timestamps: true` |
| `updatedAt` | Date | Auto (timestamps) | Mongoose `timestamps: true` |

### Future Collections (Planned — Not Implemented)

| Collection | Purpose |
|---|---|
| `meetings` | Meeting rooms, participants, metadata |
| `recordings` | Meeting recording references (Cloudinary URLs) |
| `transcripts` | AI-generated meeting transcripts |
| `summaries` | AI-generated meeting summaries |

---

## 9. Authentication Implementation

**Status: ✅ Fully Implemented**

### Strategy

- **Access Token**: Short-lived JWT (15 minutes), signed with `JWT_SECRET`. Payload: `{ id, role }`.
- **Refresh Token**: Long-lived JWT (7 days), signed with `JWT_REFRESH_SECRET`. Payload: `{ id }`. Stored in the user's database record for session validation and rotation.
- **Transport**: Both tokens are stored as `HttpOnly` cookies (`accessToken`, `refreshToken`). This protects against XSS token theft.

### Cookie Security Configuration

| Environment | `httpOnly` | `secure` | `sameSite` |
|---|---|---|---|
| Development (`NODE_ENV != 'production'`) | `true` | `false` | `lax` |
| Production (`NODE_ENV === 'production'`) | `true` | `true` | `lax` |

### Token Rotation Flow

```
Login/Register
  → Generate accessToken (15m) + refreshToken (7d)
  → Save refreshToken to user.refreshToken in DB
  → Set both as HttpOnly cookies
  → Return user object (id, fullName, email, role, createdAt)

Per Request (Protected Routes)
  → protect middleware reads accessToken cookie
  → Verifies JWT signature against JWT_SECRET
  → Fetches user from DB by decoded id
  → Attaches req.user = { id, fullName, email, role, createdAt }

Silent Refresh (Client Interceptor)
  → Axios 401 response interceptor catches expired access token
  → Calls POST /api/v1/auth/refresh-token
  → Server validates refreshToken cookie against DB record
  → Issues new accessToken + new refreshToken (rotation)
  → Client retries original request

Logout
  → POST /api/v1/auth/logout
  → Finds user by refreshToken cookie, clears DB field
  → Clears both cookies (clearCookie)
```

### Password Policy (Enforced in `authValidator.js` and `Signup.jsx`)

- Minimum 8 characters
- At least one uppercase letter (A–Z)
- At least one lowercase letter (a–z)
- At least one number (0–9)
- Hashed using `bcrypt.genSalt(10)` + `bcrypt.hash()` in `User.js` pre-save hook

### Persistent Login

On every app mount, `AppContent` calls `checkAuth()` which hits `GET /api/v1/auth/me`. If the access token cookie is still valid, the user is silently restored to authenticated state. If expired but a valid refresh token exists, the Axios interceptor handles the silent refresh transparently.

---

## 10. API Endpoints

### Implemented Endpoints

#### System

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns `{ status: 'ok', message, timestamp }` |

#### Authentication — `/api/v1/auth`

| Method | Path | Auth | Validator | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | `validateRegister` | Create new user. Returns user object + sets `accessToken` + `refreshToken` cookies. HTTP 201 on success, 409 on duplicate email, 400 on validation failure |
| `POST` | `/api/v1/auth/login` | Public | `validateLogin` | Authenticate user. Returns user object + sets cookies. HTTP 200 on success, 401 on bad credentials |
| `POST` | `/api/v1/auth/logout` | Public | — | Clears DB refreshToken and clears cookies. HTTP 200 |
| `POST` | `/api/v1/auth/refresh-token` | Public | — | Validates refreshToken cookie against DB. Issues new token pair. HTTP 200 or 401 |
| `GET` | `/api/v1/auth/me` | `protect` | — | Returns `req.user` (from access token). HTTP 200 or 401 |
| `GET` | `/api/v1/auth/profile` | `protect` | — | Alias for `/me` — returns same `req.user`. HTTP 200 or 401 |

### Standard API Response Shapes

**Success (register/login/refresh/me):**
```json
{
  "id": "64f...",
  "fullName": "Jane Miller",
  "email": "jane.miller@example.com",
  "role": "member",
  "createdAt": "2026-07-01T10:00:00.000Z"
}
```

**Validation Error (400):**
```json
{
  "message": "Password must be at least 8 characters long",
  "errors": [
    { "field": "password", "message": "Password must be at least 8 characters long" }
  ]
}
```

**Auth Error (401 / 409):**
```json
{ "message": "Email already registered" }
```

### Planned Endpoints (Not Yet Implemented)

| Module | Planned Routes |
|---|---|
| Users | `PUT /api/v1/auth/profile` (update name/avatar), `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`, `POST /api/v1/auth/verify-email` |
| Meetings | `GET/POST /api/v1/meetings`, `GET/PUT/DELETE /api/v1/meetings/:id`, `POST /api/v1/meetings/:id/join` |
| Participants | `GET /api/v1/meetings/:id/participants` |
| Recordings | `GET /api/v1/recordings`, `POST /api/v1/recordings/upload` |
| AI | `POST /api/v1/ai/summarise`, `GET /api/v1/ai/transcript/:meetingId` |
| Admin | `GET /api/v1/admin/users`, `PUT /api/v1/admin/users/:id/role` |

---

## 11. Environment Variables

### Server (`server/.env`)

| Variable | Example Value | Required | Purpose |
|---|---|---|---|
| `PORT` | `5001` | No (default: 5000) | Express server port |
| `NODE_ENV` | `development` | Yes | Controls logging mode, cookie `secure` flag |
| `CLIENT_URL` | `http://localhost:5173` | Yes | CORS allowed origin and Socket.io CORS |
| `MONGODB_URI` | `mongodb+srv://...` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | `<strong random string>` | Yes | Signs access tokens (15 min) |
| `JWT_REFRESH_SECRET` | `<strong random string>` | Yes | Signs refresh tokens (7 days) |
| `CLOUDINARY_CLOUD_NAME` | `placeholder_cloud_name` | No (future) | Cloudinary upload config |
| `CLOUDINARY_API_KEY` | `placeholder_api_key` | No (future) | Cloudinary upload config |
| `CLOUDINARY_API_SECRET` | `placeholder_api_secret` | No (future) | Cloudinary upload config |

### Client (Vite env — none currently defined in `.env` files)

| Variable | Default Fallback | Purpose |
|---|---|---|
| `VITE_API_URL` | `/api` (Vite proxy) | Axios base URL. Set to full server URL in production |

> **Security Note**: The server codebase contains hardcoded fallback values for `JWT_SECRET` and `JWT_REFRESH_SECRET` in `token.js` and `authMiddleware.js`. These must be replaced with strong secrets in `.env` before any deployment.

---

## 12. Dependencies

### Server Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `mongoose` | MongoDB ODM — schema, validation, hooks |
| `jsonwebtoken` | JWT creation and verification |
| `bcrypt` | Password hashing |
| `cookie-parser` | Parse `Cookie` header into `req.cookies` |
| `cors` | CORS middleware |
| `helmet` | Sets security-related HTTP response headers |
| `morgan` | HTTP request logger |
| `dotenv` | Loads `.env` file into `process.env` |
| `express-rate-limit` | Rate limiting — **installed but not applied** |
| `socket.io` | Real-time WebSocket server — **stub only** |
| `cloudinary` | Cloud media management — **installed, not configured** |
| `multer` | Multipart form data (file uploads) — **installed, not configured** |
| `multer-storage-cloudinary` | Multer storage adapter for Cloudinary — **installed, not configured** |

### Server Dev Dependencies

| Package | Purpose |
|---|---|
| `nodemon` | Automatic server restart on file changes |
| `eslint` | JavaScript linter |
| `globals` | ESLint global variable definitions |
| `prettier` | Code formatter |

### Client Dependencies

| Package | Purpose |
|---|---|
| `react`, `react-dom` | React 19 UI library |
| `react-router-dom` | Client-side routing |
| `zustand` | Lightweight global state management |
| `axios` | HTTP client with interceptors |
| `@tanstack/react-query` | Server state/async data management — **installed, only used in legacy health check** |
| `react-hot-toast` | Toast notification system |
| `lucide-react` | Icon library |
| `clsx` | Conditional class name utility |
| `tailwind-merge` | Merges Tailwind classes without conflicts |
| `class-variance-authority` | Variant-based component styling — **installed for shadcn/ui, not yet used** |
| `socket.io-client` | WebSocket client — **installed, not yet connected** |

### Client Dev Dependencies

| Package | Purpose |
|---|---|
| `vite` | Build tool and dev server |
| `@vitejs/plugin-react` | React Fast Refresh for Vite |
| `@tailwindcss/vite` | Tailwind CSS v4 Vite plugin |
| `tailwindcss` | Tailwind CSS v4 |
| `postcss` | CSS transformation pipeline |
| `eslint` + plugins | Linting for React, hooks, and refresh |
| `prettier` | Code formatting |

---

## 13. Design Decisions

### 1. Monorepo Structure
The project uses a simple `npm workspaces`-like root `package.json` with `concurrently` to run both client and server with a single `npm run dev` command from the root. Dependencies are not hoisted; each workspace (`client/`, `server/`) manages its own `node_modules`.

### 2. ESM Throughout
Both `client` and `server` use ES Modules (`"type": "module"` in both `package.json` files). All imports use `import/export` syntax.

### 3. JWT in HttpOnly Cookies (not localStorage)
Storing JWTs in `localStorage` exposes them to XSS attacks. Using `HttpOnly` cookies means JavaScript cannot read the tokens, significantly reducing the XSS attack surface. The tradeoff is the need to handle CSRF, which `SameSite=Lax` mitigates for same-site navigation.

### 4. Refresh Token Stored in Database
The refresh token value is stored in the user's MongoDB document (`user.refreshToken`). This enables:
- Immediate session revocation (logout clears the DB field)
- Detection of token reuse attacks (if stored token doesn't match cookie, session is invalid)
- Single-device session management (new login overwrites the stored token)

### 5. Silent Refresh via Axios Interceptor
Rather than requiring the user to log in again when the 15-minute access token expires, the Axios response interceptor automatically calls `/refresh-token` on any `401` response, gets a new token pair, and replays the original request. This is transparent to the user.

### 6. Zustand over Redux / React Context
Zustand was chosen for its minimal boilerplate and direct integration with async actions. The auth store holds all global auth state and exposes async actions (`login`, `register`, `logout`, `checkAuth`) that directly call the API.

### 7. Vite Proxy
In development, Vite's proxy routes `/api/*` to `localhost:5001`, avoiding CORS issues and eliminating the need to set `VITE_API_URL`. In production, the client would either be served from the same origin as the server or `VITE_API_URL` would be set to the server's full domain.

### 8. API Route Versioning (`/api/v1/`)
All API routes are prefixed with `/api/v1/` to allow future non-breaking additions of v2 routes without disrupting existing clients.

### 9. Tailwind CSS v4
The project uses Tailwind v4's new `@import 'tailwindcss'` syntax and the `@tailwindcss/vite` plugin directly (no `tailwind.config.js` needed). CSS custom properties are defined via the `@theme` block in `index.css`.

### 10. `shadcn/ui` Configured but Unused
`components.json` is set up and the `@/` path alias is configured in `vite.config.js`, meaning `npx shadcn@latest add <component>` will work out of the box. No components have been installed yet.

---

## 14. Coding Conventions

### General

- **ES Modules** — `import`/`export` everywhere, no `require()`
- **2-space indentation** (enforced by Prettier)
- **Single quotes** for strings (enforced by Prettier)
- **Trailing commas** in ES5 contexts (enforced by Prettier)
- **Line endings** — LF (Unix-style, enforced by `.prettierrc`)
- **Max print width** — 100 characters

### Backend (Node/Express)

- Controllers are `async` functions using `try/catch` with `next(error)` for forwarding
- Route handler signature: `async (req, res, next) => {}`
- All controllers export named functions (no default exports)
- Route files use default export for the Express `Router` instance
- Middleware files export named functions
- JSDoc-style comments on each controller: `@desc`, `@route`, `@access`

### Frontend (React)

- Functional components only — no class components
- Component files use PascalCase (`Login.jsx`, `ProtectedRoute.jsx`)
- Non-component files use camelCase (`useAuthStore.js`, `api-client.js`)
- React hooks are called at the top level of components
- `useEffect` dependencies are explicitly declared
- `prop-types` validation is disabled (per ESLint config)
- Zustand store actions are `async` functions returning `{ success: boolean, error?: string }`
- Tailwind classes are written inline (no CSS modules or styled components)

### File Naming

| Type | Convention | Example |
|---|---|---|
| React page components | PascalCase | `Login.jsx`, `Signup.jsx` |
| React layout components | PascalCase | `ProtectedRoute.jsx` |
| Stores | camelCase hook name | `useAuthStore.js` |
| Controllers | camelCase + `Controller` | `authController.js` |
| Routes | camelCase + `Routes` | `authRoutes.js` |
| Middleware | camelCase + `Middleware` | `authMiddleware.js` |
| Validators | camelCase + `Validator` | `authValidator.js` |
| Utils | camelCase | `token.js`, `api-client.js` |
| Models | PascalCase (singular) | `User.js` |

---

## 15. Development Workflow

### Prerequisites

- Node.js (LTS recommended)
- npm
- Access to MongoDB Atlas (or local MongoDB on `127.0.0.1:27017`)

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd IntellMeet

# Install all dependencies (root + client + server)
npm run install:all
```

### Configure Environment

```bash
# Copy the example env file
cp server/.env.example server/.env
# Edit server/.env with your actual secrets
```

### Run in Development

```bash
# From the project root — starts both client (5173) and server (5001) concurrently
npm run dev
```

- **Client**: http://localhost:5173
- **Server API**: http://localhost:5001 (also accessible at http://localhost:5173/api via Vite proxy)
- **Health check**: http://localhost:5173/api/health

### Available Root Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `concurrently "npm run dev --prefix client" "npm run dev --prefix server"` | Start both client and server |
| `npm run install:all` | Installs root + client + server deps | Full dependency installation |
| `npm run client:install` | `npm install --prefix client` | Install client deps only |
| `npm run server:install` | `npm install --prefix server` | Install server deps only |
| `npm run lint` | Runs ESLint on both client and server | Linting |
| `npm run format` | Runs Prettier on all `js/jsx/json/css/md` | Formatting |

### Available Server-Only Scripts

| Script | Description |
|---|---|
| `npm run dev` (in `server/`) | Start server with nodemon |
| `npm run start` (in `server/`) | Start server with node (production) |

### Available Client-Only Scripts

| Script | Description |
|---|---|
| `npm run dev` (in `client/`) | Start Vite dev server |
| `npm run build` (in `client/`) | Build for production |
| `npm run preview` (in `client/`) | Preview production build |

---

## 16. Known Issues & Technical Debt

### Health Check — 2026-07-01

A full project health check was performed. All critical auth flows verified working against MongoDB Atlas.

| Check | Result |
|---|---|
| `npm run dev` starts client + server | ✅ Pass |
| MongoDB Atlas connection | ✅ Pass (`ac-qwpomkz-shard-00-00.ylz3ot9.mongodb.net`) |
| ESLint (client + server) | ✅ Pass (0 errors after fixes) |
| Client production build (`npm run build`) | ✅ Pass |
| All required env vars in `server/.env` | ✅ Pass |
| Register / Login / Logout / GET /me / Refresh token | ✅ Pass |
| Password bcrypt hashing | ✅ Pass |
| Protected routes (`/dashboard` → redirect when unauthenticated) | ✅ Pass |
| Cookie config for development (`httpOnly`, `secure: false`, `sameSite: lax`) | ✅ Pass |
| Broken imports | ✅ None found |
| Runtime errors on startup | ✅ None |

### Fixes Applied (2026-07-01)

| ID | File | Fix |
|---|---|---|
| FIX-001 | `client/src/lib/utils.js` | Changed `tailwindMerge` import to `twMerge` from `tailwind-merge` |
| FIX-002 | `client/src/App.jsx` | Removed unused `Shield` import from `lucide-react` |
| FIX-003 | `client/src/pages/Login.jsx` | Escaped apostrophe in "Don't" → `Don&apos;t` |
| FIX-004 | `client/src/store/useAuthStore.js` | Removed unused `err` in `checkAuth` catch block |
| FIX-005 | `client/src/lib/api-client.js` | Axios interceptor no longer attempts token refresh on `/login`, `/register`, `/logout`, or initial `checkAuth` (`skipAuthRefresh`) |
| FIX-006 | `server/src/controllers/authController.js` | Removed unused `generateAccessToken` import; removed unused `err` in refresh catch |

### Bugs (Resolved)

| ID | Severity | File | Issue | Status |
|---|---|---|---|---|
| BUG-001 | Medium | `client/src/lib/utils.js` | Wrong `tailwindMerge` import — should be `twMerge` | ✅ Fixed (FIX-001) |
| BUG-002 | Low | `client/src/App.jsx` | Unused `Shield` import | ✅ Fixed (FIX-002) |
| BUG-003 | Low | `client/src/pages/Login.jsx` | Unescaped apostrophe | ✅ Fixed (FIX-003) |
| BUG-004 | Low | `client/src/store/useAuthStore.js` | Unused `err` in catch | ✅ Fixed (FIX-004) |
| BUG-005 | Medium | `client/src/lib/api-client.js` | 401 on login/register triggered unnecessary refresh + logout calls | ✅ Fixed (FIX-005) |

### Technical Debt

| ID | Priority | Description |
|---|---|---|
| TD-001 | High | **Hardcoded JWT fallback secrets** in `token.js` and `authMiddleware.js`. These must be removed before production deployment. The server should fail to start if JWT secrets are not provided. |
| TD-002 | High | **Rate limiting not applied**. `express-rate-limit` is installed but not mounted on any route. Auth endpoints (login/register) are vulnerable to brute-force attacks. |
| TD-003 | Medium | **No email verification**. Users can register with unverified email addresses. |
| TD-004 | Medium | **Refresh token not rotated per-device**. A single `refreshToken` field per user means a new login from a second device invalidates the first device's session. A `refreshTokens: [{ token, deviceInfo, createdAt }]` array pattern would support multi-device sessions. |
| TD-005 | Medium | **`/api/v1/auth/profile` is a duplicate of `/api/v1/auth/me`**. Both endpoints return the same `req.user` data. `profile` should eventually support `PUT` for profile updates. |
| TD-006 | Medium | **TanStack Query is largely unused**. It was part of the original scaffold. The auth flows use Zustand directly. A consistent data-fetching pattern needs to be decided. |
| TD-007 | Low | **`client/src/lib/utils.js` `cn()` function is unused** in current app code (reserved for future shadcn/ui). Import was broken (BUG-001) but is now fixed. |
| TD-008 | Low | **Dashboard is defined inline in `App.jsx`**. It should be moved to `client/src/pages/Dashboard.jsx` as the codebase grows. |
| TD-009 | Low | **`server/src/uploads/`** directory exists but has no `.gitkeep` — it could accumulate local files unexpectedly. |

---

## 17. Roadmap

The following order is recommended based on foundational dependencies:

### Phase 1 — Authentication Hardening (Current Phase, Minor Remaining Work)
- [x] Fix all 5 known linting/runtime bugs (BUG-001 through BUG-005) — completed 2026-07-01
- [ ] Remove hardcoded JWT fallback secrets; add startup validation (TD-001)
- [ ] Apply rate limiting to `/api/v1/auth/login` and `/api/v1/auth/register` (TD-002)
- [ ] Implement `PUT /api/v1/auth/profile` (update fullName, password)

### Phase 2 — User Management
- [ ] Forgot password / reset password flow (email-based)
- [ ] Email verification on registration
- [ ] Avatar upload via Cloudinary
- [ ] Admin user management endpoints

### Phase 3 — Meeting Core
- [ ] `Meeting` Mongoose model (title, host, participants, status, startTime, endTime)
- [ ] Meeting CRUD API (`/api/v1/meetings`)
- [ ] Meeting page UI (create, join, list)

### Phase 4 — Real-Time Communication
- [ ] Socket.io room management (join/leave meeting rooms)
- [ ] WebRTC peer connection signalling (offer/answer/ICE via Socket.io)
- [ ] Video/audio streaming UI with participant tiles
- [ ] Screen sharing

### Phase 5 — AI Features
- [ ] Meeting transcription integration
- [ ] AI-powered meeting summary generation
- [ ] Transcript storage and retrieval API

### Phase 6 — Production Readiness
- [ ] Production build pipeline
- [ ] Environment-specific configuration
- [ ] Deployment (server + client)
- [ ] Monitoring and error tracking

---

## 18. Next Recommended Task

**Apply rate limiting** to the auth endpoints (TD-002) and **remove hardcoded JWT fallback secrets** with startup validation (TD-001). These are the highest-priority remaining hygiene tasks before building meeting features.

Specifically:
1. Add `express-rate-limit` to the auth router in `authRoutes.js`
2. Remove hardcoded JWT secret fallbacks from `token.js` and `authMiddleware.js`; fail fast if env vars are missing
3. Begin Phase 2 user management (profile updates, password reset) or Phase 3 meeting core

---

## 19. Testing Status

**No automated tests exist in this project.**

| Test Type | Status | Notes |
|---|---|---|
| Unit tests (server) | ❌ None | No Jest, Mocha, or similar test framework configured |
| Integration tests (API) | ❌ None | No Supertest or similar |
| Unit tests (client) | ❌ None | No Vitest or React Testing Library configured |
| End-to-end tests | ❌ None | No Playwright or Cypress configured |

### Manual Verification Performed

The following flows were verified on **2026-07-01** via automated API integration tests and dev server startup:

| Test Case | Result |
|---|---|
| `npm run dev` — client (5173) + server (5001) start | ✅ Pass |
| MongoDB Atlas connection | ✅ Pass |
| ESLint — client + server | ✅ Pass (0 errors) |
| Client production build | ✅ Pass |
| New user registration | ✅ Works — user created, httpOnly cookies set |
| Duplicate email registration | ✅ Returns HTTP 409 with `"Email already registered"` message |
| Login with correct credentials | ✅ Works — user authenticated, cookies set |
| Login with wrong password | ✅ Returns HTTP 401 (no spurious refresh attempt) |
| Protected route access while authenticated | ✅ Dashboard accessible |
| Protected route access while unauthenticated | ✅ Redirects to `/login` |
| Session persistence after page refresh | ✅ `checkAuth()` restores session via `GET /api/v1/auth/me` |
| Refresh token rotation | ✅ Works — new access/refresh cookies issued |
| Logout | ✅ Cookies cleared via `Set-Cookie`, user returned to unauthenticated state |
| Password stored as bcrypt hash in MongoDB | ✅ Verified — `$2b$` prefix, `comparePassword()` works |
| Cookie dev config | ✅ `httpOnly: true`, `secure: false`, `sameSite: lax` |
| Axios silent refresh on expired access token | ✅ Interceptor retries after `/refresh-token` |
| Axios skip refresh on login/register/logout/checkAuth | ✅ Fixed — no unnecessary refresh calls |
| Zustand auth state (`user`, `isAuthenticated`, `isCheckingAuth`) | ✅ Correctly updated on all auth actions |

---

## 20. Deployment Status

**Not deployed. Development only.**

| Concern | Status | Notes |
|---|---|---|
| Server deployment | ❌ Not deployed | No hosting configuration, `Procfile`, or Docker setup |
| Client deployment | ❌ Not deployed | No static hosting config (Netlify, Vercel, etc.) |
| Production build | ✅ Tested 2026-07-01 | `npm run build` in `client/` succeeds |
| Environment hardening | ⚠️ Incomplete | Hardcoded JWT fallback secrets present (TD-001) |
| HTTPS | ⚠️ Dev only | Cookie `secure: false` in development. Will be `true` automatically when `NODE_ENV=production` |
| CI/CD | ❌ None | No GitHub Actions, CircleCI, or similar configured |
| MongoDB Atlas | ✅ Configured | Active Atlas cluster connection string in `server/.env` |
