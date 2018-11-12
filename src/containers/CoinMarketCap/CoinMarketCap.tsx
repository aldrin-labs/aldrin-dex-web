import * as React from 'react'
import styled from 'styled-components'
import { History } from 'history'
import { Paper, Grid, Card } from '@material-ui/core'

import Button from '@components/Elements/Button/Button'
import Calculator from '@components/Calculator/Calculator'
import DominanceChart from '@components/DominanceChart/DominanceChart'
import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'
import { TableWithSort as Table } from '@storybook-components'
import { CoinMarketCapQueryQuery } from '@containers/CoinMarketCap/annotations'
// import { CoinMarketCapQuery } from './api'
import { mock } from '@storybook-components/Tables/mocks'

import { Container, TableWrapper, TableContainer } from './styles'

import { data } from './mocks'

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
        { id: 'Change', isNumber: false, label: 'Change (24h)' },
        { id: 'MarketCap', isNumber: true, label: 'Market Cap' },
        { id: 'AvailableSupply', isNumber: true, label: 'Available Supply' },
      ],
      data: {
        body: (data.assetPagination.items).map((value, index) => ({
          id: index,
          Number: index,
          Name: value.name,
          Symbol: value.symbol,
          Price: value.priceUSD,
          Change: '-',
          MarketCap: value.maxSupply || 0,
          AvailableSupply: value.availableSupply,
        })),
      },
    }
  }

  render() {
    const { activeSortArg } = this.state
    const { data } = this.props
    console.log(data)
    const { assetPagination } = data
    const { items } = assetPagination
    const dataForTable = this.getDataForTabale(this.props.data)
    console.log(dataForTable)

    return (
           <Container container={true} spacing={16}>
             <TableContainer item={true} xs={12} md={8}>
                <TableWrapper className="PortfolioMainTable">
                  <Table
                      title="Title"
                      columnNames={dataForTable.head}
                      data={dataForTable.data}
                      checkedRows={['1']}
                      actionsColSpan={1}
                  />
                  <Pagination>
                  <Button title="Previous" onClick={this.decrementPage} />
                  <Button title="View all coins" />
                  <Button title="Next" onClick={this.incrementPage} />
                  </Pagination>
                </TableWrapper>
              </TableContainer>
              <TableContainer item={true} xs={12} md={4}>
                <TableWrapper className="PortfolioTradeOrderHistoryTable">
                  <Calculator rates={rates} />
                  <DominanceChart />
                </TableWrapper>
              </TableContainer>
           </Container>
    )
  }
}

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  margin-top: 24px;
  margin-left: 16px;
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 775px;
`

const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
`


const options = ({ location }) => {
  let page
  if (!location) {
    page = 1
  } else {
    const query = new URLSearchParams(location.search)
    page = query.get('page')
  }
  return { variables: { perPage: 20, page } }
}

/*export const CoinMarketCap = graphql(CoinMarketCapQuery, { options })(
  CoinMarket
)*/


export const MyCoinMarket = (props) => {
  return (
    <CoinMarket
      data={data}
      {...props}
    />
  )
}

export default MyCoinMarket