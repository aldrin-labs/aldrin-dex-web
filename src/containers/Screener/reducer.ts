import { createReducer } from 'redux-act'

import * as actions from '@containers/Screener/actions'

const initialState = { test: false }

export default createReducer({
  [actions.test]: state => ({ test: true }),
}, initialState)
