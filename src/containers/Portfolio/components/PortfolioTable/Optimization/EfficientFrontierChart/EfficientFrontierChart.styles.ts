import styled from 'styled-components'


export { Container, ChartTooltip }

const Container = styled.div`
  height: 300px;
  width: 100%;
`

const ChartTooltip = styled.span`
  white-space: nowrap;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
`
