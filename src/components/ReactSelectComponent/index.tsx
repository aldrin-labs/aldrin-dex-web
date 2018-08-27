import React from 'react'
import SelectReact, { components } from 'react-select'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import {
  IProps } from '@containers/Portfolio/components/PortfolioTable/Rebalance/PortfolioTableRebalance.types'

export default class ReactSelectComponent extends React.Component<IProps> {
  render() {
    const {
      controlStyles,
      menuStyles,
      menuListStyles,
      optionStyles,
      clearIndicatorStyles,
      dropdownIndicatorStyles,
      valueContainerStyles,
      singleValueStyles,
      placeholderStyles,
      inputStyles,
      multiValueStyles,
      multiValueLabelStyles,
      multiValueRemoveStyles,
      indicatorSeparatorStyles,
      ...otherProps
    } = this.props

    const customStyles = {
      control: () => {
        return {
          position: 'relative',
          boxSizing: 'border-box',
          cursor: 'default',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          outline: '0',
          transition: 'all 100ms',
          backgroundColor: 'transparent',
          minHeight: '0.8em',
          border: 'none',
          ...controlStyles,
        }
      },
      menu: (base, state) => ({
        ...base,
        backgroundColor: '#424242',
        minWidth: '250px',
        ...menuStyles,
      }),
      menuList: (base, state) => ({
        ...base,
        ...menuListStyles,
      }),
      option: (base, state) => ({
        ...base,
        color: '#fff',
        fontSize: '1.5em',
        fontFamily: 'Roboto',
        backgroundColor: state.isSelected
          ? 'rgba(255, 255, 255, 0.2)'
          : state.isFocused
            ? 'rgba(255, 255, 255, 0.1)'
            : '#424242',
        [':active']: null,
        optionStyles,
      }),
      clearIndicator: (base, state) => {
        return {
          [':hover']: {
            color: '#fff',
          },
          display: 'flex',
          width: '20px',
          boxSizing: 'border-box',
          color: 'hsl(0, 0%, 80%)',
          padding: '2px',
          transition: 'color 150ms',
          ...clearIndicatorStyles,
        }
      },
      dropdownIndicator: (base, state) => ({
        [':hover']: {
          color: '#fff',
        },
        display: 'flex',
        width: '19px',
        boxSizing: 'border-box',
        color: 'hsl(0, 0%, 80%)',
        padding: '2px',
        transition: 'color 150ms',
        ...dropdownIndicatorStyles,
      }),
      valueContainer: (base, state) => ({
        ...base,
        paddingLeft: 0,
        ...valueContainerStyles,
      }),
      singleValue: (base, state) => ({
        ...base,
        color: '#fff',
        marginLeft: '0',
        ...singleValueStyles,
      }),
      placeholder: (base, state) => ({
        ...base,
        marginLeft: 0,
        ...placeholderStyles,
      }),
      input: (base, state) => ({
        ...base,
        color: '#fff',
        ...inputStyles,
      }),
      multiValue: (base, state) => ({
        ...base,
        [':hover']: {
          borderColor: '#4ed8da',
        },

        color: '#fff',
        borderRadius: '3px',
        fontWeight: 'bold',
        backgroundColor: '#2a2d32',
        ...multiValueStyles,
      }),
      multiValueLabel: (base, state) => ({
        ...base,
        color: '#fff',
        ...multiValueLabelStyles,
      }),
      multiValueRemove: (base, state) => ({
        ...base,
        [':hover']: {
          color: '#fff',
          backgroundColor: '#4ed8da',
          ...multiValueRemoveStyles,
        },
      }),
      indicatorSeparator: () => ({
        display: 'none',
        ...indicatorSeparatorStyles
      }),
    }

    return (
      <SelectReact
        styles={customStyles}
        components={{ DropdownIndicator }}
        {...otherProps}
      />
    )
  }
}


const DropdownIndicator = (props: object) => (
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        src={dropDownIcon}
        width={19}
        height={19}
        style={{
          verticalAlign: 'middle',
        }}
      />
    </components.DropdownIndicator>
  )
)
