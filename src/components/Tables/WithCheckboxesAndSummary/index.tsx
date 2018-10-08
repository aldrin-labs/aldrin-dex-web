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
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Checkbox from '@material-ui/core/Checkbox'

import { Props } from './index.types'
import { customAquaScrollBar } from '@styles/cssUtils'
import { isObject } from 'lodash-es'
import { Typography, IconButton } from '@material-ui/core'

const CustomTableCell = withStyles((theme) => ({
  head: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.primary[700],
    color: hexToRgbAWithOpacity(theme.palette.common.white, 0.66),
    textTransform: 'uppercase',
    height: theme.spacing.unit * 5,
    fontSize: 12,
    fontWeight: 'bold',
    border: 0,
    whiteSpace: 'nowrap',
    zIndex: 100,
  },
  body: {
    borderBottom: 'none',
    height: theme.spacing.unit * 4,
    fontSize: 12,
  },
}))(TableCell)

const Settings = withStyles((theme: Theme) => ({
  root: { color: theme.palette.common.white },
}))(IconButton)

const styles = (theme: Theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'scroll',
  },
  indeterminateCheckbox: {
    color: theme.palette.secondary.main,
  },
  table: {
    minWidth: 700,
  },
  title: {
    backgroundColor: theme.palette.primary[900],
  },
  row: {
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

  return (
    <CustomTableCell
      scope="row"
      variant="body"
      numeric={numeric}
      padding="dense"
      key={i}
    >
      {''}
    </CustomTableCell>
  )
}
{
  /* ToDo: - Add sorting
            - Fixed Header And summary
            - Add settings
            - Add render anything to Cell
          */
}

const CustomTable = (props: Props) => {
  const {
    classes,
    rows = { head: [], body: [], footer: [] },
    withCheckboxes,
    title,
    onChange = () => {
      return
    },
    onSelectAllClick = () => {
      return
    },
    checkedRows = [],
  } = props
  if (
    rows !== undefined &&
    !Array.isArray(rows.head) &&
    !Array.isArray(rows.body)
  ) {
    return
  }
  const howManyColumns = rows.head.length
  return (
    <Background className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          {title && (
            <TableRow>
              <CustomTableCell
                className={classes.title}
                colSpan={howManyColumns}
              >
                <Typography variant="title" color="secondary">
                  {title}
                </Typography>
              </CustomTableCell>
              <CustomTableCell
                className={classes.title}
                numeric={true}
                colSpan={howManyColumns}
              >
                <Settings>
                  <MoreVertIcon />
                </Settings>
              </CustomTableCell>
            </TableRow>
          )}
          <TableRow>
            <CustomTableCell padding="checkbox">
              {withCheckboxes && (
                <Checkbox
                  classes={{ indeterminate: classes.indeterminateCheckbox }}
                  indeterminate={
                    checkedRows.length > 0 &&
                    rows.body.length > checkedRows.length
                  }
                  checked={rows.body.length === checkedRows.length}
                  onChange={onSelectAllClick}
                />
              )}
            </CustomTableCell>
            {rows.head.map((cell) => {
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
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.body.map((row, ind: number) => {
            const selected = checkedRows.indexOf(ind) !== -1
            return (
              <TableRow className={classes.row} key={ind}>
                <CustomTableCell padding="checkbox">
                  {withCheckboxes && (
                    <Checkbox
                      indeterminate={false}
                      checked={selected}
                      onChange={(e) => {
                        onChange(e, ind)
                      }}
                    />
                  )}
                </CustomTableCell>
                {row.map((cell, i: number) => {
                  const numeric =
                    cell !== null &&
                    (typeof cell.text === 'number' || typeof cell === 'number')

                  return renderCell(cell, i, numeric)
                })}
              </TableRow>
            )
          })}
        </TableBody>
        {Array.isArray(rows.footer) && (
          <TableFooter className={classes.footer}>
            <TableRow>
              {withCheckboxes && <CustomTableCell padding="checkbox" />}
              {rows.footer.map(
                (
                  cell: {
                    text: string | number
                    number: boolean
                    style: any
                  },
                  i: number
                ) => {
                  const numeric =
                    typeof cell.text === 'number' ||
                    typeof cell === 'number' ||
                    cell.number

                  const spreadedCell = isObject(cell) ? cell : { text: cell }

                  const footerCell = {
                    ...spreadedCell,
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
  width: 100%;
  ${customAquaScrollBar};
`

export default withStyles(styles, { withTheme: true })(CustomTable)
