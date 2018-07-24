import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { isEqual } from 'lodash'

import * as actions from '@containers/Portfolio/actions'
import {
  IState,
  IData,
  IProps,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'
import BarChart from '@components/BarChart/BarChart'
import EfficientFrontierChart from '@containers/Portfolio/components/PortfolioTable/Optimization/EfficientFrontierChart/EfficientFrontierChart'
import Import from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/Import'
import QueryRenderer from '@components/QueryRenderer'
import { getCoinsForOptimization } from '@containers/Portfolio/components/PortfolioTable/Optimization/api'
import Warning from '@components/WarningMessageSnack/WarningMessageSnack'

class Optimization extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    risk: [],
    returns: [0],
    optimizedData: [],
    rawDataBeforeOptimization: [],
    expectedReturn: '',
    activeButton: 2,
    percentages: [0],
    rawOptimizedData: [],
    openWarning: false,
    warningMessage: '',
  }

  optimizedToState = (data: object[]) =>
    this.setState({ rawOptimizedData: data })

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
        //  this part outdated
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
            returns: this.getPercentages(Number(this.state.expectedReturn)),
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
            risk: this.state.rawOptimizedData.map((el: any) => el.risk * 100),
            returns: this.state.rawOptimizedData.map(
              (el: any) => el.returns * 100
            ),
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

  transformData = (assets) => {
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

  onBtnClick = async (index: number) => {
    if (!this.props.isShownMocks) {
      this.setState({ loading: true })
    }
    this.setState({ activeButton: index })

    const { rawOptimizedData, percentages } = this.state
    const percentage = percentages[index]

    const data = rawOptimizedData.find(
      (el: any) => el.percentage_expected_returns === percentage
    )

    data && this.optimizePortfolio(data)
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

  showWarning = (message: string) => {
    this.setState({ openWarning: true, warningMessage: message })

    setTimeout(() => {
      this.hideWarning()
    }, 3000)
  }

  hideWarning = () => {
    this.setState({ openWarning: false })
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
      setPeriod,
      optimizationPeriod,
    } = this.props

    return (
      <QueryRenderer
        component={Import}
        optimizationPeriod={optimizationPeriod}
        showWarning={this.showWarning}
        query={getCoinsForOptimization}
        setPeriod={setPeriod}
        optimizedData={optimizedData}
        transformData={this.transformData}
        storeData={storeData}
        startDate={startDate}
        endDate={endDate}
        expectedReturn={expectedReturn}
        optimizePortfolio={this.optimizePortfolio}
        isShownMocks={isShownMocks}
        updateData={updateData}
        handleChange={this.handleChange}
        optimizedToState={this.optimizedToState}
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
      optimizedData,
      rawDataBeforeOptimization,
      activeButton,
      risk,
      returns,
    } = this.state
    const { storeData } = this.props

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
        color: '#2496c8',
      },
      {
        data: formatedOptimizedData,
        title: 'Optimized',
        color: '#1869a8',
      },
    ]

    let efficientFrontierData = {
      percentages: returns,
      risk,
      activeButton,
    }

    let showBarChartPlaceholder = false
    if (
      !isEqual(
        storeData.map((el: IData) => el.coin).sort(),
        optimizedData.map((el: IData) => el.coin).sort()
      )
    ) {
      showBarChartPlaceholder = true
      efficientFrontierData = {
        percentages: [],
        risk: [],
        activeButton,
      }
    }

    return (
      <ChartsContainer>
        <Chart>
          <BarChart
            height={300}
            showPlaceholder={
              optimizedData.length < 1 || showBarChartPlaceholder
            }
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
    const { loading, openWarning, warningMessage } = this.state

    return (
      <PTWrapper>
        <Content>
          {children}
          {loading ? this.renderLoading() : null}
          <ImportData>{this.renderInput()}</ImportData>

          <MainArea>
            <MainAreaUpperPart />
            {this.renderCharts()}
          </MainArea>
          <Warning
            open={openWarning}
            messageText={warningMessage}
            onCloseClick={this.hideWarning}
          />
        </Content>
      </PTWrapper>
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
  startDate: store.portfolio.optimizationStartDate,
  endDate: store.portfolio.optimizationEndDate,
  optimizationPeriod: store.portfolio.optimizationPeriod,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
  setPeriod: (payload: any) => dispatch(actions.setOptimizationPeriod(payload)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  Optimization
)

export default compose()(storeComponent)
