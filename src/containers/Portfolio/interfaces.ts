import { getPortfolioQuery } from '@containers/Portfolio/annotations'
import React from 'react'

export interface IProps {
  data: { getProfile: getPortfolioQuery; loading: boolean; error?: string }
  theme: object
  login: boolean
  keys: string[]
  activeKeys: string[]
  wallets: string[]
  activeWallets: string[]
}

export interface IState {
  isSideNavOpen: boolean
  filter: number
}

export interface IPortfolio {
  name: string | null
  processing: boolean | null
  assetIds: (string | null)[] | null
  assets:
    | ({
        _id: string
        assetId: string | null
        exchangeId: string | null
        keyId: string | null
        quantity: number | null
        realizedProfit: number | null
        unrealizedProfit: number | null
        totalProfit: number | null
        asset: {
          name: string | null
          symbol: string | null
          priceUSD: string | null
          priceBTC: string | null
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
}

export interface IndProps {
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
            quantity: number | null
            realizedProfit: number | null
            unrealizedProfit: number | null
            totalProfit: number | null
            asset: {
              name: string | null
              symbol: string | null
              priceUSD: string | null
              priceBTC: string | null
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

  checkboxes: number[]
  isUSDCurrently: boolean
  filterValueSmallerThenPercentage: string
  isShownMocks?: boolean
}

export interface ITableProps {
  isShownChart: boolean
  loading: boolean
  activeKeys: string[]
  subscription: any
  theme: object
  toggleWallets: React.ReactEventHandler

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
            quantity: number | null
            realizedProfit: number | null
            unrealizedProfit: number | null
            totalProfit: number | null
            asset: {
              name: string | null
              symbol: string | null
              priceUSD: string | null
              priceBTC: string | null
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
