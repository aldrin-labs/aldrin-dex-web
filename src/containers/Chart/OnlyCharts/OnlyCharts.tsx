import React, { Component } from 'react'
import styled from 'styled-components'
import { Paper, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { MdClear } from 'react-icons/lib/md'

import * as actions from '../actions'
import { SingleChart } from '@components/Chart'
import Switch from '@components/Switch/Switch'
import DepthChart from '../DepthChart/DepthChart'
import WarningMessageSnack from '@components/WarningMessageSnack/WarningMessageSnack'

import { getFakeDepthChartData } from '../mocks'

interface IChartProps {
  currencyPair: string
  removeChart: Function
  index: number
  chartsCount: number
}

interface IExchange {
  price: string | number
  size: string | number
}

interface IChartState {
  ordersData: IExchange[]
  spreadData: IExchange[]
  activeChart: 'candle' | 'depth'
}

class Charts extends Component<IChartProps, IChartState> {
  state: IChartState = {
    activeChart: 'candle',
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
    const { currencyPair, removeChart, index } = this.props
    const { ordersData, spreadData } = this.state

    const [base, quote] = currencyPair.split('/')

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
            values={['Chart', 'Depth']}
          />
          <Button
            onClick={() => {
              removeChart(index)
            }}
          >
            <MdClear />
          </Button>
        </ChartsSwitcher>
        {console.log(`/?symbol=${base}/${quote}`)}
        {this.state.activeChart === 'candle' ? (
          <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
        ) : (
          <DepthChartContainer>
            <DepthChart
              {...{
                ordersData,
                spreadData,
                base,
                quote,
                animated: false,
              }}
            />
          </DepthChartContainer>
        )}
      </>
    )
  }
}

class OnlyCharts extends Component<Props, {}> {
  onSelectChart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    this.setState({ choosedChart: value })
  }

  render() {
    const {
      charts,
      removeChart,
      openedWarning,
      removeWarningMessage,
    } = this.props

    return (
      <div>
        <ChartContainer chartsCount={charts.length}>
          {charts.map((chart: string, i: number) => (
            <Wrapper key={chart}>
              <Charts
                removeChart={removeChart}
                index={i}
                chartsCount={charts.length}
                currencyPair={chart}
              />
            </Wrapper>
          ))}
          <WarningMessageSnack
            open={openedWarning}
            onCloseClick={removeWarningMessage}
            messageText={'You can create up to 8 charts.'}
          />
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
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 38px;
  background: rgb(53, 61, 70);
  color: white;
  border-bottom: 1px solid #818d9ae6;
`

const ChartContainer = styled.div`
  margin-top: ${(props: { chartsCount?: number }) => {
    if (props.chartsCount === 3 || props.chartsCount === 4) {
      return '10vh'
    } else {
      return 0
    }
  }};
  overflow: hidden;
  max-height: calc(100vh - 59px - 80px);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    ${(props: { chartsCount?: number }) => {
      if (props.chartsCount && props.chartsCount <= 3) {
        return props.chartsCount
      } else {
        return 4
      }
    }},
    1fr
  );
  grid-template-rows: repeat(
    ${(props: { chartsCount?: number }) => {
      if (props.chartsCount && props.chartsCount > 4) {
        return '2, 41.5vh'
      } else if (props.chartsCount === 3 || props.chartsCount === 4) {
        return '1, 60vh'
      } else {
        return '1, 80vh'
      }
    }}
  );
`

const Wrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
`
const mapStateToProps = (store: any) => ({
  charts: store.chart.charts,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
  openedWarning: store.chart.warningMessageOpened,
})

const mapDispatchToProps = (dispatch: any) => ({
  removeChart: (i: number) => dispatch(actions.removeChart(i)),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlyCharts)
