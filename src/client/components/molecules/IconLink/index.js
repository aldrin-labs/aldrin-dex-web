import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from 'components/atoms/Icon'
import Link from 'components/atoms/Link'

const fontSize = ({ height }) => (height ? `${height / 3 / 16}rem` : '0.75em')

const margin = ({ hasText, right }) => {
  if (hasText) {
    return right ? '0 0 0 0.25em' : '0 0.25em 0 0'
  }
  return 0
}

const StyledIcon = styled(Icon)`
  font-size: ${fontSize};
  margin: ${margin};
  @media screen and (max-width: 420px) {
    margin: ${({ responsive }) => responsive && 0};
  }
`

const Text = styled.span`
  @media screen and (max-width: 420px) {
    display: ${({ responsive }) => responsive && 'none'};
  }
`

const IconLink = ({
  height,
  icon,
  size,
  right,
  responsive,
  children,
  ...props
}) => {
  const iconElement = (
    <StyledIcon
      height={height}
      icon={icon}
      size={size}
      hasText={!!children}
      right={right}
      responsive={responsive}
      palette={props.palette}
      reverse={props.reverse}
    />
  )
  return (
    <Link {...props}>
      {right || iconElement}
      <Text responsive={responsive}>{children}</Text>
      {right && iconElement}
    </Link>
  )
}

IconLink.propTypes = {
  icon: PropTypes.string.isRequired,
  height: PropTypes.number,
  size: PropTypes.string,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
  responsive: PropTypes.bool,
  right: PropTypes.bool,
  children: PropTypes.node,
}

export default IconLink
