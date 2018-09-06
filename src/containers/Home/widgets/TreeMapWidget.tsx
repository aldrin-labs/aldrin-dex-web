import * as React from 'react'
import Widget from '@components/Widget'
import TreeMapChart from '@components/TreeMapChart/TreeMapChart'
import bubble from '@icons/bubble.svg'

export default class TreeMapWidget extends React.Component {
  render() {
    return (
      <Widget icon={bubble} heading="Coin Dominance TreeMap">
        <TreeMapChart />
      </Widget>
    )
  }
}
