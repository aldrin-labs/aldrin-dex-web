import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'

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
import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
} from '@utils/PortfolioTableUtils'
import CoomingSoon from '@components/CoomingSoon'
import {
  Loader,
  ChartsContainer,
  Chart,
  MainArea,
  MainAreaUpperPart,
  PTWrapper,
  Content,
  ImportData,
} from './Optimization.styles'

const production = true

class Optimization extends Component<IProps, IState> {
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

  transformData = (assets: any[]): IData[] => {
    const allSum = calcAllSumOfPortfolioAsset(assets, true)

    return assets.map((data: any) => ({
      coin: data.asset.symbol,
      percentage: percentagesOfCoinInPortfolio(data, allSum, true),
    }))
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

    if (!storeData) return
    const formatedData = storeData.map((el: IData, i) => ({
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

    return (
      <ChartsContainer>
        <Chart>
          <BarChart
            height={300}
            showPlaceholder={formatedData.length === 0}
            charts={barChartData}
            alwaysShowLegend
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
      <PTWrapper notScrollable={production}>
        <Content>
          {production && <CoomingSoon />}
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
