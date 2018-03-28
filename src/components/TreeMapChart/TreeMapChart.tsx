import * as React from 'react'
import { Treemap } from 'react-vis'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import { myData } from './mocks'
import bubble from '../../icons/bubble.svg'
import menuIcon from '../../icons/menu.svg'

export default class TreeMapChart extends React.Component {
  state = {
    hoveredNode: false,
    treemapData: myData,
  }

  render() {
    const { hoveredNode } = this.state

    const dndStyles = { cursor: '-webkit-grab' }

    const treeProps = {
      animation: {
        damping: 9,
        stiffness: 300,
      },
      data: this.state.treemapData,
      onLeafMouseOver: (x) => this.setState({ hoveredNode: x }),
      onLeafMouseOut: () => this.setState({ hoveredNode: false }),
      height: 300,
      mode: 'binary',
      getLabel: (x) => x.title,
      width: 350,
      style: {
        border: 'thin solid #393e44',
        fontFamily: 'Roboto',
        fonWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.875)',
        backgroundColor: '#4ed8da',
      },
    }
    return (
      <Container>
        <HeadingWrapper>
          <div>
            <SvgIcon src={bubble} width={26} height={26} />
            <Heading>Coin Dominance TreeMap</Heading>
          </div>
          <span className="dnd" style={dndStyles}>
            <SvgIcon src={menuIcon} width={24} height={24} />
          </span>
        </HeadingWrapper>
        <ChartWrapper>
          <Treemap {...treeProps} />
        </ChartWrapper>
      </Container>
    )
  }
}

const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-top: 23px;
  padding-left: 49px;
`

const Heading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  text-align: left;
  color: #fff;
  margin-left: 8px;
`

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  margin-top: 16px;
`
