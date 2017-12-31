import React from 'react'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import { Link, Paragraph } from '../../../components'

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
      Made with Love by <Link href="https://github.com/kultism">Kultism</Link>
    </Credits>
  </Wrapper>
)

export default Footer
