import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { getPortfolioQuery, updateRebalanceMutation } from './api'
import { IProps } from './interfaces'
import { Login } from '@containers/Login'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from './components'
import { compose } from 'recompose'

const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdate
  }
`

class PortfolioComponent extends React.Component<IProps> {
  constructor(props, context) {
    super(props, context)

    this.state = {
      checkboxes: null,
      isSideNavOpen: false,
    }

    this.toggleWallets = this.toggleWallets.bind(this)
  }

  onChangeActiveKey = (checkboxes: number[]) => {
    this.setState({ checkboxes })
  }

  toggleWallets() {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const { checkboxes } = this.state
    const { getPortfolioQueryData, updateRebalanceMutationQuery } = this.props
    const { getProfile, loading, error } = getPortfolioQueryData

    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => (
          <PortfolioContainer>
            {error &&
              error.toString().match('jwt expired') && <Login isShownModal />}
            <PortfolioSelector
              toggleWallets={this.toggleWallets}
              isSideNavOpen={this.state.isSideNavOpen}
              onChangeActive={this.onChangeActiveKey}
            />
            <PortfolioTable
              loading={loading}
              checkboxes={checkboxes}
              toggleWallets={this.toggleWallets}
              data={getProfile}
              updateRebalanceMutationQuery={updateRebalanceMutationQuery}
              subscription={subscriptionData}
            />
            <Backdrop
              onClick={this.toggleWallets}
              isSideNavOpen={this.state.isSideNavOpen}
            />
          </PortfolioContainer>
        )}
      </Subscription>
    )
  }
}

// TODO: Refactor all these queries and move it into subcomponents

export default compose(
  graphql(getPortfolioQuery, { name: 'getPortfolioQueryData' }),
  graphql(updateRebalanceMutation, { name: 'updateRebalanceMutationQuery' })
)(PortfolioComponent)

const PortfolioContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 600px;
`
const Backdrop = styled.div`
  display: ${(props) => (props.isSideNavOpen ? 'block' : 'none')};
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`
