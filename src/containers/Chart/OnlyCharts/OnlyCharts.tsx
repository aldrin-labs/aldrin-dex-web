import React, { Component } from 'react'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import { SingleChart } from '@components/Chart'
import Switch from '@components/Switch/Switch'
import DepthChart from '../DepthChart/DepthChart'
import { getFakeDepthChartData } from '../mocks'

const options = [
  'BTC/USD',
  'ETH/USD',
  'XRP/USD',
  'BCH/USD',
  'LTC/USD',
  'ADA/USD',
]

interface Props {}

interface State {
  charts: string[]
  choosedChart?: string
}

class Charts extends Component {
  state = {
    activeChart: 'depth',
    ordersData: [],
    spreadData: [],
  }

  componentDidUpdate(prevProps) {
    // we need this hack to update depth chart Width when width of his container changes
    if (prevProps.chartsCount !== this.props.chartsCount) {
      const ordersDataContainer = this.state.ordersData
      this.setState({ ordersData: ordersDataContainer })
    }
  }

  componentDidMount() {
    const { usdSpreadFakeData, orderBookFakeData } = getFakeDepthChartData()
    this.setState({
      ordersData: orderBookFakeData,
      spreadData: usdSpreadFakeData,
    })
    // fetch data
  }

  render() {
    const { base, quote } = this.props
    const { ordersData, spreadData } = this.state

    return (
      <>
        <ChartsSwitcher>
          <ExchangePair>{`${base}/${quote}`}</ExchangePair>
          <Switch
            onClick={() => {
              this.setState((prevState) => ({
                activeChart:
                  prevState.activeChart === 'candle' ? 'depth' : 'candle',
              }))
            }}
            values={['Depth', 'Chart']}
          />
        </ChartsSwitcher>
        {this.state.activeChart === 'candle' ? (
          <SingleChart />
        ) : (
          <DepthChartContainer>
            <DepthChart
              {...{
                ordersData,
                spreadData,
              }}
            />
          </DepthChartContainer>
        )}
      </>
    )
  }
}

export default class OnlyCharts extends Component<Props, {}> {
  state: State = {
    charts: ['BTC/USD'],
  }

  addChart = () => {
    const { charts, choosedChart } = this.state
    if (!choosedChart || charts.indexOf(choosedChart) >= 0) return

    const newCharts = charts.slice()

    newCharts.push(choosedChart)
    this.setState({ charts: newCharts })
  }

  removeChart = (index: number) => {
    const { charts } = this.state

    const newCharts = charts.slice()
    newCharts.splice(index, 1)

    this.setState({ charts: newCharts })
  }

  onSelectChart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    this.setState({ choosedChart: value })
  }

  render() {
    const { charts } = this.state

    return (
      <div>
        <ChartCtrlBlock>
          <ChartSelect defaultValue="BTC/USD" onChange={this.onSelectChart}>
            {options.map((opt) => {
              return (
                <ChartSelectOption key={opt} value={opt}>
                  {opt}
                </ChartSelectOption>
              )
            })}
          </ChartSelect>

          <AddChartBtn onClick={this.addChart}>&#10010;</AddChartBtn>
        </ChartCtrlBlock>
        <ChartContainer>
          {charts.map((chart, i) => {
            return (
              <Wrapper width={100 / charts.length} key={chart}>
                <Charts chartsCount={charts.length} base="USD" quote="BTC" />
              </Wrapper>
            )
          })}
        </ChartContainer>
      </div>
    )
  }
}

const DepthChartContainer = styled.div`
  height: calc(100% - 37px);
  width: 100%;
`

const ExchangePair = styled.div`
  margin: 0 0.5rem;
  background: #2e353fd9;
  line-height: 36px;
  white-space: nowrap;
  border-radius: 3px;
  height: 100%;
  padding: 0 1rem;
`

const ChartsSwitcher = styled.div`
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 38px;
  background: rgb(53, 61, 70);
  color: white;
  border-bottom: 1px solid #818d9ae6;
`

const ChartCtrlBlock = styled.div`
  margin: 10px auto;
  background-color: #373c4e;
  width: 200px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const ChartSelectOption = styled.option`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  color: #ffffffde;
  margin-left: 15px;
  border: none;
  background-color: #292d31;
  outline: none;
`

const ChartSelect = styled.select`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  font-weight: bold;
  color: #ffffffde;
  margin-left: 15px;
  border: none;
  background: transparent;
  outline: none;
`

const Wrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: ${(props: { width: number }) => props.width}%;
  height: 500px;
  margin: 1%;

  && {
    margin: 0.25rem;
  }
`

const ChartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
`

const AddChartBtn = styled.button`
  background: transparent;
  border: none;
  padding: 5px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
`
