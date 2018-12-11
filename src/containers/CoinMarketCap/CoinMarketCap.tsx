import * as React from 'react'
import { History } from 'history'
// import { Button } from '@material-ui/core'
// import Button from '@components/Elements/Button/Button'
// import Calculator from '@components/Calculator/Calculator'
// import DominanceChart from '@components/DominanceChart/DominanceChart'
import {  TableWithSort } from '@storybook-components/index'
import { queryRendererHoc } from '@components/QueryRenderer'
// import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'
import { CoinMarketCapQueryQuery } from '@containers/CoinMarketCap/annotations'
 import { MarketsQuery } from './api'
// import CardHeader from '@components/CardHeader'
import {
  addMainSymbol,
  formatNumberToUSFormat,
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

interface Props {
  data: CoinMarketCapQueryQuery
  history: History
  location: Location
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


  getDataForTabale = (data) => {
    return {
      head: [
        { id: 'Number', isNumber: true, label: '№' },
        { id: 'Name', isNumber: false, label: 'Name' },
        { id: 'Symbol', isNumber: false, label: 'Symbol'},
        { id: 'PriceUSD', isNumber: true, label: 'Price USD' },
        { id: 'PriceBTC', isNumber: true, label: 'Price BTC' },
        { id: 'MarketCap', isNumber: true, label: 'Market Cap' },
        { id: 'AvailableSupply', isNumber: true, label: 'Available Supply' },
        { id: 'TotalSupply', isNumber: true, label: 'Total Supply' },
        { id: 'MaxSupply', isNumber: true, label: 'Max Supply' },
        { id: 'Volume24h', isNumber: true, label: 'Volume 24 hr' },
        { id: 'PercentChange1h', isNumber: true, label: '%1hr' },
        { id: 'PercentChange24h', isNumber: true, label: '%24hr' },
        { id: 'PercentChange7d', isNumber: true, label: '%7days' },
      ],
      data: {
        body: (data.markets).map((value, index) => ({
          id: index,
          Number: value.rank,
          Name: value.name,
          Symbol: value.symbol,
          PriceUSD: {
            contentToSort: value.price_usd || 0,
            render: addMainSymbol(formatNumberToUSFormat(value.price_usd || 0), true),
            isNumber: true,
          },
          PriceBTC: {
            contentToSort: value.price_btc || 0,
            render: addMainSymbol(formatNumberToUSFormat(value.price_btc) || 0, false),
            isNumber: true,
          },
          MarketCap: {
            contentToSort: value.market_cap_usd || 0,
            render: addMainSymbol(formatNumberToUSFormat(value.market_cap_usd || 0), true),
            isNumber: true,
          },
          AvailableSupply: {
            contentToSort: value.available_supply || 0,
            render: formatNumberToUSFormat(value.available_supply || 0),
            isNumber: true,
          },
          TotalSupply: {
            contentToSort: value.total_supply || 0,
            render: formatNumberToUSFormat(value.total_supply || 0),
            isNumber: true,
          },
          MaxSupply: {
            contentToSort: value.max_supply || 0,
            render: formatNumberToUSFormat(value.max_supply || 0),
            isNumber: true,
          },
          Volume24h: {
            contentToSort: value.volume_usd_24h || 0,
            render: addMainSymbol(formatNumberToUSFormat(value.volume_usd_24h || 0), true),
            isNumber: true,
          },
          PercentChange1h: {
            contentToSort: value.percent_change_1h || 0,
            render: formatNumberToUSFormat(value.percent_change_1h || 0),
            isNumber: true,
          },
          PercentChange24h: {
            contentToSort: value.percent_change_24h || 0,
            render: formatNumberToUSFormat(value.percent_change_24h || 0),
            isNumber: true,
          },
          PercentChange7d: {
            contentToSort: value.percent_change_7d || 0,
            render: formatNumberToUSFormat(value.percent_change_7d  || 0),
            isNumber: true,
          },
        })),
      },
    }
  }

  render() {
    const dataForTable = this.getDataForTabale(this.props.data)

    return (
      <Container>
        <GridContainer container={true} spacing={16}>
          <TableContainer item={true} xs={12} md={12}>
            <TableWrapper>
              <TableWithSort
                  title="Title"
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


export const MyCoinMarket = queryRendererHoc({
  query: MarketsQuery,
  pollInterval: 5000,
  fetchPolicy: 'network-only',
  variables: options(location)
})(CoinMarket)

export default MyCoinMarket