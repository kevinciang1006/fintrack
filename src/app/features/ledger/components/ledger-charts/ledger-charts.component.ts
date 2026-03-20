import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Transaction, TransactionCategory } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-ledger-charts',
  imports: [BaseChartDirective],
  templateUrl: './ledger-charts.component.html',
  styleUrl:    './ledger-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedgerChartsComponent {
  transactions = input.required<Transaction[]>();

  readonly barData = computed<ChartData<'bar'>>(() => {
    const months  = this.last6Months();
    const income  = months.map(m => this.sum(m, 'income'));
    const expense = months.map(m => this.sum(m, 'expense'));
    return {
      labels: months.map(m => { const [y,mo] = m.split('-'); return new Date(+y, +mo-1).toLocaleString('default', { month: 'short', year: '2-digit' }); }),
      datasets: [
        { label: 'Income',   data: income,  backgroundColor: 'rgba(34,197,94,0.8)',  borderRadius: 6, borderSkipped: false } as ChartDataset<'bar'>,
        { label: 'Expenses', data: expense, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 6, borderSkipped: false } as ChartDataset<'bar'>,
      ],
    };
  });

  readonly pieData = computed<ChartData<'pie'>>(() => {
    const cats: TransactionCategory[] = ['Food','Transport','Utilities','Entertainment','Freelance'];
    const expenses = this.transactions().filter(t => t.type === 'expense');
    return {
      labels: cats,
      datasets: [{ data: cats.map(c => expenses.filter(t => t.category === c).reduce((s,t) => s+t.amount, 0)), backgroundColor: ['#f97316','#3b82f6','#eab308','#ec4899','#8b5cf6'], borderWidth: 0, hoverOffset: 8 } as ChartDataset<'pie'>],
    };
  });

  readonly barOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { font: { size: 11 } } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { ticks: { callback: v => `$${(+v/1000).toFixed(0)}k`, font: { size: 11 } } },
    },
  };

  readonly pieOptions: ChartOptions<'pie'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { padding: 14, font: { size: 11 } } } },
  };

  private last6Months(): string[] {
    const now = new Date(), out: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      out.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
    }
    return out;
  }

  private sum(month: string, type: 'income' | 'expense'): number {
    return this.transactions().filter(t => t.type === type && t.date.startsWith(month)).reduce((s,t) => s+t.amount, 0);
  }
}
