import React, { PureComponent } from 'react'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'

import SelectTimeRange from '@components/SelectTimeRangeDropdown'
import Table from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrixTable/CorrelationMatrixTable'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrix/CorrelationMatrix.types'

class CorrelationMatrix extends PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    const { isFullscreenEnabled, data, fullScreenChangeHandler } = this.props

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
            <SelectTimeRange
              style={{ height: 'auto', maxWidth: '10rem', margin: '0 auto' }}
              period="lastDay"
            />
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
