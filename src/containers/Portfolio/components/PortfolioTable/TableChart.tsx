import * as React from 'react'
import styled from 'styled-components'
interface State {
  activeChart: number
}

const chartBtns = ['1 Day', '7 Days', '1 Month', '3 Month', '1 Year', 'YTD', 'ALL PERIOD']

export default class extends React.Component<Props, State> {
  state = {
    activeChart: 4,
  }

  onChangeActiveChart = (index: number) => {
    this.setState({ activeChart: index })
  }

  render() {
    const { coin } = this.props
    const { name = '', priceUSD = '' } = coin || {}
    console.log(coin)

    return (
      <SProfileChart>
        <BtnsContainer>
          {chartBtns.map((chartBtn, i) => {
            return (
              <ChartBtn
                onClick={() => this.onChangeActiveChart(i)}
                style={
                  i === this.state.activeChart
                    ? { backgroundColor: '#4ed8da', color: '#4c5055' }
                    : {}
                }
                key={chartBtn}
              >
                {chartBtn}
              </ChartBtn>
            )
          })}
        </BtnsContainer>

        <Hr />

        {/*TODO: make a chart */}
        <Chart />
      </SProfileChart>
    )
  }
}

const Chart = styled.div`
  width: 741px;
  height: 195px;
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(to left, #85edee, #4fd8da);
  border-image-slice: 1;
  padding: 38px 17px 53px 17px;
  margin: 0 auto;
`

const Hr = styled.hr`
  margin: 16px auto;
  width: 95%;
  height: 0.5px;
  border-radius: 1px;
  background-color: #ffffff;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
`

const ChartBtn = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  margin-right: 16px;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
`

const SProfileChart = styled.div`
  min-width: 775px;
  padding: 0 16px;
  margin-top: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
  padding-bottom: 48px;
  margin-left: 16.5px;

  display: flex;
  flex-direction: column;
`
const ProfileChartHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  margin-top: 16px;
`

const SuppliesBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`

const SupplyBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 56px;
  margin-right: 35px;
`

const CurrentRate = styled.span`
  font-family: Roboto;
  font-size: 25px;
  font-weight: 500;
  color: #4ed8da;
`

const CommonRate = styled.span`
  font-family: Roboto;
  font-size: 20px;
  color: #ffffff;
`

const SupplyLowRate = styled.span`
  font-family: Roboto;
  font-size: 20px;
  color: #ff687a;
`

const SupplyHighRate = styled.span`
  font-family: Roboto;
  font-size: 20px;
  color: #65c000;
`

const SupplyDetail = styled.span`
  opacity: 0.5;
  font-family: Roboto;
  font-size: 14px;
  color: #ffffff;
  margin-top: 4px;
`
