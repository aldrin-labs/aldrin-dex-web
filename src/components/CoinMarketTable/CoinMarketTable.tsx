import * as React from 'react'
import styled from 'styled-components'
import Button from '../Elements/Button/Button'
import arrowIcon from '@icons/arrow.svg'
import { Loading } from '@components/Loading'
import { CoinMarketCapQueryQuery } from '@containers/CoinMarketCap/annotations'

const kindBtns = ['All coins', 'Coins', 'Tokens']

const headers = [
  '№',
  'Name',
  'Symbol',
  'Price',
  'Change (24h)',
  'Market Cap',
  'Available Supply ',
]

export interface Props {
  data: CoinMarketCapQueryQuery
  activeSortArg?: number
  showFilterBns?: boolean
  fetchMore?: Function
  onChangeSortArg?: Function
  redirectToProfile?: Function
}

export interface State {
  activeKind: number
}

export default class CoinMarketTable extends React.Component<Props, State> {
  state: State = {
    activeKind: 0,
  }

  fetchMore = () => {
    const { fetchMore } = this.props
    if (fetchMore) fetchMore()
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
    const { activeSortArg, showFilterBns, data } = this.props
    const { activeKind } = this.state
    const { assetPagination } = data

    if (data.loading || !data.assetPagination) {
      return (
        <MarketWrapper>
          <Loading centerAligned />
        </MarketWrapper>
      )
    }

    return (
      <MarketWrapper>
        <Title>Cryptocurrency Market Capitalizations</Title>
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
            {assetPagination &&
              assetPagination.items.map((item, i) => {
                if (!assetPagination.items) return null
                const {
                  _id,
                  icoPrice,
                  name,
                  symbol,
                  priceUSD,
                  percentChangeDay,
                  maxSupply,
                  availableSupply,
                } = item

                const img = (
                  <img
                    src={icoPrice}
                    key={icoPrice}
                    style={{
                      paddingRight: '4px',
                      verticalAlign: 'bottom',
                      maxWidth: '20px',
                      maxHeight: '16px',
                      objectFit: 'contain',
                    }}
                  />
                )

                const color =
                  Number(percentChangeDay) >= 0 ? '#65c000' : '#ff687a'

                return (
                  <TR key={_id} onClick={() => this.redirectToProfile(_id)}>
                    <TD>{`${i + 1}.`}</TD>
                    <TD>{[img, name]}</TD>
                    <TD>{symbol}</TD>
                    <TD>
                      {priceUSD ? `$ ${Number(priceUSD).toFixed(2)}` : ''}
                    </TD>
                    <TD style={{ color }}>{`${percentChangeDay}` || ''}</TD>
                    <TD>
                      {maxSupply ? `$ ${this.formatNumber(maxSupply)}` : ''}
                    </TD>
                    <TD>
                      {availableSupply
                        ? `${this.formatNumber(availableSupply)}`
                        : ''}
                    </TD>
                  </TR>
                )
              })}
          </TBody>
        </Table>

        <Btn disabled={data.hasNextPage} onClick={this.fetchMore}>
          Show more
        </Btn>
      </MarketWrapper>
    )
  }
}

const Btn = styled.button`
  border-radius: 3px;
  background-color: #282c2f;
  border-color: transparent;
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  width: 15em;
`

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
  position: relative;
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
