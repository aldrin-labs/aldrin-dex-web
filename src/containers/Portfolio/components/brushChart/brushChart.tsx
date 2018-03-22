
import  React  from  'react';

import d3 from 'd3-time-format'
import {LineBrush} from 'react-d3-brush'

var parseDate = d3.timeFormat("%YM%m");

var width = 700,
  height = 300,
  margins = {left: 100, right: 100, top: 50, bottom: 50},
  title = "Taiwan refuse disposal - Multi line",
  // chart series,
  // field: is what field your data want to be selected
  // name: the name of the field that display in legend
  // color: what color is the line
  chartSeries = [
    {
      field: 'total',
      name: 'Total'
    },
    {
      field: 'incineration',
      name: 'Incineration'
    },
    {
      field: 'garbageBury',
      name: 'Garbage Bury',
      area: true
    }
  ],
  // your x accessor
  x = function(d) {
    return parseDate(d.month);
  },
  xScale = 'time',
  // your brush height
  brushHeight = 100;


export class BrushChart extends React.Component{
render(){
return <LineBrush
        title= {title}
        data= {[0,2,4,5,6,7,7]}
        width= {width}
        height= {height}
        margins= {margins}
        chartSeries= {chartSeries}
        x= {x}
        xScale= {xScale}
        brushHeight= {brushHeight}
        />
     

}
}