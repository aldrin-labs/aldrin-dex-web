import React, { Component } from 'react'
import styled from 'styled-components'
import { FlexibleXYPlot, VerticalRectSeries, XAxis } from 'react-vis'

class BarChart extends Component {
  render() {
    return (
      <div>
        <Container>
          <FlexibleXYPlot>
            <XAxis title="X" />
            <VerticalRectSeries data={this.props.data} color="#4fd8da" />
          </FlexibleXYPlot>
        </Container>
      </div>
    )
  }
}

const Container = styled.div`
  height: 300px;
  width: 100%;
`

export default BarChart
