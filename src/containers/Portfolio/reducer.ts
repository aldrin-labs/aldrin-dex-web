import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  portfolio: null,
  selectedAccounts: [0],
}

export default createReducer(
  {
    [actions.getPortfolio]: (state, payload) => {
      console.log(3333, state, payload)
      return { ...state, ...payload }
    },
    [actions.updateSelectedAccounts]: (state, payload) => {
      console.log(11111, state, payload)
      return {...state, selectedAccounts: [...payload] }
    }
  }, initialState
)
