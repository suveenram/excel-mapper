# Excel Mapper

A web app to map and transform data between Excel files with flexible column matching. Built with React (frontend) and Node.js/Express (backend).

## Features
- Upload source and destination Excel files
- Auto-mapping of columns by header (customizable by user)
- Manual override of column mapping
- Export mapped Excel in destination header order
- Modern UI, public & open

## Quick Start (Development)

### Backend
1. `cd backend`
2. `npm install && npm run dev`

### Frontend
1. `cd frontend`
2. `npm install && npm run dev`

## Deployment
- Hosted on Vercel (frontend) & Render (backend) [free tiers].
- See `/deployment.md` for step-by-step deploy using Vercel/Render with public URLs.

---

## Tech Stack
- Frontend: React + Vite + Material UI
- Backend: Node.js + Express + exceljs

## Usage
1. Go to the web app
2. Upload your Excel files
3. Adjust column mappings
4. Download the final mapped Excel file
