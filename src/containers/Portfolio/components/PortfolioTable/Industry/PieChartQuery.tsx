import * as React from 'react'

import QueryRenderer from '@components/QueryRenderer'
import PieChart from '@components/PieChart'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'

import { PortfolioPieChart } from '@containers/Portfolio/components/PortfolioTable/Industry/api'
import { PortfolioPieChartQuery } from '@containers/Portfolio/components/PortfolioTable/Industry/annotations'
import { MOCKS } from '@containers/Portfolio/components/PortfolioTable/Industry/mocks'
import {
  calcAllSumOfPortfolioAsset,
  roundPercentage,
} from '@utils/PortfolioTableUtils'

export interface Props {
  data: PortfolioPieChartQuery
  isShownMocks: boolean
}

export interface State {
  data: PortfolioPieChartQuery | null
}

class PieChartQuery extends React.Component<Props, State> {
  state: State = {
    data: null,
  }

  componentDidMount() {
    const { data, isShownMocks } = this.props

    if (isShownMocks) {
      if (!data) return
      const { getProfile } = data
      if (!getProfile) return
      const { portfolio } = getProfile
      if (!portfolio) return
      const { assets } = portfolio
      if (!assets) return

      const tmpCombinedAssets = assets.concat(...MOCKS)
      this.setState({ data: tmpCombinedAssets })
    }

    this.setState({ data })
  }

  render() {
    const { data } = this.state
    const { isUSDCurrently, theme } = this.props
    if (!data) return <CustomError error="!data" />
    const { getProfile } = data
    if (!getProfile) return <CustomError error="!getProfile" />
    const { portfolio } = getProfile
    if (!portfolio) return <CustomError error="!portfolio" />
    const { assets } = portfolio
    if (!assets) return <CustomError error="!assets" />

    const allSums = calcAllSumOfPortfolioAsset(assets)

    const obj: { [key: string]: number } = {}
    assets.forEach((asset) => {
      if (!asset) return null
      const { quantity, asset: internalAsset } = asset
      if (!internalAsset) return null
      const { industry, priceUSD, priceBTC } = internalAsset
      const name = industry ? industry.name : null

      const mainPrice = isUSDCurrently ? priceUSD : priceBTC
      const currentPrice = mainPrice * quantity

      if (name === null && !obj.Other) {
        obj['Other'] = +roundPercentage(currentPrice * 100 / allSums)
      } else if (name === null && obj.Other) {
        obj['Other'] += +roundPercentage(currentPrice * 100 / allSums)
      } else if (!obj[name] && !!quantity) {
        obj[name] = +roundPercentage(currentPrice * 100 / allSums)
      } else if (!!obj[name] && !!quantity) {
        obj[name] += +roundPercentage(currentPrice * 100 / allSums)
      }
    })

    const arrayOfColors = [
      '#EFC151',
      '#E85454',
      '#BB118D',
      '#C79B42',
      '#6DC56F',
      '#EAAB89',
      '#6084C0',
      '#A3C571',
      '#D75227',
      '#0059B4',
      '#28B587',
      '#DED848',
      '#AA1E29',
      '#6B43B7',
      '#999999',
      '#CCCCCC',
      '#00A89B',
      '#7EA9D3',
      '#F2F2F2',
      '#282F39',
    ]

    const labelsStyleObject = { fill: 'white' }

    const pieData = Object.keys(obj).map((key, i) => {
      return {
        angle: obj[key],
        label: key,
        title: key,
        color: arrayOfColors[i],
        realValue: `${roundPercentage(obj[key])}%`,
      }
    })

    return (
      <PieChart
        theme={theme}
        data={pieData}
        flexible={true}
        colorLegend={true}
      />
    )

    // return <PieChart data={pieData} flexible colorLegend labelsRadiusMultiplier={1} labelsStyle={labelsStyleObject} />
  }
}

export default function(props: any) {
  return (
    <QueryRenderer
      component={PieChartQuery}
      query={PortfolioPieChart}
      {...props}
    />
  )
}
