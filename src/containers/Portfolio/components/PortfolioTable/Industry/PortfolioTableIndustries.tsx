import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Table from '@components/Tables/WithCheckboxesAndSummary'
import {
  roundPercentage,
  calcAllSumOfPortfolioAsset,
} from '@utils/PortfolioTableUtils'

import {
  MOCKS,
  genMocks,
  inds,
} from '@containers/Portfolio/components/PortfolioTable/Industry/mocks'
import { IPortfolio } from '@containers/Portfolio/components/PortfolioTable/types'
import { IndProps } from '@containers/Portfolio/interfaces'
import { customAquaScrollBar } from '@styles/cssUtils'
import { onSortStrings, roundAndFormatNumber } from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import QueryRenderer from '@components/QueryRenderer'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { PTWrapper } from '../Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import { Paper, Grid, Card } from '@material-ui/core'

const tableHeadings = [
  { name: 'Industry', value: 'industry' },
  { name: 'Coin', value: 'symbol' },
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

class PortfolioTableIndustries extends React.Component<IndProps, IState> {
  state: IState = {
    activeKeys: null,
    portfolio: null,
    industryData: null,
    currentSort: null,
    expandedRow: NaN,
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
      const { portfolioAssets } = nextProps.data.myPortfolios[0]
      const { isShownMocks } = nextProps

      if (!portfolioAssets) {
        return
      }

      const composeWithMocks = isShownMocks
        ? {
          ...portfolio,
          assets: portfolioAssets.concat(MOCKS),
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

  putDataInTable = () => {
    const { industryData } = this.state
    if (!industryData) return
    return {
      head: tableHeadings.map((heading, ind: number) => ({
        text: heading.name,
        number: ind === 0 || ind === 1 ? false : true,
      })),
      body: industryData.map((row, ind) => {
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
          industry,
          symbol,
          +portfolioPerc,
          +portfolioPerf,
          +industryPerf1Week,
          +industryPerf1Month,
          +industryPerf3Months,
          +industryPerf1Year,
        ]
        if (ind === 2 || ind === 1) {
          res.push([
            [
              '',
              symbol,
              +portfolioPerc,
              +portfolioPerf,
              +industryPerf1Week,
              +industryPerf1Month,
              +industryPerf3Months,
              +industryPerf1Year,
            ],
            [
              '',
              symbol,
              +portfolioPerc,
              +portfolioPerf,
              +industryPerf1Week,
              +industryPerf1Month,
              +industryPerf3Months,
              +industryPerf1Year,
            ],
          ])
        }

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

    this.setState({ industryData })
  }

  onChangeData = (data: string[]) => {
    const lineChartMocks = genMocks(31, data)

    this.setState({ lineChartMocks })
  }

  expandRow = (e: React.ChangeEvent, index: number) => {
    this.setState((prevState) => {
      return { expandedRow: index === prevState.expandedRow ? NaN : index }
    })
  }

  render() {
    const { children, theme, filterValueSmallerThenPercentage } = this.props
    const { industryData } = this.state

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
      <Container container={true} spacing={16}>
        <Grid item={true} xs={12} md={8}>
          <Wrapper elevation={8}>
            <Table
              onChange={this.expandRow}
              expandedRow={this.state.expandedRow}
              rows={this.putDataInTable()}
              title="Industries"
            />
          </Wrapper>
        </Grid>
        <Grid item={true} xs={12} md={4}>
          <ChartWrapper />
        </Grid>
      </Container>
    )
  }
}

const Container = styled(Grid)`
  && {
    height: calc(100vh - 80px);
    padding: 1rem 0;
    width: 100%;
  }
`

const ChartWrapper = styled(Card)``

const Wrapper = styled(Paper)`
  max-height: 100%;
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: scroll;
  ${customAquaScrollBar};
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
