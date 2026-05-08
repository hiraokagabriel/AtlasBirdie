<div align="center">
  <h1>🏸 Atlas Birdie</h1>
  <p><strong>The full-featured badminton management platform.</strong></p>
  <p>Tournament creation · Ranking-based bracket generation · Athlete & club management · Detailed player profiles</p>
  <p><em>Designed to serve the entire competitive lifecycle — from registration day to the podium.</em></p>

  <br/>

  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
  ![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat-square&logo=fastify&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
  ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
</div>

---

## 📖 Overview

**Atlas Birdie** is a premium, multi-tenant badminton management platform that covers the full competitive ecosystem. It is inspired by the operational depth of Tournament Software and the player-centric experience of the BWF app, combining both into a single, cohesive product.

The platform serves three audiences simultaneously:

- **Organizers & Federations** — create and manage tournaments, generate seeded brackets automatically, schedule matches by court, and control the full competitive lifecycle.
- **Athletes & Clubs** — register, build detailed profiles, track individual rankings across disciplines, and monitor performance history over time.
- **Public & Fans** — access live draw results, real-time scores, rankings, athlete profiles, and tournament pages without an account.

---

## ✨ Features

### 🏆 Tournament Management
- Wizard-based tournament creation with multiple events (singles, doubles, mixed)
- Support for formats: single elimination, double elimination, round robin, groups + knockout
- Court scheduling with minimum rest time and multi-event conflict detection
- Automatic bye distribution for non-power-of-2 draw sizes
- Public tournament page with live bracket, schedule, and results

### 🥇 Ranking Engine
- Separate rankings per discipline: MS, WS, MD, WD, XD
- Configurable scoring window (e.g., best 10 results over 52 weeks)
- Rankings by federation, circuit, city, club, and season
- Seed freeze at inscription close date to prevent post-registration changes
- Full historical ranking timeline per athlete

### 🎯 Bracket Generation
- Automatic seeded draw based on ranking at cutoff date
- Seeds 1 & 2 placed on opposite halves; seeds 3 & 4 in separate quadrants
- Recursive distribution of remaining seeds following standard BWF logic
- Manual override capability for special cases

### 👤 Athlete & Club Management
- Unified athlete profile: personal data, photo, club, dominant hand, disciplines
- Long-term match history, titles, ranking evolution, and frequent doubles partners
- Club profiles with rosters, tournament history, and aggregated performance
- Bulk import via spreadsheet and public registration form
- Role-based access: federation admin, club manager, athlete, public

### 📊 Results & Statistics
- Fast score entry with automatic bracket advancement
- Simultaneous update of bracket, group table, schedule, and athlete stats
- Performance analytics: win rate, head-to-head, points per tournament, best results
- Real-time updates via WebSockets

### 🌐 Multi-Tenant Architecture
- Isolated data per organization (federation, league, club circuit)
- Each tenant has its own subdomain, branding, and configuration
- Shared infrastructure with tenant-level access control
- Designed to scale from a single regional federation to a national multi-org platform

---

## 🏗️ Tech Stack

### Full-Stack TypeScript Monorepo (Turborepo)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR/SSG, dynamic routes, SEO for public portal |
| **Styling** | Tailwind CSS v4 + Shadcn/ui | Premium, accessible, highly customizable UI |
| **Data fetching** | TanStack Query (React Query) | Cache, sync, and real-time data management |
| **Backend** | Node.js + Fastify | Lightweight, fast, ideal for rule-heavy business logic |
| **ORM** | Prisma | Structured data model, type-safe migrations |
| **Database** | PostgreSQL | Relational, robust for rankings, history, brackets |
| **Cache / Realtime** | Redis + WebSockets (Pusher/Socket.io) | Live scores, ranking cache, push notifications |
| **Auth** | Clerk / Auth.js | Role-based authentication (admin, organizer, athlete, public) |
| **File Storage** | Cloudinary / Uploadthing | Athlete photos, club logos, documents |
| **Infrastructure** | Vercel (frontend) + Railway (backend/DB) | Scalable, low-ops deployment |
| **Monorepo** | Turborepo | Unified build pipeline, shared TypeScript types and packages |

---

## 📁 Monorepo Structure

```
atlas-birdie/
├── apps/
│   ├── web/                  # Next.js 15 frontend (App Router)
│   └── api/                  # Fastify backend (REST + WebSocket)
├── packages/
│   ├── database/             # Prisma schema, migrations, seed scripts
│   ├── types/                # Shared TypeScript types and interfaces
│   ├── ui/                   # Shared component library (Shadcn/ui base)
│   ├── config/               # Shared ESLint, TypeScript, Tailwind configs
│   └── utils/                # Shared utility functions and helpers
├── turbo.json
├── package.json
└── README.md
```

---

## 🗺️ Roadmap

### Phase 0 — Foundation
- [ ] Monorepo setup with Turborepo
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Database schema design (Athlete, Club, Tournament, Event, Match, Ranking, Tenant)
- [ ] Authentication and role-based access control
- [ ] Environment configuration and deployment pipelines

### Phase 1 — Athlete & Club Registration
- [ ] Athlete registration (manual, public form, bulk import)
- [ ] Club management and roster control
- [ ] Doubles pair management (fixed and event-based)
- [ ] Public athlete profile page

### Phase 2 — Tournament Creation
- [ ] Tournament wizard (events, categories, courts, dates, regulations)
- [ ] Inscription management (open, manual, import)
- [ ] Multi-event support within a single tournament

### Phase 3 — Ranking Engine
- [ ] Points accumulation logic per discipline
- [ ] Configurable scoring window and tournament weight
- [ ] Rankings by discipline, category, federation, and season
- [ ] Ranking freeze at inscription cutoff date

### Phase 4 — Bracket Generation
- [ ] Automatic seeded draw from ranking
- [ ] Single elimination, double elimination, round robin, groups + knockout
- [ ] Bye distribution for non-power-of-2 sizes
- [ ] Manual override for special cases

### Phase 5 — Match Results & Scheduling
- [ ] Court scheduler with conflict detection and minimum rest rules
- [ ] Fast score entry with automatic bracket advancement
- [ ] Simultaneous update of bracket, group table, and athlete stats

### Phase 6 — Public Portal
- [ ] Public tournament page (bracket, schedule, results)
- [ ] Real-time live scores via WebSockets
- [ ] Public athlete and club profiles

### Phase 7 — Admin Dashboard
- [ ] Organizer dashboard with tournament overview
- [ ] Reports and data exports
- [ ] Notifications for schedule changes and match calls

### Phase 8 — Mobile & PWA
- [ ] Mobile-first optimization
- [ ] Push notifications for match calls and schedule changes
- [ ] Court-side score entry for referees

---

## 🗃️ Core Data Model

```
Tenant
  └── has many Federations, Circuits, Leagues

Athlete
  ├── belongs to Club
  ├── has many Rankings (per discipline)
  ├── has many MatchParticipations
  └── has many DoublePairs

Tournament
  ├── belongs to Tenant
  ├── has many Events (MS, WS, MD, WD, XD)
  └── Event
        ├── has many Inscriptions
        ├── has one Bracket (or Groups)
        └── Bracket
              └── has many Matches

Match
  ├── has two Participants (Athlete or DoublePair)
  ├── belongs to Court + TimeSlot
  └── produces Result → updates Ranking
```

---

## 🚀 Getting Started

> Prerequisites: Node.js 20+, PostgreSQL, Redis, pnpm

```bash
# Clone the repository
git clone https://github.com/hiraokagabriel/AtlasBirdie.git
cd AtlasBirdie

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, REDIS_URL, AUTH credentials, etc.

# Run database migrations
pnpm db:migrate

# Start all apps in development mode
pnpm dev
```

---

## 🤝 Contributing

Atlas Birdie is currently in active early development. Contributions, issues and feature requests are welcome. Please open an issue before submitting a pull request so we can align on direction.

---

## 📄 License

[MIT](./LICENSE)

---

<div align="center">
  <p>Built with precision for the badminton competitive ecosystem.</p>
  <p><strong>Atlas Birdie</strong> · From registration day to the podium.</p>
</div>
