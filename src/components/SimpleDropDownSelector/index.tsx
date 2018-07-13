import React, { Component } from 'react'
import { Select, MenuItem } from '@material-ui/core'

import { IProps } from './index.types'

class SimpleDropDownSelector extends Component<IProps> {
  render() {
    const { options, handleChange, name, id, value, style } = this.props

    return (
      <Select
        style={style}
        value={value}
        onChange={(e) => {
          e.preventDefault()
          handleChange(e)
        }}
        inputProps={{
          name,
          id,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    )
  }
}

export default SimpleDropDownSelector
