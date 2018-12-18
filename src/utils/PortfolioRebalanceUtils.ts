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

export const calculatePriceByPercents = (
  data: IRow[],
  totalRows: number | string
) => {
  const dataWithNewPrices = data.map((row: IRow) => {
    let newPrice = (parseFloat(totalRows) / 100) * +row.portfolioPerc

    return {
      ...row,
      price: newPrice,
    }
  })

  return dataWithNewPrices
}

export const calculatePriceByPercentsForOneAsset = (
  data: IRow[],
  totalRows: number | string,
  idx: number
) => {
  data[idx].price = (parseFloat(totalRows) / 100) * (+data[idx].portfolioPerc)

  return data
}


export const calculateTotal = (data: IRow[], undistributedMoney: string) => {
  // tslint:disable-next-line no-parameter-reassignment
  const total = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

  return (total + parseFloat(undistributedMoney)).toFixed(2)
}

export const calculateTableTotal = (data: IRow[], priceField = 'price') => {
  const tableTotal = data.reduce((sum, row, i) => (sum += +data[i][priceField]), 0)

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

export const checkEqualsOfTwoTotals = (total1: string | number, total2: string | number) => parseFloat(total1) === parseFloat(total2)

export const calculatePriceDifference = (data: IRow[]) => {

  const dataWithDeltaPrice = data.map((el) => ({
    ...el,
    deltaPrice: el.isCustomAsset ? parseFloat(el.price) : (parseFloat(el.price) - el.priceSnapshot),
  }))

  return dataWithDeltaPrice
}

export const calculatePercents = (
  data: IRow[],
  total: string,
  priceField = 'price',
  percentageResultField = 'portfolioPerc'
) => {
  const newDataWithPercents = data.map((row) => {
    const percentCaluclation =
      +row[priceField] === 0
        ? '0'
        : ((parseFloat(row[priceField]) * 100) / parseFloat(total)).toFixed(6)
    const percentResult = +percentCaluclation === 0 ? '0' : percentCaluclation

    return {
      ...row,
      [percentageResultField]: percentResult,
    }
  })

  return newDataWithPercents
}

export function calculateMoneyPart(
  money: number,
  numberOfCoinsThatMoneyWouldDistributed: number
): number[] {
  const divided = money / numberOfCoinsThatMoneyWouldDistributed
  const ifDividedRemainderHasMoreThan3Numbers =
    divided.toString().search(/\d+\.\d{3,}/) !== -1
  // console.log(ifDividedRemainderHasMoreThan3Numbers);

  const remainderWith2Number = Math.floor(divided * 100) / 100
  // const remainderLastNumbers = ((divided * 100) % 1 * numberOfCoinsThatMoneyWouldDistributed / 100)
  const remainderLastNumbers =
    money - remainderWith2Number * numberOfCoinsThatMoneyWouldDistributed

  // console.log('remainderLastNumbers', remainderLastNumbers);

  const array = new Array(numberOfCoinsThatMoneyWouldDistributed)
    .fill(undefined)
    .map((el, i) => {
      if (!ifDividedRemainderHasMoreThan3Numbers) {
        return divided
      }

      return i === numberOfCoinsThatMoneyWouldDistributed - 1
        ? +(remainderWith2Number + remainderLastNumbers)
        : remainderWith2Number
    })

  return array
}

export const calcPriceForRebalancedPortfolio = (el, portfolioAssets) => {
  //TODO: Write it with staticRowsMap without comparision
  const indexInCurrentPortfolio = portfolioAssets.findIndex(
    (curEl) => curEl._id === el._id
  )
  const hasSameCoinInCurrentPortfolio = indexInCurrentPortfolio !== -1
  const currentPrice = hasSameCoinInCurrentPortfolio ? parseFloat(
    portfolioAssets[indexInCurrentPortfolio].price
  ) : null
  const price = hasSameCoinInCurrentPortfolio && currentPrice !== 0
    ? (currentPrice * parseFloat(el.amount.$numberDecimal)).toFixed(2)
    : parseFloat(el.amount.$numberDecimal).toFixed(2)

  const quantity = hasSameCoinInCurrentPortfolio
    ? parseFloat(el.amount.$numberDecimal)
    : null

  return {
    price,
    currentPrice,
    quantity,
  }
}


export const checkForEmptyNamesInAssets = (rows: IRow[]): boolean => {
  const hasEmptyNames = rows.some((row) => row.exchange === '' || row.exchange === 'Exchange' || row.symbol === '' || row.symbol === 'Coin')

  return hasEmptyNames
}

export const deleteEmptyAssets = (rows: IRow[]): IRow[] => {
  return rows.filter((row) => !(row.exchange === '' || row.exchange === 'Exchange' || row.symbol === '' || row.symbol === 'Coin'))
}

type InputObject = {
  clonedRows: IRow[]
  rows: IRow[]
  undistributedMoney: number | string
  idx: number
  percentInput: string | number
  totalRows: string | number
  totalSnapshotRows: string | number
}

type OutputObject = {
  totalPercentsNew: number | string
  rowWithNewPriceDiff: IRow[]
  isPercentSumGood: boolean
  newUndistributedMoney: number | string
  newTableTotalRows: number | string
}

export const recalculateAfterInputChange = ({clonedRows, rows, undistributedMoney, idx, percentInput, totalRows, totalSnapshotRows} : InputObject): OutputObject => {
  const resultRows = [
    ...clonedRows.slice(0, idx),
    {
      ...clonedRows[idx],
      portfolioPerc: percentInput,
    },
    ...clonedRows.slice(idx + 1, clonedRows.length),
  ]

  const newCalculatedRowsWithPercents = calculatePriceByPercentsForOneAsset(
    resultRows,
    totalRows,
    idx
  )
  const totalPercentsNew = calculateTotalPercents(
    newCalculatedRowsWithPercents
  )
  const rowWithNewPriceDiff = calculatePriceDifference(
    newCalculatedRowsWithPercents
  )
  const newTableTotalRows = calculateTableTotal(
    newCalculatedRowsWithPercents
  )

  const oldRowPrice = rows[idx].price
  const newRowPrice = newCalculatedRowsWithPercents[idx].price
  const oldNewPriceDiff = parseFloat(oldRowPrice) - parseFloat(newRowPrice)
  const newUndistributedMoney = parseFloat(undistributedMoney) + oldNewPriceDiff
  const isPercentSumGood = checkEqualsOfTwoTotals(
    totalSnapshotRows,
    newTableTotalRows
  )

  return {
    totalPercentsNew,
    rowWithNewPriceDiff,
    isPercentSumGood,
    newUndistributedMoney,
    newTableTotalRows,
  }

}
