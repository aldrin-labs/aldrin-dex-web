export const getColorsAndLabelsForChartLegend = (arrayOfCharts: ILineChart[]) =>
  arrayOfCharts.reduce((legenDataArray, chart) => [...legenDataArray, {title: chart.title, color: chart.color}], [])

export const colors = ['#00C853', '#6200EA', '#0091EA']
