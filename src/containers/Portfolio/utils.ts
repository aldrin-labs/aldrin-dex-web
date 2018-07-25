import { IData } from '@containers/Portfolio/components/PortfolioTable/Optimization/Optimization.types'

export const transformAssets = (assets: any): IData => {
  // transforming data like assets from profile to IData format
  const allSums = assets.filter(Boolean).reduce((acc: number, curr: any) => {
    const { value = 0, asset = { priceUSD: 0 } } = curr || {}
    if (!value || !asset || !asset.priceUSD || !asset.priceBTC) {
      return null
    }
    const price = asset.priceBTC

    return acc + value * Number(price)
  }, 0)

  return assets.map((data: any) => ({
    coin: data.asset.symbol,
    percentage: data.asset.priceBTC * data.value * 100 / allSums,
  }))
}
