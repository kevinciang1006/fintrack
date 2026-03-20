import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanResult } from '../../../../core/models/calculator.model';
import { calculateLoan } from '../../../../core/utils/calculator.utils';

type LoanType = 'mortgage' | 'personal' | 'auto';
interface LoanPreset { principal: number; annualRate: number; termYears: number; }

@Component({
  selector: 'app-loan-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanFormComponent {
  loanType          = input<LoanType>('mortgage');
  calculationResult = output<LoanResult>();

  private readonly presets: Record<LoanType, LoanPreset> = {
    mortgage: { principal: 200_000, annualRate: 6.5, termYears: 30 },
    personal: { principal:  15_000, annualRate: 12,  termYears:  5 },
    auto:     { principal:  30_000, annualRate:  7.5, termYears:  7 },
  };

  protected readonly form: FormGroup = new FormBuilder().group({
    principal:  [200_000, [Validators.required, Validators.min(1000)]],
    annualRate: [6.5,     [Validators.required, Validators.min(0.1), Validators.max(30)]],
    termYears:  [30,      [Validators.required, Validators.min(1),   Validators.max(30)]],
  });

  constructor() {
    // When the loan type tab changes, update form values and recalculate
    effect(() => {
      const preset = this.presets[this.loanType()];
      this.form.setValue(preset, { emitEvent: false });
      this.calculate();
    });
  }

  protected calculate(): void {
    if (this.form.invalid) return;
    const { principal, annualRate, termYears } = this.form.value as LoanPreset;
    this.calculationResult.emit(calculateLoan(principal, annualRate, termYears));
  }
}
