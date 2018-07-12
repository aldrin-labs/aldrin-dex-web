import React, { PureComponent } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'

import Table from '../CorrelationMatrixTable/CorrelationMatrixTable'

export interface IProps {
  fullScreenChangeHandler: Function
  isFullscreenEnabled: boolean
}

export interface IState {
  dragging: boolean
  clientX: number | null
  clientY: number | null
}

class CorrelationMatrix extends PureComponent<IProps, IState> {
  childNode!: HTMLElement | null

  constructor(props: IProps) {
    super(props)

    this.state = {
      dragging: false,
      clientX: null,
      clientY: null,
    }
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.mouseUpHandle)
    window.addEventListener('mousemove', this.mouseMoveHandle)
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.mouseUpHandle)
    window.removeEventListener('mousemove', this.mouseMoveHandle)
  }

  mouseUpHandle = () => {
    this.setState({ dragging: false })
  }

  mouseDownHandle = (e: any) => {
    this.setState(
      {
        dragging: true,
        clientX: e.clientX,
        clientY: e.clientY,
      },
      () => {
        e.preventDefault()
      }
    )
  }

  mouseMoveHandle = (e: any) => {
    const { dragging, clientX, clientY } = this.state
    if (!dragging) return
    if (dragging && clientX && clientY && this.childNode) {
      this.childNode.scrollLeft += -clientX + e.clientX
      this.childNode.scrollTop += -clientY + e.clientY
    }
  }

  render() {
    const { isFullscreenEnabled, data } = this.props

    return (
      <ScrolledWrapper
        innerRef={this.setChildNodeRef}
        onMouseUp={this.mouseUpHandle}
        onMouseDown={this.mouseDownHandle}
      >
        <FullScreen
          onClose={() => {
            this.props.fullScreenChangeHandler(isFullscreenEnabled)
          }}
          style={{ height: '100%' }}
          enabled={isFullscreenEnabled}
        >
          <FullscreenNode
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gridTemplateRows: '100%',
              alignItems: 'center',
              justifyItems: 'center',
            }}
            className="full-screenable-node"
          >
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
