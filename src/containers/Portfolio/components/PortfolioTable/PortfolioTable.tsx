import React, { Component, SFC } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table'

import { PortfolioTableHead, PortfolioTableToolbar } from '../'

let counter = 0
function createData(data) {
  const {
    exchange,
    name,
    symbol,
    availableSupply,
    totalSupply,
    maxSupply,
    priceUSD,
    percentChangeDay,
  } = data
  counter += 1
  return { _id: counter, ...data }
}

const sampleData = [{
  _id: 1,
  exchange: {
    name: 'Gemini'
  },
  asset: {
    name: 'Etherium',
    symbol: 'ETH',
    priceUSD: '781',
  },
  currentBTC: '11000',
  currentUSD: '781',
  twentyFourHourChange: '10%',
  BTCProfitLoss: '-10%',
  USDProfitLoss: '-17%',
},
{
  _id: 2,
  exchange: {
    name: 'Binance'
  },
  asset: {
    name: 'Etherium',
    symbol: 'ETH',
    priceUSD: '781',
  },
  currentBTC: '11000',
  currentUSD: '781',
  twentyFourHourChange: '10%',
  BTCProfitLoss: '-10%',
  USDProfitLoss: '-17%',
},
{
  _id: 3,
  exchange: {
    name: 'Gdax'
  },
  asset: {
    name: 'Etherium',
    symbol: 'ETH',
    priceUSD: '781',
  },
  currentBTC: '11000',
  currentUSD: '781',
  twentyFourHourChange: '10%',
  BTCProfitLoss: '-10%',
  USDProfitLoss: '-17%',
},
{
  _id: 4,
  exchange: {
    name: 'BitCOOOOONEEEECT'
  },
  asset: {
    name: 'Etherium',
    symbol: 'ETH',
    priceUSD: '781',
  },
  currentBTC: '11000',
  currentUSD: '781',
  twentyFourHourChange: '10%',
  BTCProfitLoss: '-10%',
  USDProfitLoss: '-17%',
}]

const SPaper = styled(Paper)`
  width: 100%;
  margin: 24px;
`

const STableWrapper = styled.div`
  overflow-x: auto;
`

const STable = styled(Table)`
  min-width: 800px;
`

const SamplePortfolio = {
  exchange: 'Gemini',
  name: 'Ethereum',
  symbol: 'ETH',
  availableSupply: '90000',
  totalSupply: '9000000000',
  maxSupply: '19999999999999',
  priceUSD: '9000',
  percentChangeDay: '400',
}

const SamplePortfolio2 = {

}

export class PortfolioTable extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      data: [
        createData('Gemini', 'Bitcoin', 'BTC', 9000, 0, 111, 0.333, 0.555),
        createData('Gemini', 'Ethereum', 'Eth', 90010, 0, 1111, 0.3233, 0.5355),
      ].sort((a, b) => (a.name < b.name ? -1 : 1)),
      page: 0,
      rowsPerPage: 10,
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))

    this.setState({ data, order, orderBy })
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n._id) })
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, _id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(_id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = _id => this.state.selected.indexOf(_id) !== -1

  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
    console.log(112233, this.props)
    const assets = this.props.data.getProfile.portfolio && this.props.data.getProfile.portfolio.assets || sampleData
    // const assets = sampleData;
    return (
      <SPaper>
        <PortfolioTableToolbar numSelected={selected.length} />
        <STableWrapper>
          <STable>
            <PortfolioTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={assets.length}
            />
            <TableBody>
              {assets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n._id)
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, n._id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n._id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell padding="none">{n.exchange.name}</TableCell>
                    <TableCell numeric>{n.asset.name}</TableCell>
                    <TableCell numeric>{n.asset.symbol}</TableCell>
                    <TableCell numeric>{n.asset.priceUSD}</TableCell>
                    <TableCell numeric>{n.currentBTC}</TableCell>
                    <TableCell numeric>{n.currentUSD}</TableCell>
                    <TableCell numeric>{n.twentyFourHourChange}</TableCell>
                    <TableCell numeric>{n.BTCProfitLoss}</TableCell>
                    <TableCell numeric>{n.USDProfitLoss}</TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </STable>
        </STableWrapper>
      </SPaper>
    )
  }
}
