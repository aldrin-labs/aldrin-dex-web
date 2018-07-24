import React, { Component } from 'react'

import Selector from '@components/SimpleDropDownSelector'
import { IProps } from './index.types'

class DropDownMenu extends Component<IProps> {
  // days are minus ten from now I dunno why
  optionsMap: { [id: string]: any } = {
    lastWeek: () => ({
      startDate: this.daysFromNow(-17),
      endDate: this.daysFromNow(-10),
    }),
    lastDay: () => ({
      startDate: this.daysFromNow(-9),
      endDate: this.daysFromNow(-10),
    }),
    lastMonth: () => ({
      startDate: this.daysFromNow(-41),
      endDate: this.daysFromNow(-10),
    }),
    threeMonths: () => ({
      startDate: this.daysFromNow(-102),
      endDate: this.daysFromNow(-10),
    }),
    sixMonths: () => ({
      startDate: this.daysFromNow(-194),
      endDate: this.daysFromNow(-10),
    }),
    lastYear: () => ({
      startDate: this.daysFromNow(-366),
      endDate: this.daysFromNow(-10),
    }),
    testDates: () => ({
      startDate: 1531441380,
      endDate: 1531873380,
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
    this.props.setPeriodToStore({
      correlationPeriod: event.target.value,
      correlationStartDate: startDate,
      correlationEndDate: endDate,
    })
  }

  render() {
    const { period, style } = this.props

    return (
      <Selector
        style={{
          alignSelf: 'center',
          height: '100%',
          width: '100%',
          ...style,
        }}
        name="correlationPeriod"
        id="correlationPeriod"
        value={period}
        handleChange={this.handleChange}
        options={[
          { value: 'lastDay', label: 'Last 24h' },
          { value: 'lastWeek', label: 'Last Week' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'threeMonths', label: 'Last 3 Months' },
          { value: 'sixMonths', label: 'Last 6 Months' },
          { value: 'lastYear', label: 'Last Year' },
          { value: 'testDates', label: 'Test Dates' },
        ]}
      />
    )
  }
}

export default DropDownMenu
