import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  activeExchange: null,
  currencyPair: null,
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
  },
  initialState
)
