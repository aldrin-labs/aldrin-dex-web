import React, { Component, SFC } from 'react'
import styled from 'styled-components'

import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableFooter, TablePagination, TableRow } from 'material-ui/Table'

import { ProfileTableHead } from './ProfileTableHead'
import { ProfileTableToolbar } from './ProfileTableToolbar'

let counter = 0
function createData(name, accountType, exchange, key, info) {
  counter += 1
  return { id: counter, name, accountType, exchange, key, info }
}
const SPaper = styled(Paper)`
  width: 100%;
  margin-top: 3px;
`

const STableWrapper = styled.div`
  overflow-x: auto;
`

const STable = styled(Table)`
  min-width: 800px;
`

export class ProfileTable extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      data: [
        createData('Bitcointest', 'exchange', 'Cryptopia', 'dwadwad34fsfw2', 'hello'),
        createData('Dogeforfree', 'exchange', 'Cryptopia', 'dawdfdfgvd4543fgfds', 'hi'),
        createData('EliteCoinIlluminatiConfirmApiKey', 'exchange', 'Cryptopia', 'sdsacgew42423', ':lol:'),
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
      this.setState({ selected: this.state.data.map(n => n.id) })
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render() {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <SPaper>
        <ProfileTableToolbar numSelected={selected.length} />
        <STableWrapper>
          <STable>
            <ProfileTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n.id)
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell padding="none">{n.name}</TableCell>
                    <TableCell numeric>{n.accountType}</TableCell>
                    <TableCell numeric>{n.exchange}</TableCell>
                    <TableCell numeric>{n.key}</TableCell>
                    <TableCell numeric>{n.info}</TableCell>
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
