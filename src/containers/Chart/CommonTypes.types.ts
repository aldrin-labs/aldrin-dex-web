export interface IOrder {
  price: number | string
  size: number | string
  type: 'ask' | 'bid'
}

export interface IExchange {
  name: string
  symbol: string
}

export interface IActiveExchange {
  index: number;
  exchange: IExchange
}