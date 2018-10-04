import React from 'react'
import { withStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Paper from '@material-ui/core/Paper'
import { hexToRgbAWithOpacity } from '@styles/helpers'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
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

const styles = (theme: Theme) => ({
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
    color: 'white',
    transition: `background-color ${theme.transitions.duration.short}ms  ${
      theme.transitions.easing.easeOut
    }`,
    borderBottom: '0',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  footer: {
    height: theme.spacing.unit * 5.25,
    backgroundColor: theme.palette.secondary.A700,
  },
})

const renderCell = (cell, i, numeric) => {
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant="body"
        padding="dense"
        style={{ color: cell.color, ...cell.style }}
        key={i}
        numeric={numeric}
      >
        {cell.text}
      </CustomTableCell>
    )
  }
  if (typeof cell !== 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant="body"
        numeric={numeric}
        padding="dense"
        key={i}
      >
        {cell}
      </CustomTableCell>
    )
  }

  return null
}

const CustomTable = (props) => {
  const {
    classes,
    rows,
    onChange = () => {
      return
    },
    onSelectAllClick = () => {
      return
    },
    checkedRows = [],
  } = props
  console.log(checkedRows)
  if (!Array.isArray(rows.head) && !Array.isArray(rows.body)) return
  return (
    <Background className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <CustomTableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  checkedRows.length > 0 &&
                  rows.body.length > checkedRows.length
                }
                checked={rows.body.length === checkedRows.length}
                onChange={onSelectAllClick}
              />
            </CustomTableCell>
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
          {rows.body.map((row, ind: number) => {
            const selected = checkedRows.indexOf(ind) !== -1
            console.log(selected)
            return (
              <TableRow className={classes.row} key={ind}>
                <CustomTableCell padding="checkbox">
                  <Checkbox
                    indeterminate={false}
                    checked={selected}
                    onChange={(e) => {
                      onChange(e, ind)
                    }}
                  />
                </CustomTableCell>
                {row.map(
                  (
                    cell:
                      | string
                      | number
                      | { text: string | number; color: string; style: any },
                    i: number
                  ) => {
                    const numeric =
                      typeof cell.text === 'number' || typeof cell === 'number'

                    return renderCell(cell, i, numeric)
                  }
                )}
              </TableRow>
            )
          })}
        </TableBody>
        {rows.footer && (
          <TableFooter className={classes.footer}>
            <TableRow>
              <CustomTableCell padding="checkbox" />
              {rows.footer.map(
                (
                  cell: { text: string | number; number: boolean; style: any },
                  i: number
                ) => {
                  const numeric =
                    typeof cell.text === 'number' ||
                    typeof cell === 'number' ||
                    cell.number

                  const footerCell = {
                    ...cell,
                    style: {
                      ...cell.style,
                      opacity: 0.84,
                      color: 'black',
                    },
                  }
                  return renderCell(footerCell, i, numeric)
                }
              )}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Background>
  )
}

const Background = styled(Paper)`
  ${customAquaScrollBar};
`

export default withStyles(styles)(CustomTable)
