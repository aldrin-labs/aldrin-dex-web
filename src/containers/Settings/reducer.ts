import { createReducerAsync } from 'redux-act-async'
import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  check: 'lol',
}

export default createReducer(
  {
    [actions.addExchangeKey]: (state, payload) => {
      console.log(555, state, payload)
      return { ...state, check: 5 }
    },
  },
  initialState
)
