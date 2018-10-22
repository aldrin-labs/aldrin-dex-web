import { createReducer } from 'redux-act'

import * as actions from '@containers/Login/actions'

const initialState = {
  user: null,
  loginStatus: null,
  modalStatuses: {
    modalIsOpen: false,
    isLogging: false,
    modalLogging: false,
    listenersOff: false
  }
}

export default createReducer(
  {
    [actions.onLogin]: (state, payload) => {
      return {
        ...state,
        user: { ...payload },
        modalStatuses: { ...{isLogging: true} }
      }
    },
    [actions.storeLogin]: (state, payload) => {
      return {
        ...state,
        user: { ...payload },
        modalStatuses: { ...{ isLogging: false } }
      }
    },
    [actions.storeLogout]: (state, payload) => {
      return {
        ...state,
        user: null,
        loginStatus: false,
        modalStatuses: { ...{ modalIsOpen: false } }
      }
    },
    [actions.storeModalIsClosing]: (state, payload) => {
      return {
        ...state,
        user: { ...payload },
        modalStatuses: { ...{ modalLogging: true } }
      }
    },
    [actions.storeOpenedModal]: (state) => {
      return {
        ...state,
        modalStatuses: { ...{ modalIsOpen: true } }
      }
    },
    [actions.storeClosedModal]: (state) => {
      return {
        ...state,
        modalIsOpen: false,
        modalStatuses: { ...{ modalLogging: false } }
      }
    },
    [actions.listenersWillOff]: (state) => {
      return {
        ...state,
        modalStatuses: { ...{ listenersOff: true } }
      }
    },
    [actions.listenersWillOn]: (state) => {
      return {
        ...state,
        modalStatuses: { ...{ listenersOff: false } }
      }
    }
  },
  initialState
)
