import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { API_URL } from './config'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://q80vw8qjp.lp.gql.zone/graphql' }),
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

export default client
