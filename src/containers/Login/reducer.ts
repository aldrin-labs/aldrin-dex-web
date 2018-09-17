import { createReducer } from 'redux-act'

import * as actions from '@containers/Login/actions'

const initialState = {
  user: null,
  loginStatus: null,
  isShownModal: false
}

export default createReducer(
  {
    [actions.storeLogin]: (state, payload) => {
      return { ...state, user: { ...payload }, loginStatus: true }
    },
    [actions.storeLogout]: (state, payload) => {
      return { ...state, user: null, loginStatus: false }
    },
    [actions.storeOpenModal]: (state, payload) => {
      return state
    },
  },
  initialState
)
