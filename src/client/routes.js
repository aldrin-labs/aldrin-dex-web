import App from './containers/App'
import TestComp from './containers/TestComp'
// import Login from './containers/Login'
import Chart from './containers/Chart'
import NotFound from './components/pages/NotFound'

const routes = [
  {
    path: '/',
    exact: true,
    component: App,
  },
  {
    path: '/chart',
    exact: true,
    component: Chart,
  },
  // {
  //   path: '/login',
  //   exact: true,
  //   component: Login,
  // },
  {
    path: '*',
    component: NotFound,
  },
]

export default routes
