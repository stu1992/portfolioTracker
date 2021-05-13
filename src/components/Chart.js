import { useState , useEffect } from 'react'
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const Chart = () => {

const [stocks, setStocks] = useState([
]);
const [dates, setDates] = useState([
]);
const [portfolio, setPortfolio] = useState([
]);

const basePortfolioURI = 'http://localhost:7000/Portfolio/Stu'
var portfolioURI = basePortfolioURI

const fetchStocks = async() => {
  const res = await fetch (portfolioURI)
  const data = await res.json()
  console.log(data)
  return data
}

function fetchUser(){
  const getStocks = async () => {
    const JsonFromServer = await fetchStocks()
    setStocks(JsonFromServer.seriesdataset)
    setDates(JsonFromServer.dates)
    setPortfolio(JsonFromServer.portfolio)
  }
  getStocks()
}
useEffect(() =>{fetchUser()}, [])

const options = {
  series: stocks
  ,
  chart: {
        type: 'area'
    },
    title: {
        text: 'My asset portfolio'
    },
    subtitle: {
        text: 'Stu\'s investments'
    },
    xAxis: {
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

return (
  <HighchartsReact
  highcharts={Highcharts}
  options={options}
/>
  )
}
export default Chart
