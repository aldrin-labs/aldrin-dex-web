import { flatten, has } from 'lodash-es'

import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
  roundPercentage,
  transformToNumber,
} from '@core/utils/PortfolioTableUtils'
import { InputRecord } from './types'
import { colorful } from '@storybook-components/index'

export interface InputRecord {
  label: string
  realValue: number
}

export const combineIndustryData = ({
  data,
  red = 'red',
  green = 'green',
}: {
  data: any
  red: string
  green: string
}): { industryData: ReadonlyArray<any>; chartData: ReadonlyArray<any> } => {
  if (!has(data, 'myPortfolios')) {
    return { industryData: [], chartData: [] }
  }

  const sumPortfolioPercentageOfAsset = (
    assets: ReadonlyArray<any>,
    allSum: number
  ) => {
    let sum = 0
    assets.forEach((asset) => {
      sum += percentagesOfCoinInPortfolio(asset, allSum, true)
    })

    return {
      render: `${roundPercentage(sum)}%`,
      isNumber: true,
      contentToSort: +roundPercentage(sum),
    }
  }

  const { myPortfolios } = data
  const industryData = flatten(
    myPortfolios.map(({ industryData: industry }: { industryData: any }) => {
      // calculating all assets to calculate allSum
      let allAssets: ReadonlyArray<any> = []

      industry.forEach((row: any) => {
        row.assets.forEach((asset: any) => (allAssets = [...allAssets, asset]))
      })
      const allSum = calcAllSumOfPortfolioAsset(allAssets)

      return industry.map((row: any) => ({
        // industry should be uniq
        id: row.industry,
        industry: row.industry,
        coin:
          row.assets.length === 1
            ? { render: row.assets[0].coin, style: { fontWeight: 700 } }
            : 'multiple',
        portfolio: sumPortfolioPercentageOfAsset(row.assets, allSum),
        // portfolioPerformance: colorful(
        //   calculateTotalPerfOfCoin(row.assets) || 0,
        //   red,
        //   green
        // ),

        industry1w: colorful(+roundPercentage(row.industry1W) || 0, red, green),

        industry1m: colorful(+roundPercentage(row.industry1M) || 0, red, green),

        industry3M: colorful(+roundPercentage(row.industry3M) || 0, red, green),
        industry1Y: colorful(+roundPercentage(row.industry1Y) || 0, red, green),

        expandableContent:
          row.assets.length === 1
            ? []
            : row.assets.map((asset: any) => ({
                industry: '',
                coin: { render: asset.coin, style: { fontWeight: 700 } },
                portfolio: +roundPercentage(
                  percentagesOfCoinInPortfolio(asset, allSum, true)
                ),
                // portfolioPerformance: colorful(
                //   +roundPercentage(asset.perf),
                //   red,
                //   green
                // ),
                industry1w: '',
                industry1m: '',
                industry3m: '',
                industry1y: '',
              })),
      }))
    })
  )

  const chartData: ReadonlyArray<InputRecord> = industryData.map(
    (row: any) => ({
      label: row.industry,
      realValue: +transformToNumber(row.portfolio.render),
    })
  )

  return { chartData, industryData }
}
