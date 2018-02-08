import { combineReducers } from 'redux-immutable'

import * as ScreenerReducer from '@containers/Screener/reducer'

export default combineReducers({
  screener: ScreenerReducer
})
