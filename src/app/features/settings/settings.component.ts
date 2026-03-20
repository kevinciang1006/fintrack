import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { LayoutService } from '../../core/services/layout.service';
import { LedgerService } from '../../core/services/ledger.service';
import { SettingsConfirmDialogComponent } from './settings-confirm-dialog.component';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    MatCardModule, MatDividerModule, MatSelectModule, MatOptionModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  readonly themeService  = inject(ThemeService);
  readonly layoutService = inject(LayoutService);
  private ledgerService  = inject(LedgerService);
  private dialog         = inject(MatDialog);
  private queryClient    = inject(QueryClient);

  readonly currency   = signal(localStorage.getItem('preferred-currency') ?? 'USD');
  readonly dateFormat = signal(localStorage.getItem('date-format') ?? 'MM/DD/YYYY');
  readonly isExporting = signal(false);
  readonly isClearing  = signal(false);

  readonly currencies  = ['USD', 'EUR', 'GBP', 'SGD', 'IDR'] as const;
  readonly dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] as const;

  onCurrencyChange(value: string): void {
    this.currency.set(value);
    localStorage.setItem('preferred-currency', value);
  }

  onDateFormatChange(value: string): void {
    this.dateFormat.set(value);
    localStorage.setItem('date-format', value);
  }

  async exportTransactions(): Promise<void> {
    if (this.isExporting()) return;
    this.isExporting.set(true);
    try {
      const data = await lastValueFrom(this.ledgerService.getTransactions());
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'transactions.json';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      this.isExporting.set(false);
    }
  }

  async clearAllTransactions(): Promise<void> {
    if (this.isClearing()) return;
    const ref = this.dialog.open(SettingsConfirmDialogComponent, { width: '420px' });
    const confirmed = await lastValueFrom(ref.afterClosed());
    if (!confirmed) return;

    this.isClearing.set(true);
    try {
      const transactions = await lastValueFrom(this.ledgerService.getTransactions());
      await Promise.all(transactions.map(t => lastValueFrom(this.ledgerService.deleteTransaction(t.id))));
      await this.queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } finally {
      this.isClearing.set(false);
    }
  }
}
