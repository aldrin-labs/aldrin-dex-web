// TODO: Write tests for this
import { IData } from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'

export const sumSameCoinsPercentages = (assets: IData[]): IData[] => {
  const mapWithUniqCoins = assets.reduce((accMap, el) => {
    if (accMap.has(el.coin)) {
      accMap.set(el.coin, {
        ...accMap.get(el.coin),
        percentage: accMap.get(el.coin).percentage += el.percentage })
    } else {
      accMap.set(el.coin, el)
    }

    return accMap
  }, new Map())

  return [...mapWithUniqCoins.values()]
}
