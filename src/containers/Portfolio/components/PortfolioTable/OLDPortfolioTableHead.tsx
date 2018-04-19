import React, { Component, SFC } from 'react'

import Checkbox from 'material-ui/Checkbox'
import { TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table'
import Tooltip from 'material-ui/Tooltip'

const columnData = [
  { id: 'exchange', numeric: false, disablePadding: true, label: 'Exchange' },
  { id: 'asset', numeric: true, disablePadding: false, label: 'Coin' },
  { id: 'symbol', numeric: true, disablePadding: false, label: 'Symbol' },
  { id: 'priceUSD', numeric: true, disablePadding: false, label: 'Price (USD)'},
  { id: 'value', numeric: true, disablePadding: false, label: 'Value' },
  { id: 'realizedProfit', numeric: true, disablePadding: false, label: 'Realized profit' },
  { id: 'possibleProfit', numeric: true, disablePadding: false, label: 'Possible Profit' },

]

export class PortfolioTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map((column) =>
            (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip title="Sort" placement={column.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ), this)}
        </TableRow>
      </TableHead>
    )
  }
}
