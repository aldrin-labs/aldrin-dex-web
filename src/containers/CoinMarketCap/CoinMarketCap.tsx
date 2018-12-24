import * as React from 'react'
import { History } from 'history'
import { withTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
// import Button from '@components/Elements/Button/Button'
// import Calculator from '@components/Calculator/Calculator'
// import DominanceChart from '@components/DominanceChart/DominanceChart'
import {
  TableWithSort,
  addMainSymbol,
} from '@storybook-components/index'
import { queryRendererHoc } from '@components/QueryRenderer'
// import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'
import { CoinMarketCapQueryQuery } from '@containers/CoinMarketCap/annotations'
import { MarketsQuery } from './api'
// import CardHeader from '@components/CardHeader'
import {
  formatNumberToUSFormat,
  roundAndFormatNumber,
} from '@utils/PortfolioTableUtils'

import {
  Container,
  GridContainer,
  TableWrapper,
  TableContainer,
  ChartWrapper,
  DonutChatWrapper,
  CalculatorWrapper,
} from './styles'

import { data, chartCoins } from './mocks'
import withAuth from '@hoc/withAuth'

interface Props {
  data: CoinMarketCapQueryQuery
  history: History
  location: Location
  theme: Theme
}

interface State {
  activeSortArg: number | null
  page: number
  rowsPerPage: number
}

export const rates = [
  { name: 'BTC/USD', rate: 9103.26 },
  { name: 'USD/BTC', rate: 0.00011 },
  { name: 'BTC/ETH', rate: 1 },
  { name: 'ETH/BTC', rate: 1 },
  { name: 'ETH/USD', rate: 580.06 },
  { name: 'USD/ETH', rate: 1 },
  { name: 'XRP/USD', rate: 0.709714 },
  { name: 'USD/XRP', rate: 1 },
]

export class CoinMarket extends React.Component<Props, State> {
  state: State = {
    activeSortArg: null,
    page: 0,
    rowsPerPage: 20,
  }

  handleChangePage = (
    event: React.ChangeEvent<HTMLInputElement>,
    page: number
  ) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  redirectToProfile = (_id: string) => {
    const { history } = this.props

    history.push(`/profile/${_id}`)
  }

  onChangeSortArg = (index: number, sortArg: string) => {
    const { history, location } = this.props
    if (!location) return

    const query = new URLSearchParams(location.search)
    if (query.has('sort')) {
      query.set('sort', sortArg)
    } else {
      query.append('sort', sortArg)
    }

    history.push({ pathname: location.pathname, search: query.toString() })

    this.setState({ activeSortArg: index })
  }

  getDataForTabale = (data, green, red) => {
    return {
      head: [
        { id: 'Number', isNumber: true, label: '№' },
        { id: 'Name', isNumber: false, label: 'Name' },
        { id: 'Symbol', isNumber: false, label: 'Symbol' },
        { id: 'PriceUSD', isNumber: true, label: 'Price USD' },
        { id: 'PriceBTC', isNumber: true, label: 'Price BTC' },
        { id: 'MarketCap', isNumber: true, label: 'Market Cap' },
        { id: 'CirculatingSupply', isNumber: true, label: 'Circulating Supply' },
        { id: 'Volume24h', isNumber: true, label: 'Volume 24 hr' },
        { id: 'PercentChange1h', isNumber: true, label: '%1hr' },
        { id: 'PercentChange24h', isNumber: true, label: '%24hr' },
        { id: 'PercentChange7d', isNumber: true, label: '%7days' },
      ],
      data: {
        body: data.markets.map((value, index) => ({
          id: index,
          Number: value.rank,
          Name: value.name,
          Symbol: value.symbol,
          PriceUSD: {
            contentToSort: value.price_usd || 0,
            render: addMainSymbol(
              typeof value.price_usd === 'number'
                ? roundAndFormatNumber(value.price_usd, 2)
                : '?',
              true
            ),
            isNumber: true,
          },
          PriceBTC: {
            contentToSort: value.price_btc || 0,
            render: addMainSymbol(
              typeof value.price_btc === 'number'
                ? roundAndFormatNumber(value.price_btc, 8)
                : '?',
              false
            ),
            isNumber: true,
          },
          MarketCap: {
            contentToSort: value.market_cap_usd || 0,
            render: addMainSymbol(
              typeof value.market_cap_usd === 'number'
                ? formatNumberToUSFormat(value.market_cap_usd)
                : '?',
              true
            ),
            isNumber: true,
          },
          CirculatingSupply: {
            contentToSort: value.available_supply || 0,
            render: `${
              typeof value.available_supply === 'number'
                ? formatNumberToUSFormat(value.available_supply)
                : '?'
            }`,
            isNumber: true,
          },
          Volume24h: {
            contentToSort: value.volume_usd_24h || 0,
            render: addMainSymbol(
              typeof value.volume_usd_24h === 'number'
                ? roundAndFormatNumber(value.volume_usd_24h, 2)
                : '?',
              true
            ),
            isNumber: true,
          },
          PercentChange1h: {
            contentToSort: value.percent_change_1h || 0,
            render: `${
              typeof value.percent_change_1h === 'number'
                ? formatNumberToUSFormat(value.percent_change_1h)
                : '?'
            }%`,
            isNumber: true,
            color:
              value.percent_change_1h > 0
                ? green
                : value.percent_change_1h < 0
                ? red
                : '',
          },
          PercentChange24h: {
            contentToSort: value.percent_change_24h || 0,
            render: `${
              typeof value.percent_change_24h === 'number'
                ? formatNumberToUSFormat(value.percent_change_24h || 0)
                : '?'
            }%`,
            isNumber: true,
            color:
              value.percent_change_24h > 0
                ? green
                : value.percent_change_24h < 0
                ? red
                : '',
          },
          PercentChange7d: {
            contentToSort: value.percent_change_7d || 0,
            render: `${
              typeof value.percent_change_7d === 'number'
                ? formatNumberToUSFormat(value.percent_change_7d || 0)
                : '?'
            }%`,
            isNumber: true,
            color:
              value.percent_change_7d > 0
                ? green
                : value.percent_change_7d < 0
                ? red
                : '',
          },
        })),
      },
    }
  }

  render() {
    const dataForTable = this.getDataForTabale(
      this.props.data,
      this.props.theme.palette.green.main,
      this.props.theme.palette.red.main
    )

    return (
      <Container>
        <GridContainer container={true} spacing={16}>
          <TableContainer item={true} xs={12} md={12}>
            <TableWrapper>
              <TableWithSort
                title="Market Capitalization"
                columnNames={dataForTable.head}
                data={dataForTable.data}
                padding="default"
                pagination={{
                  page: this.state.page,
                  rowsPerPage: this.state.rowsPerPage,
                  rowsPerPageOptions: [20, 50, 100, 200],
                  handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                  handleChangePage: this.handleChangePage,
                }}
              />
            </TableWrapper>
          </TableContainer>
        </GridContainer>
      </Container>
    )
  }
}

const options = ({ location }) => {
  let page
  if (!location) {
    page = 1
  } else {
    const query = new URLSearchParams(location.search)
    page = query.get('page')
  }
  return { perPage: 1000, page }
}
// this is what actually you see at /market route

export const MyCoinMarket = withAuth(
  queryRendererHoc({
    query: MarketsQuery,
    pollInterval: 5000,
    fetchPolicy: 'network-only',
    variables: options(location),
  })(withTheme()(CoinMarket))
)

export default MyCoinMarket
