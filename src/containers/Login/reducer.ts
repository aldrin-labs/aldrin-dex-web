import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  login: null,
}

export default createReducer(
  {
    [actions.storeLogin]: (state, payload) => {
      console.log(555555555, state, payload)
      return { ...state, login: { ...payload } }
    },
    [actions.storeLogout]: (state, payload) => {
      console.log(6666666, state, payload)
      return { ...state, login: null }
    },
  },
  initialState
)
