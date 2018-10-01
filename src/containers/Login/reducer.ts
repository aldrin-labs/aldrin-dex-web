import { createReducer } from 'redux-act'

import * as actions from '@containers/Login/actions'

const initialState = {
  user: null,
  loginStatus: null,
  modalIsOpen: false,
  isLogging: false,
  listenersOff: false,
}

export default createReducer(
  {
    [actions.onLogin]: (state, payload) => {
      return { ...state, user: { ...payload }, isLogging: true }
    },
    [actions.storeLogin]: (state, payload) => {
      return { ...state, user: { ...payload }, loginStatus: true, isLogging: false }
    },
    [actions.storeLogout]: (state, payload) => {
      return { ...state, user: null, loginStatus: false, modalIsOpen: false }
    },
    [actions.storeModalIsClosing]: (state, payload) => {
      return { ...state, user: { ...payload }, isLogging: true }
    },
    [actions.storeOpenedModal]: (state) => {
      return {...state, modalIsOpen: true}
    },
    [actions.storeClosedModal]: (state) => {
      return {...state, modalIsOpen: false, isLogging: false}
    },
    [actions.listenersWillOff]: (state) => {
      return {...state, listenersOff: true}
    },
    [actions.listenersWillOn]: (state) => {
      return {...state, listenersOff: false}
    }
  },
  initialState
)
