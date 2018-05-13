import { createReducer } from 'redux-act'
import * as R from 'ramda'

import * as actions from './actions'

const initialState = {
  portfolio: null,
  selectedAccounts: [],
}

export default createReducer(
  {
    [actions.getPortfolio]: (state, payload) => {
      console.log(3333, state, payload)

      return { ...state, ...payload }
    },
    [actions.updateSelectedAccounts]: (state, payload) => {
      console.log(11111, state, payload)

      return { ...state, selectedAccounts: [...payload] }
    },
    [actions.selectAllKeys]: (state, payload) => {
      const isEqual = R.equals(state.selectedAccounts, payload)
      if (isEqual) {
        return { ...state, selectedAccounts: [] }
      }

      return { ...state, selectedAccounts: [].concat(payload) }
    },
  },
  initialState
)
