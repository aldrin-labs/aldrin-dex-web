import * as React from 'react'

import QueryRenderer from '@components/QueryRenderer'
import PieChart from '@components/PieChart'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'

import { PortfolioPieChart } from './api'
import { PortfolioPieChartQuery } from './annotations'

export interface Props {
  data: PortfolioPieChartQuery
}

class PieChartQuery extends React.Component<Props> {
  render() {
    const { data } = this.props

    const { getProfile } = data
    if (!getProfile) return <CustomError error="!getProfile" />
    const { portfolio } = getProfile
    if (!portfolio) return <CustomError error="!portfolio" />
    const { assets } = portfolio
    if (!assets) return <CustomError error="!assets" />

    const obj: { [key: string]: number } = {}

    assets.forEach((asset) => {
      if (!asset) return null
      const { value, asset: internalAsset } = asset
      if (!internalAsset) return null
      const { industry } = internalAsset
      if (!industry) return null
      const { name } = industry
      if (!name) return null

      if (!obj[name] && !!value) {
        obj[name] = value
      } else if (!!obj[name] && !!value) {
        obj[name] += value
      }
      return null
    })

    const pieData = Object.keys(obj).map((key) => {
      return {
        angle: obj[key],
        label: key,
      }
    })

    return <PieChart data={pieData} />
  }
}

export default function() {
  return <QueryRenderer component={PieChartQuery} query={PortfolioPieChart} />
}
