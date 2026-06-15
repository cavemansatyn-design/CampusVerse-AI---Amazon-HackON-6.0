# Deploying CampusVerse

## Frontend → Vercel

1. Import [GitHub repo](https://github.com/cavemansatyn-design/CampusVerse-AI---Amazon-HackON-6.0) on [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Framework preset: **Next.js** (auto-detected)
4. Environment variables (optional — app works in demo mode without backend):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-API.onrender.com/api/v1` |

5. Deploy

### CLI

```bash
cd frontend
npx vercel --prod
```

## Backend → Render (optional, for live Groq + DB)

Vercel hosts the Next.js app only. Deploy the FastAPI backend separately:

1. [render.com](https://render.com) → New → Blueprint → connect this repo
2. Uses `render.yaml` in repo root
3. Set secrets in Render dashboard:
   - `GROQ_API_KEY`
   - `DATABASE_URL` (Neon Postgres connection string)
4. Copy the Render URL into Vercel env: `NEXT_PUBLIC_API_URL=https://xxx.onrender.com/api/v1`
5. Add your Vercel domain to `CORS_ORIGINS` in Render env

## Demo mode

Without a backend URL, the frontend falls back to built-in demo personas and data — fine for hackathon demos.
