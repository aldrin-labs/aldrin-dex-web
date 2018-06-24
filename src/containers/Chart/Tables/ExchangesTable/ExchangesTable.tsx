import React, { PureComponent } from 'react'
import { MdArrowDropUp } from 'react-icons/lib/md/'
import { FaCircle } from 'react-icons/lib/fa'
import { Collapse } from '@material-ui/core'
import styled, { keyframes } from 'styled-components'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell,
  HeadCell,
} from '@components/Table/Table'

class ExchangesTable extends PureComponent {
  state = {
    exchangeTableExpanded: true,
  }

  render() {
    const { exchanges, activeExchange, changeExchange, base } = this.props
    const { exchangeTableExpanded } = this.state

    return (
      <Exchanges>
        <CollapseWrapper in={exchangeTableExpanded} collapsedHeight="2rem">
          <TriggerTitle
            onClick={() => {
              this.setState((prevState) => ({
                exchangeTableExpanded: !prevState.exchangeTableExpanded,
              }))
            }}
          >
            <StyledArrowSign
              style={{ marginRight: '0.5rem' }}
              tableCollapsed={!exchangeTableExpanded}
              up={!exchangeTableExpanded}
            />
            Exchanges
          </TriggerTitle>
          <Head style={{ height: '1.625rem' }} background={'#292d31'}>
            <Row
              style={{ width: 'calc(100% + 10px)' }}
              isHead
              background={'#292d31'}
            >
              <HeadCell color="#9ca2aa" width={'20%'}>
                Name
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'20%'}>
                Cross{' '}
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'20%'}>
                Price
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'20%'}>
                {base || 'Fiat'}
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'20%'}>
                1D Vol(K)
              </HeadCell>
            </Row>
          </Head>
          <Body style={{ width: '105%' }} height="100%">
            {exchanges.map((exchange, ind) => (
              <Row
                key={ind}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  changeExchange(ind)
                }}
                background={activeExchange === ind ? '#353c42' : '#16181b'}
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
                      <Cell key={propinx} color="#9ca2aa" width="20%">
                        {prop}
                      </Cell>
                    )
                  }
                })}
              </Row>
            ))}
          </Body>
        </CollapseWrapper>
      </Exchanges>
    )
  }
}

const TriggerTitle = Title.extend`
  cursor: pointer;
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 1rem;
  transform: ${(props: { up: boolean }) =>
    props.up ? 'rotate(0deg)' : 'rotate(180deg)'};
  position: relative;
  transition: all 0.5s ease;

  ${TriggerTitle}:hover & {
    animation: ${(props: { tableCollapsed: boolean }) =>
        props.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`
const CollapsibleTable = Table.extend`
  max-height: 28rem;
  position: absolute;
  bottom: 23px;
  left: 0;
  z-index: 999;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const Exchanges = CollapsibleTable.extend`
  bottom: -1px;

  @media (max-width: 1080px) {
    bottom: 0.5rem;
  }
`
const JumpDownArrow = keyframes`
0% {
  top: 0px;
}
50% {
 top: 0.25rem;
}
100% {
  top: 0px;
}
`
const JumpUpArrow = keyframes`
0% {
  bottom: 0px;
}
50% {
 bottom: 0.25rem;
}
100% {
  bottom: 0px;
}
`

export default ExchangesTable
