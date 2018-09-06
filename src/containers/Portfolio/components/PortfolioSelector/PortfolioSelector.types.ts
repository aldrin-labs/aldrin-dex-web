import { getKeysQuery } from '../../annotations'

export interface IProps {
  data: getKeysQuery
  onChangeActive: Function
  filterValuesLessThenThat: Function
  isShownMocks: boolean
  isSideNavOpen: boolean
  toggleWallets: Function
  filterPercent: number
}

export interface IState {
  checkedCheckboxes: number[] | null
  checkboxes: (string | null)[] | null
}
