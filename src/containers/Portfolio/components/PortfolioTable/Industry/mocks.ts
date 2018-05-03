export function combineToChart() {
  return MOCKS.map((dataItem) => {
    return {
      angle: dataItem.value,
      label: dataItem.asset.industry.name,
    }
  })
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
        performance: 10,
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
        performance: 10,
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
        performance: 10,
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

export const TMP_LINE_CHART_MOCKS = [
  [
    { x: 1, y: 137070, label: 'BTC' },
    { x: 2, y: 134926, label: 'BTC' },
    { x: 3, y: 138591, label: 'BTC' },
    { x: 4, y: 140777, label: 'BTC' },
    { x: 5, y: 150337, label: 'BTC' },
    { x: 6, y: 151651, label: 'BTC' },
  ],

  [
    { x: 1, y: 50534, label: 'ETH' },
    { x: 2, y: 49769, label: 'ETH' },
    { x: 3, y: 51829, label: 'ETH' },
    { x: 4, y: 56188, label: 'ETH' },
    { x: 5, y: 60951, label: 'ETH' },
    { x: 6, y: 59985, label: 'ETH' },
  ],

  [
    { x: 1, y: 26012, label: 'XRP' },
    { x: 2, y: 25705, label: 'XRP' },
    { x: 3, y: 27857, label: 'XRP' },
    { x: 4, y: 30952, label: 'XRP' },
    { x: 5, y: 36189, label: 'XRP' },
    { x: 6, y: 33912, label: 'XRP' },
  ],

  [
    { x: 1, y: 13093, label: 'BCH' },
    { x: 2, y: 12950, label: 'BCH' },
    { x: 3, y: 15213, label: 'BCH' },
    { x: 4, y: 16572, label: 'BCH' },
    { x: 5, y: 19252, label: 'BCH' },
    { x: 6, y: 19606, label: 'BCH' },
  ],
]
