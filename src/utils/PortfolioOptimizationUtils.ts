export const sumSameCoinsPercentages = (assets: object) => {
  const mapWithUniqCoins = assets.reduce((accMap, el) => {
    if (accMap.has(el.coin)) {
      accMap.set(el.coin, {
        ...accMap.get(el.coin),
        percentage: accMap.get(el.coin).percentage += +el.percentage })
    } else {
      accMap.set(el.coin, el)
    }

    return accMap
  }, new Map())

  return [...mapWithUniqCoins.values()]
}
