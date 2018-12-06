import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'

export const navBarHeight = 48

export const Nav = styled(AppBar)`
  z-index: 1;
  overflow: hidden;
  ${({ variant }: any) =>
    variant.background ? `background:${variant.background};` : ''} ${(
    props: any
  ) =>
    props.variant.hide
      ? `opacity: 0;
    position: absolute;
    z-index: -100;`
      : ''};
`

export const Logo = styled.img`
  z-index: 1;
  position: relative;
  margin: auto 0;
  height: 36px;
`
