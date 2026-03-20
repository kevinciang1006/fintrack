import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanResult } from '../../../../core/models/calculator.model';
import { calculateLoan } from '../../../../core/utils/calculator.utils';

@Component({
  selector: 'app-loan-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanFormComponent implements OnInit {
  calculationResult = output<LoanResult>();
  protected form!: FormGroup;
  private fb = new FormBuilder();

  ngOnInit(): void {
    this.form = this.fb.group({
      principal: [200000, [Validators.required, Validators.min(1000)]],
      annualRate: [6.5,   [Validators.required, Validators.min(0.1), Validators.max(30)]],
      termYears:  [30,    [Validators.required, Validators.min(1),   Validators.max(30)]],
    });
    this.calculate();
  }

  protected calculate(): void {
    if (this.form.invalid) return;
    const { principal, annualRate, termYears } = this.form.value as { principal: number; annualRate: number; termYears: number };
    this.calculationResult.emit(calculateLoan(principal, annualRate, termYears));
  }
}
