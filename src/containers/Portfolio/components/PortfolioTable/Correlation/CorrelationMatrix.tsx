import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import FullScreen from 'react-fullscreen-crossbrowser'
import { onFloorN } from '../../../../../utils/PortfolioTableUtils'
import {
  getColor,
  optimizeMocks,
} from '../../../../../utils/PortfolioCorrelationUtils'

export interface Props {
  fullScreenChangeHandler: Function
  isFullscreenEnabled: boolean
}

export interface State {
  hint: {
    index: number
    value: number
    colName: string
    rowName: string
    x: number
    y: number
  } | null
  hintOpacity: number
}

class CorrelationMatrix extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.onMouseOver = debounce(this.onMouseOver, 300)

    this.state = {
      hint: null,
      hintOpacity: 0,
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
    this.setState({ hintOpacity: 0 })
  }

  render() {
    const { hint } = this.state
    const tableStyle = this.props.isFullscreenEnabled
      ? { width: '100vw', height: '100vh' }
      : {}

    const { cols, rows } = optimizeMocks()

    return (
      <React.Fragment>
        <FullScreen
          enabled={this.props.isFullscreenEnabled}
          onChange={(isFullscreenEnabled: any) =>
            this.props.fullScreenChangeHandler(isFullscreenEnabled)
          }
        >
          <div
            className="full-screenable-node"
            onMouseLeave={() => {
              this.onMouseLeave()
              console.log('leaved')
            }}
          >
            <Table style={tableStyle}>
              <thead>
                <Row
                  style={{
                    position: this.props.isFullscreenEnabled
                      ? 'fixed'
                      : 'sticky',
                  }}
                >
                  <HeadItem
                    style={{
                      width: '4em',
                      position: this.props.isFullscreenEnabled
                        ? 'static'
                        : 'sticky',
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
                          position: this.props.isFullscreenEnabled
                            ? 'static'
                            : 'sticky',
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
                            onMouseOver={(event) => {
                              return this.onMouseOver(
                                indx,
                                value,
                                rows[i],
                                rows[indx],
                                event.nativeEvent.clientX,
                                event.nativeEvent.clientY
                              )
                            }}
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
      </React.Fragment>
    )
  }
}

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
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

export default CorrelationMatrix
