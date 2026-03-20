import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoinGeckoService } from '../../core/services/coingecko.service';
import { Coin } from '../../core/models/coin.model';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { CoinChartComponent } from './components/coin-chart/coin-chart.component';

@Component({
  selector: 'app-markets',
  imports: [WatchlistComponent, CoinChartComponent, MatButtonModule, MatIconModule],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent {
  private coinGeckoService = inject(CoinGeckoService);
  selectedCoin = signal<Coin | null>(null);
  private hasAutoSelected  = false;

  readonly watchlistQuery = injectQuery(() => ({
    queryKey: ['watchlist'] as const,
    queryFn:  () => lastValueFrom(this.coinGeckoService.getWatchlist()),
    refetchInterval: 60_000,
  }));

  constructor() {
    // Auto-select first coin once on initial load so the chart is immediately visible
    effect(() => {
      const coins = this.watchlistQuery.data();
      if (coins && coins.length > 0 && !this.hasAutoSelected) {
        this.selectedCoin.set(coins[0]);
        this.hasAutoSelected = true;
      }
    });
  }

  protected onCoinSelected(coin: Coin): void {
    this.selectedCoin.update(prev => prev?.id === coin.id ? null : coin);
  }
}
