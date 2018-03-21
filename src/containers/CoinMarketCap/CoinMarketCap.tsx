import gql from 'graphql-tag'
import * as React from 'react'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import { History } from 'history'
import Button from '../../components/Elements/Button/Button'
import Calculator from '../../components/Calculator/Calculator'
import arrowIcon from '../../icons/arrow.svg'
import { CoinMarketCapQueryQuery } from './annotations'

interface Props {
  data: CoinMarketCapQueryQuery
  history: History
  location: Location
}

interface State {
  activeKind: number
  activeSortArg?: number
}

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

class CoinMarket extends React.Component<Props, State> {
  state: State = {
    activeKind: 0,
  }

  onChangeKind = (index: number) => {
    this.setState({ activeKind: index })
  }

  formatNumber = (num: number) => {
    return String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
  }

  redirectToProfile = (_id: string) => {
    const { history } = this.props

    history.push(`/profile/${_id}`)
  }

  onChangeSortArg = (index: number, sortArg: string) => {
    const { history, location } = this.props
    if (!location) return

    const query = new URLSearchParams(location.search)
    if (query.has('sort')) {
      query.set('sort', sortArg)
    } else {
      query.append('sort', sortArg)
    }

    history.push({ pathname: location.pathname, search: query.toString() })

    this.setState({ activeSortArg: index })
  }

  incrementPage = () => {
    const { data, history, location } = this.props
    const { assetPagination } = data
    if (!assetPagination) return
    const { pageInfo } = assetPagination
    const { currentPage, hasNextPage } = pageInfo

    if (hasNextPage) {
      const query = new URLSearchParams(location.search)
      if (query.has('page')) {
        query.set('page', `${currentPage + 1}`)
      } else {
        query.append('page', `${currentPage + 1}`)
      }
      history.push({ pathname: location.pathname, search: query.toString() })
    }
  }

  decrementPage = () => {
    const { data, history, location } = this.props
    const { assetPagination } = data
    if (!assetPagination) return
    const { pageInfo } = assetPagination
    const { currentPage, hasPreviousPage } = pageInfo

    if (hasPreviousPage) {
      const query = new URLSearchParams(location.search)
      if (query.has('page')) {
        query.set('page', `${currentPage - 1}`)
      } else {
        query.append('page', `${currentPage - 1}`)
      }
      history.push({ pathname: location.pathname, search: query.toString() })
    }
  }

  render() {
    const { activeSortArg, activeKind } = this.state
    const { data } = this.props
    const { assetPagination } = data
    if (!assetPagination || !assetPagination.items) return null
    const { items } = assetPagination

    return (
      <Wrapper>
        <LeftColumn>
          <MarketWrapper>
            <Title>Cryptocurrency Market</Title>
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
                        i !== 0 && (
                          <WebIcon src={arrowIcon.replace(/"/gi, '')} />
                        )}
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
                      <TD>
                        {priceUSD ? `$${Number(priceUSD).toFixed(2)}` : ''}
                      </TD>
                      <TD>{percentChangeDay || ''}</TD>
                      <TD>{''}</TD>
                      <TD>
                        {maxSupply ? `$${this.formatNumber(maxSupply)}` : ''}
                      </TD>
                      <TD>
                        {totalSupply
                          ? `$${this.formatNumber(totalSupply)}`
                          : ''}
                      </TD>
                    </TR>
                  )
                })}
              </TBody>
            </Table>
          </MarketWrapper>
          <Pagination>
            <Button title="Previous" onClick={this.decrementPage} />
            <Button title="View all coins" />
            <Button title="Next" onClick={this.incrementPage} />
          </Pagination>
        </LeftColumn>

        <RightColumn>
          <Calculator
            rates={[
              { name: 'BTC/USD', rate: 9103.26 },
              { name: 'USD/BTC', rate: 0.00011 },
              { name: 'BTC/ETH', rate: 1 },
              { name: 'ETH/BTC', rate: 1 },
              { name: 'ETH/USD', rate: 580.06 },
              { name: 'USD/ETH', rate: 1 },
              { name: 'XRP/USD', rate: 0.709714 },
              { name: 'USD/XRP', rate: 1 },
            ]}
          />
        </RightColumn>
      </Wrapper>
    )
  }
}

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  margin-top: 24px;
  margin-left: 16px;
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 775px;
`

const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
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

const Wrapper = styled.div`
  max-width: 1400px;
  display: flex;
  margin: 0 auto;
`

const MarketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 775px;
  margin-top: 24px;
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

export const CoinMarketCapQuery = gql`
  query CoinMarketCapQuery($page: Int, $perPage: Int) {
    assetPagination(page: $page, perPage: $perPage) {
      pageInfo {
        pageCount
        hasNextPage
        currentPage
        hasPreviousPage
        perPage
      }
      count
      items {
        _id
        name
        symbol
        nameTrue
        priceUSD
        maxSupply
        totalSupply
        availableSupply
        priceUSD
        percentChangeDay
      }
    }
  }
`

const options = ({ location }) => {
  let page
  if (!location) {
    page = 1
  } else {
    const query = new URLSearchParams(location.search)
    page = query.get('page')
  }
  return { variables: { perPage: 20, page } }
}

export const CoinMarketCap = graphql(CoinMarketCapQuery, { options })(
  CoinMarket
)

export default CoinMarketCap
