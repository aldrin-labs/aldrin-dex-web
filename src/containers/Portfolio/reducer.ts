import { createReducer } from 'redux-act'
import * as R from 'ramda'

import * as actions from './actions'

const initialState = {
  portfolio: null,
  selectedAccounts: [],
  optimizationData: [],
  correlationTableFullscreenEnabled: false,
  correlationPeriod: '',
  correlationStartDate: 0,
  correlationEndDate: 0,
  filterValuesLessThenThat: 0,
  keys: [],
}

export default createReducer(
  {
    [actions.filterValuesLessThen]: (state, payload) => ({
      ...state,
      filterValuesLessThenThat: payload.target.value,
    }),
    [actions.setKeys]: (state, payload) => ({
      ...state,
      keys: payload,
    }),
    [actions.updateDataForOptimization]: (state, payload) => ({
      ...state,
      optimizationData: payload,
    }),
    [actions.toggleCorrelationTableFullscreen]: (state, payload) => ({
      ...state,
      correlationTableFullscreenEnabled: !state.correlationTableFullscreenEnabled,
    }),

    [actions.getPortfolio]: (state, payload) => {
      return { ...state, ...payload }
    },
    [actions.setCorrelationPeriod]: (state, payload) => ({
      ...state,
      correlationPeriod: payload.correlationPeriod,
      correlationStartDate: payload.correlationStartDate,
      correlationEndDate: payload.correlationEndDate,
    }),
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
