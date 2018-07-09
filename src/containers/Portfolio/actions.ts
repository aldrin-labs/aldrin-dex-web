import { createAction } from 'redux-act'

export const toggleCorrelationTableFullscreen = createAction(
  'TOGGLE_FULLSCREEN'
)
export const getPortfolio = createAction('GET_PORTFOLIO')
export const addExchangeKey = createAction('ADD_EXCHANGE_KEY')
export const selectAccount = createAction('SELECT_ACCOUNT')
export const updateSelectedAccounts = createAction('UPDATE_SELECTED_ACCOUNTS')
export const onLoad = createAction('ON_LOAD')
export const selectAllKeys = createAction('SELECT_ALL_KEYS')
export const mergeAllKeys = createAction('MERGE_ALL_KEYS')
export const setCorrelationPeriod = createAction('SET_CORRELATION_PERIOD')
export const updateDataForOptimization = createAction(
  'UPDATE_DATA_FOR_OPTIMIZATION'
)
