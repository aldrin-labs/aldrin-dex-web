import nanoid from 'nanoid'

export const onCheckBoxClick = (
  selected: ReadonlyArray<any>,
  id: string
): ReadonlyArray<string> => {
  const selectedIndex = selected.indexOf(id)
  let newSelected: ReadonlyArray<string> = []

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, id)
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1))
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1))
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1)
    )
  }

  return newSelected
}

export const calcAllSumOfPortfolioAsset = (assets: any): number => {
  return assets.reduce((acc: number, curr: any) => {
    return acc + curr.quantity * Number(curr.price)
  }, 0)
}

export const dustFilter = (
  tableData: any[],
  filterValueSmallerThenPercentage: number | undefined = 0
) => {
  const filtering = (el) =>
    !el || isNaN(el.portfolioPercentage)
      ? 0
      : el.portfolioPercentage >
        (filterValueSmallerThenPercentage
          ? filterValueSmallerThenPercentage
          : 0)

  //  dust filter part
  return tableData.filter((el) =>
    //  if el.percentage is not a number then turn it into 0
    filtering(el)
  )
}

const calculateTotalPerfOfCoin = (assets: any[]): number =>
  +roundPercentage(assets.reduce((acc, curr) => acc + curr.perf, 0))


// transform "number%" to number
export const transformToNumber = (percentage: string) =>
  +percentage.split('%')[0]


export const percentagesOfCoinInPortfolio = (
  asset: any,
  allSum: number,
  isUSDCurrently: boolean
): number =>
  isUSDCurrently
    ? (asset.price * asset.quantity * 100) / allSum
    : (asset.price * asset.quantity * 100) / allSum

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

export const roundPercentage = (num: number) => num && num.toFixed(2)

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
  x: number | null,
  precision: number,
  format: boolean = true
): string => {
  if (x === null || x === 0 || +parseFloat(x).toFixed(precision) === 0) {
    return '0'
  }

  const res = format
    ? formatNumberToUSFormat(parseFloat(x).toFixed(precision))
    : parseFloat(x).toFixed(precision)

  return res
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
  portfolioAssets,
  filterValueSmallerThenPercentage,
  isUSDCurrently
) => {
  if (!portfolioAssets) {
    return
  }
  // TODO: I guess, filter Boolean should be first before map, because it will reduce the array first, without
  // performance loss by mapping elements that do not pass our requirements
  // checking that asset is array and have length more then 0
  const portfolioAssetsLength = portfolioAssets.length
    ? portfolioAssets.length + 1
    : 0
  const allSums = portfolioAssets.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  )

  const tableData = portfolioAssets.map((row: any, i) => {
    const {
      _id,
      price,
      coin,
      quantity = 0,
      name = '',
      where = '',
      realized = 0,
      unrealized = 0,
      percentChangeDay = 0,
      portfolioPercentage = 0,
      dailyPerc = 0,
      daily = 0,
    } = row || {}

    return {
      coin,
      price,
      quantity,
      daily,
      dailyPerc,
      portfolioPercentage: (price * quantity * 100) / allSums,
      currentPrice: price * quantity,
      realizedPL: realized,
      unrealizedPL: unrealized,
      totalPL: realized + unrealized,
      id: _id,
      exchange: where,
    }
  })

  return tableData
}

export const numberOfDigitsAfterPoint = (isUSDCurrently: boolean): number =>
  isUSDCurrently ? 2 : 8

export const roundPrice = (price: number, isUSDCurrently: boolean): number =>
  +price.toFixed(numberOfDigitsAfterPoint(isUSDCurrently))

export const swapDates = ({
  startDate,
  endDate,
}: {
  startDate: number
  endDate: number
}) => ({ startDate: endDate, endDate: startDate })

export const sliceCoinName = (str: string) => str.slice(0, 6)
