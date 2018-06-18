import * as React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import ProfileHeading from './components/ProfileHeading'
import ProfileLinks from './components/ProfileLinks'
import ProfileChart from './components/ProfileChart'
import ProfileDataBlock from './components/ProfileDataBlock'
import { ProfileQueryQuery } from './profile-annotation'

interface Props {
  data: ProfileQueryQuery
}

class ProfileComponent extends React.Component<Props, {}> {
  render() {
    const { data } = this.props
    const { assetBySymbol } = data
    console.log(this.props)

    return (
      <SProfileWrapper>
        <SProfile>
          <SWrapper>
            <ProfileHeading coin={assetBySymbol} />
            <ProfileLinks coin={assetBySymbol} />
          </SWrapper>
          <ProfileChart
            coin={assetBySymbol}
            style={{
              maxWidth: '900px',
              marginTop: '24px',
              borderTop: 'none',
              marginLeft: '24px',
            }}
            height={195}
          />
        </SProfile>
        <ProfileDataBlock coin={assetBySymbol} />
        <Divider>
          <LeftPath />
          <DividerText>MUST-READ ARTICLES</DividerText>
          <RightPath />
        </Divider>

        <Smile>¯\_(ツ)_/¯</Smile>
      </SProfileWrapper>
    )
  }
}

const Smile = styled.div`
  font-family: PingFangSC;
  font-size: 103px;
  text-align: center;
  color: #ffffff80;
  margin: 73px auto 0 auto;
`

const DividerText = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
`

const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`

const LeftPath = styled.hr`
  width: 35%;
  height: 1px;
  border-radius: 1px;
  background-image: linear-gradient(to right, #ffffff00, #ffffff);
`

const RightPath = styled.hr`
  width: 35%;
  height: 1px;
  border-radius: 1px;
  background-image: linear-gradient(to left, #ffffff00, #ffffff);
`

const SProfileWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`

const SProfile = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
`

export const ProfileQuery = gql`
  query ProfileQuery($symbol: String!) {
    assetBySymbol(symbol: $symbol) {
      _id
      name
      symbol
      availableSupply
      totalSupply
      maxSupply
      icoPrice
      blockchain
      industryId
      otherIndustries
      product
      icoRaised
      tokenDistribution
      updatedAt
      createdAt
      priceUSD
      priceBTC
      percentChangeDay
    }
  }
`

const options = ({ match }) => ({
  variables: {
    symbol: match.params.id ? match.params.id.toUpperCase() : 'BTC',
  },
})

export default graphql(ProfileQuery, { options })(ProfileComponent)
