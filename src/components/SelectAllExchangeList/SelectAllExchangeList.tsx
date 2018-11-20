import React from 'react'
import { exchangeByEntryQuery } from '@containers/User/api'
import { SelectT } from '@styles/cssUtils'
import { client } from '@graphql/apolloClient'
import { Data } from './SelectAllExchangeList.types'
import { ApolloQueryResult } from 'apollo-client'

const combineDataToSelectOptions = (data: Data) => {
  // console.log('data in combine', data);

  const exchangeOptions =
    data.exchangeByEntry &&
    data.exchangeByEntry
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name }) => ({
        label: name,
        value: name,
      }))

  return exchangeOptions
}

const promiseOptions = (inputValue: string) => {
  // console.log('inputValue in: ', inputValue);

  return client
    .query({ query: exchangeByEntryQuery, variables: { search: inputValue } })
    .then((response: ApolloQueryResult<any>) =>
      combineDataToSelectOptions(response.data)
    )
    .catch((error) => {
      console.log(error)
    })
}

export default class SelectAllExchangeList extends React.Component {
  render() {
    const { ...otherPropsForSelect } = this.props

    return (
      <SelectT
        defaultOptions={true}
        asyncSelect={true}
        loadOptions={promiseOptions}
        cacheOptions={true}
        placeholder="Select..."
        {...otherPropsForSelect}
      />
    )
  }
}
