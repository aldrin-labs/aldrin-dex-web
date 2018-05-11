export interface IProps {
  tab: string
  portfolio: IPortfolio | null
  onChangeTab?: Function
  onToggleChart?: Function
  onToggleUSDBTC?: Function
  isShownMocks: boolean
  data: any
}

export interface IPortfolio {
  processing: boolean | null
}
