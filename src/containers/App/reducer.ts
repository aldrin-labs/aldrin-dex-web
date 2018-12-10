import { createReducer } from 'redux-act'

import * as actions from './actions'

// Use App containers as initialState for reusable parts

const initialState = {
  theme: 'dark',
  portfolio: {
    drawer: false,
  },
  mobilePopup: true,
  showPrivacyPolicy: false,
}

export default createReducer(
  {
    [actions.changeThemeMode]: (state, payload) => ({
      ...state,
      theme: state.theme === 'dark' ? 'light' : 'dark',
    }),
    [actions.toggleMobilePopup]: (state, payload) => ({
      ...state,
      mobilePopup: !state.mobilePopup,
    }),
    [actions.togglePrivacyPolicy]: (state, payload) => ({
      ...state,
      showPrivacyPolicy: !state.showPrivacyPolicy,
    }),
  },
  initialState
)
