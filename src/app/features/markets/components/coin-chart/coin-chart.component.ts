import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  ElementRef, OnDestroy, ViewChild, effect, inject, input,
} from '@angular/core';
import { createChart, IChartApi, CandlestickSeries } from 'lightweight-charts';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CoinGeckoService } from '../../../../core/services/coingecko.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-coin-chart',
  imports: [MatProgressSpinnerModule, MatIconModule],
  templateUrl: './coin-chart.component.html',
  styleUrl: './coin-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') private chartContainer!: ElementRef<HTMLDivElement>;

  coinId   = input.required<string>();
  coinName = input.required<string>();

  private coinGeckoService = inject(CoinGeckoService);
  private themeService     = inject(ThemeService);
  private chart: IChartApi | null = null;
  private resizeObserver: ResizeObserver | null = null;

  readonly ohlcQuery = injectQuery(() => ({
    queryKey: ['ohlc', this.coinId()] as const,
    queryFn:  () => lastValueFrom(this.coinGeckoService.getCoinOHLC(this.coinId())),
  }));

  constructor() {
    // Defer by one tick so Angular can update the template and make
    // the #chartContainer @ViewChild available before we init the chart.
    effect(() => {
      const data   = this.ohlcQuery.data();
      const isDark = this.themeService.isDark();
      if (data) {
        setTimeout(() => {
          if (this.chartContainer?.nativeElement) this.initChart(isDark);
        });
      }
    });
  }

  ngAfterViewInit(): void {
    const data = this.ohlcQuery.data();
    if (data && this.chartContainer?.nativeElement) {
      this.initChart(this.themeService.isDark());
    }
  }

  private initChart(isDark: boolean): void {
    if (!this.chartContainer?.nativeElement) return;
    const el = this.chartContainer.nativeElement;
    this.destroyChart();

    this.chart = createChart(el, {
      width:  el.clientWidth,
      height: 320,
      layout: {
        background: { color: isDark ? '#111827' : '#ffffff' },
        textColor:  isDark ? '#9ca3af' : '#6b7280',
      },
      grid: {
        vertLines: { color: isDark ? '#1f2937' : '#f3f4f6' },
        horzLines: { color: isDark ? '#1f2937' : '#f3f4f6' },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series = this.chart.addSeries(CandlestickSeries, {
      upColor:      '#22c55e',
      downColor:    '#ef4444',
      borderVisible: false,
      wickUpColor:   '#22c55e',
      wickDownColor: '#ef4444',
    });

    const data = this.ohlcQuery.data();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (data) { series.setData(data as any); this.chart.timeScale().fitContent(); }

    this.resizeObserver = new ResizeObserver(() => {
      if (this.chart && el.clientWidth > 0) {
        this.chart.applyOptions({ width: el.clientWidth });
      }
    });
    this.resizeObserver.observe(el);
  }

  private destroyChart(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.chart?.remove();
    this.chart = null;
  }

  ngOnDestroy(): void { this.destroyChart(); }
}
