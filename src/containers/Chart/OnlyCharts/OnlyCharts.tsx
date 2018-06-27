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
            values={['Depth', 'Chart']}
          />
          <Button
            onClick={() => {
              removeChart(index)
            }}
          >
            <MdClear />
          </Button>
        </ChartsSwitcher>
        {this.state.activeChart === 'candle' ? (
          <SingleChart />
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
      toggleWarningMessage,
    } = this.props
    console.log(openedWarning)

    return (
      <div>
        <ChartContainer>
          {charts.map((chart, i) => (
            <Wrapper width={100 / charts.length} key={chart}>
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
            onCloseClick={toggleWarningMessage}
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 38px;
  background: rgb(53, 61, 70);
  color: white;
  border-bottom: 1px solid #818d9ae6;
`
const Wrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: ${(props: { width: number }) => props.width}%;
  height: 40vh;
  min-width: 23.125rem;
  margin: 1%;

  && {
    margin: 0.25rem;
  }
`

const ChartContainer = styled.div`
  overflow-x: hidden;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const mapStateToProps = (store: any) => ({
  charts: store.chart.charts,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
  openedWarning: store.chart.warningMessageOpened,
})

const mapDispatchToProps = (dispatch: any) => ({
  removeChart: (i: number) => dispatch(actions.removeChart(i)),
  toggleWarningMessage: () => dispatch(actions.toggleWarningMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlyCharts)
