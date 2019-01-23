import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
// TODO: export all reducers in index, then rest them to combine reducers, no 9000 imports pls
import user from '@core/redux/user/reducer'
import chartReducer from '@core/redux/chart/reducer'
import portfolio from '@containers/Portfolio/reducer'
import ui from '@containers/App/reducer'

const chartPersistConfig = {
  key: 'chart',
  storage: storage,
  whitelist: ['charts', 'currencyPair', 'activeExchange'],
}
const chart = persistReducer(chartPersistConfig, chartReducer)


const rootReducer = combineReducers({
  router,
  user,
  portfolio,
  ui,
  chart,
})

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['portfolio', 'ui', 'user'],
}

export default persistReducer(persistConfig, rootReducer)
