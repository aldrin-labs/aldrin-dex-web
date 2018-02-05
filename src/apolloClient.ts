import { split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { API_URL } from './config'
import { defaults, resolvers } from './resolvers/login'

const cache = new InMemoryCache()
const httpLink = new HttpLink({ uri: API_URL });
const stateLink = withClientState({ resolvers, cache, defaults })

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://api.igorlimansky.me/graphql`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);


export const client = new ApolloClient({
  link: ApolloLink.from([stateLink, link]),
  cache,
})
