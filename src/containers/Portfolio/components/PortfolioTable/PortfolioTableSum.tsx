import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import selectedIcon from '../../../../icons/selected.svg'

interface Props {
  selectedSum: Object
}

export default class PortfolioTableSum extends React.Component<Props> {
  onFloorN = (x: number, n: number) => {
    var mult = Math.pow(10, n)
    return Math.floor(x * mult) / mult
  }

  render() {
    const { selectedSum } = this.props

    return (
      <PTBody style={{ borderBottom: 'none' }}>
        <PTR>
          {selectedSum && (
            <PTD style={{ textAlign: 'right' }}>
              <SvgIcon src={selectedIcon} width={18} height={18} />
            </PTD>
          )}
          {Object.keys(selectedSum).map((key) => {
            let res = selectedSum[key]
            if (!Number.isNaN(selectedSum[key])) {
              res = this.onFloorN(selectedSum[key], 3)
            }
            console.log(res)
            return <PTD key={key}>{res || ''}</PTD>
          })}
        </PTR>
      </PTBody>
    )
  }
}

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  padding: 20px 10px;
  text-align: left;
`

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  & ${PTD}:nth-child(n+ 3) {
    text-align: right;
  }
`
