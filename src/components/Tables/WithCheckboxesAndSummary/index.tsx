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
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'

import { Props, Cell, OnChange, Row } from './index.types'
import { customAquaScrollBar } from '@styles/cssUtils'
import { isObject } from 'lodash-es'
import { Typography, IconButton, Grow } from '@material-ui/core'

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

const styles = (theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  rowExpanded: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
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

const renderCheckBox = (
  type: 'check' | 'expand' | null,
  onChange: OnChange,
  ind: number,
  expandedRow: number | undefined = undefined,
  selected = true
) =>
  type === 'expand' ? (
    <Checkbox
      checkedIcon={<ExpandLess />}
      icon={<ExpandMore />}
      onChange={(e) => {
        onChange(e, ind)
      }}
      checked={ind === expandedRow}
    />
  ) : type === 'check' ? (
    <Checkbox
      indeterminate={false}
      checked={selected}
      onChange={(e) => {
        onChange(e, ind)
      }}
    />
  ) : null

const renderCell = (cell: Cell, id: number, numeric: boolean) => {
  if (cell !== null && typeof cell === 'object') {
    return (
      <CustomTableCell
        scope="row"
        variant="body"
        style={{ color: cell.color, ...cell.style }}
        key={id}
        numeric={numeric}
      >
        {cell.text}
      </CustomTableCell>
    )
  }
  if (typeof cell !== 'object') {
    return (
      <CustomTableCell scope="row" variant="body" numeric={numeric} key={id}>
        {cell}
      </CustomTableCell>
    )
  }

  return (
    <CustomTableCell scope="row" variant="body" numeric={numeric} key={id}>
      {''}
    </CustomTableCell>
  )
}
{
  /* ToDo: - Add sorting
            - Fixed  summary
            - Add settings render
            - Add Tooltips To header
            - Add render anything to Cell
          */
}

const CustomTable = (props: Props) => {
  const {
    expandedRow,
    classes,
    padding = 'dense',
    rows = { head: [], body: [], footer: [] },
    withCheckboxes = false,
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

  const howManyColumns = withCheckboxes
    ? rows.head.length
    : rows.head.length - 1
  const expandableRows = typeof expandedRow === 'number'

  return (
    <Background className={classes.root}>
      <Table padding={padding ? padding : 'default'} className={classes.table}>
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
            {withCheckboxes && (
              <CustomTableCell padding="checkbox">
                <Checkbox
                  classes={{ indeterminate: classes.indeterminateCheckbox }}
                  indeterminate={
                    checkedRows.length > 0 &&
                    rows.body.length > checkedRows.length
                  }
                  checked={rows.body.length === checkedRows.length}
                  onChange={onSelectAllClick}
                />
              </CustomTableCell>
            )}
            {expandableRows && <CustomTableCell padding="checkbox" />}
            {rows.head.map((cell) => {
              return (
                <CustomTableCell
                  style={{ ...cell.style }}
                  variant="head"
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
            const expandable = Array.isArray(row[row.length - 1])
            const typeOfCheckbox: 'check' | 'expand' | null = withCheckboxes
              ? 'check'
              : expandableRows
                ? 'expand'
                : null

            return (
              <React.Fragment key={ind}>
                <TableRow className={classes.row}>
                  <CustomTableCell padding="checkbox">
                    {renderCheckBox(
                      typeOfCheckbox,
                      onChange,
                      ind,
                      expandedRow,
                      selected
                    )}
                  </CustomTableCell>

                  {row.map((cell, cellIndex: number) => {
                    const numeric =
                      cell !== null &&
                      (typeof cell.text === 'number' ||
                        typeof cell === 'number')

                    // skiping rendering cell if it is array and last one
                    //  this is how we are detecting if row expandable
                    if (cellIndex === row.length - 1 && expandable) {
                      return
                    }

                    return renderCell(cell, cellIndex, numeric)
                  })}
                </TableRow>
                {expandable &&
                  // rendering content of expanded row if it is expandable
                  (row[row.length - 1] as Row[]).map(
                    (collapsedRows: Row, i: number) => {
                      return (
                        <Grow
                          // but we hiding until have an expandedRow
                          // saying to open expanded content
                          in={ind === expandedRow}
                          key={i}
                          unmountOnExit={true}
                          mountOnEnter={true}
                        >
                          <TableRow className={classes.rowExpanded}>
                            <CustomTableCell padding="checkbox" />
                            {collapsedRows.map(
                              (cell: Cell, cellIndex: number) => {
                                const numeric =
                                  cell !== null &&
                                  (typeof cell.text === 'number' ||
                                    typeof cell === 'number')

                                return renderCell(cell, cellIndex, numeric)
                              }
                            )}
                          </TableRow>
                        </Grow>
                      )
                    }
                  )}
              </React.Fragment>
            )
          })}
        </TableBody>
        {Array.isArray(rows.footer) && (
          <TableFooter className={classes.footer}>
            <TableRow>
              {(withCheckboxes || expandableRows) && (
                <CustomTableCell padding="checkbox" />
              )}
              {rows.footer.map((cell, cellIndex) => {
                const numeric =
                  typeof cell.text === 'number' ||
                  typeof cell === 'number' ||
                  cell.number

                const spreadedCell = isObject(cell) ? cell : { text: cell }

                const footerCell = {
                  ...(spreadedCell as object),
                  style: {
                    ...cell.style,
                    opacity: 0.84,
                    color: 'black',
                  },
                }

                return renderCell(footerCell as Cell, cellIndex, numeric)
              })}
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
