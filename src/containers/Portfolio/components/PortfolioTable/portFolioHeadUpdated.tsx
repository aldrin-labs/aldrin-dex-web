import * as React from 'react'
import styled from 'styled-components'
import { IState, IProps } from './portFolioHeadUpdated.types'

// import { ProfileQueryQuery } from '../profile-annotation'

// interface Props {
//   coin: ProfileQueryQuery['assetById']
// }

const chartBtns = [
  '1 Day',
  '7 Days',
  '1 Month',
  '3 Month',
  '1 Year',
  'YTD',
  'ALL PERIOD',
]

export default class ProfileChart extends React.Component<IProps, IState> {
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
        {/*TODO: need refactoring, need real data */}
        <SuppliesBlock>
          <SupplyBlock>
            <CurrentRate>{priceUSD || '9 713,19'}</CurrentRate>
            <SupplyDetail>Current rate USD</SupplyDetail>
          </SupplyBlock>

          <SupplyBlock>
            <SupplyLowRate>{'904,79'}</SupplyLowRate>
            <SupplyDetail>Low: 25 Mar 2017</SupplyDetail>
          </SupplyBlock>

          <SupplyBlock>
            <SupplyHighRate>{'20078,10'}</SupplyHighRate>
            <SupplyDetail>High: 17 Dec 2017</SupplyDetail>
          </SupplyBlock>
          <SupplyBlock>
            <SupplyHighRate>{'+748,77%'}</SupplyHighRate>
            <SupplyDetail>Change in year USD</SupplyDetail>
          </SupplyBlock>
        </SuppliesBlock>

        <BtnsContainer>
          {chartBtns.map((chartBtn, i) => (
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
          ))}
        </BtnsContainer>
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
  padding: 0 5px;
  margin-top: 5px;

  padding-bottom: 48px;
  margin-left: 16.5px;

  display: flex;
  flex-direction: column;
  align-items: center;
`
const ProfileChartHeading = styled.span`
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  margin-top: 5px;
`

const SuppliesBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
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
  font-size: 22px;
  font-weight: 500;
  color: #4ed8da;
`

const CommonRate = styled.span`
  font-family: Roboto;
  font-size: 18px;
  color: #ffffff;
`

const SupplyLowRate = styled.span`
  font-family: Roboto;
  font-size: 18px;
  color: #ff687a;
`

const SupplyHighRate = styled.span`
  font-family: Roboto;
  font-size: 18px;
  color: #65c000;
`

const SupplyDetail = styled.span`
  opacity: 0.5;
  font-family: Roboto;
  font-size: 18px;
  color: #ffffff;
  margin-top: 4px;
`
