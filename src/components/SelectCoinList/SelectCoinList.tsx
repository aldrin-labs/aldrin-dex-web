import * as React from 'react'
import { searchAssetsQuery } from '@core/graphql/queries/user/searchAssetsQuery'
import { ApolloQueryResult } from 'apollo-client'
import { client } from '@core/graphql/apolloClient'
import { Data } from './SelectCoinList.types'
import ForwarderRefHoc from '@core/hoc/ForwarderRef'
import ReactSelectComponent from '@storybook/components/ReactSelectComponent'


const combineDataToSelectOptions = (data: Data) => {
  // console.log('data in combine', data);

  const coinOptions =
    data.searchAssets &&
    data.searchAssets
      .slice()
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .map(({ symbol }) => ({
        label: symbol,
        value: symbol,
      }))

  return coinOptions
}

const promiseOptions = (inputValue: string) => {
  // console.log('inputValue in: ', inputValue);

  return client
    .query({ query: searchAssetsQuery, variables: { search: inputValue } })
    .then((response: ApolloQueryResult<any>) =>
      combineDataToSelectOptions(response.data)
    )
    .catch((error) => {
      console.log(error)
    })
}

class SelectCoinList extends React.Component {
  render() {
    const { forwardedRef, ...otherPropsForSelect } = this.props

    return (
      <ReactSelectComponent
        ref={forwardedRef}
        asyncSelect={true}
        loadOptions={promiseOptions}
        cacheOptions={true}
        placeholder="Select..."
        {...otherPropsForSelect}
      />
    )
  }
}

export default ForwarderRefHoc(SelectCoinList)
