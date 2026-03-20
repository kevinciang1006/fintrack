import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Coin } from '../../../../core/models/coin.model';

@Component({
  selector: 'app-coin-card',
  imports: [CurrencyPipe, DecimalPipe, MatIconModule],
  templateUrl: './coin-card.component.html',
  styleUrl: './coin-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinCardComponent {
  coin         = input.required<Coin>();
  isSelected   = input(false);
  coinSelected = output<Coin>();
}
