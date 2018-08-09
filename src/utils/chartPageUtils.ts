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

export const calculatePercentagesOfOrderSize = (
  size: number,
  bids: any[]
): number =>
  Math.ceil(
    +Number(size).toFixed(8) /
      bids.map((order) => +order.size).reduce((a, b) => a + b, 0) *
      100
  )

export const testJSON = (text: any) => {
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

export const sortOrders = (state: any, order: any) => {
  const bids =
    order.side === 'bid'
      ? [order, ...state.bids].sort(
          (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
        )
      : state.bids
  const asks =
    order.side === 'ask'
      ? [order, ...state.asks].sort(
          (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
        )
      : state.asks

  return { asks, bids }
}
