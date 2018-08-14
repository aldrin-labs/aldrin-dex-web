import { RowT } from '@containers/Portfolio/components/PortfolioTable/types'
import styled from 'styled-components'
import React from 'react'

export const calcAllSumOfPortfolioAsset = (
  assets: any,
  isUSDCurrently: boolean
): number =>
  // transforming data like assets from profile to IData format
  assets.filter(Boolean).reduce((acc: number, curr: any) => {
    const { value = 0, asset = { priceUSD: 0 } } = curr || {}
    if (!value || !asset || !asset.priceUSD || !asset.priceBTC) {
      return null
    }
    const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC

    return acc + value * Number(price)
  }, 0)

export const percentagesOfCoinInPortfolio = (
  asset: any,
  allSum: number,
  isUSDCurrently: boolean
): number =>
  isUSDCurrently
    ? Number(asset.asset.priceUSD * asset.value * 100 / allSum)
    : Number(asset.asset.priceBTC * asset.value * 100 / allSum)

export const onSortTableFull = (
  key,
  tableData,
  currentSort,
  arrayOfStringHeadings: string[] = [],
  arrayOfDateHeadings:  string[] = [],
) => {

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
) => {
  return arrayOfObjects.reduce((result, element) => {
    result.push(element[prop])

    return result
  }, [])
}

export const combineDataToSelect = (arrayOfOneType: object) => {
  return arrayOfOneType.map((elem) => {
    return {
      value: elem,
      label: elem,
    }
  })
}

export const cloneArrayElementsOneLevelDeep = (arrayOfObjects: object) => {
  return arrayOfObjects.map((a) => Object.assign({}, a))
}

export const onSortStrings = (a: string, b: string): number => {
  return a.localeCompare(b)
}

export const roundPercentage = (num: number) => num.toFixed(2)

export const formatNumberToUSFormat = (numberToFormat: number | string) => {
  const stringNumber = numberToFormat.toString()

  return stringNumber.match(/\./g) ? stringNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,') : stringNumber.replace(/\d(?=(\d{3})+$)/g, '$&,')
}

export const checkForString = (numberOrString: number | string) => typeof numberOrString === 'string'

export const roundAndFormatNumber = (x: number, numberOfDigitsAfterPoint: number) => {

  if (x === 0) {
    return '0'
  }

  return formatNumberToUSFormat(x.toFixed(numberOfDigitsAfterPoint))
}


const Icon = styled.i`
  padding-right: 5px;
`

// TODO: SHOULD BE REFACTORED
export const onValidateSum = (
  reducedSum: RowT,
  selectedBalances: RowT,
  tableData: RowT,
  isUSDCurrently: boolean
) => {
  // const { selectedBalances, tableData, isUSDCurrently } = this.state
  if (!selectedBalances || !tableData) return null
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
