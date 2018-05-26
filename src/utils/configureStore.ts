import rootEpic from '@utils/rootEpic'
import rootReducer from '@utils/rootReducer'

import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createEpicMiddleware } from 'redux-observable'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'

const history = createHistory()

const epicsMiddleware = createEpicMiddleware(rootEpic)
const routesMiddleware = routerMiddleware(history)

const initialState = {}
const middlewares = [epicsMiddleware, routesMiddleware]

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['login', 'portfolio', 'ui', 'user'],
}

console.log(storage)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
)

export const persistor = persistStore(store)
