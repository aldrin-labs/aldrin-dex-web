import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'
import { onFloorN } from '../../../../../utils/PortfolioTableUtils'
import {
  getColor,
  optimizeMocks,
} from '../../../../../utils/PortfolioCorrelationUtils'

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

class CorrelationMatrix extends Component<IProps, IState> {
  childNode!: HTMLElement | null

  constructor(props: IProps) {
    super(props)

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

  mouseUpHandle = () => {
    this.setState({ dragging: true })
  }

  mouseDownHandle = (e: any) => {
    this.setState(
      {
        dragging: false,
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
      hintOpacity: 1,
    })
  }

  onMouseLeave = () => {
    this.setState({ hintOpacity: 0, hint: null })
  }

  setChildNodeRef = (ref: HTMLElement | null) => {
    this.childNode = ref
  }

  render() {
    const { hint } = this.state
    const { isFullscreenEnabled } = this.props
    const tableStyle = isFullscreenEnabled
      ? { width: '100vw', height: '100vh' }
      : {}

    const { cols, rows } = optimizeMocks()

    return (
      <ScrolledWrapper
        innerRef={this.setChildNodeRef}
        onMouseUp={this.mouseUpHandle}
        onMouseDown={this.mouseDownHandle}
      >
        <FullScreen
          enabled={isFullscreenEnabled}
          onChange={(isFSEnabled: any) =>
            this.props.fullScreenChangeHandler(isFullscreenEnabled)
          }
        >
          <div
            className="full-screenable-node"
            onMouseLeave={this.onMouseLeave}
          >
            <Table style={tableStyle}>
              <thead>
                <Row
                  style={{
                    position: isFullscreenEnabled ? 'fixed' : 'sticky',
                  }}
                >
                  <HeadItem
                    style={{
                      width: '4em',
                      position: isFullscreenEnabled ? 'static' : 'sticky',
                      left: 0,
                      backgroundColor: '#393e44',
                    }}
                  />
                  {rows.map((row) => <HeadItem key={row}>{row}</HeadItem>)}
                </Row>
              </thead>
              <tbody>
                {cols.map((col, i) => (
                  <Row key={rows[i]}>
                    {rows[i] && (
                      <Item
                        style={{
                          color: '#fff',
                          textAlign: 'right',
                          border: 'none',
                          position: isFullscreenEnabled ? 'static' : 'sticky',
                          left: 0,
                          backgroundColor: '#393e44',
                        }}
                      >
                        {rows[i]}
                      </Item>
                    )}
                    {col.map((el) =>
                      el.map((e: string, indx: number) => {
                        const value = onFloorN(Number(e), 2)
                        const { backgroundColor, textColor } = getColor(e)

                        return (
                          <Item
                            key={e}
                            textColor={textColor}
                            color={backgroundColor}
                            onMouseOver={(event) =>
                              this.onMouseOver(
                                indx,
                                value,
                                rows[i],
                                rows[indx],
                                event.nativeEvent.clientX,
                                event.nativeEvent.clientY
                              )
                            }
                            onMouseLeave={() => this.onMouseLeave()}
                          >
                            {value}
                          </Item>
                        )
                      })
                    )}
                  </Row>
                ))}
              </tbody>
            </Table>
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

const HeadItem = styled.th`
  font-family: Roboto;
  font-size: 0.75em;
  color: #fff;
  font-weight: 500;
  padding: 0.5em;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: sticky;
  background-color: #393e44;
  top: 0;
  user-select: none;
`

const Row = styled.tr``

const Item = styled.td`
  background-color: ${(props: { color?: string }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};

  position: ${(props) => (props.position ? 'relative' : 'static')};

  font-family: Roboto;
  font-size: 0.75em;
  color: ${(props) => props.textColor};
  font-weight: 500;
  padding: 0.5em;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #fff;

  cursor: help;
  user-select: none;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

export default CorrelationMatrix
