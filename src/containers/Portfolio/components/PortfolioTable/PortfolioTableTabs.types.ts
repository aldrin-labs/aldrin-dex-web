export interface IProps {
  tab: string
  portfolio: IPortfolio | null
  onChangeTab?: Function
  onToggleChart?: Function
  onToggleUSDBTC?: Function
}

export interface IPortfolio {
  processing: boolean | null
}
