

import {RowT} from "../containers/Portfolio/components/PortfolioTable/types";
import styled from 'styled-components';
import React from 'react';


export const onSortStrings = (a: string, b: string): number => {
  return a.localeCompare(b)
};

export const onFloorN = (x: number, n: number) => {
  let mult = Math.pow(10, n);
  return Math.floor(x * mult) / mult
}

export const calcPercentage = (num: number) => {
  return onFloorN(num, 2)
}

export const addZerosToEnd = (num: string, isUSDCurrently: number): string => {
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

const Icon = styled.i`
  padding-right: 5px;
`;

export const onValidateSum = (reducedSum: RowT, selectedBalances: RowT, tableData: RowT, isUSDCurrently: boolean) => {
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

  return clonedSum
}

