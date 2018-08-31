import React, { SFC } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

// const StyledNavLink = styled(NavLink)`
//   width: 120px;
//   text-decoration: none;
//   font-family: Roboto, sans-serif;
//   font-size: 14px;
//   font-weight: 500;
//   font-style: normal;
//   font-stretch: normal;
//   line-height: normal;
//   letter-spacing: 0.5px;
//   text-align: center;
//   text-transform: uppercase;
//   color: rgba(255, 255, 255, 0.7);
//   transition: color 0.2s ease;
//   height: 75px;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   &:hover {
//     color: white;
//     border-bottom: 2px solid #4ed8da;
//   }

//   &.selected {
//     color: white;
//     font-weight: bold;
//     border-bottom: 2px solid #4ed8da;
//   }
// `

interface INavButton {
  link: string
  title: string
  active: boolean
}

const NavEl = styled(Button)`
  position: relative;

  && {
    color: white;
    height: 100%;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    width: ${(props: { active: boolean }) => (props.active ? '100%' : 0)};
    height: 3px;
    background: black;
    transition: all 0.75s ease-in;
  }
`

export const NavButton: SFC<INavButton> = ({ link, title, active }) => {
  const MyLink = (props: any) => <Link to={link} {...props} />
  return (
    <NavEl active={active} component={MyLink}>
      {title}
    </NavEl>
  )
}

// export const NavButton: SFC<INavButton> = ({ link, title, ...props }) => (
//   <StyledNavLink to={link} activeClassName={'selected'} {...props}>
//     {title}
//   </StyledNavLink>
// )
