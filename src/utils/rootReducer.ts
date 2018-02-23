import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

// TODO: export all reducers in index, then rest them to combine reducers, no 9000 imports pls
import screener from '@containers/Screener/reducer'
import user from '@containers/User/reducer'

export default combineReducers({
  screener,
  router,
  user,
})
