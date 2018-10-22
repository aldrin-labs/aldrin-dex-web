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
        modalStatuses: { ...state.modalStatuses, isLogging: true }
      }
    },
    [actions.storeLogin]: (state, payload) => {
      return {
        ...state,
        user: { ...payload },
        loginStatus: true,
        modalStatuses: { ...state.modalStatuses, isLogging: false  }
      }
    },
    [actions.storeLogout]: (state, payload) => {
      return {
        ...state,
        user: null,
        loginStatus: false,
        modalStatuses: { ...state.modalStatuses, modalIsOpen: false }
      }
    },
    [actions.storeModalIsClosing]: (state, payload) => {
      return {
        ...state,
        user: { ...payload },
        modalStatuses: { ...state.modalStatuses, modalLogging: true }
      }
    },
    [actions.storeOpenedModal]: (state) => {
      return {
        ...state,
        modalStatuses: { ...state.modalStatuses, modalIsOpen: true }
      }
    },
    [actions.storeClosedModal]: (state) => {
      return {
        ...state,
        modalStatuses: {
          ...state.modalStatuses,
          modalLogging: false,
          modalIsOpen: false, 
        }
      }
    },
    [actions.listenersWillOff]: (state) => {
      return {
        ...state,
        modalStatuses: { ...state.modalStatuses, listenersOff: true }
      }
    },
    [actions.listenersWillOn]: (state) => {
      return {
        ...state,
        modalStatuses: { ...state.modalStatuses, listenersOff: false }
      }
    }
  },
  initialState
)
