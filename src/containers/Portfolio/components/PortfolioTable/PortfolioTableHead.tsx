import * as React from 'react'
import styled from 'styled-components'
import { Args } from '@containers/Portfolio/components/PortfolioTable/types'

const usdHeadings: Array<{ name: string; value: Args }> = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: '% of Portfolio', value: 'percentage' },
  { name: 'Price per coin', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'Current USD', value: 'currentPrice' },
  { name: '24hr chg USD', value: 'daily' },
  { name: '24hr chg USD %', value: 'dailyPerc' },
  { name: 'Realized P&L', value: 'realizedPL' },
  { name: 'Realized P&L %', value: 'realizedPLPerc' },
  { name: 'Unrealized P&L', value: 'unrealizedPL' },
  { name: 'Unrealized P&L %', value: 'unrealizedPLPerc' },
]

const btcHeadings: Array<{ name: string; value: Args }> = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: '% of Portfolio', value: 'percentage' },
  { name: 'Price per coin', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'Current BTC', value: 'currentPrice' },
  { name: '24hr chg BTC', value: 'daily' },
  { name: '24hr chg BTC %', value: 'dailyPerc' },
  { name: 'Realized P&L', value: 'realizedPL' },
  { name: 'Realized P&L %', value: 'realizedPLPerc' },
  { name: 'Unrealized P&L', value: 'unrealizedPL' },
  { name: 'Unrealized P&L %', value: 'unrealizedPLPerc' },
]

interface Props {
  isUSDCurrently: boolean
  isSelectAll: boolean
  onSelectAll: Function
  onSortTable: Function
}

export default class PortfolioTableHead extends React.Component<Props> {
  state = {
    tableHeadings: usdHeadings,
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.isUSDCurrently) {
      this.setState({ tableHeadings: btcHeadings })
    } else if (nextProps.isUSDCurrently) {
      this.setState({ tableHeadings: usdHeadings })
    }
  }

  render() {
    const { tableHeadings } = this.state
    const { isSelectAll, onSelectAll, onSortTable } = this.props

    return (
      <PTHead>
        <PTR>
          <PTH key="selectAll" style={{ textAlign: 'right' }}>
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
            // const isSorted =
            //   currentSort && currentSort.key === heading.value
            return (
              <PTH
                key={heading.name}
                onClick={() => onSortTable(heading.value)}
                // style={{ paddingRight: isSorted ? null : '20px' }}
              >
                {heading.name}
                {/*{isSorted && (
                  <SvgIcon
                    src={sortIcon}
                    style={{
                      verticalAlign: 'middle',
                      marginLeft: '4px',
                      transform:
                        currentSort && currentSort.arg === 'ASC'
                          ? 'rotate(180deg)'
                          : null,
                    }}
                  />
                )}*/}
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
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  padding: 20px 10px;
  font-weight: 500;
  text-align: left;

  position: relative;
  overflow: hidden;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead``
