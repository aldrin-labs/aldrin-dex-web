import { IRowT, SortArgs, Args, IPortfolio } from '@containers/Portfolio/components/PortfolioTable/types'

export interface IState {
  tableData: IRowT | null
  selectedBalances: number[] | null
  selectedSum: IRowT | null
  currentSort: { arg: SortArgs; key: Args } | null
  activeKeys: number[] | null
  portfolio: IPortfolio | null
}

export interface IProps {
  isShownChart: boolean
  filterValueSmallerThenPercentage: number | undefined
  isUSDCurrently: boolean
  checkboxes: number[]
  subscription: any
  tab: string
  data: {
    portfolioId: string | null
    portfolio: {
      name: string | null
      processing: boolean | null
      assetIds: (string | null)[] | null
      assets:
        | ({
            _id: string
            assetId: string | null
            exchangeId: string | null
            keyId: string | null
            value: number | null
            realizedProfit: number | null
            unrealizedProfit: number | null
            totalProfit: number | null
            asset: {
              name: string | null
              symbol: string | null
              priceUSD: string | null
            } | null
            exchange: {
              name: string | null
            } | null
            key: {
              name: string | null
              apiKey: string | null
            } | null
          } | null)[]
        | null
    } | null
  } | null
}
