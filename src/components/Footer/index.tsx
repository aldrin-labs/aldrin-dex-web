import * as React from 'react'
import styled from 'styled-components'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'

import github from '../../icons/github.svg'
import telegram from '../../icons/telegram.svg'
import twitter from '../../icons/twitter.svg'

const socialIcons = [
  { icon: github, link: '' },
  { icon: telegram, link: '' },
  { icon: twitter, link: '' },
]

export default class Footer extends React.Component {
  render() {
    return (
      <Container>
        <Block>
          <Text>Cryptocurrencies Ai, 2018 •</Text>
          <Text>Terms of Use</Text>
        </Block>

        <Block>
          {socialIcons.map((socio) => {
            return <SvgIcon src={socio.icon} width={30} height={30} />
          })}
        </Block>

        <Block>
          <Text>NIGHT MODE</Text>
          <Switch onClick={() => {}} />
        </Block>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #222529;
  padding: 25px 0;
`

const Block = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin: 0 8px;
  }
`

const Text = styled.span`
  opacity: 0.5;
  font-family: Roboto;
  font-size: 1.225em;
  font-weight: 500;
  text-align: left;
  color: #fff;
`
