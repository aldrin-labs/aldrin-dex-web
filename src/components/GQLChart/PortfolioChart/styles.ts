import styled from 'styled-components'

export const Chart = styled.div`
  width: 100%;
  min-height: 5em;
  height: ${(props: { height: string }) => props.height || '100%'};
`

export const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto 0 auto;
`

export const SProfileChart = styled.div`
  width: 100%;
  padding: 0 16px;
  border-radius: 3px;

  margin: 0 auto;
  /*  substract CArdHeader */
  height: calc(100% - 70px);

  display: flex;
  flex-direction: column;
`
