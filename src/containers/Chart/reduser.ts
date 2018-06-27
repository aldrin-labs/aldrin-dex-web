import { createReducer } from 'redux-act'
import { uniqWith, isEqual } from 'lodash'

import * as actions from './actions'

const initialState = {
  activeExchange: null,
  currencyPair: null,
  warningMessageOpened: false,
  charts: [],
  view: 'default',
}

export default createReducer(
  {
    [actions.selectExchange]: (state, payload) => ({
      ...state,
      activeExchange: payload,
    }),
    [actions.selectCurrencies]: (state, payload) => ({
      ...state,
      currencyPair: payload,
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
    [actions.toggleWarningMessage]: (state) => ({
      ...state,
      warningMessageOpened: !state.warningMessageOpened,
    }),
    [actions.toggleView]: (state, payload: 'default' | 'onlyCharts') => ({
      ...state,
      view: payload,
    }),
  },
  initialState
)
