import * as React from 'react'
import styled from 'styled-components'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'

import github from '../../icons/github.svg'
import telegram from '../../icons/telegram.svg'
import twitter from '../../icons/twitter.svg'

const socialIcons = [
  // { icon: github, link: '' },
  { icon: telegram, link: 'https://t.me/CryptocurrenciesAi' },
  // { icon: twitter, link: '' },
]

export default class Footer extends React.Component {
  render() {
    return (
      <Container>
        <Block>
          <Text>Cryptocurrencies Ai, 2018 </Text>
          <Text>• </Text>
          <Link href="termsofuse">
            <Text> Terms of Use</Text>
          </Link>
          <Text>• </Text>
          <Link href="privacypolicy">
            <Text> Privacy Policy</Text>
          </Link>
        </Block>

        <Block>
          {socialIcons.map((socio) => (
            <LinkWithIcon key={socio.icon} href={socio.link}>
              <SvgIcon
                styledComponentsAdditionalStyle={
                  'opacity: 0.5; transition: all .5s linear; &:hover{opacity:1;}'
                }
                src={socio.icon}
                width={30}
                height={30}
              />
            </LinkWithIcon>
          ))}
        </Block>

        <Block>
          <Text>NIGHT MODE</Text>
          <Switch
            onClick={() => {
              console.log('soon...')
            }}
          />
        </Block>
      </Container>
    )
  }
}

const Link = styled.a`
  &:visited {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
`

const LinkWithIcon = Link.extend`
  margin: 0 1rem !important;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #2d3136;
  padding: 0.5rem 0;
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
