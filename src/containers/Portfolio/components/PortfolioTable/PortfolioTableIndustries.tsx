import * as React from 'react'
import styled from 'styled-components'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Industry', value: 'industry' },
  { name: 'Current', value: 'price' },
  { name: 'Portfolio performance', value: 'portfolioPerf' },
  { name: 'Industry performance', value: 'industryPerf' },
]

export default class PortfolioTableIndustries extends React.Component {
  render() {
    return (
      <PTHead>
        <PTR>
          <PTH key="selectAll" style={{ textAlign: 'left' }}>
            <Checkbox
              type="checkbox"
              id="selectAll"
              // checked={isSelectAll}
              // onChange={onSelectAll}
            />
            <Label htmlFor="selectAll">
              <Span />
            </Label>
          </PTH>
          {tableHeadings.map((heading) => {
            return (
              <PTH
                key={heading.name}
                // onClick={() => onSortTable(heading.value)}
              >
                {heading.name}
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
