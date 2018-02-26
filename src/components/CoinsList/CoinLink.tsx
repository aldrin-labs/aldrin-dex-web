import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const SCoinLink = styled(Link)`
  color: inherit;
  margin: 3px;
  padding: 0px;
  text-decoration: none;

  &.selected {
    border-color: rgba(66, 66, 66, 0.2);
  }

  &:hover {
    color: palevioletred;
  }
`

export const CoinLink = ({ assetId, name, children }) => (
  <SCoinLink to={{
    pathname: `/asset/${name}`,
    state: { assetId }
  }}>
    {name}
  </SCoinLink>
)

