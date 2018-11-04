import { createReducer } from 'redux-act'

import * as actions from '@containers/User/actions'

const initialState = {
  check: 'lol',
  isShownMocks: false,
  showBinanceWarning: true,
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
  },
  initialState
)
