import {
  ChangeDetectionStrategy, Component, computed, inject,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartDataset } from 'chart.js';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { LedgerService } from '../../core/services/ledger.service';
import { CoinGeckoService } from '../../core/services/coingecko.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { calculateLoan } from '../../core/utils/calculator.utils';
import { Transaction } from '../../core/models/transaction.model';
import { Coin } from '../../core/models/coin.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe, DecimalPipe, MatIconModule, MatButtonModule,
    BaseChartDirective, StatCardComponent, LoadingSkeletonComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private ledgerService    = inject(LedgerService);
  private coinGeckoService = inject(CoinGeckoService);
  private router           = inject(Router);

  private readonly currentMonth = new Date().toISOString().slice(0, 7);

  readonly transactionsQuery = injectQuery(() => ({
    queryKey: ['transactions'] as const,
    queryFn:  () => lastValueFrom(this.ledgerService.getTransactions()),
  }));

  readonly coinsQuery = injectQuery(() => ({
    queryKey: ['watchlist'] as const,
    queryFn:  () => lastValueFrom(this.coinGeckoService.getWatchlist()),
    refetchInterval: 60_000,
  }));

  private readonly txns = computed(() => this.transactionsQuery.data() ?? []);

  readonly netWorth = computed(() =>
    this.txns().reduce((sum: number, t: Transaction) =>
      t.type === 'income' ? sum + t.amount : sum - t.amount, 0));

  readonly monthlyIncome = computed(() =>
    this.txns()
      .filter((t: Transaction) => t.date.startsWith(this.currentMonth) && t.type === 'income')
      .reduce((s: number, t: Transaction) => s + t.amount, 0));

  readonly monthlyExpenses = computed(() =>
    this.txns()
      .filter((t: Transaction) => t.date.startsWith(this.currentMonth) && t.type === 'expense')
      .reduce((s: number, t: Transaction) => s + t.amount, 0));

  readonly savingsRate = computed(() => {
    const inc = this.monthlyIncome();
    return inc === 0 ? '—' : ((inc - this.monthlyExpenses()) / inc * 100).toFixed(1) + '%';
  });

  readonly recentTransactions = computed(() =>
    [...this.txns()]
      .sort((a: Transaction, b: Transaction) => b.date.localeCompare(a.date))
      .slice(0, 5));

  readonly spendingByCategory = computed(() => {
    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Freelance'] as const;
    const expenses = this.txns()
      .filter((t: Transaction) => t.date.startsWith(this.currentMonth) && t.type === 'expense');
    return categories
      .map(cat => ({
        label: cat,
        value: expenses
          .filter((t: Transaction) => t.category === cat)
          .reduce((s: number, t: Transaction) => s + t.amount, 0),
      }))
      .filter(c => c.value > 0);
  });

  readonly doughnutData = computed<ChartData<'doughnut'>>(() => {
    const cats = this.spendingByCategory();
    return {
      labels: cats.map(c => c.label),
      datasets: [{
        data:            cats.map(c => c.value),
        backgroundColor: ['#f97316', '#3b82f6', '#eab308', '#ec4899', '#a855f7'],
        borderWidth: 2,
        borderColor: 'transparent',
        hoverOffset: 6,
      }] as ChartDataset<'doughnut'>[],
    };
  });

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels:   { padding: 16, usePointStyle: true, pointStyleWidth: 10 },
      },
      tooltip: {
        callbacks: {
          label: ctx => ` $${(ctx.parsed as number).toFixed(2)}`,
        },
      },
    },
  };

  readonly loanSnapshot = calculateLoan(300_000, 6.5, 30);

  protected categoryClass(cat: string): string {
    const m: Record<string, string> = {
      Food:          'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      Transport:     'bg-blue-50   text-blue-700   dark:bg-blue-950   dark:text-blue-300',
      Utilities:     'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
      Salary:        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      Freelance:     'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      Entertainment: 'bg-pink-50   text-pink-700   dark:bg-pink-950   dark:text-pink-300',
    };
    return m[cat] ?? 'bg-gray-100 text-gray-700';
  }

  protected priceChangeClass(pct: number): string {
    return pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400';
  }

  protected goToMarkets(): void { this.router.navigate(['/markets']); }
  protected goToCalculator(): void { this.router.navigate(['/calculator']); }
  protected goToLedger(): void { this.router.navigate(['/ledger']); }

  // Expose Coin type for template
  protected asCoin(c: unknown): Coin { return c as Coin; }
}
