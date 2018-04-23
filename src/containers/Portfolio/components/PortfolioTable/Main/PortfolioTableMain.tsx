import * as React from 'react'
import styled from 'styled-components'
import { RowT } from '../types'

interface Props {
  tableData: RowT[] | null
  selectedBalances: number[] | null
  onSelectBalance: Function
  isUSDCurrently: boolean
}

export default class PortfolioTableMain extends React.Component<Props> {
  renderCheckbox = (index: number) => {
    const { selectedBalances } = this.props
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(index) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={index} checked={isSelected} />
        <Label htmlFor={index} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  addZerosToEnd = (num: string): string => {
    const reg = /(?=\.[0-9]+)\.[0-9]+/g
    const diff = this.props.isUSDCurrently ? 3 : 9

    if (reg.test(num)) {
      const [str] = num.match(reg) || ['']
      let tmp = str
      const len = str.length
      for (let i = 0; i < diff - len; i++) {
        tmp += 0
      }
      const [head] = num.match(/[0-9]+\./g) || ['']
      let woPoint = head.slice(0, -1)
      const result = (woPoint += tmp)
      return result || ''
    }
    return num
  }

  roundUSDOff = (num: number): string => {
    const reg = this.props.isUSDCurrently
      ? /[0-9]+(?=\.[0-9]+)\.[0-9]{2}/g
      : /[0-9]+(?=\.[0-9]+)\.[0-9]{8}/g
    if (String(num).match(reg)) {
      const [price] = String(num).match(reg)
      return price
    } else if (num > 0) {
      return this.addZerosToEnd(String(num))
    } else {
      return '0'
    }
  }

  render() {
    const { tableData, selectedBalances, isUSDCurrently } = this.props
    if (!tableData) return null

    return (
      <PTBody
        style={
          selectedBalances && selectedBalances.length > 0
            ? { borderBottom: '1px solid #fff' }
            : {}
        }
      >
        {tableData.map((row, index) => {
          const {
            currency,
            symbol,
            percentage,
            price,
            quantity,
            currentPrice,
            daily,
            dailyPerc,
            realizedPL,
            realizedPLPerc,
            unrealizedPL,
            unrealizedPLPerc,
          } = row

          const isSelected =
            (selectedBalances && selectedBalances.indexOf(index) >= 0) || false

          const mainSymbol = isUSDCurrently ? (
            <Icon className="fa fa-usd" key={`${index}usd`} />
          ) : (
            <Icon className="fa fa-btc" key={`${index}btc`} />
          )

          const cols = [
            currency,
            symbol,
            `${percentage} %`,
            [mainSymbol, `${this.roundUSDOff(price)}`],
            quantity,
            [mainSymbol, `${this.roundUSDOff(currentPrice)}`],
            //            daily,
            //            `${dailyPerc} %`,
            realizedPL,
            //            `${realizedPLPerc} %`,
            unrealizedPL,
            //            `${unrealizedPLPerc} %`,
          ]

          return (
            <PTR
              key={`${currency}${symbol}${quantity}${index}`}
              isSelected={isSelected}
              onClick={() => this.props.onSelectBalance(index)}
            >
              <PTD
                key={`${index}smt`}
                isSelected={isSelected}
                style={{ textAlign: 'right' }}
              >
                {this.renderCheckbox(index)}
              </PTD>
              {cols.map((col, idx) => {
                return (
                  <PTD
                    key={`${currency}${symbol}${quantity}${col}${idx}`}
                    isSelected={isSelected}
                  >
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
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) => {
    return props.isSelected ? '#4ed8da' : '#fff'}};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;
`

// #3a4e4e;

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
  props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
  & ${PTD}:nth-child(n+ 3) {
    text-align: right;
  }
  & ${PTD}:nth-child(8) {
    color: #50ff50;
  }
  & ${PTD}:nth-child(9) {
    color: #f73f3f;
  }
  & ${PTD}:nth-of-type(10) {
    color: #ff687a;
  }

  & ${PTD}:nth-of-type(11) {
    color: #ff687a;
  }

  & ${PTD}:nth-of-type(12) {
    color: #65c000;
  }

  & ${PTD}:nth-of-type(13) {
    color: #65c000;
  }
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
    background-size: 12px;
  }
`

const Icon = styled.i`
  padding-right: 5px;
`
