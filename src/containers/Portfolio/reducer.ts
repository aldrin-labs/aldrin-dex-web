import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  portfolio: null
}

export default createReducer(
  {
    [actions.getPortfolio]: (state, payload) => {
      console.log(3333, state, payload)
      return { ...state, portfolio: { ...payload }}
    }
  }, initialState
)
