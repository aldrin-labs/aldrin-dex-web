import * as React from 'react'
import styled from 'styled-components'
import { History } from 'history'
import { Button } from '@material-ui/core'
// import Button from '@components/Elements/Button/Button'
import Calculator from '@components/Calculator/Calculator'
import DominanceChart from '@components/DominanceChart/DominanceChart'
import { DonutChart, TableWithSort } from '@storybook-components/index'
import { queryRendererHoc } from '@components/QueryRenderer'
// import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'
import { CoinMarketCapQueryQuery } from '@containers/CoinMarketCap/annotations'
 import { CoinMarketCapQuery } from './api'
import CardHeader from '@components/CardHeader'
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

  incrementPage = () => {
    const { data, history, location } = this.props
    const { assetPagination } = data
    if (!assetPagination) return
    const { pageInfo } = assetPagination
    const { currentPage, hasNextPage } = pageInfo

    if (hasNextPage) {
      const query = new URLSearchParams(location.search)
      if (query.has('page')) {
        query.set('page', `${currentPage + 1}`)
      } else {
        query.append('page', `${currentPage + 1}`)
      }
      history.push({ pathname: location.pathname, search: query.toString() })
    }
  }

  decrementPage = () => {
    const { data, history, location } = this.props
    const { assetPagination } = data
    if (!assetPagination) return
    const { pageInfo } = assetPagination
    const { currentPage, hasPreviousPage } = pageInfo

    if (hasPreviousPage) {
      const query = new URLSearchParams(location.search)
      if (query.has('page')) {
        query.set('page', `${currentPage - 1}`)
      } else {
        query.append('page', `${currentPage - 1}`)
      }
      history.push({ pathname: location.pathname, search: query.toString() })
    }
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
        { id: 'Volume24h', isNumber: true, label: 'Volume 24 hr' },
        { id: 'cg1hUSD', isNumber: true, label: '%1hr USD' },
        { id: 'cg1hBTC', isNumber: true, label: '%1hr BTC' },
        { id: 'cg24hUSD', isNumber: true, label: '%24hr USD' },
        { id: 'cg24hBTC', isNumber: true, label: '%24hr BTC' },
        { id: 'cg7dUSD', isNumber: true, label: '%7days USD' },
        { id: 'cg7dBTC', isNumber: true, label: '%7days BTC' },
        { id: 'cgATH', isNumber: true, label: '% chg ATH' },
      ],
      data: {
        body: (data.assetPagination.items).map((value, index) => ({
          id: index,
          Number: index + 1,
          Name: value.name,
          Symbol: value.symbol,
          PriceUSD: {
            contentToSort: value.priceUSD,
            render: addMainSymbol(formatNumberToUSFormat(value.priceUSD), true),
            isNumber: true,
          },
          PriceBTC: {
            contentToSort: value.priceUSD,
            render: addMainSymbol(formatNumberToUSFormat(0), true),
            isNumber: true,
          },
          MarketCap: {
            contentToSort: value.maxSupply || 0,
            render: addMainSymbol(formatNumberToUSFormat(value.maxSupply || 0), true),
            isNumber: true,
          },
          AvailableSupply: {
            contentToSort: value.availableSupply,
            render: formatNumberToUSFormat(value.availableSupply),
            isNumber: true,
          },
          Volume24h: 0,
          cg1hUSD: 0,
          cg1hBTC: 0,
          cg24hUSD: 0,
          cg24hBTC: 0,
          cg7dUSD: 0,
          cg7dBTC: 0,
          cgATH: 0,
        })),
      },
    }
  }

  render() {
    const { activeSortArg } = this.state
    const { data } = this.props
    const { assetPagination } = data
    const { items } = assetPagination
    const dataForTable = this.getDataForTabale(this.props.data)

    return (
      <Container>
        <GridContainer container={true} spacing={16}>
          <TableContainer item={true} xs={12} md={12}>
            <TableWrapper className="PortfolioMainTable">
              <TableWithSort
                  title="Title"
                  columnNames={dataForTable.head}
                  data={dataForTable.data}
                  padding="default"
                  pagination={{
                    page: this.state.page,
                    rowsPerPage: this.state.rowsPerPage,
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
  query: CoinMarketCapQuery,
  pollInterval: 5000,
  fetchPolicy: 'network-only',
  variables: options(location)
})(CoinMarket)



/*
export const MyCoinMarket = (props) => {
  return (
    <CoinMarket
      data={data}
      {...props}
    />
  )
}*/

export default MyCoinMarket