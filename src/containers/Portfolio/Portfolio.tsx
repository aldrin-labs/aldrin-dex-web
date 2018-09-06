import React from 'react'
import { Subscription, graphql } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { IProps } from '@containers/Portfolio/interfaces'
import YouNeedToLoginMessage from '@components/YouNotLoginedCard'
import PortfolioSelector from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector'
import { PortfolioTable } from '@containers/Portfolio/components'

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
      filter: 0.5,
    }

    this.toggleWallets = this.toggleWallets.bind(this)
  }

  onChangeActiveKey = (checkboxes: number[]) => {
    this.setState({ checkboxes }, () => {
      console.log('checkboxes in state', checkboxes);

    })
  }

  toggleWallets() {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const { keys, login } = this.props
    const { checkboxes } = this.state

    return (
      <Subscription subscription={PORTFOLIO_UPDATE}>
        {(subscriptionData) => (
          <PortfolioContainer>
            {login ? (
              <>
                <PortfolioSelector
                  toggleWallets={this.toggleWallets}
                  isSideNavOpen={this.state.isSideNavOpen}
                  onChangeActive={this.onChangeActiveKey}
                />
                <PortfolioTable
                  checkboxes={checkboxes}
                  toggleWallets={this.toggleWallets}
                  subscription={subscriptionData}
                />
              </>
            ) : (
              <YouNeedToLoginMessage showModalAfterDelay={1500} />
            )}

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

const mapStateToProps = (store) => ({
  keys: store.portfolio.keys,
  login: store.login.loginStatus,
})

export default compose(connect(mapStateToProps))(PortfolioComponent)

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
  z-index: 1000;
`
