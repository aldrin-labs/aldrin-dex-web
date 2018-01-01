import React from 'react'
import ReactDOM from 'react-dom'
// eslint-disable-next-line
import { AppContainer } from 'react-hot-loader'
import App from './containers/App'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  )
}

render(App)

if (module.hot) {
  module.hot.accept()
}
