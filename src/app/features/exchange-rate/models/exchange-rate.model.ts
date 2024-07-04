export interface CurrencyTable {
  effectiveDate: string;
  no: string;
  rates: ExchangeRate[];
  table: string;
  tradingDate: string;
}

export interface ExchangeRate {
  currency: string;
  code: string;
  bid: number | undefined;
  ask: number | undefined;
  mid: number | undefined;
}
