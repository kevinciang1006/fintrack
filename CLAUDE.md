# FinTrack — Angular 21 Project

## Angular Best Practices
Source: https://angular.dev/assets/context/best-practices.md

- Standalone components only (no NgModules, do NOT set standalone: true)
- Signals for all local state, computed() for derived state
- input()/output() functions, NOT @Input/@Output decorators
- inject() function, NOT constructor injection
- @if/@for/@switch native control flow only
- ChangeDetectionStrategy.OnPush on every component
- provideZonelessChangeDetection() — no Zone.js
- No `any` types — use `unknown` for uncertain types
- No ngClass/ngStyle — use class/style bindings
- Reactive Forms only
- Lazy-loaded feature routes

## Running the App
- `npm run dev` — starts Angular dev server + json-server concurrently
- Angular: http://localhost:4200
- json-server API: http://localhost:3001

## Architecture
- features/ — lazy-loaded route modules (markets, calculator, ledger)
- core/ — singleton services, models, utils
- shared/ — reusable UI components

## Charts
- lightweight-charts (TradingView): Markets candlestick chart only
- Chart.js via ng2-charts: Calculator and Ledger charts

## Styling
- Tailwind CSS v4 (no config file, @import "tailwindcss" in tailwind.css)
- Angular Material 21 with mat.define-theme M3 theming
- Class-based dark mode: .dark class on <html> element
