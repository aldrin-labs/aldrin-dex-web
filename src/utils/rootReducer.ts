import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import screener from '@containers/Screener/reducer'

export default combineReducers({
  screener,
  router,
})
