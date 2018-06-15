import * as React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import ProfileHeading from './components/ProfileHeading'
import ProfileLinks from './components/ProfileLinks'
import ProfileChart from './components/ProfileChart'
import { ProfileQueryQuery } from './profile-annotation'

interface Props {
  data: ProfileQueryQuery
}

class ProfileComponent extends React.Component<Props, {}> {
  render() {
    const { data } = this.props
    const { assetById } = data
    console.log(this.props)
    //console.log(this.props.match.params)
    let testAsset = { name: 'Coinname', symbol: this.props.match.params.id }

    return (
      <SProfileWrapper>
        <SProfile>
          <SWrapper>
            <ProfileHeading coin={testAsset} />
            <ProfileLinks coin={testAsset} />
          </SWrapper>
          <ProfileChart
            coin={testAsset}
            style={{
              maxWidth: '900px',
              marginTop: '24px',
              borderTop: 'none',
              marginLeft: '24px',
            }}
            height={195}
          />
        </SProfile>

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

const options = ({ match }) => ({
  variables: { id: match ? match.params.id : '1' },
})

export default graphql(ProfileQuery, { options })(ProfileComponent)
