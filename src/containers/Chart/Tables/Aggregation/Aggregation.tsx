import React from 'react'
import { MdAddCircleOutline } from 'react-icons/lib/md'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

import { Row, Table, Head, Cell, HeadCell } from '@components/Table/Table'

const Aggregation = (props) => {
  const {
    aggregation,
    onButtonClick,
    theme: { palette },
  } = props

  return (
    <AggregationWrapper>
      <AggHead background={palette.background.paper}>
        <Row background={palette.background.paper} isHead>
          <Cell width={'10%'} />
          <HeadCell width={'45%'}>
            <Typography color="primary" variant="caption">
              Aggregation
            </Typography>
          </HeadCell>
          <HeadCell width={'20%'}>
            <Typography color="secondary" variant="caption">
              {aggregation.toFixed(2)}
            </Typography>
          </HeadCell>
          <HeadCell
            style={{
              zIndex: 1000,
            }}
            width={'25%'}
          >
            <Button>
              <MdAddCircleOutline
                onClick={onButtonClick}
                style={{
                  color: palette.primary['light'],
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
