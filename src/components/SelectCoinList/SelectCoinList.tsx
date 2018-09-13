import * as React from 'react'
import { searchAssetsQuery } from '@containers/User/api'
import QueryRenderer from '../QueryRenderer/index'
import { SelectR } from '@styles/cssUtils'

const SelectCoinList = ({ data, ...otherPropsForSelect }) => {

  const walletOptions =
    data.searchAssets &&
    data.searchAssets
      .slice()
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .map(({ symbol }) => ({
        label: symbol,
        value: symbol,
      }))

  return (
    <SelectR
      placeholder=""
      options={walletOptions || []}
      {...otherPropsForSelect}
    />
  )
}

const DataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={SelectCoinList}
      query={searchAssetsQuery}
      {...props}
    />
  )
}

export default DataWrapper
