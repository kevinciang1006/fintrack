import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Coin, OHLCBar } from '../models/coin.model';

@Injectable({ providedIn: 'root' })
export class CoinGeckoService {
  private http = inject(HttpClient);

  getWatchlist(): Observable<Coin[]> {
    return this.http.get<Coin[]>(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin,ethereum,solana,binancecoin,cardano,ripple',
          order: 'market_cap_desc',
          per_page: '6',
          page: '1',
          sparkline: 'true',
          price_change_percentage: '24h'
        }
      }
    );
  }

  getCoinOHLC(coinId: string): Observable<OHLCBar[]> {
    return this.http.get<number[][]>(
      `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc`,
      { params: { vs_currency: 'usd', days: '7' } }
    ).pipe(
      map(data => data.map(([timestamp, open, high, low, close]) => ({
        time: Math.floor(timestamp / 1000) as number,
        open,
        high,
        low,
        close
      })))
    );
  }
}
