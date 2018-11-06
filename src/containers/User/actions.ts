import { createAction } from 'redux-act'

export const addExchangeKey = createAction('ADD KEY')
export const testUser = createAction('TEST_USER')
export const toggleMocks = createAction('TOGGLE_MOCKS')
export const updateBinanceWarning = createAction('UPDATE_BINANCE_WARNING')
export const showToolTip = createAction('SHOW_TOOL_TIP')
export const hideToolTip = createAction('HIDE_TOOL_TIP')