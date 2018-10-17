import { createReducer } from 'redux-act'

import { 
  addExchangeKey,
  testUser,
  toggleMocks
} from '@containers/User/actions'

const initialState = {
  check: 'lol',
  isShownMocks: false,
}

export default createReducer(
  {
    [addExchangeKey]: (state, payload) => ({ ...state, check: 5 }),
    [testUser]: (state, payload) => ({ ...state, test: 'eeeee booooiii' }),
    [toggleMocks]: (state, payload) => ({
      ...state,
      isShownMocks: !state.isShownMocks,
    }),
  },
  initialState
)
