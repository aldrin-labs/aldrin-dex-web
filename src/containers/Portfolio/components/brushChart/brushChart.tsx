
import  React  from  'react';


import d3 from 'd3-time-format'
import {LineBrush} from 'react-d3-brush';

var generalChartData = require('./data/user.json');


var chartSeries = [
    {
      field: 'age',
      name: 'Age',
      color: '#ff7f0e'
    }
  ],
  x = function(d) {
    return d.index;
  };

export class BrushChart extends React.Component{
render(){
return <LineBrush
        width= {600}
        height= {400}
        brushHeight= {100}
        data= {generalChartData}
        chartSeries= {chartSeries}
        x= {x}
        xLabel= {"test"}
        />
     

}
}