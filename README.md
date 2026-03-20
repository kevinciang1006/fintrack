# FinTrack

A personal finance dashboard built with Angular 21, Angular Material, Tailwind CSS, and TanStack Query.

## Live Demo

- **Frontend:** [https://kevincprodugie.github.io/fintrack/](https://kevincprodugie.github.io/fintrack/)
- **Backend API:** Hosted on [Railway](https://railway.app)

---

## Features

- **Dashboard** — Net worth, monthly income/expense stats, spending doughnut chart, market strip, recent transactions, and a loan snapshot teaser
- **Markets** — Live crypto prices from CoinGecko with candlestick charts powered by TradingView lightweight-charts
- **Calculator** — Mortgage, Personal, and Auto loan calculators with amortization tables and Chart.js visualizations
- **Ledger** — Full transaction CRUD (add, delete, filter) backed by json-server; TanStack Query for caching
- **Settings** — Dark mode, collapsible sidebar, display preferences, export to JSON, and clear all data
- **Collapsible Sidebar** — Animated collapse to icon-only mode with localStorage persistence

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 (standalone, zoneless) |
| UI Components | Angular Material 21 (M3 theming) |
| Styling | Tailwind CSS v4 |
| State / Caching | TanStack Query (Angular) |
| Charts | ng2-charts v10 (Chart.js) + TradingView lightweight-charts v5 |
| Backend | json-server v1 (Node.js module) |
| Hosting (FE) | GitHub Pages |
| Hosting (BE) | Railway |
| CI/CD | GitHub Actions |

---

## Architecture

```
fintrack/
├── src/
│   ├── app/
│   │   ├── core/           # Singleton services, models, utils
│   │   ├── features/       # Lazy-loaded pages: dashboard, markets, calculator, ledger, settings
│   │   └── shared/         # Reusable components: sidebar, topbar, stat-card, etc.
│   └── environments/       # environment.ts (dev) + environment.production.ts (prod)
├── server/                 # Railway backend (json-server as Node module)
│   ├── index.js
│   ├── db.json
│   └── package.json
└── .github/workflows/      # CI/CD
    ├── deploy-frontend.yml # Build + deploy to GitHub Pages
    └── deploy-backend.yml  # Validate backend on Railway
```

---

## Local Development

### Prerequisites
- Node.js 20+
- npm 10+

### Setup

```bash
# Clone
git clone https://github.com/kevincprodugie/fintrack.git
cd fintrack

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Start both Angular dev server + json-server
npm run dev
```

- Angular app: http://localhost:4200
- json-server API: http://localhost:3001

---

## Deployment

### Backend (Railway)

1. Create a new Railway project and connect this repository
2. Set the **Root Directory** to `server/`
3. Railway auto-detects Node.js and runs `node index.js`
4. Copy the public Railway URL (e.g. `https://fintrack-api.up.railway.app`)

### Frontend (GitHub Pages)

1. Add the Railway URL as a repository secret named `RAILWAY_API_URL` in GitHub Settings → Secrets
2. Push to `main` — the `deploy-frontend.yml` workflow builds and deploys automatically
3. Enable GitHub Pages in repo Settings → Pages → Source: `gh-pages` branch

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Angular dev server + json-server concurrently |
| `npm run build` | Production build (outputs to `dist/fintrack/browser/`) |
| `ng test` | Run unit tests with Vitest |
