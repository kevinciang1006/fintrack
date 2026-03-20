import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LedgerService } from '../../core/services/ledger.service';
import { Transaction } from '../../core/models/transaction.model';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { TransactionFiltersComponent, TransactionFilters } from './components/transaction-filters/transaction-filters.component';
import { LedgerChartsComponent } from './components/ledger-charts/ledger-charts.component';
import { AddTransactionDialogComponent } from './components/add-transaction-dialog/add-transaction-dialog.component';
import { formatUSD } from '../../core/utils/calculator.utils';

@Component({
  selector: 'app-ledger',
  imports: [StatCardComponent, TransactionTableComponent, TransactionFiltersComponent, LedgerChartsComponent, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ledger.component.html',
  styleUrl:    './ledger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedgerComponent {
  private ledgerService = inject(LedgerService);
  private dialog        = inject(MatDialog);
  private queryClient   = injectQueryClient();
  protected readonly fmt = formatUSD;

  private filters = signal<TransactionFilters>({ category: '', type: '', dateFrom: '', dateTo: '' });

  readonly transactionsQuery = injectQuery(() => ({
    queryKey: ['transactions'] as const,
    queryFn:  () => lastValueFrom(this.ledgerService.getTransactions()),
  }));

  readonly allTransactions      = computed<Transaction[]>(() => this.transactionsQuery.data() ?? []);
  readonly filteredTransactions = computed<Transaction[]>(() => {
    const f = this.filters();
    return this.allTransactions().filter(t => {
      if (f.category && t.category !== f.category) return false;
      if (f.type     && t.type     !== f.type)     return false;
      if (f.dateFrom && t.date < f.dateFrom)        return false;
      if (f.dateTo   && t.date > f.dateTo)          return false;
      return true;
    });
  });

  readonly totalIncome   = computed(() => this.allTransactions().filter(t => t.type === 'income') .reduce((s,t) => s+t.amount, 0));
  readonly totalExpenses = computed(() => this.allTransactions().filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0));
  readonly netBalance    = computed(() => this.totalIncome() - this.totalExpenses());

  private readonly addMutation = injectMutation(() => ({
    mutationFn: (t: Omit<Transaction, 'id'>) => lastValueFrom(this.ledgerService.addTransaction(t)),
    onSuccess:  () => this.queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  }));

  private readonly deleteMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.ledgerService.deleteTransaction(id)),
    onSuccess:  () => this.queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  }));

  protected onFiltersChanged(f: TransactionFilters): void { this.filters.set(f); }

  protected openAddDialog(): void {
    const ref = this.dialog.open(AddTransactionDialogComponent, { width: '440px', panelClass: 'fintrack-dialog' });
    ref.afterClosed().subscribe((result: Omit<Transaction, 'id'> | undefined) => {
      if (result) this.addMutation.mutate(result);
    });
  }

  protected onDelete(id: string): void { this.deleteMutation.mutate(id); }
}
