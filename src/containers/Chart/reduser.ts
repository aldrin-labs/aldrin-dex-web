import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  activeExchange: null,
  base: null,
  quote: null,
}

export default createReducer(
  {
    [actions.selectExchange]: (state, payload) => ({
      ...state,
      activeExchange: payload,
    }),
    [actions.selectCurrencies]: (state, payload) => ({
      ...state,
      base: payload.split('/')[0],
      quote: payload.split('/')[1],
    }),
  },
  initialState
)
