import CORRELATION_MOCKS from './corr_matrices_total.json'

export function optimizeMocks(): { rows: string[]; cols: any[][] } {
  const m = JSON.parse(CORRELATION_MOCKS['2018-04-24'])
  const o = Object.keys(m).map((key) => ({ [key]: m[key] }))
  const rows = o.map((a) => {
    const arr = Object.keys(a)

    return arr[0].slice(0, -7)
  })

  const cols = o.map((a) =>
    Object.keys(a).map((key) => {
      const s = a[key]

      return Object.keys(s).map((keyV) => s[keyV])
    })
  )

  return { rows, cols }
}

export function getColor(value: string): string {
  const n = Number(value)
  if (n >= 0.9) {
    return '#1B5E20'
  } else if (n >= 0.8 && n < 0.9) {
    return '#2E7D32'
  } else if (n >= 0.7 && n < 0.8) {
    return '#388E3C'
  } else if (n >= 0.6 && n < 0.7) {
    return '#43A047'
  } else if (n >= 0.5 && n < 0.6) {
    return '#4CAF50'
  } else if (n >= 0.4 && n < 0.5) {
    return '#66BB6A'
  } else if (n >= 0.3 && n < 0.4) {
    return '#81C784'
  } else if (n >= 0.2 && n < 0.3) {
    return '#A5D6A7'
  } else if (n >= 0.1 && n < 0.2) {
    return '#C8E6C9'
  } else if (n >= 0 && n < 0.1) {
    return '#E8F5E9'
  } else if (n >= -0.1 && n < 0) {
    return '#B9F6CA'
  } else if (n >= -0.2 && n < -0.1) {
    return '#FFEBEE'
  } else if (n >= -0.3 && n < -0.2) {
    return '#FFCDD2'
  } else if (n >= -0.4 && n < -0.3) {
    return '#EF9A9A'
  } else if (n >= -0.5 && n < -0.4) {
    return '#E57373'
  } else if (n >= -0.6 && n < -0.5) {
    return '#EF5350'
  } else if (n >= -0.7 && n < -0.6) {
    return '#F44336'
  } else if (n >= -0.8 && n < -0.7) {
    return '#E53935'
  } else if (n >= -0.9 && n < -0.8) {
    return '#D32F2F'
  } else if (n >= -1 && n < -0.9) {
    return '#C62828'
  }
}

export function getHeatMapData(
  data: { pair: string; values: { [key: string]: string }[] }[]
) {
  const result: { x: number; y: number }[] = []
  data.forEach((item, i) => {
    item.values.forEach((value, idx) => {
      result.push({
        x: i + 1,
        y: idx * 2,
        color: getColor(value.v),
      })
    })
  })

  return result
}
