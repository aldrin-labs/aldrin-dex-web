import React from 'react'

import { ChartColorPickerContainer } from './ChartColorPicker.styles'
import { IProps } from './ChartColorPicker.types'

const ChartColorPicker = ({
  leftBar,
  rightBar,
  onChangeColor,
}: IProps) => (
  <ChartColorPickerContainer>
    <input
      type="color"
      name="leftBar"
      onChange={onChangeColor}
      value={leftBar}
    />
    <input
      type="color"
      name="rightBar"
      onChange={onChangeColor}
      value={rightBar}
    />
  </ChartColorPickerContainer>
)

export default ChartColorPicker
