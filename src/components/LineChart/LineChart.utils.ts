export const getColorsAndLabelsForChartLegend = (arrayOfCharts: ILineChart[]) =>
  arrayOfCharts.reduce((legenDataArray, chart) => [...legenDataArray, {title: chart.title, color: chart.color}], [])

export const colors = ['#00C853', '#ceabff', '#0091EA', '#FF9833', '#EF5D28']
