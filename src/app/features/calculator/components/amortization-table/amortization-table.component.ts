import { ChangeDetectionStrategy, Component, ViewChild, effect, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { AmortizationRow } from '../../../../core/models/calculator.model';

@Component({
  selector: 'app-amortization-table',
  imports: [CurrencyPipe, MatTableModule, MatPaginatorModule, MatIconModule],
  templateUrl: './amortization-table.component.html',
  styleUrl: './amortization-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmortizationTableComponent {
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  schedule = input.required<AmortizationRow[]>();
  readonly columns = ['month', 'payment', 'principal', 'interest', 'balance'];
  readonly dataSource = new MatTableDataSource<AmortizationRow>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.schedule();
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }
}
