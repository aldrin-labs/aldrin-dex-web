import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Joyride from 'react-joyride'

import QueryRenderer from '@components/QueryRenderer'
import BarChart from '@components/BarChart/BarChart'
import {
  IProps,
  IState,
  IRow,
  IShapeOfRebalancePortfolioRow,
  IShapeOfCurrentPortolioRow,
  IGetMyPortfolioQuery,
  IGetMyRebalanceQuery,
  ICurrentSort,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'
import { mockTableData } from '@containers/Portfolio/components/PortfolioTable/Rebalance/mocks'
import {
  cloneArrayElementsOneLevelDeep,
  onSortTableFull,
} from '@utils/PortfolioTableUtils'
import { calcPriceForRebalancedPortfolio } from '@utils/PortfolioRebalanceUtils'
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
  Content,
  ChartWrapper,
  ChartContainer,
  Chart,
  Container,
  BtnsWrapper,
  InnerChartContainer,
  StyledCardHeader,
} from './Rebalance.styles'
import ChartColorPicker from './ChartColorPicker/ChartColorPicker'
import withTheme from '@material-ui/core/styles/withTheme'
import { PTWrapper } from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'
import RebalanceActionButtons from './RebalancedPortfolioTable/RebalanceActionButtons/RebalanceActionButtons'
import RebalanceMoneyButtons from './RebalancedPortfolioTable/RebalanceMoneyButtons/RebalanceMoneyButtons'
import CardHeader from '@components/CardHeader'

class Rebalance extends React.Component<IProps, IState> {
  state: IState = {
    selectedActive: [],
    areAllActiveChecked: false,
    rows: [],
    staticRows: [],
    savedRows: [],
    addMoneyInputValue: 0,
    currentSortForStatic: null,
    currentSortForDynamic: null,
    isEditModeEnabled: false,
    undistributedMoney: '0',
    undistributedMoneySaved: '0',
    totalRows: '0',
    totalStaticRows: '0',
    totalSavedRows: '0',
    totalTableRows: '0',
    totalTableStaticRows: '0',
    totalTableSavedRows: '0',
    isPercentSumGood: true,
    totalPercents: 0,
    leftBar: '#fff',
    rightBar: '#4ed8da',
    run: true,
    key: 0,
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

    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []

    if (userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolioAndRebalanceQuery.portfolioAssets!.map(
        (el, i: number) => ({
          id: i,
          exchange: el.where,
          symbol: el.coin,
          price: (parseFloat(el.price) * el.quantity).toFixed(2),
          portfolioPerc: null,
          currentPrice: el.price,
        })
      )

      newTableRebalancedPortfolioData = getMyPortfolioAndRebalanceQuery.myRebalance.assets!.map(
        (el: IShapeOfRebalancePortfolioRow, i: number) => {
          const { price, currentPrice } = calcPriceForRebalancedPortfolio(
            el,
            getMyPortfolioAndRebalanceQuery.portfolioAssets
          )

          return {
            price,
            currentPrice,
            id: i,
            exchange: el._id.exchange,
            symbol: el._id.coin,
            portfolioPerc: null,
            deltaPrice: el.diff.$numberDecimal,
          }
        }
      )
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolioAndRebalanceQuery.portfolioAssets!.map(
        (el, i: number) => ({
          id: i,
          exchange: el.where,
          symbol: el.coin,
          price: (parseFloat(el.price) * el.quantity).toFixed(2),
          portfolioPerc: null,
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

    this.calculateAllPercents(
      staticRows,
      totalStaticRows,
      rows,
      totalRows,
      savedRows,
      totalSavedRows
    )

    this.setState({
      totalStaticRows,
      totalRows,
      totalSavedRows,
      totalTableStaticRows,
      totalTableRows,
      totalTableSavedRows,
    })
  }

  calculateAllPercents = (
    staticRows: IRow[],
    totalStaticRows: string,
    rows: IRow[],
    totalRows: string,
    savedRows: IRow[],
    totalSavedRows: string
  ) => {
    const rowsWithPercentage = UTILS.calculatePercents(
      rows,
      totalRows,
      staticRows
    )
    this.setState({
      staticRows: UTILS.calculatePercents(
        staticRows,
        totalStaticRows,
        staticRows
      ),
      rows: rowsWithPercentage,
      totalPercents: UTILS.calculateTotalPercents(rowsWithPercentage),
      savedRows: UTILS.calculatePercents(savedRows, totalSavedRows, staticRows),
    })
  }

  onSaveClick = () => {
    const {
      rows,
      totalRows,
      isPercentSumGood,
      undistributedMoney,
      staticRows,
    } = this.state

    if (!isPercentSumGood) {
      return
    }
    if (+undistributedMoney < 0) {
      return
    }

    // if something will broke just uncomment these lines
    // const rowsWithNewPrice = UTILS.calculatePriceByPercents(rows, totalRows)
    // const newRowsWithPriceDiff = UTILS.calculatePriceDifference(
    //   rowsWithNewPrice,
    //   staticRows
    // )
    const newRowsWithPriceDiff = UTILS.calculatePriceDifference(
      rows,
      staticRows
    )

    const newRows = UTILS.removeEditableModeInCoins(newRowsWithPriceDiff)

    this.setState(
      {
        savedRows: cloneArrayElementsOneLevelDeep(newRows),
        rows: newRows,
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
    const { updateRebalanceMutationQuery } = this.props
    const { rows, totalRows } = this.state

    const combinedRowsData = rows.map((el: IRow) => ({
      _id: {
        exchange: el.exchange,
        coin: el.symbol,
      },
      amount: el.currentPrice
        ? (el.price / el.currentPrice).toString()
        : el.price.toString(),
      percent: el.portfolioPerc.toString(),
      diff: el.deltaPrice.toString(),
    }))

    const variablesForMutation = {
      input: {
        total: totalRows.toString(),
        assets: {
          input: combinedRowsData,
        },
      },
    }

    try {
      await updateRebalanceMutationQuery({ variables: variablesForMutation })
    } catch (error) {
      console.log(error)
    }
  }

  onReset = () => {
    const clonedStaticRows = cloneArrayElementsOneLevelDeep(
      this.state.staticRows
    )

    this.setState({
      rows: clonedStaticRows,
      totalRows: this.state.totalStaticRows,
      totalTableRows: this.state.totalTableStaticRows,
      undistributedMoney: '0',
      selectedActive: [],
      areAllActiveChecked: false,
      isPercentSumGood: UTILS.checkPercentSum(clonedStaticRows),
      totalPercents: UTILS.calculateTotalPercents(clonedStaticRows),
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
        isPercentSumGood: UTILS.checkPercentSum(clonedSavedRows),
        totalPercents: UTILS.calculateTotalPercents(clonedSavedRows),
      }))
    } else {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
      }))
    }
  }

  onSortTable = (key: string, tableForSort: string) => {
    if (!this.state.staticRows && tableForSort === 'currentSortForStatic') {
      return
    }
    if (!this.state.rows && tableForSort === 'currentSortForDynamic') {
      return
    }

    const arrayOfStringHeadings = ['exchange', 'symbol']
    const currentSort: ICurrentSort = (this.state as any)[tableForSort]
    const rowsForSortText =
      tableForSort === 'currentSortForStatic' ? 'staticRows' : 'rows'
    const currentRowsForSort = this.state[rowsForSortText]

    const {
      newData,
      newCurrentSort,
    }: {
      newData: IRow[]
      newCurrentSort: ICurrentSort | null
    } = onSortTableFull(
      key,
      currentRowsForSort,
      currentSort,
      arrayOfStringHeadings
    )

    this.setState({
      [rowsForSortText]: newData,
      [tableForSort]: newCurrentSort,
    })
  }

  onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
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
      data.action === 'close'
      || data.action === 'skip'
      || data.status === 'finished'
    ) this.props.hideToolTip('Rebalance')
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({key: oldKey + 1})
    }
  }

  render() {
    const {
      children,
      isUSDCurrently,
      baseCoin,
      theme,
      theme: { palette },
    } = this.props
    const {
      selectedActive,
      areAllActiveChecked,
      currentSortForStatic,
      currentSortForDynamic,
      totalStaticRows,
      totalRows,
      isEditModeEnabled,
      undistributedMoney,
      isPercentSumGood,
      totalPercents,
      totalTableRows,
      rows,
      staticRows,
      addMoneyInputValue,
      leftBar,
      rightBar,
    } = this.state

    const { onSaveClick, onEditModeEnable, onReset, updateState } = this

    const secondary = palette.secondary.main
    const red = palette.red.main
    const green = palette.green.main
    const textColor: string = palette.getContrastText(palette.background.paper)
    const fontFamily: string = theme.typography.fontFamily
    const saveButtonColor =
      isPercentSumGood && +undistributedMoney >= 0 ? green : red

    const tableDataHasData = !staticRows.length || !rows.length

    return (
      <div>
          <Joyride
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            steps={portfolioRebalanceSteps}
            run={this.props.toolTip.portfolioRebalance}
            callback={this.handleJoyrideCallback}
            key={this.state.key}
          />
        <EmptyTablePlaceholder isEmpty={tableDataHasData}>
          <PTWrapper tableData={true}>
            {children}
            <Content>
              <Container isEditModeEnabled={isEditModeEnabled}>
                <RebalancedPortfolioTable
                  {...{
                    isEditModeEnabled,
                    staticRows,
                    totalStaticRows,
                    rows,
                    currentSortForDynamic,
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
                  }}
                  onSortTable={this.onSortTable}
                  onSaveClick={this.onSaveClick}
                  onReset={this.onReset}
                  onEditModeEnable={this.onEditModeEnable}
                  updateState={this.updateState}
                />
                <BtnsWrapper>
                  <RebalanceActionButtons
                    {...{
                      isEditModeEnabled,
                      saveButtonColor,
                      onSaveClick,
                      onEditModeEnable,
                      onReset,
                      textColor,
                      secondary,
                      red,
                      green,
                    }}
                  />
                  <RebalanceMoneyButtons
                    {...{
                      isEditModeEnabled,
                      addMoneyInputValue,
                      undistributedMoney,
                      staticRows,
                      rows,
                      selectedActive,
                      updateState,
                      textColor,
                      fontFamily,
                      secondary,
                      red,
                      green,
                    }}
                  />
                </BtnsWrapper>
              </Container>
              <ChartWrapper isEditModeEnabled={isEditModeEnabled} className="PortfolioDistributionChart">
                <ChartContainer
                  elevation={10}
                  background={palette.background.paper}
                >
                  <StyledCardHeader title={`Portfolio Distribution`}/>
                  <InnerChartContainer>
                    <Chart background={palette.background.default}>
                      {staticRows &&
                        staticRows[0] &&
                        staticRows[0].portfolioPerc && (
                          <BarChart
                            height={350}
                            hideDashForToolTip={true}
                            xAxisVertical={true}
                            alwaysShowLegend={true}
                            charts={[
                              {
                                data: combineToBarChart(staticRows),
                                color: this.state.leftBar,
                                title: 'Current',
                              },
                              {
                                data: combineToBarChart(rows),
                                color: this.state.rightBar,
                                title: 'Rebalanced',
                              },
                            ]}
                          />
                        )}
                    </Chart>
                  </InnerChartContainer>
                </ChartContainer>
              </ChartWrapper>
            </Content>
          </PTWrapper>
        </EmptyTablePlaceholder>
      </div>
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
  connect(mapStateToProps, mapDispatchToProps),
  graphql(updateRebalanceMutation, {
    name: 'updateRebalanceMutationQuery',
    options: {
      refetchQueries: [
        {
          query: getMyPortfolioAndRebalanceQuery,
          variables: { baseCoin: 'USDT' },
        },
      ],
    },
  })
)(RebalanceContainer)
