import * as React from 'react'
import styled from 'styled-components'
import PortfolioTableSum from './PortfolioTableSum'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Industry', value: 'industry' },
  { name: 'Current', value: 'price' },
  { name: 'Portfolio performance', value: 'portfolioPerf' },
  { name: 'Industry performance', value: 'industryPerf' },
]

const tableData = [
  {
    currency: 'Bitrex',
    symbol: 'ETH',
    industry: 'Smart contracts',
    price: 15000,
    portfolioPerf: 50,
    industryPerf: 500,
  },
  {
    currency: 'Poloniex',
    symbol: 'LTC',
    industry: 'Payment',
    price: 10000,
    portfolioPerf: 70,
    industryPerf: -20,
  },
  {
    currency: 'Bitrex',
    symbol: 'XRP',
    industry: 'Payment',
    price: 5000,
    portfolioPerf: 50,
    industryPerf: -20,
  },
  {
    currency: 'GDAX',
    symbol: 'ETH',
    industry: 'Smart contracts',
    price: 15000,
    portfolioPerf: 25,
    industryPerf: 500,
  },
  {
    currency: 'Bitrex',
    symbol: 'Zcash',
    industry: 'Privacy coin',
    price: 5000,
    portfolioPerf: 10,
    industryPerf: 500,
  },
]

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  industry: '',
  price: '',
  portfolioPerf: '',
  industryPerf: '',
}

interface Props {}

interface State {
  selectedRows: number[] | null
}

export default class PortfolioTableIndustries extends React.Component<
  Props,
  State
> {
  state: State = { selectedRows: null, selectedSum: defaultSelectedSum }

  renderCheckbox = (idx: number) => {
    const { selectedRows } = this.state
    const isSelected = (selectedRows && selectedRows.indexOf(idx) >= 0) || false

    return (
      <PTable>
        <Checkbox
          type="checkbox"
          id={idx}
          defaultChecked={false}
          checked={isSelected}
        />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </PTable>
    )
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

  onValidateSum = (reducedSum: Object) => {
    const { selectedRows } = this.state
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
    const { selectedRows, selectedSum } = this.state
    const isSelectAll =
      (selectedRows && tableData.length === selectedRows.length) || false

    return (
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
              return <PTH key={heading.name}>{heading.name}</PTH>
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

            const isSelected =
              (selectedRows && selectedRows.indexOf(idx) >= 0) || false

            const cols = [
              currency,
              symbol,
              industry,
              `${price} $`,
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
                  if (col.match(/%/g)) {
                    const color =
                      Number(col.replace(/%/g, '')) >= 0 ? '#65c000' : '#ff687a'

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
        <PortfolioTableSum selectedSum={selectedSum} />
      </PTable>
    )
  }
}

const PTable = styled.table`
  border-collapse: collapse;
  width: 60%;
`

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
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
  font-weight: 500;
  text-align: left;

  position: relative;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead``
