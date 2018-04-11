import * as React from 'react'
import styled from 'styled-components'
import sortIcon from '../../../../../icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import PortfolioTableSum from '../PortfolioTableSum'
import { tableData } from './mocks'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Industry', value: 'industry' },
  { name: 'Current', value: 'price' },
  { name: 'Portfolio performance', value: 'portfolioPerf' },
  { name: 'Industry performance', value: 'industryPerf' },
]

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  industry: '',
  price: 0,
  portfolioPerf: 0,
  industryPerf: 0,
}

interface Obj {
  currency: string
  symbol: string
  industry: string
  price: number
  portfolioPerf: number
  industryPerf: number
}

interface Props {
  isUSDCurrently: boolean
}

interface State {
  selectedSum: Obj | null
  selectedRows: number[] | null
  tableData: Obj[]
  currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
}

export default class PortfolioTableIndustries extends React.Component<
  Props,
  State
> {
  state: State = {
    tableData,
    currentSort: null,
    selectedRows: null,
    selectedSum: defaultSelectedSum,
  }

  onSortStrings = (a: string, b: string): number => {
    return a.localeCompare(b)
  }

  renderCheckbox = (idx: number) => {
    const { selectedRows } = this.state
    const isSelected = (selectedRows && selectedRows.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox
          type="checkbox"
          id={idx}
          defaultChecked={false}
          checked={isSelected}
        />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSortTable = (key: Args) => {
    const { tableData, currentSort } = this.state
    if (!tableData) return

    const stringKey =
      key === 'currency' || key === 'symbol' || key === 'industry'

    const newData = tableData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (stringKey) {
            return this.onSortStrings(b[key], a[key])
          }
          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (stringKey) {
            return this.onSortStrings(a[key], b[key])
          }
          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (stringKey) {
        return this.onSortStrings(a[key], b[key])
      }
      return a[key] - b[key]
    })

    this.setState({ tableData: newData })
  }

  onSelectBalance = (idx: number) => {
    const selectedRows =
      (this.state.selectedRows && this.state.selectedRows.slice()) || []

    const hasIndex = selectedRows.indexOf(idx)
    if (hasIndex >= 0) {
      selectedRows.splice(hasIndex, 1)
    } else {
      selectedRows.push(idx)
    }

    this.setState({ selectedRows }, () => this.calculateSum(selectedRows))
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { tableData } = this.state
    if (!selectedRows) {
      this.setState({ selectedSum: defaultSelectedSum })
      return
    }

    const sum = tableData.filter((td, idx) => selectedRows.indexOf(idx) >= 0)
    const reducedSum = sum.reduce(
      (acc, val) => {
        return {
          currency: val.currency,
          symbol: val.symbol,
          industry: val.industry,
          price: acc.price + val.price,
          portfolioPerf: acc.portfolioPerf + val.portfolioPerf,
          industryPerf: acc.industryPerf + val.industryPerf,
        }
      },
      {
        currency: '',
        symbol: '',
        industry: '',
        price: 0,
        portfolioPerf: 0,
        industryPerf: 0,
      }
    )
    const validateSum = this.onValidateSum(reducedSum)

    this.setState({ selectedSum: validateSum })
  }

  onValidateSum = (reducedSum: { [key: string]: string | number }) => {
    const { selectedRows, tableData } = this.state
    if (!selectedRows) return null

    if (selectedRows.length === tableData.length) {
      reducedSum.currency = 'All'
      reducedSum.symbol = '-'
    } else if (selectedRows.length > 1) {
      reducedSum.currency = 'Selected'
      reducedSum.symbol = '-'
    }

    reducedSum.industry = '-'

    return reducedSum
  }

  onSelectAll = () => {
    const { tableData } = this.state
    const rowQuantity = tableData.length
    let allRows
    const selectedRows =
      (this.state.selectedRows && this.state.selectedRows.slice()) || []
    if (selectedRows.length !== rowQuantity) {
      allRows = tableData.map((td, i) => i)
    } else {
      allRows = null
    }
    this.setState({ selectedRows: allRows })

    this.calculateSum(allRows)
  }

  render() {
    const { isUSDCurrently } = this.props
    const { selectedRows, selectedSum, tableData, currentSort } = this.state
    const isSelectAll =
      (selectedRows && tableData.length === selectedRows.length) || false

    return (
      <Wrapper>
        <PTable>
          <PTHead>
            <PTR>
              <PTH key="selectAll" style={{ textAlign: 'left' }}>
                <Checkbox
                  type="checkbox"
                  id="selectAll"
                  checked={isSelectAll}
                  onChange={this.onSelectAll}
                />
                <Label htmlFor="selectAll">
                  <Span />
                </Label>
              </PTH>
              {tableHeadings.map((heading) => {
                const isSorted =
                  currentSort && currentSort.key === heading.value

                return (
                  <PTH
                    key={heading.name}
                    onClick={() => this.onSortTable(heading.value)}
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

          <PTBody>
            {tableData.map((row, idx) => {
              const {
                currency,
                symbol,
                industry,
                price,
                portfolioPerf,
                industryPerf,
              } = row

              const mainSymbol = isUSDCurrently ? (
                <Icon className="fa fa-usd" key={`${idx}usd`} />
              ) : (
                <Icon className="fa fa-btc" key={`${idx}btc`} />
              )

              const isSelected =
                (selectedRows && selectedRows.indexOf(idx) >= 0) || false

              const cols = [
                currency,
                symbol,
                industry,
                [mainSymbol, `${price}`],
                `${portfolioPerf}%`,
                `${industryPerf}%`,
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
                    if (!Array.isArray(col) && col.match(/%/g)) {
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
          {selectedSum && <PortfolioTableSum selectedSum={selectedSum} />}
        </PTable>
      </Wrapper>
    )
  }
}

const Icon = styled.i`
  padding-right: 5px;
`

const Wrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  background-color: #393e44;

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

const PTable = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;
  text-align: right;
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
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  padding: 10px;
  font-weight: 500;
  text-align: center;

  position: sticky;
  top: 0;
  overflow: hidden;
  background-color: #393e44;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead``
