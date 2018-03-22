import React, { Component } from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table'
import Typography from 'material-ui/Typography'

import { BrushChart } from '../brushChart/index'
import ProfileChartHead from './portFolioHeadUpdated'

import { Loading } from '@components'

import {
  PortfolioTableHead,
  PortfolioTableToolbar,
  PortfolioTableFooter,
  LoginAlert,
} from './'
import { getPortfolioQuery } from '../../api'

// Data mock
import { sampleData } from './dataMock'

class PortfolioTableComponent extends Component<any, any> {
  state = {
    data: null,
    order: 'asc',
    orderBy: 'name',
    selected: [],
    page: 0,
    rowsPerPage: 10,
    currentTab: 'balances',
  }

  // Pass assets to state from props so it can be sorted, mutated, etc
  // also it can be modified to update with subscriptios now
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data && this.props.data.getProfile) {
      if (
        prevProps.data !== this.props.data &&
        !this.state.data &&
        !this.props.data.loading
      ) {
        // remove length check for real data
        this.setState({
          data:
            this.props.data.getProfile.portfolio.assets.length > 0 ||
            sampleData.assets,
        })
      }
    }
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

  addAssetsToState = (assets: any[]) => {
    this.setState({ data: assets })
  }

  handleSelectAllClick = (event: any, checked: any): void => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n._id) })

      return
    }
    this.setState({ selected: [] })
  }

  handleTabSelect = (event, currentTab) => {
    this.setState({ currentTab })
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

  render() {
    if (this.props.data.loading || !this.state.data) {
      return <Loading margin={'30% auto'} />
    }

    if (this.props.data.error) {
      if (this.props.data.error.message.toLowerCase().includes('jwt')) {
        return <LoginAlert />
      } else {
        return (
          <Typography variant="title" color="error">
            Error!
          </Typography>
        )
      }
    }

    const assets = this.state.data

    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      currentTab,
    } = this.state
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, assets.length - page * rowsPerPage)

    return (
      <TableContainer>
        <PortfolioTableToolbar
          currentTab={currentTab}
          handleTabSelect={this.handleTabSelect}
          numSelected={selected.length}
        />
        <TableWrapper>
          <PortfolioTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
            rowCount={assets.length}
          />
          <TableBody>
            {currentTab === 'balances' &&
              assets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
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
                      <TableCell numeric>
                        {`${n.asset.priceUSD}$` || 'Empty'}
                      </TableCell>
                      <TableCell numeric>{n.value || 'Empty'}</TableCell>
                      <TableCell numeric>
                        {n.realizedProfit || 'Empty'}
                      </TableCell>
                      <TableCell numeric>{n.totalProfit || 'Empty'}</TableCell>
                    </TableRow>
                  )
                })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 30 * emptyRows }}>
                <TableCell colSpan={8}>
                  <ProfileChartHead />
                  <BrushChart />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <PortfolioTableFooter
            colSpan={6}
            count={assets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </TableWrapper>
      </TableContainer>
    )
  }
}

const TableContainer = styled(Paper)`
  margin: 24px;
  width: 100%;
`

const TableWrapper = styled(Table)`
  min-width: 800px;
`

export const PortfolioTable = compose(graphql(getPortfolioQuery))(
  PortfolioTableComponent
)
