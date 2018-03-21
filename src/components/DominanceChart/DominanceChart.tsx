import * as React from 'react'
import styled from 'styled-components'
import { RadialChart, Hint } from 'react-vis'
import SvgIcon from '../../components/SvgIcon/SvgIcon'
import bubble from '../../icons/bubble.svg'
import mask from '../../icons/mask.svg'

const chartCoins = [
  { angle: 2, label: 'BCash', color: '#f9b057' },
  { angle: 6, label: 'Bitcoin', color: '#f9a626' },
  { angle: 2, label: 'NEO', color: '#0eb8e8' },
  { angle: 4, label: 'Ethereum', color: '#8c8c8c' },
  { angle: 2, label: 'Litecoin', color: '#a0a1a1' },
  { angle: 2, label: 'Stellar', color: '#86d301' },
  { angle: 3, label: 'Ripple', color: '#0099d4' },
  { angle: 2, label: 'Cardano', color: '#0c1e2c' },
  { angle: 2, label: 'Others', color: '#b6b8b8' },
]

interface HintT {
  label: string
}

interface Props {}

interface State {
  value: boolean | HintT
}

export default class DominanceChart extends React.Component<Props, State> {
  state: State = {
    value: false,
  }

  render() {
    const { value } = this.state

    return (
      <Container>
        <HeadingWrapper>
          <SvgIcon src={bubble} width={26} height={26} />
          <Heading>Coin Dominance %</Heading>
        </HeadingWrapper>

        <ChartWrapper>
          <RadialChart
            innerRadius={80}
            radius={128}
            colorType="literal"
            data={chartCoins}
            onValueMouseOver={(v: HintT) => this.setState({ value: v })}
            onSeriesMouseOut={() => this.setState({ value: false })}
            width={256}
            height={256}
          >
            {value &&
              typeof value === 'object' && (
                <Hint value={value} orientation="topleft">
                  <ChartTooltip>{value.label}</ChartTooltip>
                </Hint>
              )}
          </RadialChart>

          <SvgIcon
            src={mask}
            width={185}
            height={185}
            style={{ position: 'absolute', borderRadius: '50%' }}
          />

          <ChartInnerText>
            100%
            <br />
            <span style={{ fontSize: '20px' }}>All Cryptos</span>
          </ChartInnerText>
        </ChartWrapper>

        <ChartInfoContainer>
          {chartCoins.map(coin => {
            return (
              <ChartInfoBlock key={coin.label}>
                <ChartInfoCircle style={{ backgroundColor: coin.color }} />

                <ChartInfoDesc>{coin.label}</ChartInfoDesc>
              </ChartInfoBlock>
            )
          })}
        </ChartInfoContainer>
      </Container>
    )
  }
}

const ChartTooltip = styled.span`
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
`

const ChartInfoDesc = styled.span`
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
`

const ChartInfoCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
`

const ChartInfoBlock = styled.div`
  display: flex;
  width: 30%;
  justify-content: space-between;
  align-items: center;
`

const ChartInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 40px;

  & > * {
    margin-bottom: 8px;
  }
`

const ChartInnerText = styled.span`
  max-width: 100px;
  font-family: Roboto;
  font-size: 28px;
  text-align: center;
  color: #ffffff;
  position: absolute;
`

const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-top: 23px;
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
  margin-bottom: 5px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 380px;
  padding: 16px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  margin-top: 16px;
`
