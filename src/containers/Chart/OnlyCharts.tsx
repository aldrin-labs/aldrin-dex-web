import * as React from 'react'
import styled from 'styled-components'
import { CHARTS_API_URL } from '../../utils/config'

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

export default class OnlyCharts extends React.Component<Props, {}> {
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
            {options.map(opt => {
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
              <Wrapper key={chart}>
                <ChartInfo>
                  {chart}
                  <AddChartBtn onClick={() => this.removeChart(i)}>
                    &#10008;
                  </AddChartBtn>
                </ChartInfo>
                <iframe src={`http://${CHARTS_API_URL}`} height={'100%'} />
              </Wrapper>
            )
          })}
        </ChartContainer>
      </div>
    )
  }
}

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  height: 500px;
  margin: 1%;
`

const ChartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`
const ChartInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  background-color: #373c4e;
  color: #fff;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
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
