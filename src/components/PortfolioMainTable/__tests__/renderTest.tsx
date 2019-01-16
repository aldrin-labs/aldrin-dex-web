import React from 'react'
import { mount, shallow } from 'enzyme'
import { MockedProvider } from 'react-apollo/test-utils'
import wait from 'waait'

import Table from '../PortfolioMainTable'

import { portfolio, mocks, mockT } from '../mocks'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { getPortfolioMainQuery } from '@containers/Portfolio/api'

export const GET_BASE_COIN = gql`
  query {
    portfolio @client {
      baseCoin
    }
  }
`

export const Dog = () => (
  <Query query={GET_BASE_COIN}>
    {({ loading, error, data }) => {
      if (error) {
        console.log(error)
        return `Error!`
      }
      if (loading) return <span>loading...</span>
      return (
        <Query
          query={getPortfolioMainQuery}
          variables={{ baseCoin: data.portfolio.baseCoin }}
        >
          {({ loading: loadingTwo, data: dataT, error: errorT }) => {
            if (loadingTwo) return <span>loading...</span>
            if (errorT) {
              console.log(errorT)
              return `Error!`
            }
            return (
              <div>
                <h3>{JSON.stringify(dataT)}</h3>
                <h3>{JSON.stringify(data)}</h3>
              </div>
            )
          }}
        </Query>
      )
    }}
  </Query>
)

describe('PortfolioMainTableTests', () => {
  it('renders without errors', () => {
    shallow(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Table />
      </MockedProvider>
    )
  })
  it('calculating sum correctly', async () => {
    const wrapper = mount(
      <MuiThemeProvider theme={createMuiTheme()}>
        <MockedProvider addTypename={false} mocks={mocks}>
          <Dog />
        </MockedProvider>
      </MuiThemeProvider>
    )

    await wait(5)

    wrapper.update()
    await wait(5)

    wrapper.update()

    expect(wrapper.debug()).toBe('USDT')
  })

  // it('should calculate footer properly', () => {
  //   const wrapper = mount(<Table />)
  //   const instance = wrapper.instance()
  //   expect(wrapper.state('counter')).toBe(0)
  //   instance.incrementCounter(true)
  //   expect(wrapper.state('counter')).toBe(2)
  // })
})
