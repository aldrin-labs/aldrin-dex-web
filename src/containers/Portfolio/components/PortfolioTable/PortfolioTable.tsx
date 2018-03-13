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

import { PortfolioTableHead, PortfolioTableToolbar } from './'

const sampleData = [
  {
    _id: 1,
    exchange: {
      name: 'Gemini',
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
      name: 'Binance',
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
      name: 'Gdax',
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
    _id: 567,
    exchange: {
      name: 'BitCOOOOONEEEECT',
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
]

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

export class PortfolioTable extends Component<any, any> {
    state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      page: 0,
      rowsPerPage: 10,
    }

  handleRequestSort = (event: any, property: any): void => {
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

  handleSelectAllClick = (event: any, checked: any): void => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n._id) })
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event: any, _id: string): void => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(_id)
    let newSelected: any[] = []

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

  handleChangePage = (event: any, page: number) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: any) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = (_id: string) => this.state.selected.indexOf(_id) !== -1

  public render(): JSX.Element {
    if (this.props.data.loading) {
      return <div>Loading</div>
    }

    const assets =
    (this.props.data &&
      this.props.getProfile &&
      this.props.data.getProfile.portfolio &&
      this.props.data.getProfile.portfolio.assets) ||
    sampleData

    console.log(this.props.data)

    const { order, orderBy, selected, rowsPerPage, page } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, assets.length - page * rowsPerPage)
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
                    <TableCell numeric>{n.asset.name || 'Empty'}</TableCell>
                    <TableCell numeric>{n.asset.symbol || 'Empty'}</TableCell>
                    <TableCell numeric>{n.asset.priceUSD || 'Empty'}</TableCell>
                    <TableCell numeric>{n.currentBTC || 'Empty'}</TableCell>
                    <TableCell numeric>{n.currentUSD || 'Empty'}</TableCell>
                    <TableCell numeric>{n.twentyFourHourChange || 'Empty'}</TableCell>
                    <TableCell numeric>{n.BTCProfitLoss || 'Empty'}</TableCell>
                    <TableCell numeric>{n.USDProfitLoss || 'Empty'}</TableCell>
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
                  count={assets.length}
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
