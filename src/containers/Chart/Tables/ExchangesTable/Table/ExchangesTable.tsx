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

const mockExchanges = [
  { name: "OKEx", symbol: "okex" },
  { name: "Huobi", symbol: "huobi" },
  { name: "Bitfinex", symbol: "bitfinex" },
  { name: "Bitstamp", symbol: "bitstamp" },
  { name: "Coinbase Pro", symbol: "coinbase" },
  { name: "Huobi", symbol: "huobi" },
  { name: "DigiFinex", symbol: "digifinex" },
  { name: "ZB.COM", symbol: "zbcom" },
];

export const ExchangeQuery = gql`
  query ExchangeQuery($marketName: String!) {
    marketByName(name: $marketName){
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
    if (data && data.marketByName) {
      exchanges = data.marketByName.length > 0 ? [...(data.marketByName[0].exchanges.map(({ name, symbol }) => ({ name, symbol })))] : [];
      console.log(mockExchanges);
      console.log(exchanges);
      exchanges.push(...mockExchanges);
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
            <StyledHeadCell color="#9ca2aa" width={'30%'}>
              Name{' '}
            </StyledHeadCell>
            <StyledHeadCell color="#9ca2aa" width={'60%'}>
              Symbol
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
                changeExchange({ index: ind, exchange: exchanges[ind] })
              }}
              background={activeExchange.index === ind ? '#535b62' : '#292d31'}
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
                      width="50%"
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
