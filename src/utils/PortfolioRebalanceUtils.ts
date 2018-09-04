import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'

export const removeEditableModeInCoins = (rows: IRow[]) =>
  rows.map((el: IRow) => {
    if (el.editable) {
      return {
        ...el,
        editable: false,
      }
    }

    return el
  })

export const calculatePriceByPercents = (data: IRow[], totalRows: number | string ) => {
  const dataWithNewPrices = data.map((row: IRow) => {
    let newPrice = ((parseFloat(totalRows) / 100) * (+row.portfolioPerc)).toFixed(2)

    return {
      ...row,
      price: newPrice,
    }
  })

  return dataWithNewPrices
}

export const calculateTotal = (data: IRow[], undistributedMoney: string) => {
  const total = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

  return (total + parseFloat(undistributedMoney)).toFixed(2)
}

export const calculateTableTotal = (data: IRow[]) => {
  const tableTotal = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

  return tableTotal.toFixed(2)
}

export const calculateTotalPercents = (data: IRow[]) => {
  const totalPercents = data
    .reduce((sum, row) => (sum += +row!.portfolioPerc), 0)
    .toFixed(3)

  return totalPercents
}

export const checkPercentSum = (data: IRow[]) => {
  const sumOfAllPercents = data.reduce(
    (sum, row) => (sum += +row!.portfolioPerc),
    0
  )

  return Math.abs(sumOfAllPercents - 100) <= 0.001 || sumOfAllPercents === 0
}
