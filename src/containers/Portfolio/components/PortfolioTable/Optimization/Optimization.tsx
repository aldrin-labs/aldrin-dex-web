import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import * as actions from '@containers/Portfolio/actions'
import {
  IState,
  IData,
  IProps,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'
// import BarChart from '@components/BarChart/BarChart'
import LineChart from '@components/LineChart'
import EfficientFrontierChart from '@containers/Portfolio/components/PortfolioTable/Optimization/EfficientFrontierChart/EfficientFrontierChart'
import Import from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/Import'
import QueryRenderer from '@components/QueryRenderer'
import { getCoinsForOptimization } from '@containers/Portfolio/components/PortfolioTable/Optimization/api'
import Warning from '@components/WarningMessageSnack/WarningMessageSnack'
import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio, roundPercentage,
} from '@utils/PortfolioTableUtils'
import ComingSoon from '@components/ComingSoon'
import {
  Loader,
  ChartsContainer,
  Chart,
  MainArea,
  MainAreaUpperPart,
  PTWrapper,
  Content,
  ChartContainer
} from './Optimization.styles'
import { mockDataForLineChart } from './mockData'


import { MASTER_BUILD } from '@utils/config'
import { colors } from '@components/LineChart/LineChart.utils'

const dateMockDataOriginal = new Array(1300).fill(undefined).map((elem, i) => {
  return [(1528405044 + (86400 * i)), i * 2 - 500 + (i * Math.random())]
})

const dateMockDataOptimized = new Array(1300).fill(undefined).map((elem, i) => {
  return [(1528405044 + (86400 * i)), i * 2 + 900 - (i * Math.random())]
})


class Optimization extends Component<IProps, IState> {
  state = {
    loading: false,
    risk: [],
    returns: [0],
    optimizedData: [],
    rawDataBeforeOptimization: {},
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

  transformData = (assets: any[]): IData[] => {
    const allSum = calcAllSumOfPortfolioAsset(assets)
    console.log('allSum', allSum);
    console.log('assets', assets);



    const newAssets = assets.map((asset: any) => ({
      coin: asset.coin,
      percentage: roundPercentage(percentagesOfCoinInPortfolio(asset, allSum, true)),
    }))

    console.log('newAssets',newAssets);

    return newAssets
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

  onNewBtnClick = (index) => {
    this.setState({ activeButton: index })
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

  setActiveButtonToDefault = () => this.setState({ activeButton: 2 })

  toggleLoading = () =>
    this.setState((prevState) => ({ loading: !prevState.loading }))

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
      filterValueSmallerThenPercentage,
      theme,
    } = this.props

    return (
      <QueryRenderer
        component={Import}
        query={getCoinsForOptimization}
        filterValueSmallerThenPercentage={filterValueSmallerThenPercentage}
        optimizationPeriod={optimizationPeriod}
        showWarning={this.showWarning}
        toggleLoading={this.toggleLoading}
        setPeriod={setPeriod}
        setActiveButtonToDefault={this.setActiveButtonToDefault}
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
        onNewBtnClick={this.onNewBtnClick}
        percentages={percentages}
        activeButton={activeButton}
        showSwitchButtons={optimizedData.length >= 1}
        theme={theme}
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
      rawOptimizedData,
    } = this.state
    const { storeData } = this.props

    if (!storeData) return
    // const formatedData = storeData.map((el: IData, i) => ({
    //   x: el.coin,
    //   y: Number(Number(el.percentage).toFixed(2)),
    // }))
    // const formatedOptimizedData = optimizedData.map((el: IData, i) => ({
    //   x: el.coin,
    //   y: Number(Number(el.percentage).toFixed(2)),
    // }))

    // const barChartData = [
    //   {
    //     data: formatedData,
    //     title: 'Original',
    //     color: '#2496c8',
    //   },
    //   {
    //     data: formatedOptimizedData,
    //     title: 'Optimized',
    //     color: '#1869a8',
    //   },
    // ]


    const arrayOfReturnedValues = rawOptimizedData.map((el) => el.return_value)
    const arrayOfReturnedRisks = rawOptimizedData.map((el) => el.risk_coefficient)
    console.log('arrayOfReturnedValues',arrayOfReturnedValues);
    console.log('arrayOfReturnedRisks',arrayOfReturnedRisks);


    let efficientFrontierData = {
      activeButton,
      percentages: arrayOfReturnedValues,
      risk: arrayOfReturnedRisks,
    }

    // let showBarChartPlaceholder = false
    // if (
    //   !isEqual(
    //     storeData.map((el: IData) => el.coin).sort(),
    //     optimizedData.map((el: IData) => el.coin).sort()
    //   )
    // ) {
    //   showBarChartPlaceholder = true
    //   efficientFrontierData = {
    //     percentages: [],
    //     risk: [],
    //     activeButton,
    //   }
    // }

    // for real data
    // const lineChartData =  rawOptimizedData.length &&  rawOptimizedData[activeButton].backtest_result.map((el) => ({
    //   x: el[0],
    //   y: el[1],
    // }))

    const lineChartDataOriginal = dateMockDataOriginal.map((el) => ({
      label: 'optimized',
      x: el[0],
      y: el[1],
    }))
    const lineChartDataOptimized = dateMockDataOptimized.map((el) => ({
      label: 'optimized',
      x: el[0],
      y: el[1],
    }))

    console.log('lineChartData', lineChartDataOriginal);


    const itemsForChartLegend = [
      {
        title: 'Original',
        color: colors[0],
      },
      {
        title: 'Optimized',
        color: colors[1],
      },
    ]

    const {
      theme,
    } = this.props

    return (
      <ChartsContainer>
        <ChartContainer background={theme.palette.background.paper}>
        <Chart background={theme.palette.background.default}>
          <LineChart
            alwaysShowLegend={true}
            // data={mockDataForLineChart}
            data={[lineChartDataOriginal, lineChartDataOptimized]}
            itemsForChartLegend={itemsForChartLegend}
          />
        </Chart>
        </ChartContainer>
      <ChartContainer background={theme.palette.background.paper}>
        <Chart background={theme.palette.background.default}>
          <EfficientFrontierChart data={efficientFrontierData} theme={theme}/>
        </Chart>
      </ChartContainer>
      </ChartsContainer>
    )
  }

  renderLoading = () => <Loader color="secondary" />

  render() {
    const {
      children,
      theme: { palette },
    } = this.props
    const { loading, openWarning, warningMessage } = this.state

    return (
      <PTWrapper background={palette.background.default} notScrollable={MASTER_BUILD}>
        <Content>
          {MASTER_BUILD && <ComingSoon />}
          {children}
          {loading ? this.renderLoading() : null}
          {this.renderInput()}

          <MainArea background={palette.background.paper}>
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

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  storeData: store.portfolio.optimizationData,
  startDate: store.portfolio.optimizationStartDate,
  endDate: store.portfolio.optimizationEndDate,
  optimizationPeriod: store.portfolio.optimizationPeriod,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
  setPeriod: (payload: any) => dispatch(actions.setOptimizationPeriod(payload)),
})
const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Optimization)

export default compose()(storeComponent)
