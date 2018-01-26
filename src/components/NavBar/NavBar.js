import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Emojify from 'react-emojione';
import { compose } from 'recompose';
import { Link } from 'react-router-dom'
import styled from 'styled-components'

// TODO: split
const StyledLink = styled(Link)`
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;

  &:hover { border-color: rgba(175, 47, 47, 0.1); }
  &.selected { border-color: rgba(175, 47, 47, 0.2); }
`;

const Nav = styled.div`
  width: '100%';
`

const StyledTypography = styled(Typography)`
  flex: 1;
`

const NavButton = ({ link, title }) => <Button color="inherit">
  <StyledLink to={link}>{title}</StyledLink>
</Button>



const NavBar = props => {
  const { classes } = props;
  return (
    <Nav>
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton> */}
        <StyledTypography type="title" color="inherit">
          Cryptocurrencies AI
        </StyledTypography>
        <NavButton link={'/coinmarketcap'} title='Coin Market Cap' />
        <NavButton link={'/profile'} title='Profile' />
        <NavButton link={'/portfolio'} title='Portfolio' />
        <NavButton link={'/screener'} title='Screener' />
        <NavButton link={'/charts'} title='Charts' />
        <NavButton link={'/login'} title='Login' />
      </Toolbar>
    </AppBar>
  </Nav>
  )
}

export default compose(
)(NavBar);
