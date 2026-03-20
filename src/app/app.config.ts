import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    provideNativeDateAdapter(),
    provideAngularQuery(new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60_000, retry: 2 }
      }
    }))
  ]
};
