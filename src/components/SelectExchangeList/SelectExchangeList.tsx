import * as React from 'react'
import { getExchangesForKeysListQuery } from '@containers/User/api'
import QueryRenderer from '@components/QueryRenderer'
import ReactSelectComponent from '@components/ReactSelectComponent'
import styled from 'styled-components'

class SelectExchangeList extends React.Component {
  render() {
    const { data, ...otherPropsForSelect } = this.props
    console.log(otherPropsForSelect);


    const exchangeOptions = data.exchangePagination && data.exchangePagination.items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name }) => ({
        label: name,
        value: name,
      }))


    return <SelectR placeholder="" options={exchangeOptions || []} {...otherPropsForSelect} />
  }
}


export default class DataWrapper extends React.Component {
  render() {
    return (
      <QueryRenderer
        component={SelectExchangeList}
        query={getExchangesForKeysListQuery}
        {...this.props}
      />
    )
  }
}

const SelectR = styled(ReactSelectComponent)`
  font-family: Roboto;
  font-size: 16px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`
