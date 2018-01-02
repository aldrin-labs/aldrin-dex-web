import App from './containers/App'
import TestComp from './containers/TestComp'

const routes = [
  {
    path: '/',
    exact: true,
    component: App,
  },
  {
    path: '/sample-page',
    exact: true,
    component: TestComp,
  },
]

export default routes
