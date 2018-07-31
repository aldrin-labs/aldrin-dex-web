import React, { PureComponent } from 'react'
import { FaCircle } from 'react-icons/lib/fa'
import { Button, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell,
  HeadCell,
  FullWidthBlock,
} from '@components/Table/Table'

class ExchangesTable extends PureComponent {
  render() {
    const {
      activeExchange,
      changeExchange,
      quote,
      onButtonClick,
      exchanges,
      theme,
    } = this.props

    console.log(JSON.stringify(theme.palette))

    return (
      <StyledTable>
        <Title background={theme.palette.primary.dark}>
          <Typography color="textSecondary" variant="headline" align="center">
            Exchanges
          </Typography>
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            <Typography color="textSecondary" variant="headline" align="left">
              ORDER
            </Typography>
          </SwitchTablesButton>
        </Title>
        <StyledHead background={theme.palette.background.default}>
          <Row
            isHead
            background={theme.palette.background.default}
            hoverBackground={theme.palette.action.hover}
          >
            <StyledHeadCell width={'50%'}>
              <FullWidthBlockMovedLeft>
                <Typography variant="title" color="default" align="left">
                  Name{' '}
                </Typography>
              </FullWidthBlockMovedLeft>
            </StyledHeadCell>
            <StyledHeadCell width={'50%'}>
              <Typography variant="title" color="default" align="left">
                Symbol{' '}
              </Typography>
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
              background={
                activeExchange.index === ind
                  ? theme.palette.action.selected
                  : theme.palette.background.default
              }
              hoverBackground={theme.palette.action.hover}
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
                      width="50%"
                    >
                      <FaCircle
                        style={{
                          fontSize: '0.5rem',
                          minWidth: '20%',
                          flexBasis: '20%',
                          color:
                            exchange.status || theme.palette.secondary.main,
                          marginRight: '0.25rem',
                        }}
                      />
                      <Typography noWrap variant="body1" color="default">
                        {prop}
                      </Typography>
                    </Cell>
                  )
                } else {
                  return (
                    <Cell
                      key={propinx}
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'nowrap',
                      }}
                      width="50%"
                    >
                      <Typography variant="body1" color="default">
                        {prop}
                      </Typography>
                    </Cell>
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

const FullWidthBlockMovedLeft = FullWidthBlock.extend`
  position: relative;
  left: calc(6.4px + 19.3px);
`

const StyledHeadCell = styled(HeadCell)`
  line-height: 37px;
  padding: 0.25rem;
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

const ThemeWrapper = (props) => <ExchangesTable {...props} />

export default withTheme()(ThemeWrapper)
