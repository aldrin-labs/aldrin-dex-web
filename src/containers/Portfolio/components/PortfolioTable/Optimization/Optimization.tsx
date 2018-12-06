import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Switch from '@material-ui/core/Switch'
import Joyride from 'react-joyride'

import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core'
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
import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
  roundPercentage,
} from '@utils/PortfolioTableUtils'
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

import { colors } from '@components/LineChart/LineChart.utils'
import { Loading } from '@components/Loading'
import { TypographyWithCustomColor } from '@styles/StyledComponents/TypographyWithCustomColor'
import { sumSame } from '@utils/PortfolioOptimizationUtils'
import { portfolioOptimizationSteps } from '@utils/joyrideSteps'
import * as Useractions from '@containers/User/actions'
import config from '@utils/linkConfig'

class Optimization extends Component<IProps, IState> {
  state: IState = {
    loading: false,
    activeButton: 2,
    rawOptimizedData: [],
    openWarning: false,
    warningMessage: '',
    showAllLineChartData: true,
    isSystemError: false,
    run: true,
    key: 0,
  }

  optimizedToState = (data: RawOptimizedData) => {
    const optimizedCoinsWeightsMap = data.reduce((accMap, el) => {
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
        optimizedPercentageArray: optimizedCoinsWeightsMap.get(el.coin),
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
    const summedAssetsWithoutDuplicates = sumSame(
      newAssets,
      'coin',
      'percentage'
    )

    return [summedAssetsWithoutDuplicates, allSum]
  }

  onNewBtnClick = (index) => {
    this.setState({ activeButton: index })
  }

  showWarning = (message: string | JSX.Element, isSystemError = false) => {
    this.setState({ openWarning: true, warningMessage: message, isSystemError })
  }

  hideWarning = () => {
    this.setState({ openWarning: false })
  }

  setActiveButtonToDefault = () => this.setState({ activeButton: 2 })

  toggleLoading = () =>
    this.setState((prevState) => ({ loading: !prevState.loading }))

  onToggleLineChartSwitch = (e, isChecked: boolean) => {
    this.setState({
      showAllLineChartData: isChecked,
    })
  }

  openLink = (link: string = '') => {
    this.hideWarning()
    window.open(link, 'CCAI Feedback')
  }

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
        fetchPolicy="cache-and-network"
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
    const { activeButton, rawOptimizedData, showAllLineChartData } = this.state
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

    const riskProfileNames = ['min', 'low', 'med', 'high', 'max']

    // TODO: Make it better
    // for real data
    const lineChartData = showAllLineChartData
      ? rawOptimizedData &&
        rawOptimizedData.length &&
        rawOptimizedData.map((el, i) => {
          return {
            data: el.backtest_results.map((element) => ({
              label: riskProfileNames[i],
              x: element[0],
              y: element[1],
            })),
            color: colors[i],
          }
        })
      : rawOptimizedData &&
        rawOptimizedData.length && {
          data: rawOptimizedData[activeButton].backtest_results.map(
            (el, i) => ({
              label: 'Optimized',
              x: el[0],
              y: el[1],
            })
          ),
          color: colors[activeButton],
        }

    const itemsForChartLegend = riskProfileNames.map((el, i) => ({
      title: el,
      color: colors[i],
    }))

    const { theme } = this.props

    return (
      <ChartsContainer id="BackTestOptimization">
        <ChartContainer className="BackTestOptimizationChart">
          <StyledCardHeader
            title="Back-test Optimization"
            action={
              <>
                <TypographyWithCustomColor color={`secondary`} variant="button">
                  Show all risk profiles
                </TypographyWithCustomColor>
                <Switch
                  onChange={this.onToggleLineChartSwitch}
                  checked={this.state.showAllLineChartData}
                />
              </>
            }
          />
          <InnerChartContainer>
            <Chart background={theme.palette.background.default}>
              <LineChart
                theme={theme}
                additionalInfoInPopup={true}
                alwaysShowLegend={showAllLineChartData}
                data={
                  lineChartData === 0
                    ? undefined
                    : showAllLineChartData
                    ? lineChartData
                    : [lineChartData]
                }
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

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      this.props.hideToolTip('Optimization')
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      children,
      theme,
      theme: { palette },
      toolTip,
    } = this.props

    const textColor: string = palette.getContrastText(palette.background.paper)

    const { loading, openWarning, warningMessage, isSystemError } = this.state

    return (
      <PTWrapper background={palette.background.default}>
        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioOptimizationSteps}
          run={toolTip.portfolioOptimization}
          callback={this.handleJoyrideCallback}
          key={this.state.key}
          styles={{
            options: {
              backgroundColor: theme.palette.common.white,
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />
        <Content>
          {children}
          {loading && (
            <LoaderWrapper>
              <LoaderInnerWrapper>
                <Loading size={94} margin={'0 0 2rem 0'} />{' '}
                <TypographyWithCustomColor textColor={textColor} variant="h6">
                  Optimizing portfolio...
                </TypographyWithCustomColor>
                <TypographyWithCustomColor
                  style={{ marginTop: '2rem' }}
                  textColor={textColor}
                  variant="h6"
                >
                  We are working on improving the speed of this model
                </TypographyWithCustomColor>
              </LoaderInnerWrapper>
            </LoaderWrapper>
          )}
          <ContentInner loading={loading}>
            {this.renderInput()}
            <MainArea background={palette.background.paper}>
              {this.renderCharts()}
            </MainArea>
          </ContentInner>

          <Dialog
            id="dialogOptimization"
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
                id="okButtonDialog"
                autoFocus={true}
              >
                ok
              </Button>
              {isSystemError && (
                <Button
                  onClick={() => {
                    this.openLink(config.bugLink)
                  }}
                  size="small"
                  style={{ margin: '0.5rem 1rem' }}
                >
                  Report bug
                </Button>
              )}
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
  toolTip: store.user.toolTip,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
  hideToolTip: (tab: string) => dispatch(Useractions.hideToolTip(tab)),
})
const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Optimization)

export default compose()(storeComponent)
