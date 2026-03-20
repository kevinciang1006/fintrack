import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, effect, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-table',
  imports: [CurrencyPipe, DatePipe, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @ViewChild(MatSort) private sort!: MatSort;

  transactions      = input.required<Transaction[]>();
  deleteTransaction = output<string>();
  pageChange        = output<number>();

  readonly displayedColumns = ['date', 'description', 'category', 'amount', 'type', 'actions'];
  readonly dataSource        = new MatTableDataSource<Transaction>([]);

  constructor() {
    effect(() => { this.dataSource.data = this.transactions(); });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  protected onSort(sort: Sort): void {
    if (!sort.active || sort.direction === '') { this.dataSource.data = [...this.transactions()]; return; }
    this.dataSource.data = [...this.transactions()].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      if (sort.active === 'date')   return a.date.localeCompare(b.date)   * dir;
      if (sort.active === 'amount') return (a.amount - b.amount)          * dir;
      return 0;
    });
  }

  protected categoryClass(cat: string): string {
    const m: Record<string, string> = {
      Food:          'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      Transport:     'bg-blue-50   text-blue-700   dark:bg-blue-950   dark:text-blue-300',
      Utilities:     'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
      Salary:        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      Freelance:     'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      Entertainment: 'bg-pink-50   text-pink-700   dark:bg-pink-950   dark:text-pink-300',
    };
    return m[cat] ?? 'bg-gray-100 text-gray-700';
  }
}
