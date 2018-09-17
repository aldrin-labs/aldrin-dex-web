import { createReducer } from 'redux-act'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import * as actions from '@containers/Login/actions'



const initialState = {
  user: null,
  loginStatus: null,
  modalIsOpen: false,
  isLogging: false,
}

const UserReducer = createReducer(
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
  },
  initialState
)

const persistConfig = {
  key: 'login',
  storage: storage,
  whitelist: ['user', 'loginStatus']
};

export default persistReducer(persistConfig, UserReducer);
