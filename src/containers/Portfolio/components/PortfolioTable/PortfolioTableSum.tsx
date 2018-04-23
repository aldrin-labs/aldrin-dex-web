import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import selectedIcon from '../../../../icons/selected.svg'

interface Props {
  selectedSum: {
    [key: string]: string | number
  },
  isUSDCurrently: boolean
}

export default class PortfolioTableSum extends React.Component<Props> {
  onFloorN = (x: number, n: number) => {
    if (typeof x === 'string') return [x,x];

    const reg = this.props.isUSDCurrently
      ? /-?[0-9]+(?=\.[0-9]+)\.[0-9]{2}/g
      : /-?[0-9]+(?=\.[0-9]+)\.[0-9]{8}/g


    var mult = Math.pow(10, n);
    let multAfterCalculation = Math.floor(x * mult) / mult;

    let price;
    if (multAfterCalculation.toString().match(reg)) {
      price = multAfterCalculation.toString().match(reg);
      return [price[0],multAfterCalculation];
    }
    else if (multAfterCalculation) {
      return [multAfterCalculation,multAfterCalculation];
    }
    else {
      return ['0', multAfterCalculation];
    }

    // price = price.match(reg);
    console.log(typeof price[0]);

    console.log('this is price: ' + price[0]);
    console.log('this is mult: ' + multAfterCalculation);
    console.log('this is mult with toString: ' + multAfterCalculation.toString());



    // return Math.floor(x * mult) / mult
    // console.log(this.props.isUSDCurrently);
    // return
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
            // return <PTD key={key}>{res || ''}</PTD>
            return <PTD key={key}>{res[0] + '   ' + res[1] || ''}</PTD>
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
  font-size: 12px;
  line-height: 24px;
  padding: 10px 16px 10px 10px;
  text-align: left;

  position: sticky;
  bottom: 0;
  overflow: hidden;
  background-color: #393e44;
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
