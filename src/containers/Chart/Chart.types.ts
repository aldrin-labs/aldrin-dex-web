export interface IOrder {
  price: number | string
  size: number | string
  type: 'ask' | 'bid'
}
