import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TransactionCategory, TransactionType } from '../../../../core/models/transaction.model';

export interface TransactionFilters {
  category: TransactionCategory | '';
  type:     TransactionType | '';
  dateFrom: string;
  dateTo:   string;
}

@Component({
  selector: 'app-transaction-filters',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './transaction-filters.component.html',
  styleUrl:    './transaction-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFiltersComponent {
  filtersChanged = output<TransactionFilters>();

  private fb = new FormBuilder();
  protected form: FormGroup = this.fb.group({ category: [''], type: [''], dateFrom: [''], dateTo: [''] });

  protected readonly categories: TransactionCategory[] = ['Food','Transport','Utilities','Salary','Freelance','Entertainment'];

  protected emitFilters(): void {
    const raw = this.form.value as { category: string; type: string; dateFrom: unknown; dateTo: unknown };
    const toDateStr = (v: unknown): string => {
      if (!v) return '';
      const d = v as Date;
      return typeof d.toISOString === 'function' ? d.toISOString().split('T')[0] : String(v);
    };
    this.filtersChanged.emit({
      category: raw.category as TransactionFilters['category'],
      type:     raw.type     as TransactionFilters['type'],
      dateFrom: toDateStr(raw.dateFrom),
      dateTo:   toDateStr(raw.dateTo),
    });
  }

  protected clearFilters(): void {
    this.form.reset({ category: '', type: '', dateFrom: '', dateTo: '' });
    this.emitFilters();
  }
}
