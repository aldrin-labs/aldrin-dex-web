import { createReducer } from 'redux-act'
import { uniqWith, isEqual } from 'lodash'

import * as actions from '@containers/Chart/actions'

const initialState = {
  activeExchange: { index: 0, exchange: { symbol: 'binance' } },
  currencyPair: 'BTC_USDT',
  warningMessageOpened: false,
  charts: [],
  view: 'default',
  asks: [],
  bids: [],
}

export default createReducer(
  {
    [actions.setOrders]: (state, payload) => ({
      ...state,
      asks: payload.asks,
      bids: payload.bids,
    }),
    [actions.selectExchange]: (state, payload) => ({
      ...state,
      activeExchange: payload,
    }),
    [actions.selectCurrencies]: (state, payload) => ({
      ...state,
      currencyPair: payload,
      charts:
        state.charts.length === 0
          ? [payload]
          : uniqWith([payload, ...state.charts], isEqual),
    }),
    [actions.addChart]: (state, payload) => {
      const fitlerSamePairs = uniqWith([...state.charts, payload], isEqual)

      return {
        ...state,
        charts: fitlerSamePairs,
      }
    },
    [actions.removeChart]: (state, index) => ({
      ...state,
      charts: state.charts.filter((pair, i) => {
        if (index !== i) {
          return true
        }

        return false
      }),
    }),
    [actions.openWarningMessage]: (state) => ({
      ...state,
      warningMessageOpened: true,
    }),
    [actions.removeWarningMessage]: (state) => ({
      ...state,
      warningMessageOpened: false,
    }),
    [actions.toggleView]: (state, payload: 'default' | 'onlyCharts') => ({
      ...state,
      view: payload,
    }),
  },
  initialState
)
