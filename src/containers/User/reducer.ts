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
    [actions.test]: (state, payload) => {
      console.log(666, state, payload)
      return { ...state, test: 'eeeee booooiii' }
    },
  },
  initialState
)
