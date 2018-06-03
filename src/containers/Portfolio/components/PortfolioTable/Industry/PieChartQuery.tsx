import * as React from 'react'

import QueryRenderer from '@components/QueryRenderer'
import PieChart from '@components/PieChart'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'

import { PortfolioPieChart } from './api'
import { PortfolioPieChartQuery } from './annotations'
import { MOCKS, colors } from './mocks'

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
    if (!data) return <CustomError error="!data" />
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

    const pieData = Object.keys(obj).map((key, i) => {
      return {
        angle: obj[key],
        label: key,
        color: i + 1,
      }
    })

    return <PieChart data={pieData} flexible />
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
