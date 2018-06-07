import { createReducer } from 'redux-act'
import * as R from 'ramda'

import * as actions from './actions'

const initialState = {
  portfolio: null,
  selectedAccounts: [],
  optimizationData: [],
}

export default createReducer(
  {
    [actions.updateDataForOptimization]: (state, payload) => ({
      ...state,
      optimizationData: payload,
    }),

    [actions.getPortfolio]: (state, payload) => {
      return { ...state, ...payload }
    },
    [actions.updateSelectedAccounts]: (state, payload) => {
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
