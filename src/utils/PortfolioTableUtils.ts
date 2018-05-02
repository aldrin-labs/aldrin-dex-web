

import {RowT} from "../containers/Portfolio/components/PortfolioTable/types";

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


// export const onValidateSum = (reducedSum: RowT, selectedBalances: RowT, tableData: RowT, isUSDCurrently: boolean) => {
//   // const { selectedBalances, tableData, isUSDCurrently } = this.state
//   if (!selectedBalances || !tableData) return null
//   const clonedSum = { ...reducedSum }
//
//   const mainSymbol = isUSDCurrently ? (
//     <Icon className="fa fa-usd" key="usd" />
// ) : (
//     <Icon className="fa fa-btc" key="btc" />
// )
//
//   if (selectedBalances.length === tableData.length) {
//     clonedSum.currency = 'All'
//     clonedSum.symbol = '-'
//     clonedSum.percentage = 100
//   } else if (selectedBalances.length > 1) {
//     clonedSum.currency = 'Selected'
//     clonedSum.symbol = '-'
//   }
//   clonedSum.percentage = `${calcPercentage(clonedSum.percentage)}%`
//   clonedSum.currentPrice = [mainSymbol, clonedSum.currentPrice]
//
//   return clonedSum
// }
