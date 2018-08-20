export interface IProps {
  checkboxes: string[]
  checkedCheckboxes: number[]
  data: any
  isCheckedAll: boolean
  isSideNavOpen: boolean
  onToggleAll: Function
  onToggleCheckbox: Function
  setCheckboxes: Function
  setKeys: Function
}
