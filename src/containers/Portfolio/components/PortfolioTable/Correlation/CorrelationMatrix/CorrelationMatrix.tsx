import React, { PureComponent } from 'react'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'
import { Button, Card, CardContent, Typography } from '@material-ui/core'
import FullScreenIcon from 'react-icons/lib/md/fullscreen'

import { customAquaScrollBar } from '@styles/cssUtils'
import SelectTimeRange from '@components/SelectTimeRangeDropdown'
import Table from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrixTable/CorrelationMatrixTable'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrix/CorrelationMatrix.types'

class CorrelationMatrix extends PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  renderPlaceholder = () => (
    <>
      <StyledCard>
        <CardContent>
          <Typography gutterBottom align="center" variant="display3">
            🤔
          </Typography>
          <Typography color="secondary" variant="headline">
            Empty Response...
          </Typography>
        </CardContent>
      </StyledCard>
    </>
  )

  render() {
    const {
      isFullscreenEnabled,
      data,
      fullScreenChangeHandler,
      setCorrelationPeriod,
      period,
    } = this.props
    console.log(period);
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
            style={
              data
                ? {
                    display: 'grid',
                    gridTemplateColumns: isFullscreenEnabled
                      ? '1fr'
                      : data.values.length < 10
                        ? '20% 1fr 28%'
                        : '30% 1fr 29%',
                    gridTemplateRows: '100%',
                    alignItems: 'center',
                    background: '#393e44',
                    // justifyItems: 'center',
                  }
                : {
                    display: 'grid',
                    gridTemplateColumns: '20% 1fr 20%',
                    gridTemplateRows: '100%',
                    alignItems: 'center',
                    background: '#393e44',
                  }
            }
            className="full-screenable-node"
          >
            {isFullscreenEnabled ? null : (
              <ButtonsWrapper>
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
            )}

            {data ? (
              <Table
                {...{
                  isFullscreenEnabled,
                  data,
                }}
              />
            ) : (
              this.renderPlaceholder()
            )}
            {isFullscreenEnabled ? null : (
              <StyledFullscreenButton
                color="primary"
                variant="outlined"
                onClick={() => {
                  this.props.fullScreenChangeHandler()
                }}
              >
                <FullScreenIcon />
              </StyledFullscreenButton>
            )}
          </FullscreenNode>
        </FullScreen>
      </ScrolledWrapper>
    )
  }
}

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFullscreenButton = styled(Button)`
  z-index: 100;
  color: #fff;
  width: 25%;

  && {
    font-size: 2rem;
    margin: 0 auto;
  }
`

const FullscreenNode = styled.div`
  height: 100%;
`

const StyledCard = styled(Card)`
  && {
    margin: auto;
    background: #292d31;
  }
`

const ScrolledWrapper = styled.div`
  max-height: 70vh;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background-color: #393e44;
  margin: 0 auto;

  ${customAquaScrollBar};
`

export default CorrelationMatrix
