# KVIS Connect

Alumni network for KVIS — built with Next.js 14, FastAPI, and PostgreSQL.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm i -g pnpm` |
| Python | 3.12+ | [python.org](https://python.org) |
| Docker Desktop | latest | [docker.com](https://docker.com) |

---

## Quick Start — Mock backend (no Docker required)

For local dev or sharing with others who don't have Docker. Uses a pre-seeded Express server with 12 mock alumni — no Python, no database needed.

```bash
# 1. Install frontend deps
pnpm run install:fe

# 2. Install mock server deps
cd mock-server && npm install && cd ..

# 3. Start mock server  →  http://localhost:8000
pnpm run be:mock

# 4. Start frontend (new terminal)  →  http://localhost:3000
pnpm run fe
```

Mock alumni have realistic Thai names, DiceBear pixel-art avatars, MBTI, career history, and globe coordinates. All API endpoints are mirrored. Any `@kvis.ac.th` email + any password will log you in.

---

## Full setup (real backend)

### 1. Install dependencies

```bash
# Backend (creates .venv, installs Python deps)
pnpm run install:be

# Frontend
pnpm run install:fe
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — at minimum set SECRET_KEY

# Frontend
cp frontend/.env.local.example frontend/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000 is already set
```

### 3. Start the database

```bash
pnpm run db
```

This starts PostgreSQL on port `5432` via Docker.

### 4. Run migrations

```bash
pnpm run migrate
```

This creates all tables via Alembic.

---

## Running in development

Open **three terminals**:

```bash
# Terminal 1 — Database (only needed once, keeps running)
pnpm run db

# Terminal 2 — Backend  http://localhost:8000
pnpm run be

# Terminal 3 — Frontend  http://localhost:3000
pnpm run fe
```

API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI).

---

## Project structure

```
kvis-connect/
├── mock-server/              # Express mock backend (no Docker)
│   └── index.js              # All API endpoints + 12 pre-seeded alumni
├── backend/                  # FastAPI + SQLModel
│   ├── app/
│   │   ├── core/             # Config, DB, security, deps
│   │   ├── models/           # SQLModel tables (User, Education, Career, Blog)
│   │   ├── routers/          # auth, users, search, summary, blogs
│   │   └── schemas/          # Pydantic request/response models
│   ├── alembic/              # DB migrations
│   └── requirements.txt
├── frontend/                 # Next.js 14 App Router
│   └── src/
│       ├── app/              # Pages (routing)
│       ├── components/       # UI components (shadcn/ui + custom)
│       ├── contexts/         # AuthContext
│       ├── hooks/            # use-toast
│       └── lib/              # API client, types, constants
├── docker-compose.yml        # PostgreSQL service
└── package.json              # Root scripts
```

---

## npm scripts (root)

| Command | Description |
|---|---|
| `pnpm run db` | Start PostgreSQL in Docker |
| `pnpm run be` | Start FastAPI backend on `:8000` (requires Docker DB) |
| `pnpm run be:mock` | Start mock Express backend on `:8000` (no Docker) |
| `pnpm run fe` | Start Next.js frontend on `:3000` |
| `pnpm run migrate` | Apply pending DB migrations |
| `pnpm run migration "message"` | Create a new migration |
| `pnpm run install:be` | Install Python dependencies |
| `pnpm run install:fe` | Install frontend dependencies (pnpm) |

---

## Adding a DB migration

After changing a model in `backend/app/models/`:

```bash
pnpm run migration "describe what changed"
pnpm run migrate
```

---

## Features

| Feature | Details |
|---|---|
| **Globe** | Interactive 3D globe with avatar pins, hover profile cards, country/province borders, real-time search bar in navbar, and filter panel that flies the globe to matched alumni |
| **Directory** | Filter alumni by name, class year, country, education, and career — with sort by name / year / join date |
| **Profile** | Name, class year, MBTI, bio, interests, location, education history, career history, social links |
| **Blog** | Alumni can write Markdown posts with live preview, tag filtering, cover images |
| **Auth** | Email + password (restricted to `@kvis.ac.th`) or Microsoft OAuth |
| **Summary** | Footer with live stats — total alumni, top countries, industries, degrees, MBTI distribution |

---

## Authentication notes

- Registration is restricted to `@kvis.ac.th` email addresses
- Microsoft OAuth reuses the existing KVIS Azure tenant (`e9c554b7-2aec-4238-9b8e-372753d596ae`)
- To enable Microsoft OAuth, add `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` to `backend/.env`
- Auth uses **httpOnly cookies** (JWT) — no tokens exposed to JavaScript

---

## Storage (profile pictures)

Profile picture upload requires S3-compatible storage (Cloudflare R2 recommended). Add to `backend/.env`:

```
S3_ENDPOINT_URL=https://your-account.r2.cloudflarestorage.com
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=kvis-connect
```

Without this, the upload endpoint returns `503` and everything else still works.
