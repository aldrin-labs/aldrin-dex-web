import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'
import PieChart from '@components/PieChart'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import filterListIcon from '../../../../icons/filter-list.svg'
import gridLoader from '../../../../icons/grid.svg'
import spinLoader from '../../../../icons/tail-spin.svg'
import { RowT, State, Args } from './types'
import { TableProps, Portfolio } from '../../interfaces'
import PortfolioTableIndustries from './Industry/PortfolioTableIndustries'
import PortfolioTableRebalance from './Rebalance/PortfolioTableRebalance'
import PortfolioTableBalances from './Main/PortfolioTableBalances'
import Correlation from './Correlation/Correlation'
import { combineToChart } from './Industry/mocks'

const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio {
    updatePortfolio
  }
`

export class PortfolioTable extends React.Component<TableProps> {
  state: State = {
    tableData: null,
    isShownChart: true,
    portfolio: null,
    isUSDCurrently: true,
    tab: 'main',
  }

  onToggleChart = () => {
    this.setState({ isShownChart: !this.state.isShownChart })
  }

  onToggleUSDBTC = () => {
    this.setState({ isUSDCurrently: !this.state.isUSDCurrently })
  }

  onChangeTab = (kind: 'main' | 'industry' | 'rebalance') => {
    this.setState({ tab: kind })
  }

  render() {
    const {
      tab,
      tableData,
      portfolio,
      isShownChart,
      isUSDCurrently,
    } = this.state

    // if (!this.props.data) return null

    if (this.props.data && !tableData) {
      return (
          <LoaderWrapper>
            <SvgIcon
              src={spinLoader}
              width={48}
              height={48}
              style={{
                position: 'absolute',
                left: 'calc(50% - 48px)',
                top: 'calc(50% - 48px)',
              }}
            />
          </LoaderWrapper>
        )
    }

    return (
      <PTWrapper>
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

        {tab === 'main' && (
          <PortfolioTableBalances
            isShownChart={isShownChart}
            isUSDCurrently={isUSDCurrently}
            subscription={this.props.subscription}
            data={this.props.data}
            checkboxes={this.props.checkboxes}
            tab={this.state.tab}
          />
        )}

        {tab === 'industry' && (
          <PortfolioTableIndustries
            checkboxes={this.props.checkboxes}
            data={this.props.data}
            isUSDCurrently={isUSDCurrently}
            onSortTable={this.onSortTable}
          />
        )}

        {tab === 'rebalance' && <PortfolioTableRebalance />}

        {tab === 'correlation' && <Correlation />}

        {tab === 'main' &&
          isShownChart && (
            <ProfileChart
              style={{
                marginLeft: 0,
                borderTop: '1px solid #fff',
                minHeight: '30vh',
              }}
            />
          )}

        {tab === 'industry' &&
          isShownChart && (
            <PieChartContainer>
              <PieChartHeadingWrapper>
                <Heading>Industry Pie Chart</Heading>
              </PieChartHeadingWrapper>
              <PieChart data={combineToChart()} />
            </PieChartContainer>
          )}
      </PTWrapper>
    )
  }
}

const PieChartHeadingWrapper = styled.div`
  width: 200px;
  text-align: center;
  padding-bottom: 10px;
`

const PieChartContainer = styled.div`
  margin: 10px;
`

const TabContainer = styled.div`
  display: flex;
`

const Heading = styled.span`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #fff;
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

const ToggleBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
`

const PTWrapper = styled.div`
  width: calc(100% - 240px);
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
`

const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
  position: relative;
`

const PTHeadingBlock = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 17px;
  min-height: 100px;
`
const Icon = styled.i`
  padding-right: 5px;
`
