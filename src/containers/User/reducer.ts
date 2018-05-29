import { createReducer } from 'redux-act'

import * as actions from './actions'

const initialState = {
  check: 'lol',
  isShownMocks: true,
}

export default createReducer(
  {
    [actions.addExchangeKey]: (state, payload) => ({ ...state, check: 5 }),
    [actions.test]: (state, payload) => ({ ...state, test: 'eeeee booooiii' }),
    [actions.toggleMocks]: (state, payload) => ({
      ...state,
      isShownMocks: !state.isShownMocks,
    }),
  },
  initialState
)
