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

export function getColor(
  value: string
): { backgroundColor: string; textColor: string } {
  const n = Number(value)
  if (n >= 0.9) {
    return { backgroundColor: '#1B5E20', textColor: 'white' }
  } else if (n >= 0.8 && n < 0.9) {
    return { backgroundColor: '#2E7D32', textColor: 'white' }
  } else if (n >= 0.7 && n < 0.8) {
    return { backgroundColor: '#388E3C', textColor: 'white' }
  } else if (n >= 0.6 && n < 0.7) {
    return { backgroundColor: '#43A047', textColor: 'white' }
  } else if (n >= 0.5 && n < 0.6) {
    return { backgroundColor: '#4CAF50', textColor: 'white' }
  } else if (n >= 0.4 && n < 0.5) {
    return { backgroundColor: '#66BB6A', textColor: 'white' }
  } else if (n >= 0.3 && n < 0.4) {
    return { backgroundColor: '#81C784', textColor: 'black' }
  } else if (n >= 0.2 && n < 0.3) {
    return { backgroundColor: '#A5D6A7', textColor: 'black' }
  } else if (n >= 0.1 && n < 0.2) {
    return { backgroundColor: '#C8E6C9', textColor: 'black' }
  } else if (n >= 0 && n < 0.1) {
    return { backgroundColor: '#E8F5E9', textColor: 'black' }
  } else if (n >= -0.1 && n < 0) {
    return { backgroundColor: '#B9F6CA', textColor: 'black' }
  } else if (n >= -0.2 && n < -0.1) {
    return { backgroundColor: '#FFEBEE', textColor: 'black' }
  } else if (n >= -0.3 && n < -0.2) {
    return { backgroundColor: '#FFCDD2', textColor: 'black' }
  } else if (n >= -0.4 && n < -0.3) {
    return { backgroundColor: '#EF9A9A', textColor: 'black' }
  } else if (n >= -0.5 && n < -0.4) {
    return { backgroundColor: '#E57373', textColor: 'black' }
  } else if (n >= -0.6 && n < -0.5) {
    return { backgroundColor: '#EF5350', textColor: 'black' }
  } else if (n >= -0.7 && n < -0.6) {
    return { backgroundColor: '#F44336', textColor: 'black' }
  } else if (n >= -0.8 && n < -0.7) {
    return { backgroundColor: '#E53935', textColor: 'black' }
  } else if (n >= -0.9 && n < -0.8) {
    return { backgroundColor: '#D32F2F', textColor: 'black' }
  } else if (n >= -1 && n < -0.9) {
    return { backgroundColor: '#C62828', textColor: 'black' }
  }
}

export function getTextColor(color: string) {
  if (color === '#C8E6C9' || color === '#E8F5E9') {
  }
  switch (color) {
    case '#C8E6C9':
      return 'black'
      break

    case '#E8F5E9':
      return 'black'
      break

    default:
      break
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
        color: getColor(value.v).backgroundColor,
      })
    })
  })

  return result
}
