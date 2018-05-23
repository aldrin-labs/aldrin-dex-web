import React, { Component } from 'react'
import Widget from '@components/Widget'
import data from './lineChartDataMock'

import LineChart from '@components/LineChart/'

class LineChartWidget extends Component {
  render() {
    return (
      <Widget heading="LineChart">
        <div style={{ width: '80%', height: '100%', margin: '0 auto' }}>
          <LineChart data={data} />
        </div>
      </Widget>
    )
  }
}

export default LineChartWidget
