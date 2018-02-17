import React from 'react'
import styled from 'styled-components'
import nanoid from 'nanoid'

import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import * as T from './types'

const CoinListPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
  overflow-x: auto;
`

const CoinsListTable = styled(Table)`
  min-width: 700px;
  max-width: 1100px;
  margin: 0 auto;
`

export const CoinsListHead = ({ tableRows }: T.ICoinsTableList[]) => (
  <TableHead>
    {tableRows.map((row: T.ICoinsTableCell) => (
      <TableCell key={nanoid} numeric>
        {row}
      </TableCell>
    ))}
  </TableHead>
)
