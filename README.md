# CampusVerse AI

**The AI Operating System for Student Life**

A hackathon-ready MVP demonstrating unified AI intelligence for campus life — goals, companions, planning, network matching, intelligence hub, and Amazon-style hybrid recommendations.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue) ![Groq](https://img.shields.io/badge/Groq-AI-orange)

## Quick Start

### Frontend (works standalone with demo data)

```bash
cd frontend
npm install
npm run dev   # uses Webpack (not Turbopack) for lighter local dev
```

Open [http://localhost:3000](http://localhost:3000) → go to **Demos** → launch any scenario.

### Full Stack (with backend)

```bash
# Start PostgreSQL + Redis
docker compose up -d postgres redis

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
python scripts/generate_campus.py   # 1000 students + 1050 catalog items
python -m scripts.seed              # Seed database

uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
npm run dev
```

### Groq AI + Neon Database

**All secrets go in one file:** `backend/.env` (copy from `backend/.env.example`).

| Key | Where to get it | Env variable |
|-----|-----------------|--------------|
| Groq | [console.groq.com](https://console.groq.com) → API Keys | `GROQ_API_KEY=gsk_...` |
| Neon Postgres | [neon.tech](https://neon.tech) → Project → Connect | `DATABASE_URL=postgresql://...` |

**Frontend only needs:** `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

Full step-by-step: **[docs/SETUP_KEYS.md](docs/SETUP_KEYS.md)**

```powershell
# Backend setup (Neon — no Docker required)
cd backend
copy .env.example .env
# Edit .env → paste GROQ_API_KEY and Neon DATABASE_URL
pip install -r requirements.txt
python scripts/generate_campus.py
python -m scripts.seed
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
copy .env.local.example .env.local
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CampusVerse Frontend                      │
│              Next.js 15 · Tailwind · Framer Motion           │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
┌─────────────────────────▼───────────────────────────────────┐
│                   FastAPI Intelligence Layer                   │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│  Users   │  Goals   │Companion │ Planner  │  Intelligence   │
│  Network │ Resources│          │          │      Hub        │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│              Hybrid Recommendation Engine                    │
│         (Goals × Clubs × Interests × Context × Budget)       │
├─────────────────────────────────────────────────────────────┤
│  Groq AI  │  PostgreSQL  │  Redis  │  ChromaDB (ready)      │
└─────────────────────────────────────────────────────────────┘
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full system design.

## Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Magical home — greetings, insights, companion, recommendations |
| **Companion** | Tamagotchi dragons tied to goals (Egg → Legend evolution) |
| **Goals** | Voice/text goal creation → AI roadmap + milestones |
| **Planner** | Daily/weekly plans, focus sessions, wellness engine |
| **Intelligence Hub** | Summarize, classify, prioritize campus noise |
| **Network** | Study buddies, mentorship, project teams via campus graph |
| **Recommendations** | 1050+ item catalog, borrow-first sustainability ladder |
| **Demos** | 5 hackathon scenarios with one-click switching |

## Demo Scenarios

1. **First-Year Student** — DSA Dragon, study buddies
2. **Placement Aspirant** — Mock interviews, career recs
3. **Hackathon Participant** — Proactive gear prediction
4. **Hostel Fresher** — Dorm essentials, resource sharing
5. **Research Enthusiast** — ML tools, mentorship matching

## Synthetic Campus

- **1000 students** across 8 departments
- **16 clubs**, realistic interests/skills/goals
- **Campus graph**: friendships, mentorships, study groups
- **1050+ recommendation catalog items** across 25 categories

Generate data:

```bash
cd backend && python scripts/generate_campus.py
```

## API Docs

With backend running: [http://localhost:8000/docs](http://localhost:8000/docs)

Key endpoints:

- `GET /api/v1/dashboard/scenarios` — Demo scenarios
- `GET /api/v1/dashboard/{student_id}` — Full dashboard payload
- `POST /api/v1/ai/roadmap` — AI goal roadmap generation
- `POST /api/v1/ai/companion/chat` — Companion conversations
- `GET /api/v1/students/{id}/recommendations` — Hybrid recommendations

## Design System

Google Stitch **Comic Campus OS** aesthetic:

- **Anton** display · **Hanken Grotesk** body · **Space Mono** labels
- Hero Yellow (`#ffd700`) primary · 4px black borders · hard offset shadows
- Panel-based grid · zero border-radius · halftone textures

Reference: `stitch_hifi/stitch_campusos_ai_student_universe/`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Framer Motion, Zustand, Recharts |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL |
| Cache | Redis |
| AI | Groq API (Llama 3.3 70B) |
| Auth | Clerk (ready to integrate) |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [ER Diagram](docs/ER_DIAGRAM.md)
- [User Journeys](docs/USER_JOURNEYS.md)
- [Components](docs/COMPONENTS.md)

## License

MIT — built for hackathon demonstration.
# CampusVerse-AI---Amazon-HackON-6.0
