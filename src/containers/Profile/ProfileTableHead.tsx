import React, { Component, SFC } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core/Table'
import Tooltip from '@material-ui/core/Tooltip'

const columnData = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Account nickname',
  },
  {
    id: 'accountType',
    numeric: true,
    disablePadding: false,
    label: 'Account Type',
  },
  { id: 'exchange', numeric: true, disablePadding: false, label: 'Exchange' },
  { id: 'key', numeric: true, disablePadding: false, label: 'Key' },
  { id: 'info', numeric: true, disablePadding: false, label: 'Info' },
]

export class ProfileTableHead extends Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
    } = this.props

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
          {columnData.map((column) => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}
