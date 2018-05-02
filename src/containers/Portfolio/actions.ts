import { createAction } from 'redux-act'

export const getPortfolio = createAction('GET_PORTFOLIO')
export const addExchangeKey = createAction('ADD_EXCHANGE_KEY')
export const selectAccount = createAction('SELECT_ACCOUNT')
export const updateSelectedAccounts = createAction('UPDATE_SELECTED_ACCOUNTS')
export const onLoad = createAction('ON_LOAD')
export const selectAllKeys = createAction('SELECT_ALL_KEYS')
export const mergeAllKeys = createAction('MERGE_ALL_KEYS')
