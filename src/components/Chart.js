import { useState , useEffect } from 'react'
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Mission from './Mission';


const Chart = ({state}) => {

const [stocks, setStocks] = useState([
]);
const [dates, setDates] = useState([
]);
const [portfolio, setPortfolio] = useState([
]);

const basePortfolioURI = '/api/portfolio'
var portfolioURI = basePortfolioURI

const fetchStocks = async() => {
  const res = await fetch (portfolioURI, {
    method: 'GET',
    credentials: "same-origin"
    });
  const data = await res.json()
  console.log(data)
  return data
}

function fetchUser(){
  const getStocks = async () => {
    const JsonFromServer = await fetchStocks()
    setStocks(JsonFromServer.seriesdataset)
    var dateStrings = JsonFromServer.dates
    var dates = []
    dateStrings.forEach(function(entry) {
    dates.push(Date.parse(entry)+39600000);
    console.log(Date.parse(entry));
});
    setDates(dates);
    setPortfolio(JsonFromServer.portfolio)
  }
  getStocks()
}
useEffect(() =>{
  fetchUser()
}, [])

const options = {
  series: stocks,
  chart: {
        type: 'area'
    },
    title: {
        text: 'My asset portfolio'
    },
    subtitle: {
        text: state['name']+'\'s investments'
    },
    xAxis: {
      time: {

    },
      type: 'datetime',
       labels: {
         formatter: function() {
           const format = {
             second: '%Y-%m-%d',
             minute: '%Y-%m-%d',
             hour: '%Y-%m-%d',
             day: '%y%M-%d',
             week: '%Y%m-%d',
             month: '%Y-%m',
             year: '%Y'
           }[this.tickPositionInfo.unitName];
           return  Highcharts.dateFormat('%d-%m/%Y', this.value);
         }
       },
        categories: dates,
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: '$1000'
        },
        labels: {
          formatter: function () {
              return this.value / 1000;
          }
        }
    },
    tooltip: {
        split: true,
        valuePrefix: '$'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        },
        series: {
            marker: {
                enabled: false
            }
        }
    }
}
if(state['loggedin']){
return (
  <div style={{ padding: 10 }}>
  <HighchartsReact
    containerProps={{ style: { height: "100%" } }}
  highcharts={Highcharts}
  options={options}
/>
</div>
  )
}else {
  return(
    <Mission />
    )
}
}
export default Chart
