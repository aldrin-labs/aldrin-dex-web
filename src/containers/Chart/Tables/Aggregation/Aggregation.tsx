import React from 'react'
import { MdAddCircleOutline } from 'react-icons/lib/md'
import styled from 'styled-components'

import { Row, Table, Head, Cell, HeadCell } from '@components/Table/Table'

const Aggregation = (props) => {
  const { aggregation, onButtonClick } = props

  return (
    <AggregationWrapper>
      <AggHead background={'#292d31'}>
        <Row background={'#292d31'} isHead>
          <Cell color="#9ca2aa" width={'25%'} />
          <HeadCell
            style={{
              position: 'relative',
              left: '5%',
            }}
            color="#9ca2aa"
            width={'25%'}
          >
            Aggregation
          </HeadCell>
          <HeadCell
            style={{
              position: 'relative',
              left: '13%',
            }}
            color="#9ca2aa"
            width={'25%'}
          >
            {aggregation.toFixed(2)}
          </HeadCell>
          <HeadCell
            style={{
              zIndex: 1000,
            }}
            color="#9ca2aa"
            width={'25%'}
          >
            <Button>
              <MdAddCircleOutline
                onClick={onButtonClick}
                style={{
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              />
            </Button>
          </HeadCell>
        </Row>
      </AggHead>
    </AggregationWrapper>
  )
}

const AggHead = styled(Head)`
  height: 26px;

  @media (max-width: 1080px) {
    height: 40px;
  }
`

const Button = styled.button`
  position: relative;
  bottom: 1px;

  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  text-align: inherit;
  color: white;
  background: transparent;

  line-height: normal;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`

const AggregationWrapper = Table.extend`
  z-index: 100;
  bottom: 0;
  position: absolute;
  width: 100%;

  @media (max-width: 1080px) {
    z-index: 100;
    bottom: 0;
    position: absolute;
    width: 100%;
  }
`
export default Aggregation
