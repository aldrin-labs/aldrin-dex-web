export const findSpread = (asks: any[], bids: any[]): number =>
  asks[asks.length - 1] && bids[0]
    ? +asks[asks.length - 1].price - +bids[0].price
    : 0

export const maximumItemsInArray = (
  data: any[],
  count: number,
  removeLast: number
) => {
  if (data.length > count) {
    return data.slice(0, data.length - removeLast - 1)
  }

  return data
}

export const getNumberOfDigitsAfterDecimal = (
  orders: any[],
  column: 'size' | 'price'
) => {
  let numberOfDigitsAfterDecimal = 2
  for (const order of orders) {
    if (+order[column] > 1) {
      numberOfDigitsAfterDecimal = 2
    } else {
      numberOfDigitsAfterDecimal = 8

      break
    }
  }

  return numberOfDigitsAfterDecimal
}

export const calculatePercentagesOfOrderSize = (
  size: number,
  bids: any[]
): number =>
  Math.ceil(
    +Number(size).toFixed(8) /
      bids.map((order) => +order.size).reduce((a, b) => a + b, 0) *
      100
  )

export const testJSON = (text: any): boolean => {
  if (typeof text !== 'string') {
    return false
  }
  try {
    JSON.parse(text)

    return true
  } catch (error) {
    return false
  }
}

export const replaceOrdersWithSamePrice = (state: any, order: any) => {
  // TODO: next here we should increase or decrease size of existing orders, not just replace them
  if (order.side === 'bid') {
    const ind = state.bids.findIndex((i) => i.price === order.price)
    if (ind > -1) {
      if (order.size !== '0') {
        state.bids.splice(ind, 1, order)
      } else {
        state.bids.splice(ind, 1)
      }
      order = null
    }
  }
  if (order !== null && order.side === 'ask') {
    const ind = state.asks.findIndex((i) => i.price === order.price)
    if (ind > -1) {
      if (order.size !== '0') {
        state.asks.splice(ind, 1, order)
      } else {
        state.asks.splice(ind, 1)
      }
      order = null
    }
  }
}

export const sortOrders = (orders: any[]) =>
  orders
    .slice()
    .sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0))
