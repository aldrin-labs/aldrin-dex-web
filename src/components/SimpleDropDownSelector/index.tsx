import React, { Component } from 'react'
import { Select, MenuItem, InputLabel } from '@material-ui/core'
import { IProps } from '@components/SimpleDropDownSelector/index.types'
import styled from 'styled-components'


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
      content,
    } = this.props
    const StyledSelect = styled(Select)`
    && > div > div::after {
      content: "${content}";
      margin-left: 16px;
      font-size: 1rem;
      box-sizing: content-box;
      font-weight: 400;
      line-height: 1.5em;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    }`;
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
