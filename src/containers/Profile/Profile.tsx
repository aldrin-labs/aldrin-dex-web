import * as React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import ProfileHeading from './components/ProfileHeading'
import ProfileLinks from './components/ProfileLinks'
import { ProfileQueryQuery } from './profile-annotation'

const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`

interface Props { data: ProfileQueryQuery }

class Profile extends React.Component<Props, {}> {
  render() {
    const { data } = this.props
    const { assetById } = data

    return (
      <SWrapper>
        <ProfileHeading coin={assetById} />
        <ProfileLinks coin={assetById} />
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
