import { createAction } from 'redux-act'

export const toggleCorrelationTableFullscreen = createAction(
  'TOGGLE_FULLSCREEN'
)
export const getPortfolio = createAction('GET_PORTFOLIO')
export const addExchangeKey = createAction('ADD_EXCHANGE_KEY')
export const setActiveChart = createAction('SET_ACTIVE_CHART')
export const selectAccount = createAction('SELECT_ACCOUNT')
export const updateSelectedAccounts = createAction('UPDATE_SELECTED_ACCOUNTS')
export const onLoad = createAction('ON_LOAD')
export const selectAllKeys = createAction('SELECT_ALL_KEYS')
export const filterValuesLessThen = createAction('FILTER_VALUES_LESS_THEN')
export const mergeAllKeys = createAction('MERGE_ALL_KEYS')
export const setKeys = createAction('SET_KEYS')
export const setActiveKeys = createAction('SET_ACTIVE_KEYS')
export const setWallets = createAction('SET_WALLETS')
export const setActiveWallets = createAction('SET_ACTIVE_WALLETS')
export const setCorrelationPeriod = createAction('SET_CORRELATION_PERIOD')
export const setOptimizationPeriod = createAction('SET_OPTIMIZATION_PERIOD')
export const updateDataForOptimization = createAction(
  'UPDATE_DATA_FOR_OPTIMIZATION'
)
