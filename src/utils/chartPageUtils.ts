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
