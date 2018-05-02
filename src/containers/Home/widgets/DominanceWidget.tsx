import * as React from 'react'
import Widget from '@components/Widget'
import DominanceChart from '@components/DominanceChart/DominanceChart'
import bubble from '@icons/bubble.svg'

export default class DominanceWidget extends React.Component {
  render() {
    return (
      <Widget icon={bubble} heading="Coin Dominance %">
        <DominanceChart />
      </Widget>
    )
  }
}
