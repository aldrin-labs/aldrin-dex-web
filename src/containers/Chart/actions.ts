import { createAction } from 'redux-act'

export const selectExchange = createAction('SELECT_EXCHANGE')
export const selectCurrencies = createAction('SELECT_CURRENCIES')
export const addChart = createAction('ADD_CHART')
export const removeChart = createAction('REMOVE_CHART')
export const openWarningMessage = createAction('OPEN_WARNING_MESSAGE')
export const removeWarningMessage = createAction('REMOVE_WARNING_MESSAGE')
export const toggleView = createAction('TOGGLE_VIEW')
