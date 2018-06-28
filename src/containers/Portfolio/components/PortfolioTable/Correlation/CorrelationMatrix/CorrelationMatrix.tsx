import React, { PureComponent } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'

import Table from '../CorrelationMatrixTable/CorrelationMatrixTable'

export interface IProps {
  fullScreenChangeHandler: Function
  isFullscreenEnabled: boolean
}

export interface IHint {
  index: number
  value: number
  colName: string
  rowName: string
  x: number
  y: number
}

export interface IState {
  hint: IHint | null
  hintOpacity: number
  dragging: boolean
  clientX: number | null
  clientY: number | null
}

class CorrelationMatrix extends PureComponent<IProps, IState> {
  childNode!: HTMLElement | null

  constructor(props: IProps) {
    super(props)

    this.onMouseOver = debounce(this.onMouseOver, 300)
    this.onMouseLeave = debounce(this.onMouseLeave, 300)
    this.mouseMoveHandle = debounce(this.mouseMoveHandle, 50)

    this.state = {
      hint: null,
      hintOpacity: 0,
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

  onMouseOver = (
    index: number,
    value: number,
    colName: string,
    rowName: string,
    x: number,
    y: number
  ) => {
    this.setState({
      hint: { index, value, colName, rowName, x, y },
    })
  }

  onTableMouseOver = () => {
    this.setState({ hintOpacity: 1 })
  }

  onTableMouseLeave = () => {
    this.setState({
      hintOpacity: 0,
      hint: null,
    })
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

  onMouseLeave = () => {
    this.setState({ hintOpacity: 0, hint: null })
  }

  render() {
    const { hint } = this.state
    const { isFullscreenEnabled } = this.props
    const { onTableMouseLeave, onTableMouseOver, onMouseOver } = this

    return (
      <ScrolledWrapper
        innerRef={this.setChildNodeRef}
        onMouseUp={this.mouseUpHandle}
        onMouseDown={this.mouseDownHandle}
      >
        <FullScreen
          enabled={isFullscreenEnabled}
          onChange={() =>
            this.props.fullScreenChangeHandler(isFullscreenEnabled)
          }
        >
          <div className="full-screenable-node">
            <Table
              {...{
                isFullscreenEnabled,
                onTableMouseLeave,
                onTableMouseOver,
                onMouseOver,
              }}
            />
            {!!hint && (
              <Hint x={hint.x} y={hint.y} opacity={this.state.hintOpacity}>
                {`${hint.colName} - ${hint.rowName} `}
              </Hint>
            )}
          </div>
        </FullScreen>
      </ScrolledWrapper>
    )
  }
}

const ScrolledWrapper = styled.div`
  max-height: 70vh;

  overflow-y: scroll;
  background-color: #393e44;
  margin: 0 auto;
  margin-bottom: 3.125rem;

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

const Hint = styled.span`
  z-index: 1997;
  position: fixed;
  width: auto;
  opacity: ${(props) => props.opacity};
  left: ${(props) => props.x + 8}px;
  top: ${(props: { x: number; y: number; opacity: number }) => props.y + 8}px;
  padding: 5px;
  background-color: #292d31;
  color: #4ed8da;
  transition: all 0.2s linear;
`

export default CorrelationMatrix
