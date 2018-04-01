import * as React from 'react'
import styled from 'styled-components'

const headings: Array<{ name: string; value: Args }> = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: '% of Portfolio', value: 'percentage' },
  { name: 'Price per coin', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'Current USD', value: 'priceUSD' },
  { name: 'Current BTC', value: 'priceBTC' },
  { name: '24hr change USD', value: 'usdDaily' },
  { name: '24hr change BTC', value: 'btcDaily' },
  { name: 'USD P&L', value: 'usdpl' },
  { name: 'BTC P&L', value: 'btcpl' },
]

interface Props {
  isSelectAll: boolean
  onSelectAll: Function
  onSortTable: Function
}

export default class PortfolioTableHead extends React.Component<Props> {
  render() {
    const { isSelectAll, onSelectAll, onSortTable } = this.props

    return (
      <PTHead>
        <PTR>
          <PTH key="selectAll" style={{ textAlign: 'left' }}>
            <Checkbox
              type="checkbox"
              id="selectAll"
              checked={isSelectAll}
              onChange={() => onSelectAll}
            />
            <Label htmlFor="selectAll">
              <Span />
            </Label>
          </PTH>
          {headings.map((heading) => {
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

const PTH = styled.th`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #fff;
  padding: 20px;
  font-weight: 500;

  position: relative;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead``
