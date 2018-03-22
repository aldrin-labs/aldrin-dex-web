import React, { Fragment } from 'react'
import Drawer from 'material-ui/Drawer'
import styled, { css } from 'styled-components'
import { transitions } from 'polished'

import { PortfolioList } from './PortfolioList'

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
  margin-top: 104px;
  width: 240px;
`

export class PortfolioSelector extends React.Component {
  state = {
    open: true,
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
        <DrawerPaper
          variant="persistent"
          anchor="left"
          open={open}
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
