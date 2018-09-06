import React, { Component } from 'react'
import { MenuItem, InputLabel } from '@material-ui/core'
import { IProps } from '@components/SimpleDropDownSelector/index.types'
import { StyledSelect } from '@components/SimpleDropDownSelector/index.styles'
class SimpleDropDownSelector extends Component<IProps> {
  render() {
    const {
      options,
      handleChange,
      name,
      id,
      value,
      style,
      placeholder,
    } = this.props

    return (
      <>
      {placeholder ? (
        <InputLabel htmlFor="label">{placeholder}</InputLabel>
        ) : null}
      <StyledSelect
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
        <MenuItem
        style={{ zIndex: 1500 }}
        key={option.label}
        value={option.value}
        >
        {option.label}
        </MenuItem>
        ))}
      </StyledSelect>
      </>
      )
  }
}

export default SimpleDropDownSelector
