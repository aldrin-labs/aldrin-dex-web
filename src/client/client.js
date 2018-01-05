import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import ClientContainer from './index'
import routes from './routes'

ReactDOM.render(
  <ClientContainer>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </ClientContainer>,
  document.getElementById('app'),
)

export default Client
