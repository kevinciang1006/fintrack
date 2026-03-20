export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Food' | 'Transport' | 'Utilities' | 'Salary' | 'Freelance' | 'Entertainment';

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
}
