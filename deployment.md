# Deployment Instructions

## One-Click Deploy: Excel Mapper (Backend & Frontend)

### ✔️ Backend (API) — Render.com

1. In your GitHub repo, ensure `/backend/deploy-to-render.yaml` exists.
2. Go to https://render.com/import/yaml and paste your repo URL — or use 'New Web Service' and select this file.
3. Make sure in `deploy-to-render.yaml`, under `repo:`, the line points to **your repo URL** (e.g. `https://github.com/YOUR_USER/YOUR_REPO.git`).
4. Render will install, detect Node, set up the server, and give you a public endpoint (e.g., `https://excel-mapper-api.onrender.com`)

### ✔️ Frontend (UI) — Vercel.com

1. In your GitHub repo, ensure `/frontend/vercel.json` exists.
2. Go to https://vercel.com/new, import your repo, and pick `frontend/` as the project folder.
3. Set environment variable:
   - `VITE_API_URL = [your backend public URL]`
   - (e.g. `https://excel-mapper-api.onrender.com`)
4. Deploy — Vercel will give you a public URL like `https://excel-mapper.vercel.app`

## Connecting & Usage
- The frontend will automatically call your backend via the public VITE_API_URL
- Users can visit your public frontend link, upload/download files & map columns

---

## Manual Deploy (CLI)
- Backend: `cd backend && npm install && npm run start`
- Frontend: `cd frontend && npm install && npm run build && npx serve dist`

## Troubleshooting
- Ensure CORS is enabled in backend for Vercel frontend domain
- For file size errors: increase JSON/body/parsing limits in Express if needed
