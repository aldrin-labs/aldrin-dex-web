import * as React from 'react'
import styled from 'styled-components'
import withTheme from '@material-ui/core/styles/withTheme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Telegram from '@material-ui/icons/NearMeSharp'

import { changeThemeMode } from '@containers/App/actions'
import Props from './index.types'
import { AppBar, IconButton } from '@material-ui/core'
import { MASTER_BUILD } from '@utils/config'

const Footer = ({
  changeModeTheme,
  themeMode,
  hide,
  theme: {
    palette: { secondary },
  },
}: Props) => (
  <Container position="static" color="default" hide={hide}>
    <Block>
      <Typography variant="caption" color="default">
        Cryptocurrencies Ai, 2018{' '}
      </Typography>
      <Typography variant="h6" color="secondary">
        •
      </Typography>
      {/* you can see it only in develop for now */}
      {!MASTER_BUILD && (
        <>
          <Button size="small" color="default">
            Terms of Use
          </Button>
          <Typography variant="h6" color="secondary">
            •
          </Typography>
          <Button size="small" color="default">
            Privacy Policy
          </Button>
        </>
      )}
    </Block>

    <Block>
      <IconButton href={'https://t.me/CryptocurrenciesAi'}>
        <Telegram color="secondary" width={32} height={32} />
      </IconButton>
    </Block>

    <Block>
      <Typography variant="body1" color="textPrimary">
        NIGHT MODE
      </Typography>
      <Switch
        checked={themeMode === 'dark'}
        onChange={() => {
          changeModeTheme()
        }}
        value="theme"
        color="default"
      />
    </Block>
  </Container>
)

const Link = styled.a`
  &:visited {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
`

const Container = styled(AppBar)`
  flex-wrap: nowrap;
  justify-content: space-around;
  transition: background 0.25s ease-in-out;
  ${(props: { hide: boolean }) =>
    props.hide
      ? `opacity: 0;
    position: absolute;
    top: 0;
    z-index: -100;`
      : ''};

  && {
    flex-direction: row;
  }
`

const Block = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin: 0 8px;
  }
`

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
})

const mapDispatchToProps = (dispatch: any) => ({
  changeModeTheme: () => dispatch(changeThemeMode()),
})

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Footer)
