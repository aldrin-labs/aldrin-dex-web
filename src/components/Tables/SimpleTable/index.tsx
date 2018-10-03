import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { hexToRgbAWithOpacity } from '@styles/helpers'
import styled from 'styled-components'
import { customAquaScrollBar } from '@styles/cssUtils'

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary[700],
    color: hexToRgbAWithOpacity(theme.palette.common.white, 0.66),
    textTransform: 'uppercase',
    height: theme.spacing.unit * 5,
    fontSize: 12,
    fontWeight: 'bold',
    // padding: '4px 40px 4px 16px',
    whiteSpace: 'nowrap',
    position: 'relative',
  },
  body: {
    // padding: '4px 40px 4px 16px',
    borderBottom: 'none',
    height: theme.spacing.unit * 4,
    fontSize: 12,
  },
}))(TableCell)

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    overflowY: 'scroll',
  },
  table: {
    minWidth: 700,
  },
  row: {
    transition: `background-color ${theme.transitions.duration.short}ms  ${
      theme.transitions.easing.easeOut
    }`,
    borderBottom: '0',
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.secondary[600],
    },
  },
})

const CustomTable = (props) => {
  const { classes, rows } = props
  if (!Array.isArray(rows.head) && !Array.isArray(rows.body)) return
  return (
    <Background className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            {rows.head.map(
              (
                cell:
                  | { text: string | number; number: boolean; style: any }
                  | number
              ) => {
                return (
                  <CustomTableCell
                    style={{ ...cell.style }}
                    variant="head"
                    padding="dense"
                    numeric={cell.number}
                    key={cell.text}
                  >
                    {cell.text}
                  </CustomTableCell>
                )
              }
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.body.map((row) => {
            return (
              <TableRow className={classes.row} key={row.id}>
                {row.map(
                  (
                    cell:
                      | string
                      | number
                      | { text: string | number; color: string; style: any },
                    i: number
                  ) => {
                    let renderCell
                    const numeric =
                      typeof cell.text === 'number' || typeof cell === 'number'
                    if (cell !== null && typeof cell === 'object') {
                      renderCell = (
                        <CustomTableCell
                          padding="dense"
                          style={{ color: cell.color, ...cell.style }}
                          key={i}
                          numeric={numeric}
                        >
                          {cell.text}
                        </CustomTableCell>
                      )
                    } else if (typeof cell !== 'object') {
                      renderCell = (
                        <CustomTableCell
                          numeric={numeric}
                          padding="dense"
                          key={i}
                        >
                          {cell}
                        </CustomTableCell>
                      )
                    }

                    return renderCell
                  }
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Background>
  )
}

const Background = styled(Paper)`
  ${customAquaScrollBar};
`

export default withStyles(styles)(CustomTable)
