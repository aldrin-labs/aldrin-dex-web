//TODO: Why when I edit it did not update the hot reloader

export interface IProps {

}

export interface IState {
  coin: string
  marketCap: string
  price: string
  peg: string
  volume: string
  performance: string,
  performance2: string,
  twenty20DayHighLow: string,
  twenty20DaySimpleMoving: string,
  fifty50DaySimpleMoving: string,
  fifty50DayHighLow: string,
  averageTrueRange: string,
  twoHundreds200SimpleMoving: string,
  fiftyTwo52WeekHighLow: string,
  rsi14: string,
  change: string,
  pattern: string,
  gap: string,
  changeFromOpen: string,
  candleStick: string,
  volatility: string,

  data: {
    coin: { label: string; value: string }[]
    marketCap: { label: string; value: string }[]
    price: { label: string; value: string }[]
    peg: { label: string; value: string }[]
    volume: { label: string; value: string }[]
  }
}
