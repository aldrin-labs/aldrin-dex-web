import React, { PureComponent } from 'react'

import { Row, Title, Body, Head } from '@components/Table/Table'
import { IProps } from './ExchangesTable.types'
import {
  StyledTable,
  SwitchTablesButton,
  StyledHeadCell,
  FullWidthBlockMovedLeft,
  FlexCell,
  Icon,
} from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable.styles'
import { TypographyWithCustomColor } from '@styles/Components/TypographyWithCustomColor'

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
        <Title background={theme.palette.primary.main}>
          <TypographyWithCustomColor
            textColor={theme.palette.getContrastText(
              theme.palette.primary.main
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
                theme.palette.primary.main
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
                : theme.palette.secondary.main
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
                      <FlexCell key={propinx} width="50%">
                        <Icon
                          color={
                            exchange.status || theme.palette.secondary.main
                          }
                        />
                        <TypographyWithCustomColor
                          noWrap={true}
                          variant="body1"
                          textColor={exchangeText}
                        >
                          {prop}
                        </TypographyWithCustomColor>
                      </FlexCell>
                    )
                  }

                  return (
                    <FlexCell key={propinx} width="50%">
                      <TypographyWithCustomColor
                        variant="body1"
                        textColor={exchangeText}
                      >
                        {prop}
                      </TypographyWithCustomColor>
                    </FlexCell>
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

export default ExchangesTable
