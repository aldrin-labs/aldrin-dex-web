import React from 'react'
import nanoid from 'nanoid'

import { IRowT } from '@containers/Portfolio/components/PortfolioTable/types'
import { Icon } from '@styles/cssUtils'
import { IPortfolio } from '@containers/Portfolio/interfaces'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'

export const calcAllSumOfPortfolioAsset = (
  assets: any,
  isUSDCurrently: boolean,
  cryptoWallets: any = null
): number => {
  // transforming data like assets from profile to IData format
  const sum = assets.filter(Boolean).reduce((acc: number, curr: any) => {
    const { quantity = 0, asset = { priceUSD: 0 } } = curr || {}
    if (!quantity || !asset || !asset.priceUSD || !asset.priceBTC) {
      return null
    }
    const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC

    return acc + quantity * Number(price)
  }, 0)
  if (cryptoWallets) {
    return cryptoWallets.reduce(
      (acc: number, curr: any) =>
        curr.assets.reduce((acc: number, curr: any) => {
          const { balance = 0, asset = { priceUSD: 0 } } = curr || {}
          if (!balance || !asset || !asset.priceUSD || !asset.priceBTC) {
            return null
          }
          const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC

          return acc + balance * Number(price)
        }, 0),
      sum
    )
  }

  return sum
}

export const dustFilter = (
  tableData: any[],
  filterValueSmallerThenPercentage: number | undefined = 0
) => {
  //  dust filter part
  return tableData.filter(
    (el) =>
      //  if el.percentage is not a number then turn it into 0
      isNaN(el.portfolioPercentage)
        ? 0
        : el.portfolioPercentage >
          (filterValueSmallerThenPercentage
            ? filterValueSmallerThenPercentage
            : 0)
  )
}

export const calcSumOfPortfolioAssetProfitLoss = (
  PLs: any,
  isUSDCurrently: boolean
): number => {
  return PLs.reduce(
    (acc: number, curr: any) => {
      const {
        realized = 0,
        price,
        basePriceUSD,
        basePriceBTC,
        averageBuyPrice,
        totalBuyQty,
        totalSellQty,
      } = curr || {}

      if (!basePriceUSD || !basePriceBTC) {
        return acc
      }
      //  pl_unrealized_points = (last_price - average_buy_price) * (total_buy_qty - total_sell_qty);

      const basePrice = isUSDCurrently ? basePriceUSD : basePriceBTC
      const unrealizedPL =
        (price - averageBuyPrice) * (totalBuyQty - totalSellQty) * basePrice
      const realizedPL = realized * basePrice

      acc.unrealized += unrealizedPL
      acc.realized += realizedPL
      acc.total += realizedPL + unrealizedPL

      return acc
    },
    { unrealized: 0, realized: 0, total: 0 }
  )
}

export const percentagesOfCoinInPortfolio = (
  asset: any,
  allSum: number,
  isUSDCurrently: boolean
): number =>
  isUSDCurrently
    ? Number((asset.asset.priceUSD * asset.quantity * 100) / allSum)
    : Number((asset.asset.priceBTC * asset.quantity * 100) / allSum)

export const onSortTableFull = (
  key,
  tableData,
  currentSort,
  arrayOfStringHeadings,
  arrayOfDateHeadings?
) => {
  if (!tableData) {
    return
  }

  const stringKey = arrayOfStringHeadings.some((heading) => heading === key)
  const dateKey = arrayOfDateHeadings
    ? arrayOfDateHeadings.some((heading) => heading === key)
    : false

  let newCurrentSort: { key: string; arg: 'ASC' | 'DESC' } | null

  const newData = tableData.slice().sort((a, b) => {
    if (currentSort && currentSort.key === key) {
      if (currentSort.arg === 'ASC') {
        newCurrentSort = { key, arg: 'DESC' }

        if (stringKey) {
          return onSortStrings(b[key], a[key])
        }

        if (dateKey) {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime()
        }

        return b[key] - a[key]
      } else {
        newCurrentSort = { key, arg: 'ASC' }

        if (stringKey) {
          return onSortStrings(a[key], b[key])
        }

        if (dateKey) {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime()
        }

        return a[key] - b[key]
      }
    }

    newCurrentSort = { key, arg: 'ASC' }

    if (stringKey) {
      return onSortStrings(a[key], b[key])
    }

    if (dateKey) {
      return new Date(a[key]).getTime() - new Date(b[key]).getTime()
    }

    return a[key] - b[key]
  })

  console.log('dateKey: ', dateKey)
  console.log(newData)
  console.log(newCurrentSort)
  console.log('stringKey: ', stringKey)

  return {
    newData,
    newCurrentSort,
  }
}

export const getArrayContainsOnlyOnePropertyType = (
  arrayOfObjects: object,
  prop
) =>
  arrayOfObjects.reduce((result, element) => {
    result.push(element[prop])

    return result
  }, [])

export const combineDataToSelect = (arrayOfOneType: object) =>
  arrayOfOneType.map((elem) => ({
    value: elem,
    label: elem,
  }))

export const cloneArrayElementsOneLevelDeep = (arrayOfObjects: object) =>
  arrayOfObjects.map((a) => Object.assign({}, a))

export const onSortStrings = (a: string, b: string): number =>
  a.localeCompare(b)

export const roundPercentage = (num: number) => num.toFixed(2)

// formatNumberToUSFormat - this function takes number or string, then it converts it to string anyway, and then decide
// — if our number has dot "." (is it number with fractional part or not) and then place commas by one of two regexes,
// depending on is our number has float part or not, and return us-formatted number (e.g. 1,000 etc.)

export const formatNumberToUSFormat = (numberToFormat: number | string) => {
  const stringNumber = numberToFormat.toString()

  return stringNumber.match(/\./g)
    ? stringNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,')
    : stringNumber.replace(/\d(?=(\d{3})+$)/g, '$&,')
}

export const checkForString = (numberOrString: number | string) =>
  typeof numberOrString === 'string'

export const roundAndFormatNumber = (
  x: number,
  numberOfDigitsAfterPoint: number,
  format: boolean = true
): string => {
  if (x === 0 || +x.toFixed(numberOfDigitsAfterPoint) === 0) {
    return '0'
  }
  const res = format
    ? formatNumberToUSFormat(x.toFixed(numberOfDigitsAfterPoint))
    : x.toFixed(numberOfDigitsAfterPoint)

  return res
}

// TODO: SHOULD BE REFACTORED
export const onValidateSum = (
  reducedSum: IRowT,
  selectedBalances: IRowT,
  tableData: IRowT,
  isUSDCurrently: boolean
) => {
  // const { selectedBalances, tableData, isUSDCurrently } = this.state
  if (!selectedBalances || !tableData) {
    return null
  }
  const clonedSum = { ...reducedSum }

  const mainSymbol = isUSDCurrently ? (
    <Icon className="fa fa-usd" key="usd" />
  ) : (
    <Icon className="fa fa-btc" key="btc" />
  )

  if (selectedBalances.length === tableData.length) {
    clonedSum.currency = 'Total'
    clonedSum.symbol = '-'
    clonedSum.percentage = 100
  } else if (selectedBalances.length > 1) {
    clonedSum.currency = 'Selected'
    clonedSum.symbol = '-'
  }
  clonedSum.percentage = `${roundPercentage(clonedSum.percentage)}%`
  clonedSum.currentPrice = [mainSymbol, clonedSum.currentPrice]
  clonedSum.realizedPL = [mainSymbol, clonedSum.realizedPL]
  clonedSum.unrealizedPL = [mainSymbol, clonedSum.unrealizedPL]
  clonedSum.totalPL = [mainSymbol, clonedSum.totalPL]

  return clonedSum
}

export const createColumn = (
  id: string | number = nanoid(),
  exchange: string = '',
  coin: string = '',
  portfolioPercentage: number = 0,
  price: number = 0,
  quantity: number = 0,
  currentPrice: number = 0,
  daily: number = 0,
  dailyPerc: number = 0,
  realizedPL: number = 0,
  unrealizedPL: number = 0,
  totalPL: number = 0
) => ({
  id,
  exchange,
  coin,
  portfolioPercentage,
  price,
  quantity,
  currentPrice,
  daily,
  dailyPerc,
  realizedPL,
  unrealizedPL,
  totalPL,
})

export const combineTableData = (
  portfolio: IPortfolio | null,
  activeKeys,
  filterValueSmallerThenPercentage,
  isUSDCurrently
) => {
  if (!portfolio || !portfolio.assets || !activeKeys) {
    return
  }
  // TODO: I guess, filter Boolean should be first before map, because it will reduce the array first, without
  // performance loss by mapping elements that do not pass our requirements
  const { assets: portfolioAssets, cryptoWallets } = portfolio
  // checking that asset is array and have length more then 0
  const exchangeAssetsLength = portfolioAssets.length
    ? portfolioAssets.length + 1
    : 0
  const allSums = calcAllSumOfPortfolioAsset(
    portfolioAssets,
    isUSDCurrently,
    cryptoWallets
  )

  const walletData = cryptoWallets
    .map((row: any) => {
      const {
        baseAsset = {
          symbol: '',
          priceUSD: 0,
          priceBTC: 0,
          percentChangeDay: 0,
        },
        name = '',
        assets = [],
      } = row || {}

      return assets.map((walletAsset: any, i: number) => {
        // checking for props that we need
        if (
          !(
            walletAsset &&
            walletAsset.asset &&
            walletAsset.asset.priceUSD &&
            walletAsset.asset.priceBTC
          )
        ) {
          return {}
        }
        const mainPrice = isUSDCurrently
          ? walletAsset.asset.priceUSD
          : walletAsset.asset.priceBTC

        const currentPrice = mainPrice * walletAsset.balance
        const col = createColumn(
          i + exchangeAssetsLength,
          `${baseAsset.symbol} ${name}`,
          walletAsset.asset.symbol,
          +roundPercentage((currentPrice * 100) / allSums),
          mainPrice,
          +walletAsset.balance.toFixed(5),
          currentPrice
        )

        return col
      })
    })
    .reduce((a: any, b: any) => a.concat(b), [])

  let tableData = [
    portfolioAssets.map((row: any, i) => {
      const {
        asset = {
          symbol: '',
          priceUSD: 0,
          priceBTC: 0,
          percentChangeDay: 0,
        },
        quantity = 0,
        key = { name: '' },
        exchange = '',
      } = row || {}
      if (key === null || key.name === null) {
        return
      }
      if (activeKeys.indexOf(key.name) === -1) {
        return null
      }
      const { symbol = 0, priceUSD = 0, priceBTC = 0, percentChangeDay = 0 } =
        asset || {}
      const { name } = exchange

      const PL = calcSumOfPortfolioAssetProfitLoss(row.PL, isUSDCurrently)
      const mainPrice = isUSDCurrently ? priceUSD : priceBTC

      const currentPrice = mainPrice * quantity
      return createColumn(
        i,
        name,
        symbol,
        +roundPercentage((currentPrice * 100) / allSums),
        mainPrice,
        quantity,
        currentPrice,
        +roundPercentage((mainPrice / 100) * percentChangeDay),
        percentChangeDay,
        PL.realized,
        PL.unrealized,
        PL.total
      )
    }),
    walletData,
  ]
    .reduce((a: any, b: any) => a.concat(b), [])
    .filter(Boolean)

  tableData = dustFilter(tableData, filterValueSmallerThenPercentage)

  return tableData
}

export const composePortfolioWithMocks = (
  portfolio: any,
  isShownMocks = false
) => {
  if (!(portfolio && portfolio.assets && portfolio.cryptoWallets)) {
    return
  }

  return isShownMocks
    ? {
        ...portfolio,
        assets: portfolio!.assets!.concat(MOCK_DATA),
        cryptoWallets: portfolio!.cryptoWallets!.concat([]),
      }
    : portfolio
}
