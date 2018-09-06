import React from 'react'
import {
  VictoryChart,
  createContainer,
  VictoryLine,
  VictoryAxis,
  VictoryBrushContainer,
} from 'victory'

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi')
// const data = range(100).map((x) => ({x, y: 100 + x + random(10)}));

export class BrushChart extends React.Component {
  state = {
    zoomDomain: null,
  }

  handleZoom = (domain) => {
    this.setState({ selectedDomain: domain })
  }

  handleBrush = (domain) => {
    this.setState({ zoomDomain: domain })
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <VictoryChart
          width={900}
          height={240}
          scale={{ x: 'time' }}
          containerComponent={
            <VictoryZoomVoronoiContainer
              labels={(d) => `${d.x}, ${d.y}`}
              responsive={false}
              zoomDimension="x"
              zoomDomain={this.state.zoomDomain}
              onZoomDomainChange={this.handleZoom.bind(this)}
            />
          }
        >
          <VictoryAxis
            style={{
              axis: { stroke: '#fff' },
              axisLabel: { fontSize: 20, padding: 30 },
              grid: {
                stroke: (t) => (t > 0.5 ? 'rgba(255,255,255,.1)' : 'grey'),
              },
              ticks: { stroke: '#fff', size: 5 },
              tickLabels: { fontSize: 15, padding: 5, fill: '#E0F2F1' },
            }}
          />
          <VictoryAxis
            dependentAxis
            offsetX={905}
            styles={{
              axis: { stroke: '#fff', fill: '#fff' },
              axisLabel: { fontSize: 20, padding: 30, fill: '#fff' },
              grid: {
                stroke: (t) => (t > 0.5 ? 'rgba(255,255,255,.1)' : 'grey'),
              },
              ticks: { stroke: '#fff', size: 5, fill: '#fff' },
              tickLabels: {
                fill: 'blue',
                fontFamily: 'inherit',
                fontSize: 16,
              },
            }}
          />

          <VictoryLine
            style={{
              data: { stroke: '#20bf6b' },
            }}
            data={[
              { x: new Date(1982, 1, 1), y: 125 },
              { x: new Date(1987, 1, 1), y: 257 },
              { x: new Date(1993, 1, 1), y: 345 },
              { x: new Date(1997, 1, 1), y: 515 },
              { x: new Date(2001, 1, 1), y: 132 },
              { x: new Date(2005, 1, 1), y: 305 },
              { x: new Date(2011, 1, 1), y: 270 },
              { x: new Date(2015, 1, 1), y: 470 },
            ]}
          />
        </VictoryChart>

        <VictoryChart
          padding={{ top: 0, left: 50, right: 50, bottom: 5 }}
          width={800}
          height={90}
          scale={{ x: 'time' }}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              brushDimension="x"
              brushDomain={this.state.selectedDomain}
              brushStyle={{ fill: 'rgb(78, 216, 218)', opacity: 0.35 }}
              onBrushDomainChange={this.handleBrush.bind(this)}
            />
          }
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 12, fill: '#E0F2F1', fontWeight: 'bold' },
            }}
            tickValues={[
              new Date(1985, 1, 1),
              new Date(1990, 1, 1),
              new Date(1995, 1, 1),
              new Date(2000, 1, 1),
              new Date(2005, 1, 1),
              new Date(2010, 1, 1),
            ]}
            tickFormat={(x) => new Date(x).getFullYear()}
          />
          <VictoryLine
            style={{
              data: { stroke: 'tomato' },
            }}
            data={[
              { x: new Date(1982, 1, 1), y: 125 },
              { x: new Date(1987, 1, 1), y: 257 },
              { x: new Date(1993, 1, 1), y: 345 },
              { x: new Date(1997, 1, 1), y: 515 },
              { x: new Date(2001, 1, 1), y: 132 },
              { x: new Date(2005, 1, 1), y: 305 },
              { x: new Date(2011, 1, 1), y: 270 },
              { x: new Date(2015, 1, 1), y: 470 },
            ]}
          />
        </VictoryChart>
      </div>
    )
  }
}
