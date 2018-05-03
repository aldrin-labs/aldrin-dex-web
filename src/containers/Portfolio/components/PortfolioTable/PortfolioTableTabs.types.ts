export interface Props {
  tab: string
  portfolio: Portfolio | null
  onChangeTab?: Function
  onToggleChart?: Function
  onToggleUSDBTC?: Function
}

export interface Portfolio {
  processing: boolean | null
}
