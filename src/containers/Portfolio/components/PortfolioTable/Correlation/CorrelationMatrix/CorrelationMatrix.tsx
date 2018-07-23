import React, { PureComponent } from 'react'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'
import { Button } from '@material-ui/core'
import FullScreenIcon from 'react-icons/lib/md/fullscreen'

import SelectTimeRange from '@components/SelectTimeRangeDropdown'
import Table from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrixTable/CorrelationMatrixTable'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrix/CorrelationMatrix.types'

class CorrelationMatrix extends PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    const {
      isFullscreenEnabled,
      data,
      fullScreenChangeHandler,
      setCorrelationPeriod,
      period,
    } = this.props

    console.log(setCorrelationPeriod)
    console.log(period)

    return (
      <ScrolledWrapper>
        <FullScreen
          onClose={() => {
            fullScreenChangeHandler(isFullscreenEnabled)
          }}
          style={{ height: '100%' }}
          enabled={isFullscreenEnabled}
        >
          <FullscreenNode
            style={{
              display: 'grid',
              gridTemplateColumns: '25% 1fr',
              gridTemplateRows: '100%',
              alignItems: 'center',
              // justifyItems: 'center',
            }}
            className="full-screenable-node"
          >
            <ButtonsWrapper>
              <StyledFullscreenButton
                color="primary"
                variant="outlined"
                onClick={() => {
                  this.props.fullScreenChangeHandler()
                }}
              >
                <FullScreenIcon />
              </StyledFullscreenButton>
              <SelectTimeRange
                style={{
                  height: 'auto',
                  maxWidth: '10rem',
                  marginTop: '2rem',
                }}
                setPeriodToStore={setCorrelationPeriod}
                period={period}
              />
            </ButtonsWrapper>
            <Table
              {...{
                isFullscreenEnabled,
                data,
              }}
            />
          </FullscreenNode>
        </FullScreen>
      </ScrolledWrapper>
    )
  }
}

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`

const StyledFullscreenButton = styled(Button)`
  z-index: 100;
  color: #fff;

  && {
    font-size: 2rem;
    margin: auto 1rem;
  }
`

const FullscreenNode = styled.div`
  height: 100%;
`

const ScrolledWrapper = styled.div`
  max-height: 70vh;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background-color: #393e44;
  margin: 0 auto;

  &::-webkit-scrollbar {
    width: 0.75rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

export default CorrelationMatrix
