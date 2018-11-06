import { LinearProgress, Card } from '@material-ui/core'
import styled from 'styled-components'
import { PTWrapper as PTWrapperRaw } from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import { customAquaScrollBar } from '@styles/cssUtils'
import CardHeader from '@components/CardHeader';

export { Loader, ChartsContainer, Chart, MainArea, MainAreaUpperPart, PTWrapper, Content, ChartContainer }


const Loader = styled(LinearProgress)`
  margin-bottom: 0.5rem;
`

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`
const Chart = styled.div`
  padding: 0.5rem;
  flex-grow: 1;
  min-width: 0;
  height: 300px;
  border-radius: 1rem;
  background: ${(props: { background: string }) => props.background};

  @media (max-width: 1080px) {
    width: 100%;
    flex-basis: 100%;
  }
`

const MainAreaUpperPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const MainArea = styled.div`
  margin: 2rem;
  color: white;
  border-radius: 3px;
  flex-direction: column;
`

const PTWrapper = styled.div`
  overflow-y: auto;
  overflow: auto;
  ${(props: { notScrollable: boolean }) =>
  props.notScrollable ? 'overflow:hidden;' : ''};
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  position: relative;
  height: calc(100vh - 48px);
  background: ${(props: {background: string}) => props.background};

  ${customAquaScrollBar};
`

export const StyledCardHeader = styled(CardHeader)`
  margin-bottom: 15px;
`

export const ContentInner = styled.div`
  ${(props: { loading: boolean }) =>
  props.loading ? `
  filter: blur(10px);
  user-select: none;
  pointer-events: none;
  ` : ``};
`

const Content = styled.div`
  flex: 0 0 auto;
`

const ChartContainer = styled(Card)`
    width: 49%;
`

export const LoaderWrapper = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    & > div {
      z-index: 1;
    }
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const LoadingText = styled.p`

`
