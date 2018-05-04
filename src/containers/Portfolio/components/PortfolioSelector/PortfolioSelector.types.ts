import { getKeysQuery } from '../../annotations'

export interface IProps {
  data: getKeysQuery
  onChangeActive: Function
  isShownMocks: boolean
}

export interface IState {
  checkedCheckboxes: number[] | null
  checkboxes: (string | null)[] | null
}
