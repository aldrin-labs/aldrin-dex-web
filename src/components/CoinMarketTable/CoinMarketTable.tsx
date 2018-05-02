import * as React from 'react'
import styled from 'styled-components'
import Button from '../Elements/Button/Button'
import arrowIcon from '../../icons/arrow.svg'
import { CoinMarketCapQueryQuery } from '../../containers/CoinMarketCap/annotations'

const kindBtns = ['All coins', 'Coins', 'Tokens']

const headers = [
  '№',
  'Name',
  'Symbol',
  'Price',
  'Chg (24h)',
  'Chg (7d)',
  'Market Cap',
  'Total Supply ',
]

interface Props {
  items: Array<{
    _id: string
    name: string | null
    symbol: string | null
    nameTrue: string | null
    priceUSD: string | null
    maxSupply: number | null
    totalSupply: number | null
    availableSupply: number | null
    percentChangeDay: string | null
  } | null>
  activeSortArg?: number
  showFilterBns?: boolean
  onChangeSortArg?: Function
  redirectToProfile?: Function
}

interface State {
  activeKind: number
}

export default class CoinMarketTable extends React.Component<Props, State> {
  state: State = {
    activeKind: 0,
  }

  onChangeKind = (index: number) => {
    this.setState({ activeKind: index })
  }

  formatNumber = (num: number) => {
    return String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
  }

  onChangeSortArg = (index: number, header: string) => {
    const { onChangeSortArg } = this.props
    if (onChangeSortArg) onChangeSortArg(index, header)
  }

  redirectToProfile = (id: string) => {
    const { redirectToProfile } = this.props
    if (redirectToProfile) redirectToProfile(id)
  }

  render() {
    const { activeSortArg, items, showFilterBns } = this.props
    const { activeKind } = this.state

    return (
      <MarketWrapper>
        <Title>TOP-20 Cryptocurrency Market Capitalizations</Title>
        {showFilterBns && (
          <BtnsContainer>
            {kindBtns.map((kindBtn, i) => {
              return (
                <Button
                  onClick={() => this.onChangeKind(i)}
                  active={i === activeKind}
                  key={kindBtn}
                  title={kindBtn}
                  mRight
                />
              )
            })}
          </BtnsContainer>
        )}

        <Table>
          <THead>
            <tr>
              {headers.map((header, i) => (
                <TH
                  key={header}
                  onClick={() => this.onChangeSortArg(i, header)}
                  style={i === activeSortArg ? {} : { fontWeight: 500 }}
                >
                  {header}
                  {i === activeSortArg &&
                    i !== 0 && <WebIcon src={arrowIcon.replace(/"/gi, '')} />}
                </TH>
              ))}
            </tr>
          </THead>
          <TBody>
            {items.map((item, i) => {
              if (!item) return null
              const {
                _id,
                name,
                symbol,
                priceUSD,
                percentChangeDay,
                maxSupply,
                totalSupply,
              } = item

              return (
                <TR key={_id} onClick={() => this.redirectToProfile(_id)}>
                  <TD>{`${i + 1}.`}</TD>
                  <TD>{name}</TD>
                  <TD>{symbol}</TD>
                  <TD>{priceUSD ? `$${Number(priceUSD).toFixed(2)}` : ''}</TD>
                  <TD>{percentChangeDay || ''}</TD>
                  <TD>{''}</TD>
                  <TD>{maxSupply ? `$${this.formatNumber(maxSupply)}` : ''}</TD>
                  <TD>
                    {totalSupply ? `$${this.formatNumber(totalSupply)}` : ''}
                  </TD>
                </TR>
              )
            })}
          </TBody>
        </Table>
      </MarketWrapper>
    )
  }
}

const TBody = styled.tbody`
  width: 100%;
`

const TH = styled.th`
  font-family: Roboto;
  font-size: 14px;
  text-align: left;
  color: #fff;
  padding: 6px 0;
  cursor: pointer;
`

const THead = styled.thead`
  width: 100%;
  border-bottom: 1px solid #fff;
`

const Table = styled.table`
  display: table;
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
  margin-bottom: 36px;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
`

const MarketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
`

const Title = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
`

const WebIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 1px;
  vertical-align: middle;
`

const TD = styled.td`
  font-family: Roboto;
  font-size: 12px;
  text-align: left;
  color: #fff;
`

const TR = styled.tr`
  width: 100%;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 2.4em;
  cursor: pointer;

  &:hover ${TD} {
    color: #4ed8da;
  }
`
