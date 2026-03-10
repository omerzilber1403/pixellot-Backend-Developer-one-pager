# Deployment Guide

## Frontend (Vercel — recommended)
1. Push to GitHub (already done)
2. Go to vercel.com → Import Repository → `pixellot-Backend-Developer-one-pager`
3. Framework: Next.js (auto-detected)
4. Add environment variable:
   - `NEXT_PUBLIC_AGENT_API_URL` = your Render.com backend URL (see below)
5. Deploy → done. Auto-deploys on every push to main.

## AI Agent Backend (Render.com — Free Tier)
The backend lives at: `C:/Users/omerz/Documents/projectsz/ForcePoint submission/pixellot-agent-backend/`

### Deploy Steps
1. Push `pixellot-agent-backend/` to GitHub (e.g., `pixellot-agent-backend`)
2. render.com → New Web Service → Connect repo
3. Settings:
   - Runtime: Python
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Add env vars: `OPENAI_API_KEY`, `ALLOWED_ORIGINS=*`
5. Copy Render URL → Vercel env `NEXT_PUBLIC_AGENT_API_URL`

### Cold Start Handling
Render free tier sleeps after 15 min. Frontend handles gracefully:
- 4-second health probe on mount → if fails → offline mock mode (17+ responses)

## Public CV
The CV PDF is at: `public/cv/Omer_Zilbershtein_CV.pdf`
This is committed to the repo.

## Environment Variables
```
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000         # local dev
NEXT_PUBLIC_AGENT_API_URL=https://xxx.onrender.com     # production
```
