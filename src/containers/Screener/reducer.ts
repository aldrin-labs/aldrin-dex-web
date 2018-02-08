import { createReducer } from 'redux-act'

import { add, inc } from './actions'

const initialState = { count : 0 }

export default createReducer({
  [inc]: state => state.count + 1,
  [add]: (state, payload) => state.count + payload,
}, initialState)
