import { createReducer } from 'redux-act'
import { uniqWith, isEqual } from 'lodash-es'
import nanoid from 'nanoid'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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

const chartReducer = createReducer(
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
      // const fitlerSamePairs = uniqWith([...state.charts, payload], isEqual)

      return {
        ...state,
        charts: [...state.charts, { pair: payload, id: nanoid() }],
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

const persistConfig = {
  key: 'chart',
  storage: storage,
  whitelist: ['charts', 'currencyPair', 'activeExchange'],
}

export default persistReducer(persistConfig, chartReducer)
