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
