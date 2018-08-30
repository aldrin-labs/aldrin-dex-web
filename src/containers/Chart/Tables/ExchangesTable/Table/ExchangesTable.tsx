import React, { PureComponent } from 'react'
import { FaCircle } from 'react-icons/lib/fa'
import { Button, Typography } from '@material-ui/core'
import styled from 'styled-components'

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
import { IProps } from './ExchangesTable.types'
import { TypographyWithCustomColor } from '@styles/components'

class ExchangesTable extends PureComponent<IProps> {
  render() {
    const {
      activeExchange,
      changeExchange,
      onButtonClick,
      exchanges,
      theme,
    } = this.props

    return (
      <StyledTable>
        <Title background={theme.palette.primary.dark}>
          <TypographyWithCustomColor
            textColor={theme.palette.getContrastText(
              theme.palette.primary.dark
            )}
            variant="subheading"
            align="center"
          >
            Exchanges
          </TypographyWithCustomColor>
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            <TypographyWithCustomColor
              textColor={theme.palette.getContrastText(
                theme.palette.primary.dark
              )}
              variant="headline"
              align="left"
            >
              ORDER
            </TypographyWithCustomColor>
          </SwitchTablesButton>
        </Title>
        <Head background={theme.palette.background.default}>
          <Row
            isHead={true}
            background={theme.palette.background.default}
            hoverBackground={theme.palette.action.hover}
          >
            <StyledHeadCell width={'50%'}>
              <FullWidthBlockMovedLeft>
                <TypographyWithCustomColor
                  textColor={theme.palette.getContrastText(
                    theme.palette.background.default
                  )}
                  variant="subheading"
                  color="default"
                  align="left"
                >
                  Name{' '}
                </TypographyWithCustomColor>
              </FullWidthBlockMovedLeft>
            </StyledHeadCell>
            <StyledHeadCell width={'50%'}>
              <TypographyWithCustomColor
                textColor={theme.palette.getContrastText(
                  theme.palette.background.default
                )}
                variant="subheading"
                color="default"
                align="left"
              >
                Symbol{' '}
              </TypographyWithCustomColor>
            </StyledHeadCell>
          </Row>
        </Head>
        <Body
          style={{ width: '105%' }}
          height={'calc(100vh - 59px - 80px - 39px - 37px - 30px)'}
        >
          {exchanges.map((exchange, ind) => {
            const background =
              activeExchange.index === ind
                ? theme.palette.action.selected
                : theme.palette.background.default
            const exchangeText =
              activeExchange.index !== ind
                ? theme.palette.getContrastText(background)
                : theme.palette.secondary.dark
            return (
              <Row
                key={ind}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  changeExchange({ index: ind, exchange: exchanges[ind] })
                }}
                background={background}
                hoverBackground={theme.palette.action.hover}
              >
                {Object.values(exchange).map((prop, propinx) => {
                  const keyByValue = Object.keys(exchange).find(
                    (key) => exchange[key] === prop
                  )

                  if (keyByValue === 'status') {
                    return
                  }
                  if (keyByValue === 'name') {
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
                          }}
                        />
                        <TypographyWithCustomColor
                          noWrap={true}
                          variant="body1"
                          textColor={exchangeText}
                        >
                          {prop}
                        </TypographyWithCustomColor>
                      </Cell>
                    )
                  }

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
                      <TypographyWithCustomColor
                        variant="body1"
                        textColor={exchangeText}
                      >
                        {prop}
                      </TypographyWithCustomColor>
                    </Cell>
                  )
                })}
              </Row>
            )
          })}
        </Body>
      </StyledTable>
    )
  }
}

const FullWidthBlockMovedLeft = FullWidthBlock.extend`
  position: relative;
  left: 20%;
`

const StyledHeadCell = styled(HeadCell)`
  line-height: 37px;
  padding: 0.25rem 0.4rem;
`

const StyledTable = styled(Table)`
  overflow-x: hidden;
`

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`

export default ExchangesTable
