import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { ApolloConsumer } from 'react-apollo'

import * as actions from '@containers/Portfolio/actions'
import {
  IState,
  IData,
  IProps,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'
import BarChart from '@components/BarChart/BarChart'
import EfficientFrontierChart from '@containers/Portfolio/components/PortfolioTable/Optimization/EfficientFrontierChart/EfficientFrontierChart'
import Table from '@containers/Portfolio/components/PortfolioTable/Optimization/Table/Table'
import Import from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/Import'
import QueryRenderer from '@components/QueryRenderer'
import {
  OPTIMIZE_PORTFOLIO,
  getCoinsForOptimization,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/api'

class Optimization extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    risk: [],
    optimizedData: [],
    rawDataBeforeOptimization: [],
    expectedReturn: '',
    activeButton: 2,
    percentages: [0],
  }

  handleChange = (event: any) => {
    this.setState({
      expectedReturn: event.target.value.replace(/-|%/g, ''),
    })
  }

  optimizePortfolio = (data: any) => {
    if (
      !(this.state.expectedReturn === '' || this.props.storeData.length < 1)
    ) {
      if (this.props.isShownMocks) {
        const risk = [
          +(Math.random() * 100).toFixed(2),
          +(Math.random() * 100).toFixed(2),
          +(Math.random() * 100).toFixed(2),
          +(Math.random() * 100).toFixed(2),
          +(Math.random() * 100).toFixed(2),
        ]
        this.setState(
          {
            optimizedData: this.props.storeData.map(
              ({ coin }: { coin: string }) => ({
                coin,
                percentage: (Math.random() * 100).toFixed(2),
              })
            ),
            risk,
            rawDataBeforeOptimization: this.props.storeData,
          },
          () => console.log(this.state)
        )
      } else {
        this.setState(
          {
            loading: false,
            optimizedData: data['weighted_coins_optimized'].map(
              ({ coin, weight }: { coin: string; weight: number }) => ({
                coin,
                percentage: Math.max(+weight * 100, 0.01),
              })
            ),
            risk: data.risk,
            rawDataBeforeOptimization: this.props.storeData,
          },
          () => console.log(this.state)
        )
      }

      this.setState({
        percentages: this.getPercentages(Number(this.state.expectedReturn)),
      })
    }
  }

  transfromData = (assets) => {
    // transforming data like assets from profile to IData format
    const allSums = assets.filter(Boolean).reduce((acc: number, curr: any) => {
      const { value = 0, asset = { priceUSD: 0 } } = curr || {}
      if (!value || !asset || !asset.priceUSD || !asset.priceBTC) {
        return null
      }
      const price = asset.priceBTC

      return acc + value * Number(price)
    }, 0)

    return assets.map((data: any) => ({
      coin: data.asset.symbol,
      percentage: data.asset.priceBTC * data.value * 100 / allSums,
    }))
  }

  onBtnClick = async (index: number, client: any) => {
    this.setState({ loading: true })
    this.setState({ activeButton: index })
    console.log('onBtnClick')
    const { storeData, startDate, endDate } = this.props
    const { data } = await client.query({
      query: OPTIMIZE_PORTFOLIO,
      variables: {
        expectedPct: +this.state.percentages[index] / 100,
        coinList: ['ETH', 'LTC', 'BCH'],
        startDate: 1531441380,
        endDate: 1531873380,
      },
    })

    this.optimizePortfolio(JSON.parse(data.portfolioOptimization))
  }

  getPercentages = (percentage: number) => {
    /* tslint:disable */
    //  not optimized code
    const percetageArray: number[] = []

    if (percentage <= 0) {
      return []
    }

    if (percentage <= 5) {
      percetageArray.push(percentage)
      for (let index = 1; index < 5; index++) {
        percetageArray.push(percentage + 5 * index)
      }

      return percetageArray
    }

    if (percentage <= 10) {
      percetageArray.push(percentage - 5)
      percetageArray.push(percentage)

      for (let index = 1; index < 4; index++) {
        percetageArray.push(percentage + 5 * index)
      }

      return percetageArray
    }

    for (let index = 1; index < 3; index++) {
      percetageArray.push(percentage - 5 * (3 - index))
    }

    percetageArray.push(percentage)

    for (let index = 1; index < 3; index++) {
      percetageArray.push(percentage + 5 * index)
    }
    /* tslint:enable */

    return percetageArray
  }

  renderInput = () => {
    // importing stuff from backend or manually bu user
    const {
      expectedReturn,
      percentages,
      activeButton,
      optimizedData,
    } = this.state
    const {
      isShownMocks,
      updateData,
      storeData,
      startDate,
      endDate,
    } = this.props

    return (
      <QueryRenderer
        component={Import}
        query={getCoinsForOptimization}
        transfromData={this.transfromData}
        storeData={storeData}
        startDate={startDate}
        endDate={endDate}
        expectedReturn={expectedReturn}
        optimizePortfolio={this.optimizePortfolio}
        isShownMocks={isShownMocks}
        updateData={updateData}
        handleChange={this.handleChange}
        // buttons props
        onBtnClick={this.onBtnClick}
        percentages={percentages}
        activeButton={activeButton}
        showSwitchButtons={optimizedData.length >= 1}
      />
    )
  }

  renderCharts = () => {
    const {
      percentages,
      optimizedData,
      rawDataBeforeOptimization,
      activeButton,
      risk,
    } = this.state

    const formatedData = rawDataBeforeOptimization.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))
    const formatedOptimizedData = optimizedData.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))

    const barChartData = [
      {
        data: formatedData,
        title: 'Original',
        color: '#4fd8da',
      },
      {
        data: formatedOptimizedData,
        title: 'Optimized',
        color: '#4fa1da',
      },
    ]

    const efficientFrontierData = {
      percentages,
      risk,
      activeButton,
    }

    return (
      <ChartsContainer>
        <Chart>
          <BarChart
            height={300}
            showPlaceholder={optimizedData.length < 1}
            charts={barChartData}
          />
        </Chart>
        <Chart>
          <EfficientFrontierChart data={efficientFrontierData} />
        </Chart>
      </ChartsContainer>
    )
  }

  renderLoading = () => <Loader color="secondary" />

  render() {
    const { children } = this.props
    const { loading } = this.state

    return (
      <ApolloConsumer>
        {(client) => (
          <PTWrapper>
            <Content>
              {children}
              {loading ? this.renderLoading() : null}
              <ImportData>{this.renderInput()}</ImportData>

              <MainArea>
                <MainAreaUpperPart />
                {this.renderCharts()}
              </MainArea>
            </Content>
          </PTWrapper>
        )}
      </ApolloConsumer>
    )
  }
}

const Loader = styled(LinearProgress)`
  margin-bottom: 0.5rem;
`

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`
const Chart = styled.div`
  padding: 0.5rem;
  margin: 1rem;
  flex-grow: 1;
  min-width: 0;
  height: 300px;
  border-radius: 1rem;
  background: #393e44;

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

const MainAreaUpperPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const MainArea = styled.div`
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  flex-direction: column;
  background: #292d31;
  height: auto;
  display: flex;
  margin: 2rem;
`

const PTWrapper = styled.div`
  min-height: 100%;
  overflow-y: auto;
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  overflow: auto;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const Content = styled.div`
  flex: 0 0 auto;
`

const ImportData = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  margin: 0 auto;

  @media (max-width: 1080px) {
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  storeData: store.portfolio.optimizationData,
  startDate: store.portfolio.correlationStartDate,
  endDate: store.portfolio.correlationEndDate,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  Optimization
)

export default compose()(storeComponent)
