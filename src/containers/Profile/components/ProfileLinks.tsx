import * as React from 'react'
import styled from 'styled-components'
import { ProfileQueryQuery } from '../profile-annotation'

interface Props {
  coin: ProfileQueryQuery['assetById']
}

export default class ProfileLinks extends React.Component<Props, {}> {
  render() {
    /*TODO: need real links */
    const rows = [
      {
        icon: require('../../../icons/website.svg'),
        heading: 'Website',
        links: ['bitcoin.com', 'bitcoin.org'],
      },
      {
        icon: require('../../../icons/explorer.svg'),
        heading: 'Explorer',
        links: ['blockchain.info'],
      },
      {
        icon: require('../../../icons/code.svg'),
        heading: 'Source',
        links: ['github.com'],
      },
      {
        icon: require('../../../icons/star.svg'),
        heading: 'Rank',
        links: ['1 by Market cap'],
      },
      {
        icon: require('../../../icons/tags.svg'),
        heading: 'Tags',
        links: ['Mineable', 'Coin'],
      },
    ]

    return (
      <SProfileLinks>
        <CoinLinkHeadingRow>
          <WebIcon
            dangerouslySetInnerHTML={{
              __html: require('../../../icons/web.svg'),
            }}
          />
          <CoinLinkHeading>Useful Links</CoinLinkHeading>
        </CoinLinkHeadingRow>

        {rows.map(row => {
          const { icon = '', heading = '', links = [] } = row || {}
          return (
            <CoinLinkRow key={heading}>
              <WebIcon
                dangerouslySetInnerHTML={{
                  __html: icon,
                }}
              />
              <RowHeading>{heading}</RowHeading>
              <RowLinks>{links.map(link => <RowLink key={link}>{link}</RowLink>)}</RowLinks>
            </CoinLinkRow>
          )
        })}
      </SProfileLinks>
    )
  }
}

const SProfileLinks = styled.div`
  width: 380px;
  margin-top: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
  padding-bottom: 48px;
`

const CoinLinkRow = styled.div`
  display: flex;
  margin: 9px 0 9px 16px;
  align-items: baseline;
`

const CoinLinkHeadingRow = styled.div`
  display: flex;
  margin: 9px 0 24px 16px;
  align-items: center;
`

const CoinLinkHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: left;
  color: #fff;
  margin-left: 9px;
`

const WebIcon = styled.div`
  width: 20px;
  height: 20px;
  object-fit: contain;
`

const RowHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.75;
  letter-spacing: 0.5px;
  text-align: left;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 9px;
  min-width: 79px;
`

const RowLinks = styled.div`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.75;
  letter-spacing: 0.5px;
  text-align: left;
  color: #ffffff;
  margin-left: 16px;
  text-decoration: underline;

  display: flex;
  flex-direction: column;
`

const RowLink = styled.span`
  cursor: pointer;
`
