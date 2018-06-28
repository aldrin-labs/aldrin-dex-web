import { RowT } from '../containers/Portfolio/components/PortfolioTable/types'
import styled from 'styled-components'
import React from 'react'

export const onSortTableFull = (key, tableData, currentSort, arrayOfStringHeadings) => {
    if (!tableData) {
      return
    }

    const stringKey = arrayOfStringHeadings.some((heading) => heading === key)
    let newCurrentSort : { key: string; arg: 'ASC' | 'DESC' } | null

    const newData = tableData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          newCurrentSort = { key, arg: 'DESC' }

          if (stringKey) {
            return onSortStrings(b[key], a[key])
          }

          return b[key] - a[key]
        } else {
          newCurrentSort = { key, arg: 'ASC' }

          if (stringKey) {
            return onSortStrings(a[key], b[key])
          }

          return a[key] - b[key]
        }
      }

      newCurrentSort = { key, arg: 'ASC' }

      if (stringKey) {
        return onSortStrings(a[key], b[key])
      }

      return a[key] - b[key]
    })

    console.log(newData)
    console.log(newCurrentSort)
    console.log('stringKey: ', stringKey)


  return {
      newData,
      newCurrentSort
    }

}

export const getArrayContainsOnlyOnePropertyType = (arrayOfObjects: object, prop) => {
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

export const onFloorN = (x: number, n: number) => {
  let mult = Math.pow(10, n)
  return Math.floor(x * mult) / mult
}

export const calcPercentage = (num: number) => onFloorN(num, 2)

export const addZerosToEnd = (num: string, isUSDCurrently: boolean): string => {
  const reg = /(?=\.[0-9]+)\.[0-9]+/g
  const diff = isUSDCurrently ? 3 : 9

  if (reg.test(num)) {
    const [str] = num.match(reg) || ['']
    let tmp = str
    const len = str.length
    for (let i = 0; i < diff - len; i++) {
      tmp += 0
    }
    const [head] = num.match(/[0-9]+\./g) || ['']
    let woPoint = head.slice(0, -1)
    const result = (woPoint += tmp)
    return result || ''
  }
  return num
}

export const roundUSDOff = (num: number, isUSDCurrently: boolean): string => {
  const reg = isUSDCurrently
    ? /[0-9]+(?=\.[0-9]+)\.[0-9]{2}/g
    : /[0-9]+(?=\.[0-9]+)\.[0-9]{8}/g
  if (String(num).match(reg)) {
    const [price] = String(num).match(reg)
    return price
  } else if (num > 0) {
    return addZerosToEnd(String(num), isUSDCurrently)
  } else {
    return `${num}`
  }
}

const Icon = styled.i`
  padding-right: 5px;
`

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
    clonedSum.currency = 'All'
    clonedSum.symbol = '-'
    clonedSum.percentage = 100
  } else if (selectedBalances.length > 1) {
    clonedSum.currency = 'Selected'
    clonedSum.symbol = '-'
  }
  clonedSum.percentage = `${calcPercentage(clonedSum.percentage)}%`
  clonedSum.currentPrice = [mainSymbol, clonedSum.currentPrice]
  clonedSum.realizedPL = [mainSymbol, clonedSum.realizedPL]
  clonedSum.unrealizedPL = [mainSymbol, clonedSum.unrealizedPL]
  clonedSum.totalPL = [mainSymbol, clonedSum.totalPL]

  return clonedSum
}
