import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = { test: false }

export default createReducer({
  [actions.test]: state => ({ test: true }),
}, initialState)
