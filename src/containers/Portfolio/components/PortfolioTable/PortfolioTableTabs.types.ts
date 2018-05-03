export interface Props {
  tab: string
  portfolio: Portfolio
  onChangeTab?: Function
  onToggleChart?: Function
  onToggleUSDBTC?: Function
}

export interface Portfolio {
  processing: boolean | null
}
