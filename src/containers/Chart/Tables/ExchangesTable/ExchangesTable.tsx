import React, { PureComponent } from 'react'
import { FaCircle } from 'react-icons/lib/fa'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell,
  HeadCell,
} from '@components/Table/Table'
import AnimatedCell from '@components/Table/AnimatedCell/AnimatedCell'
import QueryRenderer from '@components/QueryRenderer'
import { Loading } from '@components/Loading/Loading'
import gql from 'graphql-tag'


export const ExchangeQuery = gql`
  query ExchangeQuery($marketName: String!) {
    marketByName(name: $marketName){
    name
    exchangeIds
    exchanges {
      symbol
      name
    }
  }
}
`

class ExchangesTable extends PureComponent {
  render() {

    const {
      activeExchange,
      changeExchange,
      quote,
      onButtonClick,
      data
    } = this.props

    let exchanges = this.props.exchanges;

    if (!exchanges || !data) {
      return <Loading centerAligned />
    }
    if (data) {
      exchanges = data.marketByName[0].exchanges;
    }

    return (
      <StyledTable>
        <Title>
          Exchanges
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            ORDER
          </SwitchTablesButton>
        </Title>
        <StyledHead background={'#292d31'}>
          <Row isHead background={'#292d31'}>
            <StyledHeadCell color="#9ca2aa" width={'20%'}>
              Name
            </StyledHeadCell>
            <StyledHeadCell color="#9ca2aa" width={'20%'}>
              Cross{' '}
            </StyledHeadCell>
            <StyledHeadCell color="#9ca2aa" width={'20%'}>
              Price
            </StyledHeadCell>
            <StyledHeadCell color="#9ca2aa" width={'20%'}>
              {quote || 'Fiat'}
            </StyledHeadCell>
            <StyledHeadCell
              style={{ lineHeight: 'inherit', paddingTop: '0.25rem' }}
              color="#9ca2aa"
              width={'20%'}
            >
              1D Vol
              <br />(K)
            </StyledHeadCell>
          </Row>
        </StyledHead>
        <Body
          style={{ width: '105%' }}
          height={'calc(100vh - 59px - 80px - 39px - 37px - 30px)'}
        >
          {exchanges.map((exchange, ind) => (
            <Row
              key={ind}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                changeExchange(ind)
              }}
              background={activeExchange === ind ? '#535b62' : '#292d31'}
            >
              {Object.values(exchange).map((prop, propinx) => {
                const keyByValue = Object.keys(exchange).find(
                  (key) => exchange[key] === prop
                )

                if (keyByValue === 'status') {
                  return
                } else if (keyByValue === 'name') {
                  return (
                    <Cell
                      key={propinx}
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'nowrap',
                      }}
                      color="#9ca2aa"
                      width="20%"
                    >
                      <FaCircle
                        style={{
                          fontSize: '0.5rem',
                          minWidth: '20%',
                          flexBasis: '20%',
                          color: exchange.status,
                          marginRight: '0.25rem',
                        }}
                      />
                      {prop}
                    </Cell>
                  )
                } else {
                  return (
                    <AnimatedCell
                      value={prop}
                      animation={'fadeInGreenAndBack'}
                      key={keyByValue}
                      color="#9ca2aa"
                      width="20%"
                    />
                  )
                }
              })}
            </Row>
          ))}
        </Body>
      </StyledTable>
    )
  }
}

const StyledHeadCell = styled(HeadCell)`
  line-height: 37px;
  padding: 0;
`

const StyledTable = styled(Table)`
  overflow-x: hidden;
`

const StyledHead = styled(Head)`
  height: 40px;
`

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`


export default function (props: any) {
  return (
    <QueryRenderer
      component={ExchangesTable}
      query={ExchangeQuery}
      variables={{ marketName: props.marketName }}
      {...props}
    />
  )
}
