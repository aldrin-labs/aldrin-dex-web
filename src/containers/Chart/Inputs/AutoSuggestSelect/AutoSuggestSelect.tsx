/* eslint-disable react/prop-types */
//  https://github.com/mui-org/material-ui/blob/master/docs/src/pages/demos/autocomplete/IntegrationReactSelect.js
import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Select from 'react-select-for-charting-page'
import { MdArrowDropDown, MdArrowDropUp, MdClear } from 'react-icons/lib/md'

import * as actions from '@containers/Chart/actions'

import QueryRenderer from '@components/QueryRenderer'
import { Loading } from '@components/Loading/Loading'
import gql from 'graphql-tag'

export const MarketsQuery = gql`
  query MarketsQuery {
    liveMarkets {
      name
    }
  }
`

let suggestions = [
  { label: 'BTC/USD' },
  { label: 'XRP/USD' },
  { label: 'LTC/USD' },
  { label: 'ETH/BTC' },
  { label: 'BCH/USD' },
  { label: 'EOS/BTC' },
  { label: 'LTC/ETH' },
  { label: 'XLM/ADA' },
  { label: 'ADA/EUR' },
  { label: 'ADA/USD' },
  { label: 'MIOTA/RUB' },
  { label: 'USDT/USD' },
  { label: 'TRX/EUR' },
  { label: 'LOL/KEK' },
  { label: 'KEK/LOL' },
  { label: 'USD/ETH' },
  { label: 'XMR/USD ' },
].map((suggestion) => ({
  value: suggestion.label,
  label: suggestion.label,
}))

class Option extends React.Component {
  handleClick = (event) => {
    const {
      onSelect,
      selectCurrencies,
      charts,
      view,
      addChart,
      openWarningMessage,
      removeWarningMessage,
    } = this.props

    onSelect(this.props.option, event)
    if (view === 'default') {
      selectCurrencies(this.props.option.value)

      return
    } else if (charts.length < 8 && view === 'onlyCharts') {
      addChart(this.props.option.value)

      return
    } else {
      setTimeout(() => {
        removeWarningMessage()
      }, 1500)
      openWarningMessage()
    }
  }

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    )
  }
}

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  view: store.chart.view,
  charts: store.chart.charts,
  isShownMocks: store.user.isShownMocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  openWarningMessage: () => dispatch(actions.openWarningMessage()),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
  selectCurrencies: (baseQuote: string) =>
    dispatch(actions.selectCurrencies(baseQuote)),
  addChart: (baseQuote: string) => dispatch(actions.addChart(baseQuote)),
})

const Opt = connect(mapStateToProps, mapDispatchToProps)(Option)

function SelectWrapped(props) {
  const { classes, ...other } = props

  const onInputKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: // ENTER
        e.preventDefault()
        break
      default:
        break
    }
  }

  return (
    <Select
      onInputKeyDown={onInputKeyDown}
      optionComponent={Opt}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={(arrowProps) =>
        arrowProps.isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />
      }
      clearRenderer={() => <MdClear />}
      valueComponent={(valueProps) => {
        const { value, children, onRemove } = valueProps

        const onDelete = (event) => {
          event.preventDefault()
          event.stopPropagation()
          onRemove(value)
        }

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<div onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          )
        }

        return <div className="Select-value">{children}</div>
      }}
      {...other}
    />
  )
}

class IntegrationReactSelect extends React.Component {
  render() {
    const { classes, id, value, data } = this.props
    if (!suggestions || !data) {
      return <Loading centerAligned />
    }

    if (data) {
      suggestions = data.liveMarkets.map((suggestion: any) => ({
        value: suggestion.name,
        label: suggestion.name,
      }))
    }

    return (
      <div className={classes.root}>
        <Input
          classes={{
            underline: classes.cssUnderline,
          }}
          fullWidth
          inputComponent={SelectWrapped}
          value={value}
          onChange={() => {}}
          placeholder="Add currency pair"
          id={id}
          inputProps={{
            classes,
            name: id,
            instanceId: id,
            simpleValue: true,
            options: suggestions,
          }}
        />
      </div>
    )
  }
}

const ITEM_HEIGHT = 48

const styles = (theme) => ({
  root: {
    height: '100%',
    width: '15%',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  cssUnderline: {
    '&:after': {
      borderBottomColor: '#4ed8da',
    },
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '::-webkit-scrollbar': { width: 3 },
    '::-webkit-scrollbar-track': { background: 'rgba(45, 49, 54, 0.1)' },
    '::-webkit-scrollbar-thumb': {
      background: '#4ed8da',
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      color: 'white',
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: 'white',
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
})

const queryRender = function(props: any) {
  console.log(props)
  return (
    <QueryRenderer
      component={IntegrationReactSelect}
      query={MarketsQuery}
      {...props}
    />
  )
}

export default withStyles(styles)(queryRender)
