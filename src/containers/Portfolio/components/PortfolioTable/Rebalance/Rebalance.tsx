import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Grow,
} from '@material-ui/core'
import moment from 'moment'

import { Container as Content } from '../Industry/Industry.styles'
import { systemError } from '@utils/errorsConfig'
import QueryRenderer from '@components/QueryRenderer'
import { BarChart } from '@storybook-components/index'
import {
  IProps,
  IState,
  IRow,
  IShapeOfRebalancePortfolioRow,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'
import { mockTableData } from '@containers/Portfolio/components/PortfolioTable/Rebalance/mocks'
import { cloneArrayElementsOneLevelDeep } from '@utils/PortfolioTableUtils'
import { combineToBarChart } from './mocks'
import {
  updateRebalanceMutation,
  getMyPortfolioAndRebalanceQuery,
} from '@containers/Portfolio/api'
import RebalancedPortfolioTable from './RebalancedPortfolioTable/RebalancedPortfolioTable'
import * as UTILS from '@utils/PortfolioRebalanceUtils'
import { portfolioRebalanceSteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'

import {
  ChartWrapper,
  ChartContainer,
  Chart,
  Container,
  BtnsWrapper,
} from './Rebalance.styles'
import withTheme from '@material-ui/core/styles/withTheme'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'
import RebalanceMoneyButtons from './RebalancedPortfolioTable/RebalanceMoneyButtons/RebalanceMoneyButtons'
import config from '@utils/linkConfig'
import CardHeader from '@components/CardHeader'

// TODO: Remove quantity
// TODO: Fix types for snapshots changes

class Rebalance extends React.Component<IProps, IState> {
  state: IState = {
    selectedActive: [],
    areAllActiveChecked: false,
    rows: [],
    staticRows: [],
    savedRows: [],
    staticRowsMap: new Map(),
    addMoneyInputValue: 0,
    isEditModeEnabled: false,
    undistributedMoney: '0',
    undistributedMoneySaved: '0',
    totalRows: '0',
    totalStaticRows: '0',
    totalSavedRows: '0',
    totalTableRows: '0',
    totalTableStaticRows: '0',
    totalTableSavedRows: '0',
    totalSnapshotRows: '0',
    isPercentSumGood: true,
    totalPercents: 0,
    leftBar: '#fff',
    rightBar: '#4ed8da',
    run: true,
    key: 0,
    loading: false,
    openWarning: false,
    isSystemError: false,
    warningMessage: '',
    timestampSnapshot: moment(),
    isSaveError: false,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction)

    const { isShownMocks, data } = this.props
    this.combineRebalanceData(isShownMocks, data.myPortfolios[0])
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { isShownMocks, data } = nextProps

    this.combineRebalanceData(isShownMocks, data.myPortfolios[0])
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction)
  }

  combineRebalanceData = (
    isShownMocks: boolean,
    getMyPortfolioAndRebalanceQuery
  ) => {
    const userHasRebalancePortfolio =
      getMyPortfolioAndRebalanceQuery &&
      getMyPortfolioAndRebalanceQuery.myRebalance &&
      getMyPortfolioAndRebalanceQuery.myRebalance.assets &&
      getMyPortfolioAndRebalanceQuery.myRebalance.assets.length > 0

    const userHasPortfolio =
      getMyPortfolioAndRebalanceQuery &&
      getMyPortfolioAndRebalanceQuery.portfolioAssets &&
      getMyPortfolioAndRebalanceQuery.portfolioAssets.length > 0

    let newTableRebalancedPortfolioData: IRow[] = []
    let newTableCurrentPortfolioData: IRow[] = []

    if (userHasRebalancePortfolio && userHasPortfolio) {
      this.setState({
        timestampSnapshot: moment.unix(
          getMyPortfolioAndRebalanceQuery.myRebalance.timestampSnapshot
        ),
      })

      newTableCurrentPortfolioData = getMyPortfolioAndRebalanceQuery.portfolioAssets!.map(
        (el, i: number) => ({
          _id: el._id,
          id: i,
          exchange: el.where,
          symbol: el.coin,
          price: (parseFloat(el.price) * el.quantity).toFixed(2),
          portfolioPerc: null,
          priceSnapshot: parseFloat((parseFloat(el.price) * el.quantity).toFixed(2)),
          percentSnapshot: null,
        })
      )

      newTableRebalancedPortfolioData = getMyPortfolioAndRebalanceQuery.myRebalance.assets!.map(
        (el: IShapeOfRebalancePortfolioRow, i: number) => {
          return {
            _id: el._id,
            id: i,
            exchange: el.exchange,
            symbol: el.coin,
            portfolioPerc: null,
            price: parseFloat(el.amount.$numberDecimal).toFixed(2),
            deltaPrice: el.diff.$numberDecimal,
            isCustomAsset: el.isCustomAsset,
            priceSnapshot: el.priceSnapshot,
            percentSnapshot: el.percentSnapshot,
          }
        }
      )

      const newAssetsData = newTableCurrentPortfolioData.filter(
        (currentPortfolioAsset: IRow) =>
          !newTableRebalancedPortfolioData.some(
            (rebalancedPortfolioAsset) =>
              currentPortfolioAsset._id === rebalancedPortfolioAsset._id
          )
      )
      const isCurrentPortfolioDataHaveMoreCoinsThanRebalanced =
        newAssetsData.length

      newTableRebalancedPortfolioData = isCurrentPortfolioDataHaveMoreCoinsThanRebalanced
        ? newTableRebalancedPortfolioData.concat(newAssetsData)
        : newTableRebalancedPortfolioData
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      this.setState({ timestampSnapshot: moment() })

      newTableCurrentPortfolioData = getMyPortfolioAndRebalanceQuery.portfolioAssets!.map(
        (el, i: number) => ({
          _id: el._id,
          id: i,
          exchange: el.where,
          symbol: el.coin,
          price: (parseFloat(el.price) * el.quantity).toFixed(2),
          portfolioPerc: null,
          quantity: el.quantity,
          priceSnapshot: parseFloat(
            (parseFloat(el.price) * el.quantity).toFixed(2)
          ),
          percentSnapshot: null,
        })
      )
    }

    const composeWithMocksCurrentPortfolio = isShownMocks
      ? [...newTableCurrentPortfolioData, ...mockTableData]
      : newTableCurrentPortfolioData

    const composeWithMocksRebalancedPortfolio = isShownMocks
      ? [...newTableRebalancedPortfolioData, ...mockTableData]
      : newTableRebalancedPortfolioData

    if (userHasRebalancePortfolio) {
      this.setTableData(
        composeWithMocksCurrentPortfolio,
        composeWithMocksRebalancedPortfolio
      )
    } else {
      this.setTableData(
        composeWithMocksCurrentPortfolio,
        composeWithMocksCurrentPortfolio
      )
    }
  }

  setTableData = (
    tableDataCurrentPortfolio: IRow[],
    tableDataRebalancedPortfolio: IRow[]
  ) => {
    const { undistributedMoney } = this.state
    const rows = cloneArrayElementsOneLevelDeep(tableDataRebalancedPortfolio)
    const staticRows = cloneArrayElementsOneLevelDeep(tableDataCurrentPortfolio)
    const savedRows = cloneArrayElementsOneLevelDeep(
      tableDataRebalancedPortfolio
    )

    this.calculateAllTotals(staticRows, rows, savedRows, undistributedMoney)
  }

  calculateAllTotals = (
    staticRows: IRow[],
    rows: IRow[],
    savedRows: IRow[],
    undistributedMoney: string
  ) => {
    const totalStaticRows = UTILS.calculateTotal(staticRows, '0')
    const totalRows = UTILS.calculateTotal(rows, undistributedMoney)
    const totalSavedRows = UTILS.calculateTotal(savedRows, undistributedMoney)
    const totalTableStaticRows = UTILS.calculateTableTotal(staticRows)
    const totalTableRows = UTILS.calculateTableTotal(rows)
    const totalTableSavedRows = UTILS.calculateTableTotal(savedRows)
    const totalSnapshotRows = UTILS.calculateTableTotal(rows, 'priceSnapshot')

    this.calculateAllPercents(
      staticRows,
      totalStaticRows,
      rows,
      totalRows,
      savedRows,
      totalSavedRows,
      totalSnapshotRows
    )

    this.setState({
      totalStaticRows,
      totalRows,
      totalSavedRows,
      totalTableStaticRows,
      totalTableRows,
      totalTableSavedRows,
      totalSnapshotRows,
    })
  }

  calculateAllPercents = (
    staticRows: IRow[],
    totalStaticRows: string,
    rows: IRow[],
    totalRows: string,
    savedRows: IRow[],
    totalSavedRows: string,
    totalSnapshotRows: string
  ) => {
    const rowsWithPercentage = UTILS.calculatePriceDifference(
      UTILS.calculatePercents(
        UTILS.calculatePercents(rows, totalRows),
        totalSnapshotRows,
        'priceSnapshot',
        'percentSnapshot'
      )
    )

    const staticRowsWithPercentage = UTILS.calculatePriceDifference(
      UTILS.calculatePercents(staticRows, totalStaticRows)
    )

    const staticRowsMap = staticRowsWithPercentage.reduce((accMap, el) => {
      accMap.set(el._id, el)
      return accMap
    }, new Map())

    this.setState({
      staticRowsMap,
      staticRows: staticRowsWithPercentage,
      rows: rowsWithPercentage,
      totalPercents: UTILS.calculateTotalPercents(rowsWithPercentage),
      savedRows: UTILS.calculatePriceDifference(
        UTILS.calculatePercents(
          UTILS.calculatePercents(savedRows, totalSavedRows),
          totalSnapshotRows,
          'priceSnapshot',
          'percentSnapshot'
        )
      ),
    })
  }

  onSaveClick = (deleteEmptyAssets?: boolean | object) => {
    const {
      rows,
      totalRows,
      isPercentSumGood,
      undistributedMoney,
    } = this.state

    const isArgumentAnObject = deleteEmptyAssets === Object(deleteEmptyAssets)

    if (!isPercentSumGood) {
      return
    }
    if (+undistributedMoney < 0) {
      return
    }
    if (UTILS.checkForEmptyNamesInAssets(rows) && isArgumentAnObject) {
      this.showWarning('Your assets has empty names in columns Exchange and Coin, what we should do with them?', false, true)
      return
    }

    const rowsAfterProcessing = deleteEmptyAssets === true ? UTILS.deleteEmptyAssets(rows) : rows
    const newRowsWithPriceDiff = UTILS.calculatePriceDifference(rowsAfterProcessing)

    this.setState(
      {
        savedRows: cloneArrayElementsOneLevelDeep(newRowsWithPriceDiff),
        rows: newRowsWithPriceDiff,
        totalSavedRows: totalRows,
        isEditModeEnabled: false,
        selectedActive: [],
        areAllActiveChecked: false,
        undistributedMoneySaved: undistributedMoney,
      },
      () => {
        this.updateServerDataOnSave()
      }
    )
  }

  updateServerDataOnSave = async () => {
    const { updateRebalanceMutationQuery, refetch } = this.props
    const { rows, totalRows, timestampSnapshot } = this.state

    const combinedRowsData = rows.map((el: IRow) => ({
      _id: el._id,
      exchange: el.exchange,
      coin: el.symbol,
      // amount: el.isCustomAsset
      //   ? el.price.toString()
      //   : staticRowsMap.get(el._id).price !== el.price
      //   ? (el.price / el.currentPrice).toString()
      //   : el.quantity.toString(),
      amount: el.price.toString(),
      percent: el.portfolioPerc.toString(),
      diff: el.deltaPrice.toString(),
      isCustomAsset: el.isCustomAsset,
      priceSnapshot: el.priceSnapshot,
      percentSnapshot: el.percentSnapshot,
    }))

    const variablesForMutation = {
      input: {
        timestampSnapshot: timestampSnapshot.unix(),
        total: totalRows.toString(),
        assets: {
          input: combinedRowsData,
        },
      },
    }

    try {
      this.setState({ loading: true })

      const backendResult = await updateRebalanceMutationQuery({
        variables: variablesForMutation,
      })
      if (backendResult.data.updateRebalance === null) {
        this.showWarning(systemError, true)
      }
      refetch()
        .then(() => {
          this.setState({ loading: false })
        })
        .catch(() => {
          this.setState({ loading: false })
          this.showWarning(systemError, true)
        })
    } catch (error) {
      this.setState({ loading: false })
      this.showWarning(systemError, true)
      console.log(error)
    }
  }

  onReset = () => {
    const { rows, totalSnapshotRows } = this.state

    const clonedStaticRows = cloneArrayElementsOneLevelDeep(
      this.state.staticRows
    )
    // TODO: BUT are we are we really sure that it will the same for multiaccounts?

    const clonedStaticRowsWithSnapshotsData = clonedStaticRows.map((el, i) => ({
      ...el,
      priceSnapshot: rows[i].priceSnapshot,
      percentSnapshot: rows[i].percentSnapshot,
      price: rows[i].priceSnapshot,
      portfolioPerc: rows[i].percentSnapshot,
    }))

    // TODO: Are we sure that the total would be the same for us in this case?
    this.setState({
      rows: clonedStaticRowsWithSnapshotsData,
      totalRows: totalSnapshotRows,
      totalTableRows: totalSnapshotRows,
      undistributedMoney: '0',
      selectedActive: [],
      areAllActiveChecked: false,
      isPercentSumGood: UTILS.checkPercentSum(
        clonedStaticRowsWithSnapshotsData
      ),
      totalPercents: UTILS.calculateTotalPercents(
        clonedStaticRowsWithSnapshotsData
      ),
    })
  }

  onEditModeEnable = () => {
    if (this.state.isEditModeEnabled) {
      const clonedSavedRows = cloneArrayElementsOneLevelDeep(
        this.state.savedRows
      )

      this.setState((prevState: IState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
        totalRows: this.state.totalSavedRows,
        totalTableRows: this.state.totalTableSavedRows,
        rows: clonedSavedRows,
        selectedActive: [],
        areAllActiveChecked: false,
        undistributedMoney: this.state.undistributedMoneySaved,
        isPercentSumGood: UTILS.checkEqualsOfTwoTotals(this.state.totalTableSavedRows, this.state.totalSnapshotRows),
        totalPercents: UTILS.calculateTotalPercents(clonedSavedRows),
      }))
    } else {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
      }))
    }
  }

  updateState = (obj: object) => {
    this.setState(obj)
  }

  escFunction = (e: KeyboardEvent): void => {
    if (e.keyCode === 27 && this.state.isEditModeEnabled) {
      this.onEditModeEnable()
    }
  }

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      this.props.hideToolTip('Rebalance')
    }
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  showWarning = (message: string, isSystemError = false, isSaveError = false) => {
    this.setState({ isSystemError, isSaveError, openWarning: true, warningMessage: message })
  }

  hideWarning = () => {
    this.setState({ openWarning: false })
  }

  openLink = (link: string = '') => {
    this.hideWarning()
    window.open(link, 'CCAI Feedback')
  }

  render() {
    const {
      children,
      isUSDCurrently,
      theme,
      theme: { palette },
      tab,
    } = this.props
    const {
      selectedActive,
      areAllActiveChecked,
      totalStaticRows,
      totalRows,
      isEditModeEnabled,
      undistributedMoney,
      isPercentSumGood,
      totalPercents,
      totalTableRows,
      totalSnapshotRows,
      rows,
      staticRows,
      addMoneyInputValue,
      leftBar,
      rightBar,
      loading,
      staticRowsMap,
      openWarning,
      isSystemError,
      warningMessage,
      timestampSnapshot,
      isSaveError,
    } = this.state

    const secondary = palette.secondary.main
    const red = palette.red.main
    const green = palette.green.main
    const fontFamily = theme.typography.fontFamily
    const saveButtonColor =
      isPercentSumGood && +undistributedMoney >= 0 ? green : red

    const tableDataHasData = !staticRows.length || !rows.length

    return (
      <>
        <EmptyTablePlaceholder isEmpty={tableDataHasData}>
          {children}
          <Content container spacing={16}>
            <Container item md={12} isEditModeEnabled={isEditModeEnabled}>
              <RebalancedPortfolioTable
                {...{
                  isEditModeEnabled,
                  staticRows,
                  staticRowsMap,
                  totalStaticRows,
                  rows,
                  selectedActive,
                  areAllActiveChecked,
                  totalRows,
                  totalPercents,
                  totalTableRows,
                  isPercentSumGood,
                  undistributedMoney,
                  isUSDCurrently,
                  addMoneyInputValue,
                  theme,
                  loading,
                  red,
                  saveButtonColor,
                  secondary,
                  fontFamily,
                  totalSnapshotRows,
                  timestampSnapshot,
                }}
                onSaveClick={this.onSaveClick}
                onReset={this.onReset}
                onEditModeEnable={this.onEditModeEnable}
                updateState={this.updateState}
              />
            </Container>
            {/*don't delete this it's for future*/}
            {/*<Grow*/}
            {/*timeout={{*/}
            {/*enter: theme.transitions.duration.enteringScreen,*/}
            {/*exit: 0,*/}
            {/*}}*/}
            {/*in={isEditModeEnabled}*/}
            {/*mountOnEnter*/}
            {/*unmountOnExit*/}
            {/*>*/}
            {/*<BtnsWrapper*/}
            {/*container*/}
            {/*justify="center"*/}
            {/*alignItems="center"*/}
            {/*item*/}
            {/*md={4}*/}
            {/*>*/}
            {/*<RebalanceMoneyButtons*/}
            {/*{...{*/}
            {/*isEditModeEnabled,*/}
            {/*addMoneyInputValue,*/}
            {/*undistributedMoney,*/}
            {/*onEditModeEnable,*/}
            {/*onReset,*/}
            {/*onSaveClick,*/}
            {/*saveButtonColor,*/}
            {/*textColor,*/}
            {/*staticRows,*/}
            {/*rows,*/}
            {/*selectedActive,*/}
            {/*updateState,*/}
            {/*fontFamily,*/}
            {/*secondary,*/}
            {/*red,*/}
            {/*green,*/}
            {/*}}*/}
            {/*/>*/}
            {/*</BtnsWrapper>*/}
            {/*</Grow>*/}

            <ChartWrapper
              item
              md={12}
              isEditModeEnabled={isEditModeEnabled}
              className="PortfolioDistributionChart"
            >
              <ChartContainer background={palette.background.paper}>
                <CardHeader title={`Portfolio Distribution`} />

                <Chart>
                  <Grow
                    in={Boolean(
                      staticRows &&
                        staticRows[0] &&
                        staticRows[0].portfolioPerc &&
                        tab === 'rebalance'
                    )}
                    mountOnEnter
                    unmountOnExit
                  >
                    <BarChart
                      bottomMargin={75}
                      theme={theme}
                      hideDashForToolTip={true}
                      xAxisVertical={true}
                      alwaysShowLegend={true}
                      charts={[
                        {
                          data: combineToBarChart(staticRows),
                          color: leftBar,
                          title: 'Current',
                        },
                        {
                          data: combineToBarChart(rows),
                          color: rightBar,
                          title: 'Rebalanced',
                        },
                      ]}
                    />
                  </Grow>
                </Chart>
              </ChartContainer>
            </ChartWrapper>

            {/* end of a grid */}
            <>
              <Dialog
                fullScreen={false}
                open={openWarning}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  {warningMessage}
                </DialogTitle>
                <DialogActions>
                  {isSaveError && (
                    <>
                      <Button
                        onClick={() => {
                          this.hideWarning()
                          this.onSaveClick()
                        }}
                        color="secondary"
                        autoFocus={true}
                      >
                        Save anyway
                      </Button>
                        <Button
                          onClick={() => {
                            this.hideWarning()
                            this.onSaveClick(true)
                          }}
                          size="small"
                          style={{ margin: '0.5rem 1rem' }}
                        >
                          Delete empty and save
                      </Button>
                    </>
                  )}
                  {isSystemError && (
                    <>
                  <Button
                    onClick={this.hideWarning}
                    color="secondary"
                    autoFocus={true}
                  >
                    ok
                  </Button>
                    <Button
                      onClick={() => {
                        this.openLink(config.bugLink)
                      }}
                      size="small"
                      style={{ margin: '0.5rem 1rem' }}
                    >
                      Report bug
                    </Button>
                    </>
                  )}
                </DialogActions>
              </Dialog>
              <Joyride
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                steps={portfolioRebalanceSteps}
                run={
                  this.props.toolTip.portfolioRebalance && tab === 'rebalance'
                }
                callback={this.handleJoyrideCallback}
                key={this.state.key}
                styles={{
                  options: {
                    backgroundColor: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                    primaryColor: theme.palette.secondary.main,
                    textColor: theme.palette.primary.main,
                  },
                  tooltip: {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.fontSize,
                  },
                }}
              />
            </>
          </Content>
        </EmptyTablePlaceholder>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  toolTip: store.user.toolTip,
})
const RebalanceContainer = (props) => (
  <QueryRenderer
    fetchPolicy="network-only"
    component={Rebalance}
    query={getMyPortfolioAndRebalanceQuery}
    variables={{ baseCoin: 'USDT' }}
    {...props}
  />
)

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(updateRebalanceMutation, {
    name: 'updateRebalanceMutationQuery',
  })
)(RebalanceContainer)
