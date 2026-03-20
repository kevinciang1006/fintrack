import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { LoanResult } from '../../../../core/models/calculator.model';

@Component({
  selector: 'app-loan-charts',
  imports: [BaseChartDirective],
  templateUrl: './loan-charts.component.html',
  styleUrl: './loan-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanChartsComponent {
  result = input.required<LoanResult>();

  readonly doughnutData = computed<ChartData<'doughnut'>>(() => {
    const r = this.result();
    return {
      labels: ['Principal', 'Total Interest'],
      datasets: [{
        data: [r.principal, r.totalInterest],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 8,
      } as ChartDataset<'doughnut'>],
    };
  });

  readonly lineData = computed<ChartData<'line'>>(() => {
    const s = this.result().amortizationSchedule;
    const sampled = s.filter((_, i) => i % 6 === 5 || i === s.length - 1);
    return {
      labels: sampled.map(r => `Mo ${r.month}`),
      datasets: [{
        label: 'Balance',
        data: sampled.map(r => r.balance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#3b82f6',
      } as ChartDataset<'line'>],
    };
  });

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true, maintainAspectRatio: false, cutout: '65%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
      tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.toLocaleString('en-US', { maximumFractionDigits: 0 })}` } },
    },
  };

  readonly lineOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 10 } } },
      y: { ticks: { callback: v => `$${(Number(v) / 1000).toFixed(0)}k`, font: { size: 10 } } },
    },
  };
}
