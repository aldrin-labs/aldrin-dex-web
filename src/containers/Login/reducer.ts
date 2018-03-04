import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  user: null,
  loginStatus: null,
}

export default createReducer(
  {
    [actions.storeLogin]: (state, payload) => {
      return { ...state, user: { ...payload }, loginStatus: true }
    },
    [actions.storeLogout]: (state, payload) => {
      return { ...state, user: null, loginStatus: false }
    },
  },
  initialState
)
