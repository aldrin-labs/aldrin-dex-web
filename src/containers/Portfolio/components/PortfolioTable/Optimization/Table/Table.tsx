import React, { Component } from 'react'
import styled from 'styled-components'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import { Typography, Card, CardContent } from '@material-ui/core'

import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/Table/Table.types'
import { customAquaScrollBar } from '@styles/cssUtils'

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

  onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.props.onPlusClick &&
        this.props.onPlusClick(this.state.name, this.state.value)

      this.setState({ name: '', value: '' })
    }
  }

  render() {
    const {
      withInput,
      data,
      onClickDeleteIcon,
      onPlusClick,
      optimizedData,
      filterValueSmallerThenPercentage,
      theme: {palette}
    } = this.props
    const textColor: string= palette.getContrastText(palette.background.paper)

    if (withInput) {
      return (
        <StyledTable background={palette.background.paper}>
          <Head bottomCollor={textColor}>
            <HeadItem background={palette.background.paper}>
              <Typography variant="title" align="center">
                {' '}
                Coin
              </Typography>
            </HeadItem>
            <HeadItem background={palette.background.paper}>
              <Typography variant="title" align="center">
                Portfolio%
              </Typography>
            </HeadItem>
            <HeadItem background={palette.background.paper}>
              <Typography variant="title" align="center">
                Optimized%
              </Typography>
            </HeadItem>
          </Head>
          <Body>
            {data.length === 0 ? (
              <StyledCard>
                <CardContent>
                  <Typography
                    variant="display2"
                    align="center"
                    color="secondary"
                  >
                    No Coins.
                  </Typography>
                  <Typography variant="headline" align="center" color="primary">
                    Add something to optimize.
                  </Typography>
                </CardContent>
              </StyledCard>
            ) : null}

            <Col>
              {data
                .filter((d) => d.percentage > filterValueSmallerThenPercentage)
                .map((item, i) => (
                  <Item
                    background={palette.background.paper}
                    evenBackground={palette.action.hover} 
                    key={item.coin}
                  >
                    <Typography variant="body1" align="center">
                      {item.coin}
                    </Typography>
                  </Item>
                ))}
            </Col>

            <Col>
              {data
                .filter((d) => d.percentage > filterValueSmallerThenPercentage)
                .map((item, i) => (
                  <Item
                    background={palette.background.paper}
                    evenBackground={palette.action.hover} 
                    key={item.coin}
                  >
                    <Typography variant="body1" align="center">
                      {`${Number(item.percentage).toFixed(2)}%`}{' '}
                    </Typography>
                  </Item>
                ))}
            </Col>

            {/*  optimizedData */}
            {optimizedData.length >= 1 ? (
              //  &&
              // optimizedData.length === data.length
              <Col>
                {data
                  .filter(
                    (d) => d.percentage > filterValueSmallerThenPercentage
                  )
                  .map((item, i) => (
                    <Item
                      background={palette.background.paper}
                      evenBackground={palette.action.hover} 
                      key={item.coin}
                    >
                      <Typography variant="body1" align="center">
                        {optimizedData[i]
                          ? `${Number(optimizedData[i].percentage).toFixed(2)}%`
                          : '-'}{' '}
                      </Typography>

                      <StyledDeleteIcon
                        onClick={() => {
                          onClickDeleteIcon && onClickDeleteIcon(i)
                        }}
                      />
                    </Item>
                  ))}
              </Col>
            ) : (
              <Col>
                {data
                  .filter(
                    (d) => d.percentage > filterValueSmallerThenPercentage
                  )
                  .map((item, i) => (
                    <Item
                      background={palette.background.paper}
                      evenBackground={palette.action.hover} 
                      key={i}
                    >
                      <Typography variant="body1" align="center">
                        {'-'}{' '}
                      </Typography>
                      <StyledDeleteIcon
                        onClick={() => {
                          onClickDeleteIcon && onClickDeleteIcon(i)
                        }}
                      />{' '}
                    </Item>
                  ))}
              </Col>
            )}
          </Body>
          <TableInput>
            <Item background={palette.background.paper}>
              <Input
                placeholder="Coin"
                type="text"
                value={this.state.name || ''}
                onChange={this.handleChangeName}
                onKeyDown={this.onKeyDown}
              />
            </Item>
            <Item
              background={palette.background.paper}
            />
            <Item
              background={palette.background.paper}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                // because of nth-child(even)
              }}
            >
              <AddStyled
                show={true}
                onClick={() => {
                  onPlusClick && onPlusClick(this.state.name, this.state.value)
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
        <StyledTableWithoutInput background={palette.background.paper}>
          <Head>
            <HeadItem>Coin</HeadItem>
            <HeadItem>Portfolio%</HeadItem>
          </Head>
          <Body>
            <Col>
              {data.map((item, i) => (
                <Item key={i}>{item.coin}</Item>
              ))}
            </Col>

            <Col>
              {data.map((item, i) => (
                <Item key={i}>{`${Number(item.percentage).toFixed(2)}%`}</Item>
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

const StyledCard = styled(Card)`
  height: 190px;
  width: 100%;
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
  font-family: Roboto, sans-serif;
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
  width: calc(100% - 2px);
  position: relative;
  color: white;
  justify-content: center;
  padding: 0.5rem;
  font-family: Roboto, sans-serif;
  font-size: 1.2rem;
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
  background: ${(props: {background: string}) =>
      props.background
    };
  &:nth-child(even) {
    background: ${(props: {
      evenBackground: string,
      background:string
    }) =>
      props.evenBackground ? props.evenBackground : props.background};
    }
  }
`

const HeadItem = styled(Item)`
  top: -1px;
`

const Head = styled.div`
  display: flex;
  width: 95%;
  flex-direction: row;
  justify-content: center;
  max-width: 50rem;
  margin: 0.5rem;
  border-bottom: 1px solid ${(props: { color: string }) => props.color};
`

const TableInput = styled.div`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 95%;
`
const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background: ${(props: {background: string}) =>
      props.background
    };
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  transition: all 0.3s linear;
`

const StyledTableWithoutInput = styled(StyledTable)`
  width: 212px;
  min-height: 10rem;
`

const Col = styled.div`
  flex: 1;
  flex-direction: column;
`

const Body = styled.div`
  width: 98%;
  border-radius: 2px;
  display: flex;
  font-size: 0.8rem;
  margin: 0.5rem;
  line-height: 1.5;
  max-width: 50rem;
  max-height: 200px;
  overflow: auto;

  ${customAquaScrollBar};
`

const StyledDeleteIcon = styled(DeleteIcon)`
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0.5rem;
  font-size: 1.5rem;
  transition: opacity 0.3s ease-in;

  ${Body}:hover & {
    opacity: 1;
  }
`

export default Table
