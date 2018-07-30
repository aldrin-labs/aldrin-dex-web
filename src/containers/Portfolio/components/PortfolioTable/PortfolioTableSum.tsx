import * as React from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import selectedIcon from '../../../../icons/selected.svg'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/PortfolioTableSum.types'

export default class PortfolioTableSum extends React.Component<IProps> {
  onFloorN = (x: string | number, n: number) => {
    if (typeof x === 'string') {
      return x
    }
    let mult = Math.pow(10, n)
    let multAfterCalculation = Math.floor(x * mult) / mult

    const reg = this.props.isUSDCurrently
      ? /-?[0-9]+(?=\.[0-9]+)\.[0-9]{2}/g
      : /-?[0-9]+(?=\.[0-9]+)\.[0-9]{8}/g

    if (multAfterCalculation.toString().match(reg)) {
      const sum = multAfterCalculation.toString().match(reg)
      if (!sum) {
        return null
      }

      return sum[0]
    } else if (multAfterCalculation) {
      return multAfterCalculation
    } else {
      return '0'
    }
  }

  render() {
    const { selectedSum, industry } = this.props

    return (
      <PTBody style={{ borderBottom: 'none' }}>
        <PTR>
          {selectedSum && (
            <PTD style={{ textAlign: 'left' }}>
              <SvgIcon src={selectedIcon} width={18} height={18} />
            </PTD>
          )}
          {Object.keys(selectedSum).map((key) => {
            let res = selectedSum[key]
            if (Array.isArray(res)) {
              const [icon, currency] = res

              return (
                <PTD key={key}>
                  {icon}
                  {this.onFloorN(currency, 3)}
                </PTD>
              )
            }
            if (!Number.isNaN(selectedSum[key])) {
              res = this.onFloorN(
                selectedSum[key],
                this.props.isUSDCurrently ? 2 : 8
              )
            }

            return (
              <PTD key={key} industry={industry}>
                {res || ''}
              </PTD>
            )
          })}
        </PTR>
      </PTBody>
    )
  }
}
const PTDIndustry = css`
  padding: 10px 0 10px 10px;
  min-width: 100px;

  &:nth-child(1) {
    min-width: 30px;
    padding: 1.75px 10px;
  }
  
  &:nth-child(2) {
    min-width: 90px;
  }

  &:nth-child(3) {
    min-width: 60px;
  }
  &:nth-child(n + 4) {
    text-align: right;
  }

  &:nth-child(4) {
    min-width: 200px;
  }

  &:nth-child(n + 6) {
    min-width: 150px;
  }
  
  &:nth-child(7) {
    min-width: 160px;
    padding-right: 16px;
  }
`

const PTDOther = css`
  min-width: 100px;
  //font-size: 13px;
  font-size: 12px;
  padding: 10px 0 10px 10px;


  &:nth-child(1) {
    padding: 10px;
    min-width: 30px;
  }
  
  &:nth-child(2) {
    text-align: left;
    min-width: 80px;
  }
  
  &:nth-child(3) {
    text-align: left;
    min-width: 50px;
  }
  
  &:nth-child(4) {
    min-width: 85px;
  }
  
  &:nth-child(5) {
    //min-width: 110px;
  }
  
  &:nth-child(7) {
    min-width: 93px;
  }
  
  &:nth-child(9) {
    min-width: 95px;
  }
  
  &:nth-child(10) {
    min-width: 95px;
    padding-right: 10px;
  }
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 10px 16px 10px 10px;
  text-align: left;

  position: sticky;
  bottom: 0;
  overflow: hidden;
  background-color: #393e44;

  ${(props: { industry?: boolean }) =>
    props.industry ? PTDIndustry : PTDOther};
`

const PTBody = styled.tbody`
  border-bottom: none;
  display: table;
  position: sticky;
  z-index: 1;
  bottom: -2px;
  width: 100%;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  & ${PTD}:nth-child(n + 4) {
    text-align: right;
  }
`
