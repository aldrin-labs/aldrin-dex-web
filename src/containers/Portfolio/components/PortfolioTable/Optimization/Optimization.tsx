import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'

import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core'
import * as actions from '@containers/Portfolio/actions'
import {
  IState,
  IData,
  IProps,
  RawOptimizedData,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'
import LineChart from '@components/LineChart'
import EfficientFrontierChart from '@containers/Portfolio/components/PortfolioTable/Optimization/EfficientFrontierChart/EfficientFrontierChart'
import Import, {
  InnerChartContainer,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Import/Import'
import QueryRenderer from '@components/QueryRenderer'
import { getCoinsForOptimization } from '@containers/Portfolio/components/PortfolioTable/Optimization/api'
import Warning from '@components/WarningMessageSnack/WarningMessageSnack'
import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
  roundPercentage,
} from '@utils/PortfolioTableUtils'
import ComingSoon from '@components/ComingSoon'
import {
  ChartsContainer,
  Chart,
  MainArea,
  PTWrapper,
  Content,
  ChartContainer,
  ContentInner,
  LoaderWrapper,
  LoaderInnerWrapper,
  StyledCardHeader,
} from './Optimization.styles'

import { MASTER_BUILD } from '@utils/config'
import { colors } from '@components/LineChart/LineChart.utils'
import { Loading } from '@components/Loading'
import { TypographyWithCustomColor } from '@styles/StyledComponents/TypographyWithCustomColor'
import { sumSameCoinsPercentages } from '@utils/PortfolioOptimizationUtils'
import { portfolioOptimizationSteps } from '@utils/joyrideSteps'


class Optimization extends Component<IProps, IState> {
  state: IState = {
    loading: false,
    activeButton: 2,
    rawOptimizedData: [],
    openWarning: false,
    warningMessage: '',
  }

  optimizedToState = (data: RawOptimizedData) => {
    const optimizedCoinsWeights = data.reduce((accMap, el) => {
      el.weights.forEach((weight: number, index: number) => {
        const percentageWeight = Math.abs(Number(weight) * 100).toFixed(2)
        const currentCoinName = el.portfolio_coins_list[index]

        if (accMap.has(currentCoinName)) {
          accMap.set(currentCoinName, [
            ...accMap.get(currentCoinName),
            percentageWeight,
          ])
        } else {
          accMap.set(currentCoinName, [percentageWeight])
        }
      })

      return accMap
    }, new Map())

    this.props.updateData(
      [...this.props.storeData].map((el) => ({
        ...el,
        optimizedPercentageArray: optimizedCoinsWeights.get(el.coin),
      }))
    )

    this.setState({ rawOptimizedData: data })
  }

  transformData = (assets: any[]): IData[] => {
    const allSum = calcAllSumOfPortfolioAsset(assets)
    // TODO: Avoid mutations in array of objects
    const newAssets = assets.map((asset: IData) => ({
      coin: asset.coin,
      percentage: +roundPercentage(
        percentagesOfCoinInPortfolio(asset, allSum, true)
      ),
    }))
    const summedAssetsWithoutDuplicates = sumSameCoinsPercentages(newAssets)

    return [summedAssetsWithoutDuplicates, allSum]
  }

  onNewBtnClick = (index) => {
    this.setState({ activeButton: index })
  }

  showWarning = (message: string) => {
    this.setState({ openWarning: true, warningMessage: message })
  }

  hideWarning = () => {
    this.setState({ openWarning: false })
  }

  setActiveButtonToDefault = () => this.setState({ activeButton: 2 })

  toggleLoading = () =>
    this.setState((prevState) => ({ loading: !prevState.loading }))

  renderInput = () => {
    // importing stuff from backend or manually bu user
    const { activeButton, rawOptimizedData } = this.state
    const {
      isShownMocks,
      updateData,
      storeData,
      filterValueSmallerThenPercentage,
      baseCoin,
      theme,
    } = this.props

    return (
      <QueryRenderer
        fetchPolicy="network-only"
        component={Import}
        query={getCoinsForOptimization}
        variables={{ baseCoin }}
        filterValueSmallerThenPercentage={filterValueSmallerThenPercentage}
        showWarning={this.showWarning}
        toggleLoading={this.toggleLoading}
        setActiveButtonToDefault={this.setActiveButtonToDefault}
        rawOptimizedData={rawOptimizedData}
        transformData={this.transformData}
        storeData={storeData}
        isShownMocks={isShownMocks}
        updateData={updateData}
        optimizedToState={this.optimizedToState}
        // buttons props
        onNewBtnClick={this.onNewBtnClick}
        activeButton={activeButton}
        theme={theme}
      />
    )
  }

  renderCharts = () => {
    const { activeButton, rawOptimizedData } = this.state
    const { storeData } = this.props

    if (!storeData) return

    const arrayOfReturnedValues =
      rawOptimizedData && rawOptimizedData.map((el) => el.return_value)
    const arrayOfReturnedRisks =
      rawOptimizedData && rawOptimizedData.map((el) => el.risk_coefficient)

    const efficientFrontierData = {
      activeButton,
      percentages: arrayOfReturnedValues,
      risk: arrayOfReturnedRisks,
    }

    // for real data
    const lineChartData =
      rawOptimizedData &&
      rawOptimizedData.length &&
      rawOptimizedData[activeButton].backtest_results.map((el) => ({
        label: 'optimized',
        x: el[0],
        y: el[1],
      }))

    const itemsForChartLegend = [
      {
        title: 'Optimized',
        color: colors[0],
      },
      {
        title: 'Original',
        color: colors[1],
      },
    ]

    const { theme } = this.props

    return (
      <ChartsContainer>
        <ChartContainer className="BackTestOptimizationChart">
          <StyledCardHeader title="Back-test Optimization" />
          <InnerChartContainer>
            <Chart background={theme.palette.background.default}>
              <LineChart
                alwaysShowLegend={false}
                data={lineChartData === 0 ? undefined : [lineChartData]}
                itemsForChartLegend={itemsForChartLegend}
              />
            </Chart>
          </InnerChartContainer>
        </ChartContainer>
        <ChartContainer className="EfficientFrontierChart">
          <StyledCardHeader title="Efficient Frontier" />
          <InnerChartContainer>
            <Chart background={theme.palette.background.default}>
              <EfficientFrontierChart
                data={efficientFrontierData}
                theme={theme}
              />
            </Chart>
          </InnerChartContainer>
        </ChartContainer>
      </ChartsContainer>
    )
  }

  render() {
    const {
      children,
      theme: { palette },
    } = this.props

    const textColor: string = palette.getContrastText(palette.background.paper)

    const { loading, openWarning, warningMessage } = this.state

    return (
      <PTWrapper
        background={palette.background.default}
        notScrollable={MASTER_BUILD}
      >
        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioOptimizationSteps}
          run={true}
        />
        <Content>
          {MASTER_BUILD && <ComingSoon />}
          {children}
          {loading && (
            <LoaderWrapper>
              {' '}
              <LoaderInnerWrapper>
                <Loading size={94} margin={'0 0 2rem 0'} />{' '}
                <TypographyWithCustomColor color={textColor} variant="h6">
                  Optimizing portfolio...
                </TypographyWithCustomColor>{' '}
              </LoaderInnerWrapper>{' '}
            </LoaderWrapper>
          )}
          <ContentInner loading={loading}>
            {this.renderInput()}
            <MainArea background={palette.background.paper}>
              {this.renderCharts()}
            </MainArea>
          </ContentInner>
          {/*<Warning*/}
            {/*open={openWarning}*/}
            {/*messageText={warningMessage}*/}
            {/*onCloseClick={this.hideWarning}*/}
          {/*/>*/}
          <Dialog
            fullScreen={false}
            open={openWarning}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {warningMessage}
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={this.hideWarning}
                color="secondary"
                autoFocus={true}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Content>
      </PTWrapper>
    )
  }
}

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  storeData: store.portfolio.optimizationData,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
})
const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Optimization)

export default compose()(storeComponent)
