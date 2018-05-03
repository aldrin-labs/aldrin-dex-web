import * as React from 'react'
import styled from 'styled-components'
import { IState, IProps } from './types'
import { tableData } from './mocks'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'Current', value: 'price' },
]

export default class PortfolioTableRebalance extends React.Component<
  IProps,
  IState
> {
  state: IState = { selectedBalances: null }

  renderCheckbox = (idx: number) => {
    const { selectedBalances } = this.state
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={idx} checked={isSelected} />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSelectBalance = (idx: number) => {
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []

    const hasIndex = selectedBalances.indexOf(idx)
    if (hasIndex >= 0) {
      selectedBalances.splice(hasIndex, 1)
    } else {
      selectedBalances.push(idx)
    }

    this.setState({ selectedBalances })
  }

  render() {
    const { selectedBalances } = this.state

    return (
      <div style={{ display: 'flex' }}>
        <Table>
          <PTHead>
            <PTR>
              <PTH key="selectAll" style={{ textAlign: 'left' }}>
                <Checkbox type="checkbox" id="selectAll" />
                <Label htmlFor="selectAll">
                  <Span />
                </Label>
              </PTH>
              {tableHeadings.map((heading) => {
                return <PTH key={heading.name}>{heading.name}</PTH>
              })}
            </PTR>
          </PTHead>

          <PTBody>
            {tableData.map((row, idx) => {
              const { currency, symbol, portfolioPerc, price } = row

              const isSelected =
                (selectedBalances && selectedBalances.indexOf(idx) >= 0) ||
                false

              const cols = [
                currency,
                symbol || '',
                portfolioPerc ? `${portfolioPerc}%` : '',
                `${price} $`,
              ]

              return (
                <PTR
                  key={`${currency}${symbol}`}
                  isSelected={isSelected}
                  onClick={() => this.onSelectBalance(idx)}
                >
                  <PTD key="smt" isSelected={isSelected}>
                    {this.renderCheckbox(idx)}
                  </PTD>
                  {cols.map((col, idx) => {
                    if (col.match(/%/g)) {
                      const color =
                        Number(col.replace(/%/g, '')) >= 0
                          ? '#65c000'
                          : '#ff687a'

                      return (
                        <PTD
                          key={`${col}${idx}`}
                          style={{ color }}
                          isSelected={isSelected}
                        >
                          {col}
                        </PTD>
                      )
                    }
                    return (
                      <PTD key={`${col}${idx}`} isSelected={isSelected}>
                        {col}
                      </PTD>
                    )
                  })}
                </PTR>
              )
            })}
          </PTBody>
        </Table>

        <Table>
          <PTHead>
            <PTR>
              {tableHeadings.map((heading) => {
                return <PTH key={heading.name}>{heading.name}</PTH>
              })}
            </PTR>
          </PTHead>

          <PTBody>
            {tableData.map((row, idx) => {
              const { currency, symbol, portfolioPerc, price } = row

              const cols = [
                currency,
                symbol || '',
                portfolioPerc ? `${portfolioPerc}%` : '',
                `${price} $`,
              ]

              return (
                <PTR key={`${currency}${symbol}`}>
                  {cols.map((col, idx) => {
                    if (col.match(/%/g)) {
                      const color =
                        Number(col.replace(/%/g, '')) >= 0
                          ? '#65c000'
                          : '#ff687a'

                      return (
                        <PTD key={`${col}${idx}`} style={{ color }}>
                          {col}
                        </PTD>
                      )
                    }
                    return <PTD key={`${col}${idx}`}>{col}</PTD>
                  })}
                </PTR>
              )
            })}
          </PTBody>
        </Table>
      </div>
    )
  }
}

const Table = styled.table`
  border-collapse: collapse;
`

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  padding: 20px 10px;
`

const Span = styled.span``

const Label = styled.label``

const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 18px;
    height: 18px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  & :checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

const PTH = styled.th`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  padding: 20px 10px;
  text-align: left;
  font-weight: 500;

  position: relative;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead``
