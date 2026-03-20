import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { Transaction, TransactionCategory, TransactionType } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-add-transaction-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatRadioModule],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTransactionDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<AddTransactionDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly categories: TransactionCategory[] = ['Food','Transport','Utilities','Salary','Freelance','Entertainment'];

  protected readonly form = this.fb.group({
    date:        [new Date(), Validators.required],
    description: ['',       Validators.required],
    category:    ['' as TransactionCategory, Validators.required],
    amount:      [null as number | null, [Validators.required, Validators.min(0.01)]],
    type:        ['expense' as TransactionType, Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) return;
    const v    = this.form.value;
    const date = v.date instanceof Date ? v.date.toISOString().split('T')[0] : String(v.date);
    const t: Omit<Transaction, 'id'> = { date, description: v.description!, category: v.category!, amount: v.amount!, type: v.type! };
    this.dialogRef.close(t);
  }
}
