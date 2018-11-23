import styled from 'styled-components'
import { Card } from '@material-ui/core'

export const Chart = styled.div`
  width: 100%;
  min-height: 5em;
  height: ${(props: { height: string }) => props.height || '100%'};
`

export const SProfileChart = styled(Card)`
  position: relative;
  height: 100%;
  width: 100%;
`
