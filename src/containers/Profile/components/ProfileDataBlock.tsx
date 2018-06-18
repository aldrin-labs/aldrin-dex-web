import * as React from 'react'
import styled from 'styled-components'
import { ProfileQueryQuery } from '../profile-annotation'

interface Props {
  coin: ProfileQueryQuery['assetById']
}

export default class ProfileDataBlock extends React.Component<Props, {}> {
  render() {
    const coin = this.props.coin ? this.props.coin : {}

    return (
      <SProfileDataBlock>
        {Object.keys(coin).map((item, i) => (
          <div>
            <p>
              {item}: {coin[item]}
            </p>
            <br />
          </div>
        ))}
      </SProfileDataBlock>
    )
  }
}

const SProfileDataBlock = styled.div`
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
  margin-top: 19px;
  max-width: 380px;
  margin-left: 24px;
  padding-left: 16px;
  padding-top: 16px;
  color: #fff;
  font-family: Roboto;
`
