import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import { Args } from '@containers/Portfolio/components/PortfolioTable/types'
import sortIcon from '../../../../../icons/arrow.svg'
import { IState, IProps } from './PortfolioTableHead.types'

const usdHeadings: { name: string; value: Args }[] = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'percentage' },
  { name: 'Price per coin', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'Current USD', value: 'currentPrice' },
  //  { name: '24hr chg USD', value: 'daily' },
  //  { name: '24hr chg USD %', value: 'dailyPerc' },
  { name: 'Realized P&L', value: 'realizedPL' },
  //  { name: 'Realized P&L %', value: 'realizedPLPerc' },
  { name: 'Unrealized P&L', value: 'unrealizedPL' },
  //  { name: 'Unrealized P&L %', value: 'unrealizedPLPerc' },
  { name: 'Total P&L', value: 'total' },
]

const btcHeadings: { name: string; value: Args }[] = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'percentage' },
  { name: 'Price per coin', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'Current BTC', value: 'currentPrice' },
  //  { name: '24hr chg BTC', value: 'daily' },
  //  { name: '24hr chg BTC %', value: 'dailyPerc' },
  { name: 'Realized P&L', value: 'realizedPL' },
  //  { name: 'Realized P&L %', value: 'realizedPLPerc' },
  { name: 'Unrealized P&L', value: 'unrealizedPL' },
  //  { name: 'Unrealized P&L %', value: 'unrealizedPLPerc' },
  { name: 'Total P&L', value: 'total' },
]

export default class PortfolioTableHead extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    tableHeadings: usdHeadings,
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (!nextProps.isUSDCurrently) {
      this.setState({ tableHeadings: btcHeadings })
    } else if (nextProps.isUSDCurrently) {
      this.setState({ tableHeadings: usdHeadings })
    }
  }

  render() {
    const { tableHeadings } = this.state
    const { isSelectAll, onSelectAll, onSortTable, currentSort } = this.props

    return (
      <PTHead>
        <PTR>
          <PTH key="selectAll" style={{ textAlign: 'left' }}>
            <Checkbox
              type="checkbox"
              id="selectAll"
              checked={isSelectAll}
              onChange={onSelectAll}
            />
            <Label htmlFor="selectAll">
              <Span />
            </Label>
          </PTH>
          {tableHeadings.map((heading) => {
            const isSorted = currentSort && currentSort.key === heading.value

            return (
              <PTH
                key={heading.name}
                onClick={() => onSortTable(heading.value)}
                style={{ paddingRight: isSorted ? 0 : '16px' }}
              >
                {heading.name}

                {isSorted && (
                  <SvgIcon
                    src={sortIcon}
                    width={12}
                    height={12}
                    style={{
                      verticalAlign: 'middle',
                      marginLeft: '4px',
                      transform:
                        currentSort && currentSort.arg === 'ASC'
                          ? 'rotate(180deg)'
                          : null,
                    }}
                  />
                )}
              </PTH>
            )
          })}
        </PTR>
      </PTHead>
    )
  }
}

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

const PTH = styled.th`
  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  padding: 10px;
  font-weight: 500;
  text-align: right;
  
  &:not(:nth-child(1)):not(:nth-child(3)):not(:nth-child(9)) {
    min-width: 100px;
  }
  &:nth-child(2) {
    text-align: left;
  }
  &:nth-child(3) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(9) {
    min-width: 110px;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead`
  display: table;
  width: 100%;
  position: sticky;
  top: -5px;  /* trigger sticky when reaches coordonates */

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`
