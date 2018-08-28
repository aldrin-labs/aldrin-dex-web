import * as React from 'react'
import { searchSupportedNetworksQuery } from '@containers/User/api'
import QueryRenderer from '../QueryRenderer/index'
import ReactSelectComponent from '../ReactSelectComponent/index'
import styled from 'styled-components'

class SelectWalletList extends React.Component {
  render() {
    const { data, ...otherPropsForSelect } = this.props
    console.log(this.props, 'this props in wallet');


    const walletOptions = data.searchSupportedNetworks && data.searchSupportedNetworks
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name }) => ({
        label: name,
        value: name,
      }))

    return <SelectR placeholder="" options={walletOptions || []} {...otherPropsForSelect} />
  }
}


export default class DataWrapper extends React.Component {
  render() {
    return (
      <QueryRenderer
        component={SelectWalletList}
        query={searchSupportedNetworksQuery}
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
