import { createAction } from 'redux-act'
export const onLogin = createAction('ON_LOGIN')
export const storeLogin = createAction('STORE_LOGIN')
export const storeLogout = createAction('STORE_LOGOUT')

export const storeOpenedModal = createAction('STORE_OPENED_MODAL')
export const storeModalIsClosing = createAction('STORE_MODAL_IS_CLOSING')
export const storeClosedModal = createAction('STORE_CLOSED_MODAL')
export const listenersWillOn = createAction('LISTENERS_WILL_ON')
export const listenersWillOff = createAction('LISTENERS_WILL_OFF')
