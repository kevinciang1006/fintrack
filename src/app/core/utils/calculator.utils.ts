import { LoanResult, AmortizationRow } from '../models/calculator.model';

const formatUSD = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export { formatUSD };

export function calculateLoan(principal: number, annualRate: number, termYears: number): LoanResult {
  const monthlyRate = annualRate / 100 / 12;
  const n = termYears * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= n; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance
    });
  }

  return {
    principal,
    annualRate,
    termYears,
    monthlyPayment,
    totalPayment,
    totalInterest,
    amortizationSchedule: schedule
  };
}
