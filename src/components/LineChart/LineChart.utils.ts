export const getColorsAndLabelsForChartLegend = (arrayOfCharts: ILineChart[]) =>
  arrayOfCharts.reduce((legenDataArray, chart) => [...legenDataArray, {title: chart.title, color: chart.color}], [])

export const colors = ['#6200EA', '#00C853', '#0091EA']
