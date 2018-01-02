import React from 'react'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import Icon from 'components/atoms/Icon'
import Link from 'components/atoms/Link'
import Paragraph from 'components/atoms/Paragraph'

const Wrapper = styled.div`
  background-color: ${palette('grayscale', 1, true)};
  padding: 2rem;
`

const Credits = styled(Paragraph)`
  vertical-align: center;
  text-align: center;
  margin: 0;
`

const Footer = props => (
  <Wrapper {...props}>
    <Credits>
      Made with <Icon icon="heart" /> by{' '}
      <Link href="https://localhost:3000">CC.ai</Link>
    </Credits>
  </Wrapper>
)

export default Footer
