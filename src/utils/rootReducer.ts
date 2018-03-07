import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

// TODO: export all reducers in index, then rest them to combine reducers, no 9000 imports pls
import screener from '@containers/Screener/reducer'
import settings from '@containers/Settings/reducer'
import login from '@containers/Login/reducer'
import portfolio from '@containers/Portfolio/reducer'
import ui from '@containers/App/reducer'

export default combineReducers({
  screener,
  router,
  settings,
  login,
  portfolio,
  ui,
})
