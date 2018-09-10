import React from 'react'
import { TableFooter, TablePagination, TableRow } from '@material-ui/core/Table'

export const PortfolioTableFooter = ({ ...pageSettings }) => (
  <TableFooter>
    <TableRow>
      <TablePagination
        {...pageSettings}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
      />
    </TableRow>
  </TableFooter>
)
