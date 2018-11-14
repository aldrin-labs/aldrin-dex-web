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
  roundAndFormatNumber,
  numberOfDigitsAfterPoint,
} from '@utils/PortfolioTableUtils'

import {
  Container,
  GridContainer,
  TableWrapper,
  TableContainer,
  ChartWrapper,
  DonutChatWrapper,
  CalculatorWrapper,
  Pagination,
} from './styles'

import { data, chartCoins } from './mocks'

interface Props {
  data: CoinMarketCapQueryQuery
  history: History
  location: Location
}

interface State {
  activeSortArg: number | null
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
        { id: 'Price', isNumber: true, label: 'Price' },
        { id: 'MarketCap', isNumber: true, label: 'Market Cap' },
        { id: 'AvailableSupply', isNumber: true, label: 'Available Supply' },
      ],
      data: {
        body: (data.assetPagination.items).map((value, index) => ({
          id: index,
          Number: index + 1,
          Name: value.name,
          Symbol: value.symbol,
          Price: {
            contentToSort: value.priceUSD,
            render: addMainSymbol(roundAndFormatNumber(value.priceUSD), true),
          },
          MarketCap: value.maxSupply || 0,
          AvailableSupply: value.availableSupply,
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
          <TableContainer item={true} xs={12} md={7}>
            <TableWrapper className="PortfolioMainTable">
              <TableWithSort
                  title="Title"
                  columnNames={dataForTable.head}
                  data={dataForTable.data}
                  actionsColSpan={1}
              />
              <Pagination>
              <Button title="Previous" onClick={this.decrementPage}> Previous </Button>
              <Button title="View all coins"> View all coins </Button>
              <Button title="Next" onClick={this.incrementPage}> Next </Button>
              </Pagination>
            </TableWrapper>
          </TableContainer>
          <TableContainer item={true} xs={12} md={5}>
            <TableWrapper className="PortfolioTradeOrderHistoryTable">
              <CardHeader title="Calculator" />
              <CalculatorWrapper>
                <Calculator rates={rates} />
              </CalculatorWrapper>
            </TableWrapper>
            <DonutChatWrapper>
              <CardHeader title="Donut Chart" />
              <ChartWrapper>
                <DonutChart
                  colorLegend
                  colorLegendWhidh={150}
                  data={chartCoins}
                />
              </ChartWrapper>
            </DonutChatWrapper>
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
  return { perPage: 20, page }
}


export const MyCoinMarket =   queryRendererHoc({
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