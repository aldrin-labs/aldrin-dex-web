import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import NotFound from './containers/NotFound'
import { hot } from 'react-hot-loader'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

import { renderRoutes } from 'react-router-config'
import Reboot from 'material-ui/Reboot';

import client from './apolloClient'

const render = Component =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={App}/>
          <Route path='*' component={NotFound}/>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  );

render(hot(module)(App));
