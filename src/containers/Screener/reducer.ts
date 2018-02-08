import { createReducer } from 'redux-act'

import { PING, PONG } from './actions'

const initialState = { isPinging: null }

export default createReducer({
  [PING]: state => ({ isPinging: true }),
  [PONG]: state => ({ isPinging: false }),
}, initialState)
