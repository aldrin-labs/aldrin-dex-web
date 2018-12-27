import { getPortfolioMainQuery } from '@containers/Portfolio/api'
import { GET_BASE_COIN } from '@core/queries/portfolio/getBaseCoin'

export const portfolio = {
  name: 'My portfolio',
  portfolioAssets: [
    {
      _id: '5bfc514c9cae12f60171934bdemo',
      coin: 'ADA',
      name: 'demo',
      where: 'Binance',
      price: 0.04305,
      quantity: 382.672,
      realized: 0,
      unrealized: 2.1294799999999983,
    },
    {
      _id: '5bfc55fd9cae124648719432demo',
      coin: 'XLM',
      name: 'demo',
      where: 'Binance',
      price: 0.16802,
      quantity: 62.937,
      realized: 0,
      unrealized: 1.053359999999999,
    },
  ],
}

export const mocks: ReadonlyArray<any> = [
  {
    request: {
      query: GET_BASE_COIN,
    },
    result: {
      data: {
        portfolio: {
          baseCoin: 'BTC',
        },
      },
    },
  },
  {
    request: {
      query: getPortfolioMainQuery,
      variables: { baseCoin: 'BTC' },
    },
    result: {
      data: {
        myPortfolios: [
          {
            name: 'My portfolio',
            portfolioAssets: [
              {
                _id: '5bfc514c9cae12f60171934bdemo',
                coin: 'ADA',
                name: 'demo',
                where: 'Binance',
                price: 0.04305,
                quantity: 382.672,
                realized: 0,
                unrealized: 2.1294799999999983,
              },
              {
                _id: '5bfc55fd9cae124648719432demo',
                coin: 'XLM',
                name: 'demo',
                where: 'Binance',
                price: 0.16802,
                quantity: 62.937,
                realized: 0,
                unrealized: 1.053359999999999,
              },
            ],
          },
        ],
      },
    },
  },
]

export const mockT = [
  {
    request: {
      query: getPortfolioMainQuery,
      variables: { name: 'USDT' },
    },
    result: {
      data: {
        myPortfolios: [
          {
            name: 'My portfolio',
            portfolioAssets: [
              {
                _id: '5bfc514c9cae12f60171934bdemo',
                coin: 'ADA',
                name: 'demo',
                where: 'Binance',
                price: 0.04305,
                quantity: 382.672,
                realized: 0,
                unrealized: 2.1294799999999983,
              },
              {
                _id: '5bfc55fd9cae124648719432demo',
                coin: 'XLM',
                name: 'demo',
                where: 'Binance',
                price: 0.16802,
                quantity: 62.937,
                realized: 0,
                unrealized: 1.053359999999999,
              },
            ],
          },
        ],
      },
    },
  },
]
