import { removeEditableModeInCoins } from './PortfolioRebalanceUtils'

// Function that remove edit prop in our rows of Coins on Rebalance tab.
// This function used to define, should I delete row or just sell all values in the row

const rowExample = {
  exchange: 'Exchange',
  symbol: 'Coin',
  portfolioPerc: 0.0,
  deltaPrice: 0,
  price: 0,
}

const rows = Array(3).fill(rowExample)
const rowsEditable = Array(3).fill({...rowExample, editable: true})

describe('Function removeEditableModeInCoins', () => {
  it('is array passed as a result', () => {
    expect(removeEditableModeInCoins(rows)).toBeInstanceOf(Array)
  })
  it('is object in array has right IRow type properties', () => {
    expect(removeEditableModeInCoins(rows)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exchange: expect.any(String),
          symbol: expect.any(String),
          portfolioPerc: expect.any(Number),
          deltaPrice: expect.any(Number),
          price: expect.any(Number),
        }),
      ]))
  })
  it('is object in array has right IRow type properties in editable', () => {
    expect(removeEditableModeInCoins(rowsEditable)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exchange: expect.any(String),
          symbol: expect.any(String),
          portfolioPerc: expect.any(Number),
          deltaPrice: expect.any(Number),
          price: expect.any(Number),
          editable: expect.any(Boolean),
        }),
      ]))
  })
  it('when we have row without editable prop', () => {
    expect(removeEditableModeInCoins(rows)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          editable: false,
        }),
      ]))
  })
  it('when we have editable row', () => {
    expect(removeEditableModeInCoins(rowsEditable)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          editable: false,
        }),
      ]))
  })
})
