export function combineToChart() {
  return MOCKS.map((dataItem) => ({
    angle: dataItem.value,
    label: dataItem.asset.industry.name,
  }))
}

export const MOCKS = [
  {
    _id: '5abbf010cd922f0027555a61',
    asset: {
      name: 'Bitcoin',
      priceUSD: 6859.31117,
      priceBTC: 1,
      symbol: 'BTC',
      percentChangeDay: -7.71,
      industry: {
        name: 'Smart contracts',
        performance: { usd: 14, btc: 2 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'Cryptopia',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test1',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.82562342,
  },
  {
    _id: '5abbf010cd922f0027555a62',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.37,
      priceBTC: 0.0554801,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Privacy coin',
        performance: { usd: 8, btc: 10 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'Bitrex',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test1',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 3.454242,
  },
  {
    _id: '5abbf010cd922f0027555a62',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 7, btc: 12 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'GDAX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a62',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 7, btc: 12 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'GDAX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a62',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 7, btc: 12 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'GDAX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a62',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 7, btc: 12 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'GDAX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a64',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 8, btc: 10 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'PKAX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a65',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 15, btc: 4 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'LKAX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a66',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 14, btc: 7 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'NPAE',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a67',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 10, btc: 1 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'BDAS',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
  {
    _id: '5abbf010cd922f0027555a68',
    asset: {
      name: 'Ethereum',
      priceUSD: 380.373123123,
      priceBTC: 0.341,
      symbol: 'ETH',
      percentChangeDay: -7.39,
      industry: {
        name: 'Payment',
        performance: { usd: 1, btc: 6 },
      },
    },
    assetId: '5abbebe80dfdb5c3e01b7319',
    btcRealizedProfit: 40,
    btcTotalProfit: 50,
    btcUnrealizedProfit: 60,
    exchange: {
      name: 'LOREX',
    },
    exchangeId: '5abbeba80dfdb5c3e01b71cf',
    key: {
      apiKey: '34be780a9a27431bad2ad6693beefa03',
      name: 'Test2',
    },
    keyId: '5abbf00f19f6b8001b2872df',
    usdRealizedProfit: 10,
    usdTotalProfit: 20,
    usdUnrealizedProfit: 30,
    value: 0.454242,
  },
]

export const tableData = [
  {
    currency: 'Bitrex',
    symbol: 'ETH',
    industry: 'Smart contracts',
    price: 15000,
    portfolioPerf: 50,
    industryPerf: 500,
  },
  {
    currency: 'Poloniex',
    symbol: 'LTC',
    industry: 'Payment',
    price: 10000,
    portfolioPerf: 70,
    industryPerf: -20,
  },
  {
    currency: 'Bitrex',
    symbol: 'XRP',
    industry: 'Payment',
    price: 5000,
    portfolioPerf: 50,
    industryPerf: -20,
  },
  {
    currency: 'GDAX',
    symbol: 'ETH',
    industry: 'Smart contracts',
    price: 15000,
    portfolioPerf: 25,
    industryPerf: 500,
  },
  {
    currency: 'Bitrex',
    symbol: 'Zcash',
    industry: 'Privacy coin',
    price: 5000,
    portfolioPerf: 10,
    industryPerf: 500,
  },
]

export const inds = ['Privacy coin', 'Smart contracts', 'Payment']

export const coins = ['BTC', 'ETH', 'BCH']

export function randomInteger(min: number, max: number) {
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

export function genMocks(len: number, categories: string[]) {
  return categories.map((categorie, index) => {
    return [...Array(len)].map((_, i) => {
      const int = randomInteger(1 * i + index, 10 * i)
      return {
        x: i + 1,
        y: int,
        label: categorie,
      }
    })
  })
}

// palette from https://material.io/design/color/#tools-for-picking-colors
// color A700
export const colors = ['#6200EA', '#00C853', '#0091EA']

export function genAngleMocks(categories: string[]) {
  return categories.map((categorie, index) => {
    const int = randomInteger(1 + index, 10 + index)
    return {
      angle: int,
      label: categorie,
      color: colors[index],
    }
  })
}
