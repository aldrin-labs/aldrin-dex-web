//TODO: Why when I edit it did not update the hot reloader

export interface IProps {

}

export interface IState {
  coin: string
  marketCap: string
  price: string
  peg: string
  volume: string
  data: {
    coin: { label: string; value: string }[]
    marketCap: { label: string; value: string }[]
    price: { label: string; value: string }[]
    peg: { label: string; value: string }[]
    volume: { label: string; value: string }[]
  }
}
