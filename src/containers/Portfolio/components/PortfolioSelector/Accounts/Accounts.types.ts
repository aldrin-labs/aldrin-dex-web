export interface IProps {
  checkboxes: string[]
  checkedCheckboxes: number[]
  data: any
  isCheckedAll: boolean
  isSideNavOpen: boolean
  onToggleAll: Function
  onToggleKeyCheckbox: Function
  setCheckboxes: Function
  setKeys: Function
}
