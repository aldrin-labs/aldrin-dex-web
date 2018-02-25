import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  user: null,
}

export default createReducer(
  {
    [actions.storeLogin]: (state, payload) => {
      console.log(555555555, state, payload)
      return { ...state, user: { ...payload } }
    },
    [actions.storeLogout]: (state, payload) => {
      console.log(6666666, state, payload)
      return { ...state, user: null }
    },
  },
  initialState
)
