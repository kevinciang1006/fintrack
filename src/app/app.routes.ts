import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'markets',
    loadComponent: () => import('./features/markets/markets.component').then(m => m.MarketsComponent)
  },
  {
    path: 'calculator',
    loadComponent: () => import('./features/calculator/calculator.component').then(m => m.CalculatorComponent)
  },
  {
    path: 'ledger',
    loadComponent: () => import('./features/ledger/ledger.component').then(m => m.LedgerComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
