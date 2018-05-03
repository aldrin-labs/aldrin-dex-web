import * as React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'
import filterListIcon from '@icons/filter-list.svg'
import gridLoader from '@icons/grid.svg'

import { Props } from './PortfolioTableTabs.types'

const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio {
    updatePortfolio
  }
`

export default class PortfolioTableTabs extends React.Component<Props> {
  onChangeTab = (tab: string) => {
    const { onChangeTab } = this.props
    if (onChangeTab) onChangeTab(tab)
  }

  onToggleChart = () => {
    const { onToggleChart } = this.props
    if (onToggleChart) onToggleChart()
  }

  onToggleUSDBTC = () => {
    const { onToggleUSDBTC } = this.props
    if (onToggleUSDBTC) onToggleUSDBTC()
  }

  render() {
    const { tab, portfolio } = this.props

    return (
      <React.Fragment>
        <PTHeadingBlock>
          <TabContainer>
            <Tab
              onClick={() => this.onChangeTab('main')}
              active={tab === 'main'}
            >
              Main
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('industry')}
              active={tab === 'industry'}
            >
              Industry
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('rebalance')}
              active={tab === 'rebalance'}
            >
              Rebalance
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('correlation')}
              active={tab === 'correlation'}
            >
              Correlation
            </Tab>
          </TabContainer>

          <ToggleBtn onClick={this.onToggleChart}>
            <SvgIcon src={filterListIcon} width={24} height={24} />
          </ToggleBtn>
        </PTHeadingBlock>

        {tab !== 'correlation' && (
          <PTHeadingBlock>
            <Switch onClick={this.onToggleUSDBTC} values={['USD', 'BTC']} />

            {tab === 'main' && (
              <Mutation mutation={UPDATE_PORTFOLIO}>
                {(updatePortfolio, { data, loading }) => {
                  const isLoading =
                    loading || (portfolio && portfolio.processing)
                  return (
                    <ToggleBtn onClick={updatePortfolio}>
                      {isLoading ? (
                        <SvgIcon src={gridLoader} width={24} height={24} />
                      ) : (
                        'Refresh'
                      )}
                    </ToggleBtn>
                  )
                }}
              </Mutation>
            )}
          </PTHeadingBlock>
        )}
      </React.Fragment>
    )
  }
}

const PTHeadingBlock = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 17px;
  min-height: 100px;
`

const ToggleBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
`

const TabContainer = styled.div`
  display: flex;
`

const Tab = styled.button`
  color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : '#fff'};
  border-color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : 'transparent'};

  padding: 10px 30px;
  border-radius: 3px;
  background-color: #292d31;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin: 10px 15px;
  outline: none;
  box-sizing: border-box;
`

const Icon = styled.i`
  padding-right: 5px;
`
