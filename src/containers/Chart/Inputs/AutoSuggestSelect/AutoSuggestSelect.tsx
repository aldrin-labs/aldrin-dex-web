import React from 'react'
import { connect } from 'react-redux'

import * as actions from '@containers/Chart/actions'
import TextInputLoader from '@components/Placeholders/TextInputLoader'
import QueryRenderer from '@components/QueryRenderer'
import { Loading } from '@components/Loading/Loading'
import { SelectR } from '@styles/cssUtils'
import { MARKETS_BY_EXCHANE_QUERY } from '@containers/Chart/api'
import { createFilter } from 'react-select'

type T = { value: string; data: string }

let suggestions: T[] = []

class IntegrationReactSelect extends React.PureComponent {
  handleChange = ({ value }) => {
    const {
      selectCurrencies,
      charts,
      view,
      addChart,
      openWarningMessage,
      removeWarningMessage,
    } = this.props

    if (!value) {
      return
    }

    if (view === 'default') {
      selectCurrencies(value)

      return
    } else if (charts.length < 8 && view === 'onlyCharts') {
      addChart(value)

      return
    } else {
      setTimeout(() => {
        removeWarningMessage()
      }, 1500)
      openWarningMessage()
    }
  }
  render() {
    const { value, data } = this.props
    if (!suggestions || !data) {
      return <Loading centerAligned={true} />
    }

    const matchFrom: 'start' | 'any' = 'start'

    const filterConfig = {
      matchFrom,
      ignoreCase: true,
      trim: true,
    }

    if (data) {
      suggestions = data.getMarketsByExchange.map((suggestion: any) => ({
        value: suggestion.symbol,
        label: suggestion.symbol,
      }))
    }
    return (
      <div style={{ width: '15%' }} className="AutoSuggestSelect">
        <SelectR
          filterOption={createFilter(filterConfig)}
          placeholder="Add chart"
          value={value && { value, label: value }}
          fullWidth={true}
          options={suggestions || []}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

const queryRender = (props: any) => {
  return (
    <QueryRenderer
      centerAlign={false}
      placeholder={() => <TextInputLoader style={{ width: 100, margin: 0 }} />}
      component={IntegrationReactSelect}
      query={MARKETS_BY_EXCHANE_QUERY}
      variables={{ splitter: '_', exchange: props.exchange.exchange.symbol }}
      {...props}
    />
  )
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(queryRender)
