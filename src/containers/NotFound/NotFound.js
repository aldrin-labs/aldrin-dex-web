import React from 'react'
import styled from 'styled-components'
import NavBar from 'components/NavBar'
import Typography from 'material-ui/Typography'

const NotFoundText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 800px;
`

const NotFound = () => (
  <div>
    <NavBar />
    <NotFoundText>
      <Typography type="display3">🚧 Under construction 🚧</Typography>
    </NotFoundText>
  </div>
)

export default NotFound
