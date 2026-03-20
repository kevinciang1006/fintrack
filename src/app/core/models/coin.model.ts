export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_in_7d: { price: number[] };
}

export interface OHLCBar {
  time: number; // unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}
