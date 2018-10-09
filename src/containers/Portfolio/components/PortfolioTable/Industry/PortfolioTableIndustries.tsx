import * as React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { compose } from 'recompose'
import ArrowDownward from '@material-ui/icons/ArrowDownward'

import Table from '@components/Tables/WithCheckboxesAndSummary'
import {
  roundPercentage,
  calcAllSumOfPortfolioAsset,
} from '@utils/PortfolioTableUtils'
import LineChart from '@components/LineChart'
import {
  MOCKS,
  genMocks,
  inds,
} from '@containers/Portfolio/components/PortfolioTable/Industry/mocks'
import {
  IPortfolio,
  Args,
} from '@containers/Portfolio/components/PortfolioTable/types'
import { IndProps } from '@containers/Portfolio/interfaces'
import {
  customAquaScrollBar,
  Checkbox,
  Label,
  Span,
  Icon,
} from '@styles/cssUtils'
import { onSortStrings, roundAndFormatNumber } from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import QueryRenderer from '@components/QueryRenderer'
import PieChartQuery from '@containers/Portfolio/components/PortfolioTable/Industry/PieChartQuery'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { PTWrapper } from '../Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import { withTheme, Paper, Grid, Card } from '@material-ui/core'

const tableHeadings = [
  { name: 'Coin', value: 'symbol' },
  { name: 'Industry', value: 'industry' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'Portfolio', value: 'portfolioPerf', additionName: 'performance' },
  {
    name: 'Industry: 1W',
    value: 'industryPerf1Week',
    additionName: 'performance',
  },
  {
    name: '1M',
    value: 'industryPerf1Month',
    additionName: 'performance',
  },
  {
    name: '3M',
    value: 'industryPerf3Months',
    additionName: 'performance',
  },
  {
    name: '1Y',
    value: 'industryPerf1Year',
    additionName: 'performance',
  },
]

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  industry: '',
  portfolioPerc: 0,
  portfolioPerf: 0,
  industryPerf1Week: 0,
  industryPerf1Month: 0,
  industryPerf3Months: 0,
  industryPerf1Year: 0,
}

class PortfolioTableIndustries extends React.Component<IndProps, IState> {
  state: IState = {
    activeKeys: null,
    portfolio: null,
    industryData: null,
    currentSort: null,
    selectedRows: null,
    selectedSum: defaultSelectedSum,
    activeLegend: null,
    showChart: 'chart',
  }

  componentWillMount() {
    const lineChartMocks = genMocks(31, inds)
    this.setState({ lineChartMocks })
  }

  componentDidMount() {
    const {
      data: { getProfile: data },
      isShownMocks,
      switchToUsd,
    } = this.props
    switchToUsd()
    if (!data && isShownMocks) {
      this.setState({ portfolio: { assets: MOCKS } }, () =>
        this.combineIndustryData({ assets: MOCKS })
      )

      this.setState({ activeKeys: this.props.activeKeys })

      return
    } else if (!data) {
      return
    }
    const { portfolio } = data

    const composeWithMocks = isShownMocks
      ? {
          ...portfolio,
          assets: portfolio!.assets!.concat(MOCKS),
        }
      : portfolio

    this.setState({ portfolio: composeWithMocks }, () =>
      this.combineIndustryData(composeWithMocks)
    )

    this.setState({ activeKeys: this.props.activeKeys })
  }

  componentWillReceiveProps(nextProps: IndProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data.getProfile
      const { isShownMocks } = nextProps

      if (!portfolio || !portfolio.assets) {
        return
      }

      const composeWithMocks = isShownMocks
        ? {
            ...portfolio,
            assets: portfolio.assets.concat(MOCKS),
          }
        : portfolio

      this.setState({ portfolio: composeWithMocks })
      this.combineIndustryData(composeWithMocks)
    }

    if (nextProps.activeKeys) {
      this.setState({ activeKeys: nextProps.activeKeys }, () =>
        this.combineIndustryData(this.state.portfolio)
      )
    }

    if (nextProps.activeKeys && nextProps.activeKeys.length === 0) {
      this.setState({ selectedRows: null, selectedSum: defaultSelectedSum })
    }

    if (nextProps.isUSDCurrently !== this.props.isUSDCurrently) {
      const { portfolio } = this.state
      this.combineIndustryData(portfolio)
    }
  }

  toggleChart = () => {
    this.setState((prevState: IState) => ({
      showChart: prevState.showChart === 'line' ? 'chart' : 'line',
    }))
  }

  putDataInTable = () => {
    const { industryData } = this.state
    if (!industryData) return
    return {
      head: tableHeadings.map((heading, ind: number) => ({
        text: heading.name,
        number: ind === 0 || ind === 1 ? false : true,
      })),
      body: industryData.map((row) => {
        const {
          symbol,
          industry,
          portfolioPerc,
          portfolioPerf,
          industryPerf1Week,
          industryPerf1Month,
          industryPerf3Months,
          industryPerf1Year,
        } = row

        const res = [
          symbol,
          industry,
          +portfolioPerc,
          +portfolioPerf,
          +industryPerf1Week,
          +industryPerf1Month,
          +industryPerf3Months,
          +industryPerf1Year,
        ]

        return res
      }),
    }
  }

  combineIndustryData = (portfolio?: IPortfolio) => {
    const { isUSDCurrently } = this.props
    const { activeKeys } = this.state
    if (!portfolio || !portfolio.assets || !activeKeys) {
      return
    }
    const {
      assets,
      portfolioPerformance = [{ usd: '', btc: '', coin: '' }],
    } = portfolio

    const allSums = calcAllSumOfPortfolioAsset(assets, isUSDCurrently)

    const industryData = assets
      .map((row, i) => {
        const {
          asset = { symbol: '', priceBTC: '', priceUSD: '', industry: '' },
          key = { name: '' },
          exchange = { name: '' },
          quantity = 0,
        } = row || {}
        if (activeKeys.indexOf(key!.name) === -1) {
          return null
        }
        const {
          symbol = '',
          priceUSD = '',
          priceBTC = '',
          industry: ind = '',
        } = asset || {}
        const { name = '' } = exchange
        const { name: industryName, performance } = ind || {
          name: '',
          performance: {
            usdWeek: 0,
            usdMonth: 0,
            usd3Months: 0,
            usdYear: 0,
            btcWeek: 0,
            btcMonth: 0,
            btc3Months: 0,
            btcYear: 0,
          },
        }
        const industryPerformance = isUSDCurrently
          ? {
              oneWeek: performance.usdWeek,
              oneMonth: performance.usdMonth,
              threeMonth: performance.usd3Months,
              oneYear: performance.usdYear,
            }
          : {
              oneWeek: performance.btcWeek,
              oneMonth: performance.btcMonth,
              threeMonth: performance.btc3Months,
              oneYear: performance.btcYear,
            }
        // TODO: HAVE TO BE REWORKED (because it's just fix for first row without data in btc asset)
        const isElementHavePerformance = portfolioPerformance.find(
          (element) => element.coin === symbol
        )
        const portfolioPerf = isElementHavePerformance
          ? isUSDCurrently
            ? isElementHavePerformance.usd
            : isElementHavePerformance.btc
          : null

        const mainPrice = isUSDCurrently ? priceUSD : priceBTC
        const currentPrice = mainPrice * quantity

        const col = {
          id: i,
          currency: name || '-',
          symbol,
          industry: industryName || '-',
          portfolioPerf:
            portfolioPerf !== null
              ? roundPercentage(parseFloat(portfolioPerf))
              : null,
          portfolioPerc: roundPercentage((currentPrice * 100) / allSums),
          industryPerf1Week:
            industryPerformance.oneWeek !== null
              ? roundPercentage(parseFloat(industryPerformance.oneWeek))
              : null,
          industryPerf1Month:
            industryPerformance.oneMonth !== null
              ? roundPercentage(parseFloat(industryPerformance.oneMonth))
              : null,
          industryPerf3Months:
            industryPerformance.threeMonth !== null
              ? roundPercentage(parseFloat(industryPerformance.threeMonth))
              : null,
          industryPerf1Year:
            industryPerformance.oneYear !== null
              ? roundPercentage(parseFloat(industryPerformance.oneYear))
              : null,
        }

        return col
      })
      .filter(Boolean)

    this.setState({ industryData }, () =>
      this.calculateSum(this.state.selectedRows)
    )
  }

  renderCheckbox = (idx: number) => {
    const { selectedRows } = this.state
    const isSelected = (selectedRows && selectedRows.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox
          type="checkbox"
          id={idx}
          defaultChecked={false}
          checked={isSelected}
        />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSortTable = (key: Args) => {
    const { industryData, currentSort } = this.state
    if (!industryData) {
      return
    }

    const stringKey =
      key === 'currency' || key === 'symbol' || key === 'industry'

    const newData = industryData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (stringKey) {
            return onSortStrings(b[key], a[key])
          }

          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (stringKey) {
            return onSortStrings(a[key], b[key])
          }

          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (stringKey) {
        return onSortStrings(a[key], b[key])
      }

      return a[key] - b[key]
    })

    this.setState({ industryData: newData })
  }

  onSelectBalance = (idx: number) => {
    const selectedRows =
      (this.state.selectedRows && this.state.selectedRows.slice()) || []

    const hasIndex = selectedRows.indexOf(idx)
    if (hasIndex !== -1) {
      selectedRows.splice(hasIndex, 1)
    } else {
      selectedRows.push(idx)
    }

    this.setState({ selectedRows }, () => this.calculateSum(selectedRows))
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { industryData } = this.state
    if (!selectedRows || !industryData) {
      this.setState({ selectedSum: defaultSelectedSum })

      return
    }

    const sum = industryData.filter((td, idx) => selectedRows.indexOf(idx) >= 0)
    const reducedSum = sum.reduce(
      (acc, val) => ({
        currency: val.currency,
        symbol: val.symbol,
        industry: val.industry,
        portfolioPerc: Number(acc.portfolioPerc) + Number(val.portfolioPerc),
        portfolioPerf: Number(acc.portfolioPerf) + Number(val.portfolioPerf),
        industryPerf1Week:
          Number(acc.industryPerf1Week) + Number(val.industryPerf1Week),
        industryPerf1Month:
          Number(acc.industryPerf1Month) + Number(val.industryPerf1Month),
        industryPerf3Months:
          Number(acc.industryPerf3Months) + Number(val.industryPerf3Months),
        industryPerf1Year:
          Number(acc.industryPerf1Year) + Number(val.industryPerf1Year),
      }),
      {
        currency: '',
        symbol: '',
        industry: '',
        portfolioPerc: 0,
        portfolioPerf: 0,
        industryPerf1Week: 0,
        industryPerf1Month: 0,
        industryPerf3Months: 0,
        industryPerf1Year: 0,
      }
    )
    const validateSum = this.onValidateSum(reducedSum)

    this.setState({ selectedSum: validateSum })
  }

  onValidateSum = (reducedSum: { [key: string]: string | number }) => {
    const { selectedRows, industryData } = this.state
    const { isUSDCurrently } = this.props

    if (!selectedRows || !industryData) {
      return defaultSelectedSum
    }

    let newReducedSum = {}
    // TODO: SHOULD BE REFACTORED below
    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" key="usd" />
    ) : (
      <Icon className="fa fa-btc" key="btc" />
    )
    // TODO: SHOULD BE REFACTORED above

    if (selectedRows.length === industryData.length) {
      newReducedSum = {
        ...reducedSum,
        currency: 'Total',
        symbol: '-',
        industry: '-',
        portfolioPerc: `100.00%`,
        portfolioPerf: `${reducedSum.portfolioPerf.toFixed(2)}%`,
        industryPerf1Week: `${reducedSum.industryPerf1Week.toFixed(2)}%`,
        industryPerf1Month: `${reducedSum.industryPerf1Month.toFixed(2)}%`,
        industryPerf3Months: `${reducedSum.industryPerf3Months.toFixed(2)}%`,
        industryPerf1Year: `${reducedSum.industryPerf1Year.toFixed(2)}%`,
      }
    } else if (selectedRows.length >= 1) {
      newReducedSum = {
        ...reducedSum,
        currency: 'Selected',
        symbol: '-',
        industry: '-',
        portfolioPerc: `${reducedSum.portfolioPerc.toFixed(2)}%`,
        portfolioPerf: `${reducedSum.portfolioPerf.toFixed(2)}%`,
        industryPerf1Week: `${reducedSum.industryPerf1Week.toFixed(2)}%`,
        industryPerf1Month: `${reducedSum.industryPerf1Month.toFixed(2)}%`,
        industryPerf3Months: `${reducedSum.industryPerf3Months.toFixed(2)}%`,
        industryPerf1Year: `${reducedSum.industryPerf1Year.toFixed(2)}%`,
      }
    }

    return newReducedSum
  }

  onSelectAll = () => {
    const { industryData } = this.state
    if (!industryData) {
      return
    }
    const rowQuantity = industryData.length
    let allRows: number[] | null
    const selectedRows =
      (this.state.selectedRows && this.state.selectedRows.slice()) || []
    if (selectedRows.length !== rowQuantity) {
      allRows = industryData.map((td, i) => i)
    } else {
      allRows = null
    }
    this.setState({ selectedRows: allRows }, () => this.calculateSum(allRows))
  }

  onChangeData = (data: string[]) => {
    const lineChartMocks = genMocks(31, data)

    this.setState({ lineChartMocks })
  }

  render() {
    const {
      isUSDCurrently,
      children,
      theme,
      filterValueSmallerThenPercentage,
    } = this.props
    const {
      selectedRows,
      selectedSum,
      industryData,
      currentSort,
      activeLegend,
    } = this.state
    const isSelectAll =
      (industryData &&
        selectedRows &&
        industryData.length === selectedRows.length) ||
      false

    const textColor: string = theme.palette.getContrastText(
      theme.palette.background.paper
    )
    let isThereAnySelectedRows = false
    if (selectedRows) {
      isThereAnySelectedRows = selectedRows.length > 1
    }

    const tableDataHasData = industryData
      ? !!Object.keys(industryData).length
      : false

    if (!tableDataHasData) {
      return (
        <PTWrapper tableData={!!tableDataHasData}>
          {children}
          <PTextBox>Add account for Portfolio</PTextBox>
        </PTWrapper>
      )
    }

    return (
      <Container container={true} spacing={24}>
        <Grid item={true} xs={12} md={8}>
          <Wrapper elevation={8}>
            <Table
              checkedRows={[]}
              rows={this.putDataInTable()}
              title="Industries"
            />
          </Wrapper>
        </Grid>
        <Grid item={true} xs={12} md={4}>
          <ChartWrapper>
            <PieChartQuery
              theme={theme}
              isUSDCurrently={isUSDCurrently}
              isShownMocks={this.props.isShownMocks}
            />
          </ChartWrapper>
        </Grid>
      </Container>
    )
  }
}

const Container = styled(Grid)`
  && {
    padding: 1rem;
    width: 100%;
  }
`

const HeadingForPieChart = css`
  position: absolute;
  z-index: 2;
  right: 16px;
`

const Heading = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #fff;

  ${(props: { pieChart?: boolean }) =>
    props.pieChart ? HeadingForPieChart : ''};
`

const transformPieChart = css`
  & .rv-xy-plot__inner {
    transform: translateX(-20%);
  }
`

const ChartWrapper = styled(Card)``

const ChartContainer = styled.div`
  border-radius: 3px;

  box-shadow: ${(props: { shadows: string }) => props.shadows};
  position: relative;
  padding: 1em;
  text-align: center;
  height: 35vh;

  width: 1031px;

  @media (max-width: 2200px) {
    height: 30vh;
  }

  @media (max-height: 940px) {
    height: 30vh;
  }

  @media (max-height: 680px) {
    display: none;
  }
  @media (max-width: 850px) {
    display: none;
  }
`

const Wrapper = styled(Paper)`
  ${customAquaScrollBar};
`

const PTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  display: inline-block;
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
`

const PTD = styled.td`
  color: ${(props: {
    isSelected?: boolean
    red: string
    green: string
    colorized: string | null
    selectedTextColor: string
    textColor: string
  }) => {
    if (props.colorized) {
      if (props.colorized === 'green') {
        return props.green
      }
      if (props.colorized === 'red') {
        return props.red
      }
    }

    return props.isSelected ? props.selectedTextColor : props.textColor
  }};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 0 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;
  min-width: 100px;

  &:nth-child(1) {
    min-width: 30px;
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 90px;
    text-overflow: ellipsis;
  }

  &:nth-child(3) {
    min-width: 60px;
    text-overflow: ellipsis;
  }

  &:nth-child(n + 4) {
    text-align: right;
  }

  &:nth-child(4) {
    min-width: 200px;
    max-width: 200px;
    text-overflow: ellipsis;
  }

  &:nth-child(n + 7) {
    min-width: 110px;
  }

  &:nth-last-child(1) {
    min-width: 112px;
    padding-right: 16px;
  }
`

const PTH = styled.th`
  color: ${(props: { textColor: string }) => props.textColor};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 0 1.75px 10px;
  font-weight: 500;
  min-width: 100px;
  user-select: none;

  &:nth-child(1) {
    min-width: 30px;
  }
  &:nth-child(2) {
    min-width: 90px;
  }

  &:nth-child(3) {
    min-width: 60px;
  }

  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
  }

  &:nth-child(3) {
    text-align: left;
  }

  &:nth-child(n + 4) {
    text-align: right;
  }

  &:nth-child(4) {
    min-width: 200px;
  }

  &:nth-child(n + 7) {
    min-width: 110px;
  }

  &:nth-last-child(1) {
    min-width: 112px;
    padding-right: 16px;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { background: string }) => props.background};
`

const PTRBody = styled.tr`
  cursor: pointer;

  background-color: ${(props: {
    isSelected?: boolean
    isBase?: boolean
    background: string
    selectedBackground: string
  }) =>
    props.isBase
      ? '#00ff0028'
      : props.isSelected
        ? props.selectedBackground
        : props.background};

  &:nth-child(even) {
    background-color: ${(props: {
      isSelected?: boolean
      isBase?: boolean
      evenBackground: string
      selectedBackground: string
    }) => (props.isSelected ? props.selectedBackground : props.evenBackground)};
  }

  &:hover {
    background-color: rgba(70, 102, 142, 0.2);
  }
`

const PTHead = styled.thead`
  display: table;
  position: sticky;
  top: 0;
  width: 100%;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid
      ${(props: { bottomCollor: string }) => props.bottomCollor};
  }
`

const PTextBox = styled.div`
  font-size: 30px;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3136;
`

const MainDataWrapper = (props) => (
  <QueryRenderer
    component={PortfolioTableIndustries}
    query={getPortfolioQuery}
    {...props}
  />
)

const mapStateToProps = (store: object) => ({
  isShownMocks: store.user.isShownMocks,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

export default connect(mapStateToProps)(MainDataWrapper)
