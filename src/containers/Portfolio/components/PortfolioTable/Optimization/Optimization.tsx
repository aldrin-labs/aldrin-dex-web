import React, { Component } from 'react'
import styled from 'styled-components'
import FakeData from './mocks'

class Optimization extends Component<{}> {
  state = {
    activePercentageButton: 0,
  }

  render() {
    const { children } = this.props
    const percentages = [10, 15, 20, 25, 30]

    return (
      <PTWrapper>
        <Content>
          {children}
          <UpperArea>
            <InputContainer>
              <Button>Import Portfolio</Button>
              <Input type="number" placeholder="Expected return" />
              <Button>Optimize Portfolio</Button>
            </InputContainer>

            <Table>
              <Head>
                <HeadItem>Coin</HeadItem>
                <HeadItem>Portfolio%</HeadItem>
              </Head>
              <Body>
                <Col>
                  {FakeData.map((item, i) => <Item key={i}>{item.coin}</Item>)}
                </Col>

                <Col>
                  {FakeData.map((item, i) => (
                    <Item key={i}>{`${item.percentage}%`}</Item>
                  ))}
                </Col>
              </Body>
              <TableInput>
                <Item>
                  <Input type="text" />
                </Item>
                <Item
                  style={{
                    background: 'rgb(45, 49, 54)',
                    // because of nth-child(even)
                  }}
                >
                  <Input type="text" />
                </Item>
              </TableInput>
            </Table>
          </UpperArea>

          <MainArea>
            <BtnsContainer>
              {percentages.map((percentage, i) => (
                <ChartBtn
                  onClick={() => this.onPercentageButtonsClick(i)}
                  style={
                    i === this.state.activePercentageButton
                      ? { backgroundColor: '#4ed8da', color: '#4c5055' }
                      : {}
                  }
                  key={percentage}
                >
                  {`${percentage}%`}
                </ChartBtn>
              ))}
            </BtnsContainer>
            <Table>
              <Head>
                <HeadItem>Coin</HeadItem>
                <HeadItem>Portfolio%</HeadItem>
              </Head>
              <Body>
                <Col>
                  {FakeData.map((item, i) => <Item key={i}>{item.coin}</Item>)}
                </Col>

                <Col>
                  {FakeData.map((item, i) => (
                    <Item key={i}>{`${item.percentage}%`}</Item>
                  ))}
                </Col>
              </Body>
            </Table>
          </MainArea>
        </Content>
      </PTWrapper>
    )
  }
}

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 20px auto;
  max-height: 2rem;
`

const ChartBtn = styled.button`
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
  background: #292d31;
  height: 500px;
  width: 80%;
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

const TableInput = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 192px;
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background: rgb(45, 49, 54);
  box-shadow: 0 10px 30px 0 rgb(45, 49, 54);
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
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 10px;

  &:nth-child(1) {
    margin: 0;
  }
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: 2px solid rgb(78, 216, 218);
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);
`

export default Optimization
