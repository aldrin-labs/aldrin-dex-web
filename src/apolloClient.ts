import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'

import { API_URL } from './config.ts'

export const client = new ApolloClient({
  link: new HttpLink({ uri: API_URL }),
  cache: new InMemoryCache(),
})
client
  .query({
    query: gql`
      {
        hello
      }
    `,
  })
  .then(console.log)
