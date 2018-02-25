import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  user: null,
  loginStatus: null,
}

export default createReducer(
  {
    [actions.storeLogin]: (state, payload) => {
      console.log(555555555, state, payload)
      return { ...state, user: { ...payload }, loginStatus: true }
    },
    [actions.storeLogout]: (state, payload) => {
      console.log(6666666, state, payload)
      return { ...state, user: null, loginStatus: false }
    },
  },
  initialState
)
