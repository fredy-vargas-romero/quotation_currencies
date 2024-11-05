export interface Quotation {
    quote_id: string,
    base_currency: string,
    quote_currency: string,
    base_amount: number,
    quote_amount: number,
    rate: number,
    balam_rate: number,
    fixed_fee: number,
    pct_fee: number,
    status: string,
    expiration_ts: string
  }