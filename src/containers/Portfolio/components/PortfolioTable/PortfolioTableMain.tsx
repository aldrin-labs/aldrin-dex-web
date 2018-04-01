import * as React from 'react'
import styled from 'styled-components'
import { RowT } from './types'

interface Props {
  tableData: RowT[] | null
  selectedBalances: string[] | null
  onSelectBalance: Function
}

export default class PortfolioTableMain extends React.Component<Props> {
  renderCheckbox = (rowSymbol: string) => {
    const { selectedBalances } = this.props
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(rowSymbol) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={rowSymbol} checked={isSelected} />
        <Label htmlFor={rowSymbol} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  roundUSDOff = (num: number): string => {
    const reg = /[0-9]+(?=\.[0-9]+)\.[0-9]{2}/g
    if (String(num).match(reg)) {
      const [price] = String(num).match(reg)
      return price
    } else if (num > 0) {
      return String(num)
    } else {
      return '0'
    }
  }

  render() {
    const { tableData, selectedBalances } = this.props
    if (!tableData) return null

    return (
      <PTBody>
        {tableData.map((row) => {
          const {
            currency,
            symbol,
            percentage,
            price,
            quantity,
            priceUSD,
            priceBTC,
            usdDaily,
            btcDaily,
            usdpl,
            btcpl,
          } = row

          const isSelected =
            (selectedBalances && selectedBalances.indexOf(symbol) >= 0) || false

          const cols = [
            currency,
            symbol,
            `${percentage}%`,
            `$${this.roundUSDOff(price)}`,
            quantity,
            `$${this.roundUSDOff(priceUSD)}`,
            priceBTC,
            usdDaily,
            btcDaily,
            usdpl,
            btcpl,
          ]

          return (
            <PTR
              key={symbol}
              isSelected={isSelected}
              onClick={() => this.props.onSelectBalance(symbol, row)}
            >
              <PTD key="smt" isSelected={isSelected}>
                {this.renderCheckbox(symbol)}
              </PTD>
              {cols.map((col, idx) => {
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
    )
  }
}

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  padding: 20px;
`
const Span = styled.span``

const Label = styled.label``

const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 22px;
    height: 22px;

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
