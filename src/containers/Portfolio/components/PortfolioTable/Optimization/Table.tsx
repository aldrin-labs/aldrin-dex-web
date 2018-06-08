import React, { Component } from 'react'
import styled from 'styled-components'
import DeleteIcon from 'react-icons/lib/md/delete-forever'
import AddIcon from 'react-icons/lib/md/add'
import { IProps, IState } from './tableTypes'

class Table extends Component<IProps, IState> {
  state = {
    name: '',
    value: null,
  }

  formatString = (str: string) => str.toUpperCase().replace(/\s+/g, '')

  handleChangeName = (event: any) => {
    if (event.target.value.length < 10) {
      this.setState({
        name: this.formatString(event.target.value),
      })
    }
  }
  handleChangeValue = (event: any) => {
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
        <StyledTableWithoutInput>
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
        </StyledTableWithoutInput>
      )
    }
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

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 192px;
  margin: 0.5rem;
  border-bottom: 1px solid white;
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

const StyledTableWithoutInput = StyledTable.extend`
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

export default Table
