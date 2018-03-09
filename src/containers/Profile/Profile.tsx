import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

const SWrapper = styled.div`
  display: flex;
  margin-top: 5px;
`
const ProfileHeading = styled.div`
  display: flex;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
  margin-left: 135px;
  margin-top: 24px;
  max-width: 380px;
`

const ProfileImage = styled.div`
  min-width: 120px;
  height: 120px;
  border-radius: 3px;
  background-color: #4c5055;
  margin: 16px;
`

const CoinProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const CoinName = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: left;
  color: #ffffff;
  margin: 16px 16px 16px 0;
`

const CoinShortName = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: left;
  margin-left: 8px;
`

const CoinDescription = styled.span`
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.4px;
  text-align: left;
  color: #ffffff;
  margin: 0 0 16px 0;
`

class Profile extends Component {
  render() {
    return (
      <SWrapper>
        <ProfileHeading>
          <ProfileImage />
          <CoinProfileWrapper>
            <CoinName>
              Bitcoin<CoinShortName>BTC</CoinShortName>
            </CoinName>
            <CoinDescription>
              Basic info lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt.
            </CoinDescription>
          </CoinProfileWrapper>
        </ProfileHeading>
      </SWrapper>
    )
  }
}

export const ProfileQuery = gql`
  query ProfileQuery($id: MongoID!) {
    assetById(_id: $id) {
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
`

const options = ({ match }) => ({ variables: { id: match ? match.params.id : '' } })

export const ProfileWrapper = graphql(ProfileQuery, { options })(Profile)
