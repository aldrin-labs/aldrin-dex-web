import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import { Args } from '@containers/Portfolio/components/PortfolioTable/types'
import sortIcon from '../../../../../icons/arrow.svg'
import {
  IState,
  IProps,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableHead.types'
import { Checkbox, Label, Span } from '@styles/cssUtils'


const usdHeadings: { name: string; value: Args }[] = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'percentage' },
  { name: 'Price', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'USD', value: 'currentPrice' },
  //  { name: '24hr chg USD', value: 'daily' },
  //  { name: '24hr chg USD %', value: 'dailyPerc' },
  { name: 'Realized', value: 'realizedPL', additionName: 'P&L' },
  //  { name: 'Realized P&L %', value: 'realizedPLPerc' },
  { name: 'Unrealized', value: 'unrealizedPL', additionName: 'P&L' },
  //  { name: 'Unrealized P&L %', value: 'unrealizedPLPerc' },
  { name: 'Total', value: 'totalPL', additionName: 'P&L' },
]

const btcHeadings: { name: string; value: Args }[] = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'percentage' },
  { name: 'Price', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'BTC', value: 'currentPrice' },
  //  { name: '24hr chg BTC', value: 'daily' },
  //  { name: '24hr chg BTC %', value: 'dailyPerc' },
  { name: 'Realized', value: 'realizedPL', additionName: 'P&L' },
  //  { name: 'Realized P&L %', value: 'realizedPLPerc' },
  { name: 'Unrealized', value: 'unrealizedPL', additionName: 'P&L' },
  //  { name: 'Unrealized P&L %', value: 'unrealizedPLPerc' },
  { name: 'Total', value: 'totalPL', additionName: 'P&L' },
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
    const {
      isSelectAll,
      onSelectAll,
      onSortTable,
      currentSort,
      theme: { palette },
    } = this.props

    const textColor: string = palette.getContrastText(palette.background.default) 

    return (
      <PTHead>
        <PTR background={palette.background.paper}>
          <PTH
            textColor={textColor}
            key="selectAll"
            style={{ textAlign: 'left' }}
          >
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
          {tableHeadings.map((heading, index) => {
            const isSorted = currentSort && currentSort.key === heading.value

            return (
              <PTH
                textColor={textColor}
                key={heading.name}
                onClick={() => onSortTable(heading.value)}
                // style={{ paddingRight: isSorted ? 0 : '16px' }}
              >
                {/*{index === 6 && heading.name + 100}*/}
                {[6, 7, 8].includes(index) ? (
                  <>
                    {heading.name} <br /> {heading.additionName}
                  </>
                ) : (
                  heading.name
                )}

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

const PTH = styled.th`
  font-family: Roboto, sans-serif;
  font-size: 12px;

  line-height: 24px;
  color: ${(props: { textColor: string }) => props.textColor};
  padding: 10px;
  padding-right: 0;
  font-weight: 500;
  text-align: right;
  min-width: 100px;
  user-select: none;

  &:nth-child(1) {
    min-width: 30px;
    padding-right: 10px;
  }

  &:nth-child(2) {
    min-width: 80px;
    text-align: left;
  }
  &:nth-child(3) {
    min-width: 50px;
    text-align: left;
  }
  &:nth-child(4) {
    min-width: 85px;
  }

  &:nth-child(6) {
    min-width: 90px;
  }

  &:nth-child(7) {
    min-width: 93px;
  }

  &:nth-child(9) {
    min-width: 95px;
  }

  &:nth-child(10) {
    min-width: 101px;
    padding-right: 10px;
  }

  &:nth-child(n + 8) {
    padding-bottom: 0;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: {
    background: string
    selectedBackground: string
  }) => props.background};
`

const PTHead = styled.thead`
  display: table;
  width: 100%;
  position: sticky;
  top: 0; /* trigger sticky when reaches coordonates */

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`
