import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LoanResult } from '../../core/models/calculator.model';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { AmortizationTableComponent } from './components/amortization-table/amortization-table.component';
import { LoanChartsComponent } from './components/loan-charts/loan-charts.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { formatUSD } from '../../core/utils/calculator.utils';

type TabType = 'mortgage' | 'personal' | 'auto';

@Component({
  selector: 'app-calculator',
  imports: [LoanFormComponent, AmortizationTableComponent, LoanChartsComponent, StatCardComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent {
  protected readonly activeTab = signal<TabType>('mortgage');
  protected readonly result   = signal<LoanResult | null>(null);
  protected readonly fmt      = formatUSD;

  protected readonly tabs: { key: TabType; label: string }[] = [
    { key: 'mortgage', label: 'Mortgage'      },
    { key: 'personal', label: 'Personal Loan' },
    { key: 'auto',     label: 'Auto Loan'     },
  ];

  protected onResult(r: LoanResult): void { this.result.set(r); }
}
