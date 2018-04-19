import { getKeysQuery } from '../../annotations'

export interface Props {
  data: getKeysQuery
  onChangeActive: Function
}

export interface State {
  checkedCheckboxes: number[] | null
  checkboxes: (string | null)[] | null
}
