import * as React from 'react'
import styled from 'styled-components'
import { roundUSDOff } from '../../../../../utils/PortfolioTableUtils'
import { IProps } from './PortfolioTableMain.types'
import { IRowT } from '../types'

export default class PortfolioTableMain extends React.Component<IProps> {
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

  render() {
    const { tableData, selectedBalances, isUSDCurrently } = this.props
    if (!tableData) {
      return null
    }
    return (
      <PTBody
        style={
          selectedBalances && selectedBalances.length > 0
            ? { borderBottom: '1px solid #fff' }
            : {}
        }
      >
        {tableData.map((row: IRowT, index: number) => {
          const {
            currency,
            symbol,
            percentage,
            price,
            quantity,
            currentPrice,
            // daily,
            // dailyPerc,
            realizedPL,
            // realizedPLPerc,
            unrealizedPL,
            // unrealizedPLPerc,
            totalPL,
          } = row

          const isSelected =
            (selectedBalances && selectedBalances.indexOf(index) >= 0)

          const isBase =
              (isUSDCurrently && (symbol === 'USDT' || symbol === 'USD')) || (!isUSDCurrently && symbol === 'BTC')


          const mainSymbol = isUSDCurrently ? (
            <Icon className="fa fa-usd" key={`${index}usd`} />
          ) : (
            <Icon className="fa fa-btc" key={`${index}btc`} />
          )

          const cols = [
            currency,
            symbol,
            `${percentage} %`,
            [mainSymbol, `${roundUSDOff(price, isUSDCurrently)}`],
            quantity,
            [mainSymbol, `${roundUSDOff(currentPrice, isUSDCurrently)}`],
            //            daily,
            //            `${dailyPerc} %`,
            [mainSymbol, `${roundUSDOff(realizedPL, isUSDCurrently)}`],
            // realizedPL,
            //            `${realizedPLPerc} %`,
            // unrealizedPL,
            [mainSymbol, `${roundUSDOff(unrealizedPL, isUSDCurrently)}`],
            [mainSymbol, `${roundUSDOff(totalPL, isUSDCurrently)}`],
            //            `${unrealizedPLPerc} %`,
          ]

          return (
            <PTR
              key={`${currency}${symbol}${quantity}${index}`}
              isSelected={isSelected}
              isBase={isBase}
              onClick={() => this.props.onSelectBalance(index)}
            >
              <PTD key={`${index}smt`} isSelected={isSelected}>
                {this.renderCheckbox(index)}
              </PTD>
              {cols.map((col, idx) => {
                let colorized = null
                if (Array.isArray(col) && idx >= 6) {
                  if (isBase) {
                    col = "-"
                  } else {
                    const [icon, str] = col
                    colorized = str
                  }
                }
                return (
                  <PTD
                    key={`${currency}${symbol}${quantity}${col}${idx}`}
                    isSelected={isSelected}
                    isBase={isBase}
                    colorized={colorized}
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
  display: table;
  width: 100%;
`

const PTD = styled.td`
  color: ${(props: {
    isSelected?: boolean
    colorized: string | JSX.Element | null
  }) => {
    if (props.colorized) {
      const num = Number(props.colorized)
      if (num > 0) {
        return '#4caf50'
      } else if (num < 0) {
        return '#f44336'
      }
    }

    return props.isSelected ? '#4ed8da' : '#fff'
  }};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;

  &:nth-child(1) {
    text-align: center;
    padding: 1.75px 10px;
  }
  &:not(:nth-child(1)):not(:nth-child(3)):not(:nth-child(9)) {
    min-width: 100px;
  }
  &:nth-child(3) {
    min-width: 70px;
  }
  &:nth-child(9) {
    min-width: 110px;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean, isBase?: boolean  }) =>
    props.isBase ? '#00ff0028' : props.isSelected ? '#2d3136' : '#393e44'};

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean, isBase?: boolean }) =>
    props.isBase ? '#00ff0028' : props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
  & ${PTD}:nth-child(n + 4) {
    text-align: right;
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
