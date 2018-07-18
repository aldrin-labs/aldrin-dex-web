import React, { Component } from 'react'

import Selector from '@components/SimpleDropDownSelector'

class DropDownMenu extends Component {
  optionsMap: { [id: string]: any } = {
    lastWeek: () => ({
      startDate: this.daysFromNow(-17),
      endDate: this.daysFromNow(-10),
    }),
    lastDay: () => ({
      startDate: this.daysFromNow(-10),
      endDate: this.daysFromNow(-10),
    }),
    lastMonth: () => ({
      startDate: this.daysFromNow(-41),
      endDate: this.daysFromNow(-10),
    }),
  }

  formatTimestamp = (timestamp: number) => Math.round(timestamp / 1000)

  daysFromNow = (days: number) => {
    let date = new Date()
    date.setDate(date.getDate() + days)
    date.setHours(0, 0, 0, 0)

    return this.formatTimestamp(date.getTime())
  }

  handleChange = (event) => {
    const { startDate, endDate } = this.optionsMap[event.target.value]()
    this.props.setCorrelationPeriodToStore({
      correlationPeriod: event.target.value,
      correlationStartDate: startDate,
      correlationEndDate: endDate,
    })
  }

  render() {
    const { correlationPeriod } = this.props

    return (
      <Selector
        style={{
          alignSelf: 'center',
          height: '100%',
        }}
        name="correlationPeriod"
        id="correlationPeriod"
        value={correlationPeriod}
        handleChange={this.handleChange}
        options={[
          { value: 'lastDay', label: 'Last 24h' },
          { value: 'lastWeek', label: 'Last week' },
          { value: 'lastMonth', label: 'Last Month' },
        ]}
      />
    )
  }
}

export default DropDownMenu
