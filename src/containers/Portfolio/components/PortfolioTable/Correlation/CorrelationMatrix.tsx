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
  hint: { index: number; value: number } | null
}

class CorrelationMatrix extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.onMouseOver = debounce(this.onMouseOver, 300)

    this.state = {
      hint: null,
    }
  }

  onMouseOver = (index: number, value: number) => {
    this.setState({ hint: { index, value } })
  }

  onClick = () => {}

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
          <div className="full-screenable-node">
            <Table style={tableStyle} onClick={this.onClick}>
              <thead>
                <Row>
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
                            onMouseOver={() => this.onMouseOver(indx, value)}
                            position={
                              !!hint &&
                              hint.index === indx &&
                              hint.value === value
                            }
                          >
                            {value}
                            {!!hint &&
                              hint.index === indx &&
                              hint.value === value && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    width: '100%',
                                    left: 0,
                                    top: 0,
                                    padding: '5px',
                                    backgroundColor: '#292d31',
                                    color: '#4ed8da',
                                  }}
                                >
                                  {hint.value}
                                </span>
                              )}
                          </Item>
                        )
                      })
                    )}
                  </Row>
                ))}
              </tbody>
            </Table>
          </div>
        </FullScreen>
      </React.Fragment>
    )
  }
}

const ToolTip = styled.span`
  display: none;
  opacity: 0;
  position: absolute;
  color: #dfdfdf;
  text-decoration: none;
  padding: 3px;
  margin-left: -3.5%;
  margin-top: -2%;
  background-color: #292d31;

  border-radius: 3px;
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

  &:hover ${ToolTip} {
    display: inline-block;
    opacity: 1;
  }
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

export default CorrelationMatrix
