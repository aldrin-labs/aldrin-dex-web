import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import * as actions from '../../../actions'
import { IState, IData, IProps } from './Optimization.types'
import BarChart from '@components/BarChart/BarChart'
import EfficientFrontierChart from './EfficientFrontierChart/EfficientFrontierChart'
import Table from './Table/Table'
import SwitchButtons from '@components/SwitchButtons/SwitchButtons'
import Import from './Import/Import'
import QueryRenderer from '@components/QueryRenderer'
import { getCoinsForOptimization } from './api'

class Optimization extends Component<IProps, IState> {
  state = {
    activePercentageButton: 0,
    risk: [],
    optimizedData: [],
    rawDataBeforeOptimization: [],
    expectedReturn: '',
    activeButton: 2,
    percentages: [0],
  }

  handleChange = (event: any) => {
    this.setState({
      expectedReturn: event.target.value.replace(/-|%/g, ''),
    })
  }

  optimizePortfolio = () => {
    if (!(this.state.expectedReturn === '' || this.props.data.length < 1)) {
      if (this.props.isShownMocks) {
        const risk = [
          (Math.random() * 100).toFixed(2),
          (Math.random() * 100).toFixed(2),
          (Math.random() * 100).toFixed(2),
          (Math.random() * 100).toFixed(2),
          (Math.random() * 100).toFixed(2),
        ]
        this.setState({
          optimizedData: this.props.data.map(({ coin }: { coin: string }) => ({
            coin,
            percentage: (Math.random() * 100).toFixed(2),
          })),
          risk,
          rawDataBeforeOptimization: this.props.data,
        })
      } else {
        // send some data to backend maybe?
        // also get data from props and push it to main table
        // this.props.optimizedData &&
        //   this.setState({ optimizedData: this.props.optimizedData })
      }

      this.setState({
        percentages: this.getPercentages(Number(this.state.expectedReturn)),
      })
    }
  }

  onBtnClick = (index: number) => {
    this.optimizePortfolio()
    this.setState({ activeButton: index })
  }

  getPercentages = (percentage: number) => {
    /* tslint:disable */
    //  not optimized code
    const percetageArray: number[] = []

    if (percentage <= 0) {
      return []
    }

    if (percentage <= 5) {
      percetageArray.push(percentage)
      for (let index = 1; index < 5; index++) {
        percetageArray.push(percentage + 5 * index)
      }

      return percetageArray
    }

    if (percentage <= 10) {
      percetageArray.push(percentage - 5)
      percetageArray.push(percentage)

      for (let index = 1; index < 4; index++) {
        percetageArray.push(percentage + 5 * index)
      }

      return percetageArray
    }

    for (let index = 1; index < 3; index++) {
      percetageArray.push(percentage - 5 * (3 - index))
    }

    percetageArray.push(percentage)

    for (let index = 1; index < 3; index++) {
      percetageArray.push(percentage + 5 * index)
    }
    /* tslint:enable */

    return percetageArray
  }

  renderInput = () => {
    const { expectedReturn } = this.state
    const { isShownMocks, updateData, storeData } = this.props

    return (
      <QueryRenderer
        storeData={storeData}
        component={Import}
        query={getCoinsForOptimization}
        expectedReturn={expectedReturn}
        optimizePortfolio={this.optimizePortfolio}
        isShownMocks={false}
        updateData={updateData}
        handleChange={this.handleChange}
      />
    )
  }

  renderCharts = () => {
    const {
      percentages,
      optimizedData,
      rawDataBeforeOptimization,
      activeButton,
      risk,
    } = this.state

    const formatedData = rawDataBeforeOptimization.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))
    const formatedOptimizedData = optimizedData.map((el: IData, i) => ({
      x: el.coin,
      y: Number(Number(el.percentage).toFixed(2)),
    }))

    const barChartData = [
      {
        data: formatedData,
        title: 'Original',
        color: '#4fd8da',
      },
      {
        data: formatedOptimizedData,
        title: 'Optimized',
        color: '#4fa1da',
      },
    ]

    const efficientFrontierData = {
      percentages,
      risk,
      activeButton,
    }

    return (
      <ChartsContainer>
        <Chart>
          <BarChart
            height={300}
            showPlaceholder={optimizedData.length < 1}
            charts={barChartData}
          />
        </Chart>
        <Chart>
          <EfficientFrontierChart data={efficientFrontierData} />
        </Chart>
      </ChartsContainer>
    )
  }

  render() {
    const { children } = this.props
    const { optimizedData, percentages, activeButton } = this.state

    return (
      <PTWrapper>
        <Content>
          {children}
          <UpperArea>{this.renderInput()}</UpperArea>

          <MainArea>
            <MainAreaUpperPart>
              <SwitchButtons
                onBtnClick={this.onBtnClick}
                values={percentages}
                show={optimizedData.length >= 1}
                activeButton={activeButton}
              />

              <Table data={optimizedData} withInput={false} />
            </MainAreaUpperPart>
            {this.renderCharts()}
          </MainArea>
        </Content>
      </PTWrapper>
    )
  }
}

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`
const Chart = styled.div`
  padding: 0.5rem;
  margin: 1rem;
  flex-grow: 1;
  min-width: 0;
  height: 300px;
  border-radius: 1rem;
  background: #393e44;

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

const MainAreaUpperPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 20px auto;
  max-height: 2rem;
  position: relative;
  top: ${(props: { show: boolean }) => (props.show ? '0' : '-100px')};
  z-index: ${(props: { show: boolean }) => (props.show ? '1' : '-10')};
  opacity: ${(props: { show: boolean }) => (props.show ? '1' : '0')};
  transition: top 0.3s ease-in, opacity 0.3s ease-out;
`

const Btn = styled.button`
  border-radius: 2px;
  background-color: ${(props: { active: boolean }) =>
    props.active ? '#4ed8da' : '#4c5055'};
  margin-right: 16px;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${(props: { active: boolean }) =>
    props.active ? '#4c5055' : '#4ed8da'};
  cursor: pointer;
  transition: all 0.25s linear;
`

const MainArea = styled.div`
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  flex-direction: column;
  background: #292d31;
  height: auto;
  display: flex;
  margin: 2rem;
`

const PTWrapper = styled.div`
  min-height: 100%;
  overflow-y: auto;
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  overflow: auto;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const Content = styled.div`
  flex: 0 0 auto;
`

const UpperArea = styled.div`
  width: 50%;
  display: flex;
  margin: 0 auto;

  @media (max-width: 1080px) {
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  storeData: store.portfolio.optimizationData,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  Optimization
)

export default compose()(storeComponent)
