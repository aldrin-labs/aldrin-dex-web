import React from 'react'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'

import styled, { css } from 'styled-components'
import { transitions } from 'polished'

const drawerWidth = '240px'

const Root = styled.div`
  flex-grow: 1;
`

const AppFrame = styled.div`
  height: 430;
  z-index: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  width: 100%;
`

const AppbarContainer = styled(AppBar)`
  position: absolute;
  ${transitions('margin 0.2s ease-out', 'width 0.2s ease-out')} ${props =>
    props.open &&
    css`
      width: calc(100% - ${drawerWidth});
      ${transitions('margin 0.2s ease-out', 'width 0.2s ease-out')}
      margin-left: ${drawerWidth};
    `};
`

const Content = styled.div`
  flex-grow: 1;
  padding: 8px;
  ${transitions('margin 0.2s ease-in')};
  margin-left: -${drawerWidth};

  ${props =>
    props.open &&
    css`
      ${transitions('margin 0.2s ease-out')};
      margin-left: 0px;
    `};
`

const DrawerPaper = styled(Drawer)`
  position: relative;
  width: ${drawerWidth};
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
`

class PersistentDrawer extends React.Component {
  state = {
    open: false
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  render() {
    const {open} = this.state
    return (
      <Root>
      Test
      </Root>
    )
  }
}

export default PersistentDrawer
