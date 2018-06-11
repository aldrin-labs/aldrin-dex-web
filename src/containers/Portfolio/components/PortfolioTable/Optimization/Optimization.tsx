import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { MOCK_DATA } from '../dataMock'
import BarChart from './BarChart'
import EfficientFrontier from './EfficientFrontier'
import Table from './Table'
import { calcPercentage } from '../../../../../utils/PortfolioTableUtils'
import * as actions from '../../../actions'

class Optimization extends Component<{}> {
  state = {
    activePercentageButton: 0,
    data: [],
    optimizedData: [],
    expectedReturn: '',
    activeButton: 2,
    percentages: [0],
  }

  handleChange = (event) => {
    this.setState({
      expectedReturn: event.target.value.replace(/-|%/g, ''),
    })
  }

  optimizePortfolio = () => {
    if (!(this.state.expectedReturn === '' || this.props.data.length < 1)) {
      if (this.props.isShownMocks) {
        this.setState({
          optimizedData: this.props.data.map(({ coin }: { coin: string }) => ({
            coin,
            percentage: (Math.random() * 100).toFixed(2),
          })),
        })
      } else {
        // send some data to backend maybe?
        // also get data from props and push it to main table
        this.props.optimizedData &&
          this.setState({ optimizedData: this.props.optimizedData })
      }

      this.setState({
        percentages: this.getPercentages(Number(this.state.expectedReturn)),
      })
    }
  }

  sumSameCoins = (rawData) => {
    const data = []

    rawData.forEach((asset) => {
      const index = data.findIndex((obj) => obj.coin === asset.coin)
      if (index >= 0) {
        data[index].percentage =
          Number(asset.percentage) + Number(data[index].percentage)
      } else {
        data.push(asset)
      }
    })

    const result = data.map((asset) => {
      const { coin, percentage } = asset

      return { coin, percentage: calcPercentage(percentage) }
    })

    return result
  }

  importPortfolio = () => {
    let assets
    if (this.props.isShownMocks) {
      assets = MOCK_DATA
    } else {
      assets = this.props.data
      // Implement BackEnd fetch Logic here
      console.log('NoBackEnd fetch Logic here')
    }

    const allSums = assets.filter(Boolean).reduce((acc, curr) => {
      const { value = 0, asset = { priceUSD: 0 } } = curr || {}
      if (!value || !asset || !asset.priceUSD || !asset.priceBTC) {
        return null
      }
      const price = asset.priceBTC

      return acc + value * Number(price)
    }, 0)

    const rawData = assets.map((data) => ({
      coin: data.asset.symbol,
      percentage: data.asset.priceBTC * data.value * 100 / allSums,
    }))

    this.props.updateData(this.sumSameCoins(rawData))
  }

  addRow = (name: string, value: number) => {
    if (name) {
      this.props.updateData(
        this.sumSameCoins([
          ...this.props.data,
          { coin: name, percentage: value },
        ])
      )
    }
  }

  onBtnClick = (index: number) => {
    this.optimizePortfolio()
    this.setState({ activeButton: index })
  }

  getPercentages = (percentage: number) => {
    // sorry for not optimized code
    const percetageArray = []

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

    return percetageArray
  }

  deleteRow = (i: number) => {
    this.setState({
      optimizedData: this.state.optimizedData.filter(
        (el) => el.coin !== this.props.data[i].coin
      ),
    })

    return this.props.updateData(
      [...this.props.data].filter((el, index) => i !== index)
    )
  }

  render() {
    const { children, data, risk } = this.props
    const {
      percentages,
      expectedReturn,
      optimizedData,
      activeButton,
    } = this.state

    const barChartData = { data, optimizedData }
    const efficientFrontierData = {
      percentages,
      // if there is no riskData from server so push some random data
      // demoPurpose
      risk: risk
        ? risk
        : [
            (Math.random() * 100).toFixed(2),
            (Math.random() * 100).toFixed(2),
            (Math.random() * 100).toFixed(2),
            (Math.random() * 100).toFixed(2),
            (Math.random() * 100).toFixed(2),
          ],
      activeButton,
    }

    return (
      <PTWrapper>
        <Content>
          {children}
          <UpperArea>
            <InputContainer>
              <Button onClick={this.importPortfolio}>Import Portfolio</Button>
              <Input
                placeholder="Expected return in %"
                value={expectedReturn || ''}
                onChange={this.handleChange}
              />
              <Button
                disabled={expectedReturn === '' || data.length < 1}
                onClick={this.optimizePortfolio}
              >
                Optimize Portfolio
              </Button>
            </InputContainer>

            <Table
              onPlusClick={this.addRow}
              data={data}
              withInput
              onClickDeleteIcon={this.deleteRow}
            />
          </UpperArea>

          <MainArea>
            <MainAreaUpperPart>
              <BtnsContainer show={optimizedData.length >= 1}>
                {percentages.map((percentage, i) => (
                  <Btn
                    onClick={() => {
                      this.onBtnClick(i)
                    }}
                    style={
                      i === activeButton
                        ? { backgroundColor: '#4ed8da', color: '#4c5055' }
                        : {}
                    }
                    key={percentage}
                  >
                    {`${percentage}%`}
                  </Btn>
                ))}
              </BtnsContainer>

              <Table data={optimizedData} withInput={false} />
            </MainAreaUpperPart>
            <ChartsContainer>
              <Chart>
                <BarChart data={barChartData} />
              </Chart>
              <Chart>
                <EfficientFrontier data={efficientFrontierData} />
              </Chart>
            </ChartsContainer>
          </MainArea>
        </Content>
      </PTWrapper>
    )
  }
}

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }
`
const Chart = styled.div`
  padding: 0.5rem;
  margin: 1rem;
  flex-basis: calc(50% - 2rem);
  flex-grow: 1;
  height: 300px;
  border-radius: 1rem;
  background: #393e44;
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
  background-color: #4c5055;
  margin-right: 16px;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
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
`

const InputContainer = styled.div`
  margin: auto 2rem auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Button = styled.div`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: ${(props: { disabled: boolean }) =>
    props.disabled ? 'not-allowed' : 'pointer'};
  text-transform: uppercase;
  margin-top: 10px;

  &:nth-child(1) {
    margin: 0;
  }
`

const Input = styled.input`
  box-sizing: border-box;
  background: transparent;
  border-top: none;
  border-left: none;
  border-bottom: 2px solid rgba(78, 216, 218, 0.3);
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);
  transition: all 0.25s ease-out;

  &:focus {
    border-bottom: 2px solid rgb(78, 216, 218);
  }
`
const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  data: store.portfolio.optimizationData,
})

const mapDispatchToProps = (dispatch: any) => ({
  updateData: (data: any) => dispatch(actions.updateDataForOptimization(data)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  Optimization
)

export default compose()(storeComponent)
