export function combineToChart(mockData) {

  return mockData.map((dataItem) => ({
    angle: parseFloat(dataItem.portfolioPerc),
    label: dataItem.symbol,
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
    currency: 'Bitrex',
    symbol: 'ETH',
    portfolioPerc: 28.78,
    price: 12950,
  },
  {
    currency: 'GDAX',
    symbol: 'ETH',
    portfolioPerc: 22.22,
    price: 10000,
  },
  {
    currency: 'Binance',
    symbol: 'LTC',
    portfolioPerc: 4.44,
    price: 2000,
  },
  {
    currency: 'Binance',
    symbol: 'XRP',
    portfolioPerc: 5.55,
    price: 5000,
  },
  {
    currency: 'Binance',
    symbol: 'PCI',
    portfolioPerc: 4.44,
    price: 2000,
  },
  {
    currency: 'Binance',
    symbol: 'LTU',
    portfolioPerc: 5.55,
    price: 5000,
  },
  {
    currency: 'Binance',
    symbol: 'PKI',
    portfolioPerc: 4.44,
    price: 2000,
  },
  {
    currency: 'Binance',
    symbol: 'DKI',
    portfolioPerc: 5.55,
    price: 5000,
  },
]
