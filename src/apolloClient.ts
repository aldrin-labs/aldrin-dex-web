import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { withClientState } 'apollo-link-state'


import { API_URL } from './config.ts'

import { defaults, resolvers } from './resolvers/login';

const cache = new InMemoryCache()
const httpLink = new HttpLink({ uri: API_URL })
const stateLink = withClientState({ resolvers, cache, defaults })

export const client = new ApolloClient({
  link: ApolloLink.from([stateLink, httpLink]),
  cache,
})
