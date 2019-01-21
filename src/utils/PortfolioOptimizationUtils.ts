// TODO: Write tests for this
import { IData } from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'
import { IRow } from '@core/types/PortfolioTypes'

type Shape = IData | IRow;

export const sumSame = (assets: Shape[], sumBy: string, sumWhat: string): Shape[] => {
  const mapWithUniqCoins = assets.reduce((accMap, el: Shape) => {
    if (accMap.has(el[sumBy])) {
      accMap.set(el[sumBy], {
        ...accMap.get(el[sumBy]),
        [sumWhat]: accMap.get(el[sumBy])[sumWhat] = +accMap.get(el[sumBy])[sumWhat] + parseFloat(el[sumWhat]) })
    } else {
      accMap.set(el[sumBy], el)
    }

    return accMap
  }, new Map())

  return [...mapWithUniqCoins.values()]
}
