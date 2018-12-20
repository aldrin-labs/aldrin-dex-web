import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { CachePersistor } from 'apollo-cache-persist'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { defaults, resolvers } from './resolvers'
import { withClientState } from 'apollo-link-state'
import gql from 'graphql-tag'

import { inflate } from 'graphql-deduplicator'

import { API_URL } from '@utils/config'
import { GET_BASE_COIN } from '../queries/portfolio/getBaseCoin'
import { GET_COINS } from '../mutations/portfolio/getCoins'
import { GET_OPTIMIZATION_COUNT_OF_RUNS } from '../queries/portfolio/getOptimizationCountOfRuns'
import { GET_INDUSTRIES } from '../queries/portfolio/GET_INDUSTRIES'
import { LOGIN_POPUP_APPEARED } from '../queries/ui/LOGIN_POPUP_APPEARED'

const httpLink = new HttpLink({ uri: `https://${API_URL}/graphql` })

const memCache = new InMemoryCache()

export const persistor = new CachePersistor({
  cache: memCache,
  storage: localStorage,
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: getToken(),
    },
  }
})

const getToken = () => {
  return localStorage.getItem('token')
    ? `Bearer ${localStorage.getItem('token')}`
    : ''
}

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://${API_URL}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getToken(),
    },
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)
const defaultState = {
  portfolio: {
    __typename: 'portfolio',
    baseCoin: 'USDT',
  },
  portfolioMain: {
    __typename: 'portfolioMain',
    activeChart: '1Y',
    coins: [],
  },
  portfolioIndustries: {
    __typename: 'portfolioIndustries',
    industries: [],
  },
  portfolioOptimization: {
    __typename: 'portfolioOptimization',
    optimizationCountOfRuns: 0,
  },
  ui: {
    logInPopupAppeared: false,
    __typename: 'ui',
  },
}

const typeDefs = gql`
  type Industry {
    label: String!
    realValue: Float!
  }
`

const stateLink = withClientState({
  typeDefs,
  cache: memCache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updatePortfolioMain: (_, args, source) => {
        const { value } = args
        const { cache } = source
        const query = gql`
          query portfolioMain {
            portfolioMain @client {
              activeChart
            }
          }
        `
        const previous = cache.readQuery({ query })

        cache.writeData({
          data: {
            portfolioMain: {
              __typename: previous.portfolioMain.__typename,
              activeChart: value,
            },
          },
        })
        return null
      },
      toggleBaseCoin: (_: undefined, args: undefined, source: any) => {
        const { cache } = source
        const query = GET_BASE_COIN

        const previous = cache.readQuery({ query })

        const baseCoin = previous.portfolio.baseCoin === 'USDT' ? 'BTC' : 'USDT'

        cache.writeData({
          data: {
            portfolio: {
              baseCoin,
              __typename: previous.portfolio.__typename,
            },
          },
        })

        return null
      },
      updateCoins: (_: undefined, args: any, source: any) => {
        const { coins } = args
        const { cache } = source
        const query = GET_COINS

        const previous = cache.readQuery({ query })

        cache.writeQuery({
          query,
          data: {
            portfolioMain: {
              coins: coins,
              __typename: 'portfolioMain',
            },
          },
        })

        return null
      },
      updateIndustries: (_: undefined, args: any, source: any) => {
        const { industries } = args
        const { cache } = source
        const query = GET_INDUSTRIES

        cache.writeQuery({
          query,
          data: {
            portfolioIndustries: {
              industries: industries,
              __typename: 'portfolioIndustries',
            },
          },
        })

        return null
      },
      updateOptimizationCountOfRuns: (_: undefined, args: any, source: any) => {
        const { count } = args
        const { cache } = source
        const query = GET_OPTIMIZATION_COUNT_OF_RUNS

        cache.writeQuery({
          query,
          data: {
            portfolioOptimization: {
              optimizationCountOfRuns: count,
              __typename: 'portfolioOptimization',
            },
          },
        })

        return count
      },
      updateLoginPopupAppeared: (_: undefined, __: any, source: any) => {
        const { cache } = source
        const query = LOGIN_POPUP_APPEARED

        cache.writeQuery({
          query,
          data: {
            ui: {
              logInPopupAppeared: true,
              __typename: 'ui',
            },
          },
        })

        return true
      },
    },
  },
})

const inflateLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    return inflate(response)
  })
})

export const client = new ApolloClient({
  link: ApolloLink.from([stateLink, authLink, link]),
  cache: memCache,
  connectToDevTools: true,
  queryDeduplication: true,
})
