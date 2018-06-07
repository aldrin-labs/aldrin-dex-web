import React, { Component } from 'react'
import styled from 'styled-components'
import DeleteIcon from 'react-icons/lib/md/delete-forever'
import AddIcon from 'react-icons/lib/md/add'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { MOCK_DATA } from '../dataMock'
import BarChart from './BarChart'
import { calcPercentage } from '../../../../../utils/PortfolioTableUtils'
import * as actions from '../../../actions'

class Table extends Component<{}> {
  state = {
    name: '',
    value: null,
  }

  formatString = (str: string) => str.toUpperCase().replace(/\s+/g, '')

  handleChangeName = (event) => {
    if (event.target.value.length < 10) {
      this.setState({
        name: this.formatString(event.target.value),
      })
    }
  }
  handleChangeValue = (event) => {
    this.setState({
      value: this.formatString(event.target.value),
    })
  }

  render() {
    const { withInput, data, onClickDeleteIcon, onPlusClick } = this.props
    if (withInput) {
      return (
        <StyledTable>
          <Head>
            <HeadItem>Coin</HeadItem>
            <HeadItem>Portfolio%</HeadItem>
          </Head>
          <Body>
            <Col>{data.map((item, i) => <Item key={i}>{item.coin}</Item>)}</Col>

            <Col>
              {data.map((item, i) => (
                <Item key={i}>
                  {`${item.percentage}%`}{' '}
                  <StyledDeleteIcon
                    onClick={() => {
                      onClickDeleteIcon(i)
                    }}
                  />
                </Item>
              ))}
            </Col>
          </Body>
          <TableInput>
            <Item>
              <Input
                type="text"
                value={this.state.name || ''}
                onChange={this.handleChangeName}
              />
            </Item>
            <Item
              style={{
                background: 'rgb(45, 49, 54)',
                // because of nth-child(even)
              }}
            >
              <Input
                type="number"
                value={this.state.value || ''}
                onChange={this.handleChangeValue}
              />
              <AddStyled
                show={!!this.state.name}
                onClick={() => {
                  onPlusClick(this.state.name, this.state.value)
                  this.setState({ name: '' })
                  this.setState({ value: '' })
                }}
              />
            </Item>
          </TableInput>
        </StyledTable>
      )
    } else {
      return (
        <SyledTableWithoutInput>
          <Head>
            <HeadItem>Coin</HeadItem>
            <HeadItem>Portfolio%</HeadItem>
          </Head>
          <Body>
            <Col>{data.map((item, i) => <Item key={i}>{item.coin}</Item>)}</Col>

            <Col>
              {data.map((item, i) => (
                <Item key={i}>{`${item.percentage}%`}</Item>
              ))}
            </Col>
          </Body>
        </SyledTableWithoutInput>
      )
    }
  }
}

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
      expectedReturn: event.target.value.replace(/-|\+/g, ''),
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
    // i dunno what happens on backend so...
    let assets
    if (this.props.isShownMocks) {
      assets = MOCK_DATA
    } else {
      assets = this.props.data
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
    const { children, data } = this.props
    const {
      percentages,
      expectedReturn,
      optimizedData,
      activeButton,
    } = this.state

    const barChartData = { data, optimizedData }

    return (
      <PTWrapper>
        <Content>
          {children}
          <UpperArea>
            <InputContainer>
              <Button onClick={this.importPortfolio}>Import Portfolio</Button>
              <Input
                type="number"
                placeholder="Expected return"
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
              <Chart>Chart</Chart>
            </ChartsContainer>
          </MainArea>
        </Content>
      </PTWrapper>
    )
  }
}

const AddStyled = styled(AddIcon)`
  position: relative;
  font-size: 2rem;
  cursor: pointer;
  top: ${(props: { show: boolean }) => (props.show ? '0px' : '100px')};
  opacity: ${(props: { show: boolean }) => (props.show ? '1' : '0')};
  transition: all 0.4s linear;

  @-moz-document url-prefix() {
    min-width: 32px;
    min-height: 32px;
  }
`

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

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 192px;
  margin: 0.5rem;
  border-bottom: 1px solid white;
`

const Item = styled.div`
  position: relative;
  color: white;
  justify-content: center;
  padding: 0.5rem;
  font-family: Roboto;
  font-size: 0.8rem;
  font-weight: normal;
  text-align: center;
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  flex-basis: 0;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0px;
  white-space: nowrap;

  &:nth-child(even) {
    background: #393e44;
  }
`

const HeadItem = Item.extend`
  font-weight: 500;

  &:nth-child(even) {
    background: rgb(45, 49, 54);
  }
`
const StyledDeleteIcon = styled(DeleteIcon)`
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0.5rem;
  font-size: 1rem;
  transition: opacity 0.3s ease-in;

  ${Item}:hover & {
    opacity: 1;
  }
`

const TableInput = styled.div`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 192px;
`

const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background: rgb(45, 49, 54);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  transition: all 0.3s linear;
`

const SyledTableWithoutInput = StyledTable.extend`
  width: 212px;
  min-height: 10rem;
`

const Col = styled.div`
  flex: 1;
  flex-direction: column;
`

const Body = styled.div`
  width: 100%;
  border-radius: 2px;
  display: flex;
  font-size: 0.8rem;
  margin: 0.5rem;
  line-height: 1.5;
  max-width: 200px;
  max-height: 200px;
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
