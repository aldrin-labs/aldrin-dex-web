import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { getPortfolioQuery } from './api'
import { IProps } from './interfaces'
import { Login } from '@containers/Login'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from './components'

const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdate
  }
`

class PortfolioComponent extends React.Component<IProps> {
  state = {
    checkboxes: null,
  }

  onChangeActiveKey = (checkboxes: number[]) => {
    this.setState({ checkboxes })
  }

  render() {
    const { checkboxes } = this.state
    const { data } = this.props
    const { getProfile, loading, error } = data

    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => {
          return (
            <PortfolioContainer>
              {error &&
                error.toString().match('jwt expired') && <Login isShownModal />}
              <PortfolioSelector onChangeActive={this.onChangeActiveKey} />
              <PortfolioTable
                loading={loading}
                checkboxes={checkboxes}
                data={getProfile}
                subscription={subscriptionData}
              />
            </PortfolioContainer>
          )
        }}
      </Subscription>
    )
  }
}

export default graphql(getPortfolioQuery)(PortfolioComponent)

const PortfolioContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
`
