# API Keys & Database Setup

## Where to put each secret

| Secret | File | Variable |
|--------|------|----------|
| **Groq API key** | `backend/.env` | `GROQ_API_KEY` |
| **Neon DB connection string** | `backend/.env` | `DATABASE_URL` |
| **Frontend → backend URL** | `frontend/.env.local` | `NEXT_PUBLIC_API_URL` |

Groq and Neon **never** go in the frontend. Only the backend URL is public in `.env.local`.

---

## Step 1 — Create `backend/.env`

```powershell
cd C:\Users\10sat\Desktop\CampusVerse\backend
copy .env.example .env
```

Open **`backend/.env`** in your editor.

---

## Step 2 — Groq API key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign in → **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_`)

In **`backend/.env`**:

```env
GROQ_API_KEY=gsk_paste_your_real_key_here
```

---

## Step 3 — Neon database

1. Go to [https://neon.tech](https://neon.tech)
2. Create a project (e.g. `campusverse`)
3. Open **Dashboard** → **Connect**
4. Copy the **connection string** (PostgreSQL)

In **`backend/.env`**, set (paste your real string):

```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-cool-name-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Notes:
- You can paste `postgresql://` or `postgres://` — the app converts it for asyncpg automatically.
- SSL is auto-enabled for `neon.tech` hosts.
- You do **not** need local Docker Postgres if you use Neon.

---

## Step 4 — Frontend env

```powershell
cd C:\Users\10sat\Desktop\CampusVerse\frontend
copy .env.local.example .env.local
```

**`frontend/.env.local`** should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Step 5 — Install deps & seed Neon (first time only)

```powershell
cd C:\Users\10sat\Desktop\CampusVerse\backend
pip install -r requirements.txt
```

If `pip install` fails on **chromadb** / C++ errors, use the slim `requirements.txt` in this repo (ChromaDB is optional and not wired yet).

```powershell
python scripts/generate_campus.py
python -m scripts.seed
```

`seed` creates all tables in Neon and loads 1000 students + catalog.

If you see **"Database already seeded"**, tables + data already exist.

---

## Step 6 — Run

**Terminal 1 — backend**

```powershell
cd C:\Users\10sat\Desktop\CampusVerse\backend
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend**

```powershell
cd C:\Users\10sat\Desktop\CampusVerse\frontend
npm run dev
```

---

## Verify

| Check | URL |
|-------|-----|
| Groq connected | http://localhost:8000/api/v1/ai/status → `"groq_available": true` |
| DB + seed OK | http://localhost:8000/api/v1/students?demo_only=true → JSON list |
| App | http://localhost:3000 |

---

## Troubleshooting

**`password authentication failed`** — wrong Neon password in `DATABASE_URL`; reset in Neon dashboard.

**`SSL required`** — ensure connection string includes `?sslmode=require` or set `DATABASE_SSL=true`.

**Groq still in demo mode** — restart uvicorn after editing `.env`; key must start with `gsk_`.

**Frontend shows mock data** — confirm `frontend/.env.local` exists and backend is running on port 8000.
