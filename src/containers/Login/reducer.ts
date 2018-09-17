import { createReducer } from 'redux-act'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import * as actions from '@containers/Login/actions'



const initialState = {
  user: null,
  loginStatus: null,
  modalIsOpen: false
}

const UserReducer = createReducer(
  {
    [actions.storeLogin]: (state, payload) => {
      return { ...state, user: { ...payload }, loginStatus: true }
    },
    [actions.storeLogout]: (state, payload) => {
      return { ...state, user: null, loginStatus: false }
    },
    [actions.storeOpenedModal]: (state) => {
      return {...state, modalIsOpen: true}
    },
    [actions.storeClosedModal]: (state) => {
      return {...state, modalIsOpen: false}
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
