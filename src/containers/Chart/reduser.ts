import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  activeExchange: null,
}

export default createReducer(
  {
    [actions.selectExchange]: (state, payload) => ({
      ...state,
      activeExchange: payload,
    }),
  },
  initialState
)
