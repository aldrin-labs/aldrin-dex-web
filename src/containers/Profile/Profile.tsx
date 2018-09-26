import * as React from 'react'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import ProfileHeading from '@containers/Profile/components/ProfileHeading'
import ProfileLinks from '@containers/Profile/components/ProfileLinks'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import { ProfileQueryQuery } from '@containers/Profile/profile-annotation'
import { ProfileQuery } from '@containers/Profile/api'

interface Props {
  data: ProfileQueryQuery
}

class ProfileComponent extends React.Component<Props, {}> {
  render() {
    const { data } = this.props
    const { assetById } = data

    return (
      <SProfileWrapper>
        <SProfile>
          <SWrapper>
            <ProfileHeading coin={assetById} />
            <ProfileLinks coin={assetById} />
          </SWrapper>
          <ProfileChart
            coin={assetById}
            style={{
              maxWidth: '900px',
              marginTop: '24px',
              borderTop: 'none',
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
  font-family: Roboto, sans-serif;
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

const options = ({ match }) => ({
  variables: { id: match ? match.params.id : '' },
})

export default graphql(ProfileQuery, { options })(ProfileComponent)
