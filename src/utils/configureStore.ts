import rootEpic from '@utils/rootEpic'
import rootReducer from '@utils/rootReducer'

import createHistory from 'history/createBrowserHistory'
import Immutable from 'immutable'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createEpicMiddleware } from 'redux-observable'
import { autoRehydrate, persistStore } from 'redux-persist-immutable'

const history = createHistory()

const epicsMiddleware = createEpicMiddleware(rootEpic)
const routesMiddleware = routerMiddleware(history)

const initialState = Immutable.Map({});
const middlewares = [epicsMiddleware]

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares), autoRehydrate())
)

export default persistStore(store, {})
