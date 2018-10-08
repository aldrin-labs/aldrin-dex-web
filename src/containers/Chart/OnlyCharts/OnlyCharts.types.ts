export interface IChart {
  pair: string
  id: string
}

export interface IProps {
  addChart: () => void
  mainPair: () => void
  removeChart: () => void
  removeWarningMessage: () => void
  charts: IChart[]
  currencyPair: string
  isShownMocks: boolean
  openedWarning: boolean
  theme: any
  view: any
}
