import { CSSProperties } from 'react'
import { Theme } from '@material-ui/core'

export interface IProps {
  asyncSelect: boolean
  theme: Theme
  controlStyles: CSSProperties
  menuStyles: CSSProperties
  menuListStyles: CSSProperties
  optionStyles: CSSProperties
  clearIndicatorStyles: CSSProperties
  dropdownIndicatorStyles: CSSProperties
  valueContainerStyles: CSSProperties
  singleValueStyles: CSSProperties
  placeholderStyles: CSSProperties
  inputStyles: CSSProperties
  multiValueStyles: CSSProperties
  multiValueLabelStyles: CSSProperties
  multiValueRemoveStyles: CSSProperties
  indicatorSeparatorStyles: CSSProperties
}
