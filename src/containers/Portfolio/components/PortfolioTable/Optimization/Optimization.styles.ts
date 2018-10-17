import { LinearProgress } from '@material-ui/core'
import styled from 'styled-components'
import { PTWrapper as PTWrapperRaw } from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import { customAquaScrollBar } from '@styles/cssUtils'

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
  //margin: 1rem;
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
  //box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  flex-direction: column;
//<<<<<<< HEAD
//=======
//>>>>>>> develop
//  height: auto;
//  display: flex;
  //margin: 2rem;
`

// <<<<<<< HEAD
const PTWrapper = styled.div`
  //min-height: 100%;
  overflow-y: auto;
  overflow: auto;
  ${(props: { notScrollable: boolean }) =>
  props.notScrollable ? 'overflow:hidden;' : ''};
  width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  //box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  background: ${(props: {background: string}) => props.background};

  ${customAquaScrollBar};
  

`

export const ContentInner = styled.div`
  ${(props: { loading: boolean }) =>
  props.loading ? `
  filter: blur(10px);
  user-select: none;
  pointer-events: none;
  ` : ``};
  
`

// export const PTWrapper = styled(PTWrapperRaw)`
//   ${(props: { notScrollable: boolean }) =>
//     props.notScrollable ? 'overflow:hidden;' : ''} width: calc(100% - 2rem);
// `

const Content = styled.div`
  flex: 0 0 auto;
`

const ChartContainer = styled.div`
    //&:first-child {
    //    margin-left: 2rem;
    //}
    //
    //margin-right: 2rem;
    width: 49%;
    //margin: 0 0 0 2.5rem;
    padding: 15px;
    box-shadow: 0 2px 6px 0 #00000066;
    background: ${(props: {background: string}) => props.background};
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
