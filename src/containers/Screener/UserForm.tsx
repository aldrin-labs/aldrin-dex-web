import React from 'react'
import VirtualizedSelect from 'react-virtualized-select'

export const MarketCap = [
  { label: 'any', value: 'any' },
  { label: 'mega', value: 'Mega ($200bln and more)' },
  { label: 'large', value: 'Large ($10bln to $200bln)' },
  { label: 'mid', value: 'Mid ($2bln to $10bln)' },
  { label: 'small', value: 'Small ($300mln to $2bln' },
  { label: 'micro', value: 'Micro ($50mln to $300mln)' },
]

export default class UserForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const options = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3, disabled: true },
      // And so on...
    ]

    return (
      <VirtualizedSelect
        options={options}
        onChange={selectValue => this.setState({ selectValue })}
        value={this.state.selectValue}
      />
    )
  }
}
