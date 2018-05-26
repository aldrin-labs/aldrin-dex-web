import { getKeysQuery } from '../../annotations'

export interface IProps {
  data: getKeysQuery
  onChangeActive: Function
  isShownMocks: boolean
  isSideNavOpen: boolean
  toggleWallets: Function
}

export interface IState {
  checkedCheckboxes: number[] | null
  checkboxes: (string | null)[] | null
}
