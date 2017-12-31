import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { font, palette } from 'styled-theme'

const styles = css`
  font-family: ${font('primary')};
  text-decoration: none;
  font-weight: 500;
  color: ${palette({ grayscale: 0 }, 1)};
  &:hover {
    text-decoration: underline;
  }
`

const Anchor = styled.a`
  ${styles};
`

const Link = ({ ...props }) => {
  return <Anchor {...props} />
}

Link.propTypes = {
  palette: PropTypes.string,
}

Link.defaultProps = {
  palette: 'primary',
}

export default Link
