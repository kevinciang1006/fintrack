import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Coin } from '../../../../core/models/coin.model';
import { CoinCardComponent } from '../coin-card/coin-card.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-watchlist',
  imports: [CoinCardComponent, LoadingSkeletonComponent, MatButtonModule, MatIconModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistComponent {
  coins          = input<Coin[]>([]);
  isPending      = input(false);
  isError        = input(false);
  selectedCoinId = input<string | null>(null);
  coinSelected   = output<Coin>();
  retry          = output<void>();
}
