import React, { Fragment } from 'react'
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

import { connect } from 'react-redux'
import { compose } from 'recompose'
import styled, { css } from 'styled-components'
import { transitions } from 'polished'

import { PortfolioList } from './PortfolioList'
import graphql from 'graphql-anywhere';

const drawerWidth = '240px'

const DrawerPaper = styled(Drawer)`
  width: -${drawerWidth};
  position: relative;
  ${props =>
    props.open &&
    css`
    ${transitions('width 0.2s ease-out')}
    width: ${drawerWidth};
  `};
`

const InnerPaper = styled.div`
  margin-top: 88px;
  width: 240px;
`

class WalletsDrawer extends React.Component {
  state = {
    open: false,
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { open } = this.state

    return (
      <Fragment>
        {console.log(1111, this.props)}
        <DrawerPaper
          variant="persistent"
          anchor="left"
          open={true}
          PaperProps={{
            component: InnerPaper,
          }}
        >
          <PortfolioList />
        </DrawerPaper>
      </Fragment>
    )
  }
}

// const mapStateToProps = (state) => ({
//   ui: state.ui
// })

// const mapDispatchToProps = (dispatch) => ({
//   toggleDrawer: () => dispatch(actions.toggleDrawer)
// })

export const PortfolioSelector = WalletsDrawer
// connect(mapStateToProps, mapDispatchToProps),
