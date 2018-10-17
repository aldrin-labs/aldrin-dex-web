// palette from https://material.io/design/color/#tools-for-picking-colors
// color A700
import { colors } from '@components/LineChart/LineChart.utils'

export function randomInteger(min: number, max: number) {
  const rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}


export function genMocks(len: number, categories: string[]) {
  return categories.map((categorie, index) => {
    return [...Array(len)].map((_, i) => {
      const int = randomInteger(1 * i + index, 10 * i)
      return {
        x: i + 1,
        y: int,
        label: categorie,
      }
    })
  })
}


export function genAngleMocks(categories: string[]) {
  return categories.map((categorie, index) => {
    const int = randomInteger(1 + index, 10 + index)
    return {
      angle: int,
      label: categorie,
      color: colors[index],
    }
  })
}
