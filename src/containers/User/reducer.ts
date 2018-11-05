import { createReducer } from 'redux-act'

import * as actions from '@containers/User/actions'

const initialState = {
  check: 'lol',
  isShownMocks: false,
  showBinanceWarning: true,
  toolTip: {
    portfolioMain: true,
    portfolioIndustry: true,
    portfolioRebalance: true,
    portfolioCorrelation: true,
    portfolioOptimization: true,
  },
}

export default createReducer(
  {
    [actions.addExchangeKey]: (state, payload) => ({ ...state, check: 5 }),
    [actions.testUser]: (state, payload) => ({ ...state, test: 'eeeee booooiii' }),
    [actions.updateBinanceWarning]: (state, payload) => ({ ...state, showBinanceWarning: payload }),
    [actions.toggleMocks]: (state, payload) => ({
      ...state,
      isShownMocks: !state.isShownMocks,
    }),
    [actions.showToolTip]: (state) => ({
      ...state,
      toolTip: {
        portfolioMain: true,
        portfolioIndustry: true,
        portfolioRebalance: true,
        portfolioCorrelation: true,
        portfolioOptimization: true,
      },
    }),
    [actions.hideToolTip]: (state, payload) => {
      switch (payload) {
        case 'Main': return { ...state, toolTip: { ...state.toolTip, portfolioMain: false}}
        case 'Industry': return { ...state, toolTip: { ...state.toolTip, portfolioIndustry: false}}
        case 'Rebalance': return { ...state, toolTip: { ...state.toolTip, portfolioRebalance: false}}
        case 'Correlation': return { ...state, toolTip: { ...state.toolTip, portfolioCorrelation: false}}
        case 'Optimization': return { ...state, toolTip: { ...state.toolTip, portfolioOptimization: false}}
        default: return state
      }
    },
  },
  initialState
)
