export function combineToChart(mockData) {

  return mockData.map((dataItem) => ({
    angle: parseFloat(dataItem.portfolioPerc),
    label: dataItem.symbol,
    realValue: parseFloat(dataItem.portfolioPerc),
    labelCurrency: dataItem.exchange
  }))
}

export const PieChartMockFirst = [
  {
    name: 'ETH',
    value: 0.82562342,
  },
  {
    name: 'BTC',
    value: 1.62562342,
  },
  {
    name: 'LTC',
    value: 2.32562342,
  },
]

export const PieChartMockSecond = [
  {
    name: 'XPR',
    value: 2.5213123,
  },
  {
    name: 'BTC',
    value: 3.123123123,
  },
  {
    name: 'LTC',
    value: 8.12312312,
  },
]

export const tableData = [
  {
    exchange: 'Bitrex',
    symbol: 'ETH',
    portfolioPerc: 28.78,
    price: 12950,
  },
  {
    exchange: 'GDAX',
    symbol: 'ETH',
    portfolioPerc: 22.22,
    price: 10000,
  },
  {
    exchange: 'Binance',
    symbol: 'LTC',
    portfolioPerc: 4.44,
    price: 2000,
  },
  {
    exchange: 'Binance',
    symbol: 'XRP',
    portfolioPerc: 5.55,
    price: 5000,
  },
  {
    exchange: 'Binance',
    symbol: 'PCI',
    portfolioPerc: 4.44,
    price: 2000,
  },
  {
    exchange: 'Binance',
    symbol: 'LTU',
    portfolioPerc: 5.55,
    price: 5000,
  },
  {
    exchange: 'Binance',
    symbol: 'PKI',
    portfolioPerc: 4.44,
    price: 2000,
  },
  {
    exchange: 'Binance',
    symbol: 'DKI',
    portfolioPerc: 5.55,
    price: 5000,
  },
]
