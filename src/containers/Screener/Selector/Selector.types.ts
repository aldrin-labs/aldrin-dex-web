// TODO: Why when I edit it did not update the hot reloader

export interface IProps {

}

export interface IState {
  coin: undefined[] | string[]
  industry: undefined[] | string[]

  marketCap: string
  changeInDigits: string
  changeInPercentage: string
  simpleMovingAverage: string
  closingPriceAverage: string
  averageVolume: string
  averageVolumeOnBalance: string
  chaikinMoneyFlow: string

  one1DayLow: string
  one1DayHigh: string
  one1HourLow: string
  one1HourHigh: string
  one1MonthLow: string
  one1MonthHigh: string
  three3MonthLow: string
  three3MonthHigh: string
  twelve12MonthLow: string
  twelve12MonthHigh: string

  InputMarketCap: string
  InputChangeInDigits: string
  InputChangeInPercentage: string
  InputSimpleMovingAverage: string
  InputClosingPriceAverage: string
  InputAverageVolume: string
  InputAverageVolumeOnBalance: string
  InputChaikinMoneyFlow: string

  InputOne1HourLow: string
  InputOne1HourHigh: string
  InputOne1DayLow: string
  InputOne1DayHigh: string
  InputOne1MonthLow: string
  InputOne1MonthHigh: string
  InputThree3MonthLow: string
  InputThree3MonthHigh: string
  InputTwelve12MonthLow: string
  InputTwelve12MonthHigh: string

  showFilters: boolean
}
