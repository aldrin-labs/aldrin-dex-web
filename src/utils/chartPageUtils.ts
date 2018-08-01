export const maximumItemsInArray = (
  data: any[],
  count: number,
  removeLast: number
) => {
  if (data.length > count) {
    return data.slice(0, removeLast)
  }

  return data
}
