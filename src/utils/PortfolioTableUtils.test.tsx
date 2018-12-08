import { formatNumberToUSFormat, roundAndFormatNumber } from './PortfolioTableUtils'

describe('Format number to US format function', () => {
  it('for number 1000', () => {
    expect(formatNumberToUSFormat(1000)).toBe('1,000')
  })
  it('for number 1 000 000.', () => {
    expect(formatNumberToUSFormat(1000000)).toBe('1,000,000')
  })
  it('for number 1 000 000 000', () => {
    expect(formatNumberToUSFormat(1000000000)).toBe('1,000,000,000')
  })
  it('for string 1000', () => {
    expect(formatNumberToUSFormat('1000')).toBe('1,000')
  })
  it('for string 1 000 000', () => {
    expect(formatNumberToUSFormat('1000000')).toBe('1,000,000')
  })
  it('for string 1 000 000 000', () => {
    expect(formatNumberToUSFormat('1000000000')).toBe('1,000,000,000')
  })
  it('for float number 1 000 000 000', () => {
    expect(formatNumberToUSFormat(1000000000.9321312)).toBe('1,000,000,000.9321312')
  })
  it('for float string-number 1 000.10', () => {
    expect(formatNumberToUSFormat('1000.10')).toBe('1,000.10')
  })
  it('for float minumum number 0.0321312313', () => {
    expect(formatNumberToUSFormat(0.0321312313)).toBe('0.0321312313')
  })
  it('for float number 2383.18734781', () => {
    expect(formatNumberToUSFormat(2383.18734781)).toBe('2,383.18734781')
  })
  it('for float string-number 123499.11', () => {
    expect(formatNumberToUSFormat('123499.11')).toBe('123,499.11')
  })
})



describe('roundAndFormatNumber number function', () => {
  it('only round 1000.99923313 to 2 digits after point', () => {
    expect(roundAndFormatNumber(1000.99923313, 2, false)).toBe('1001.00')
  })
  it('round and format 1000.99923313 to 2 digits after point', () => {
    expect(roundAndFormatNumber(1000.99923313, 2, true)).toBe('1,001.00')
  })
  it('round and format 1000.99923313 to 2 digits after point (default 3th argument)', () => {
    expect(roundAndFormatNumber(1000.99923313, 2)).toBe('1,001.00')
  })
  it('round 0 to 2 digits after point', () => {
    expect(roundAndFormatNumber(0, 2, false)).toBe('0')
  })
  it('round and format 0 to 2 digits after point', () => {
    expect(roundAndFormatNumber(0, 2, true)).toBe('0')
  })
  it('round and format null', () => {
    expect(roundAndFormatNumber(null, 2)).toBe('0')
  })
  it('round and format 1e-37 to 8 digits after point', () => {
    expect(roundAndFormatNumber(1e-37, 8)).toBe('0')
  })
  it('round and format 12e-8 to 8 digits after point', () => {
    expect(roundAndFormatNumber(12e-8, 8)).toBe('0.00000012')
  })
  it('round and format 12e-8 to 2 digits after point', () => {
    expect(roundAndFormatNumber(12e-8, 2)).toBe('0')
  })
  it('round and format 0.01923123123 to 2 digits after point', () => {
    expect(roundAndFormatNumber(0.01923123123, 2)).toBe('0.02')
  })
  it('only round 0.01923123123 to 8 digits after point', () => {
    expect(roundAndFormatNumber(0.019123456789, 8, false)).toBe('0.01912346')
  })
  it('only round 82736.9263547173 to 8 digits after point', () => {
    expect(roundAndFormatNumber(82736.9263547173, 8, false)).toBe('82736.92635472')
  })
  it('round and format 82736.9263547173 to 8 digits after point', () => {
    expect(roundAndFormatNumber(82736.9263547173, 8, true)).toBe('82,736.92635472')
  })
})
