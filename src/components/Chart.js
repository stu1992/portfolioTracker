
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Newsfeed from './Newsfeed';
import LandingPage from './LandingPage';
import React, { useEffect, useState} from 'react';
import ReactApexChart from "react-apexcharts";

const Chart = ({name, loggedIn, dailySecret}) => {

const [stocks, setStocks] = React.useState([
]);
const [dates, setDates] = React.useState([
]);
const [portfolio, setPortfolio] = React.useState([
]);

const [news, setNews] = React.useState([
]);

const basePortfolioURI = '/api/portfolio'
const newsURI = '/api/news'
var portfolioURI = basePortfolioURI

const fetchStocks = async() => {
  const res = await fetch (portfolioURI, {
    method: 'GET',
    credentials: "same-origin"
    });
  const data = await res.json()
  return data
}
// get news based on user tags which should come in body from user info
const fetchUserNews = async() => {
  const res = await fetch (newsURI, {
    method: 'GET',
    credentials: "same-origin"
    });
  const data = await res.json()
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
});
    setDates(dates);
    setPortfolio(JsonFromServer.portfolio)
  }
  getStocks()
}
// duplicate function to get news, this needs to move elsewhere but lets get a poc
function fetchNews(){
  const getNews = async () => {
    const JsonFromServer = await fetchUserNews()
    setNews(JsonFromServer)
  }
  getNews()
}

useEffect(() =>{
  fetchUser()
  fetchNews()
}, [])

const options = {
  series: stocks,
  chart: {
        type: 'area',
        backgroundColor: '#eceded'
    },
    title: {
        text: 'My asset portfolio'
    },
    subtitle: {
        text: name+'\'s investments'
    },
    xAxis: {
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
           return  Highcharts.dateFormat('%B-%d/%y', this.value);
         }
       },
        categories: dates,
        title: {
            enabled: false
        }
    },
    yAxis: {
        opposite: true,
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
      xDateFormat: '%d-%m-%Y',
        shared: true,
        split: false,
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
            },
            animation: {
                duration: 3000
            }
        }
    }
}

const newChart = {

    series: stocks,
    options: {
      theme: {
      palette: 'palette2',
      },

      tooltip: {
          enabled: true,
          enabledOnSeries: undefined,
          shared: true,
          followCursor: true,
          intersect: false,
          inverseOrder: false,
          custom: undefined,
          fillSeriesColor: false,
          theme: false,
          style: {
            fontSize: '10px',
            fontFamily: undefined
          },
          onDatasetHover: {
              highlightDataSeries: false,
          },
          marker: {
              show: true,
          },
          fixed: {
              enabled: false,
              position: 'topRight',
              offsetX: 0,
              offsetY: 0,
          }
      },

       yaxis: {
         show: true,
         opposite: true,

         labels: {
                  show: true,
                  align: 'right',
                  minWidth: 0,
                  maxWidth: 160,
                  style: {
                      colors: [],
                      fontSize: '14px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 400,
                      cssClass: 'apexcharts-yaxis-label',
       }
     }
   },

      chart: {
        type: 'area',
        height: 600,
        stacked: true,
        events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min))
          }
        },
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width : 0.5,
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 1.0,
          opacityTo: 1.0,
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'right'
      },
      xaxis: {
        type: 'datetime',
        categories: dates,
        labels: {
  format: 'dd/MMM',
}
      },
    }
}
return (
  <div style={{ paddingTop: '100px' }}>

<ReactApexChart  options={newChart.options} series={newChart.series} type="area" height={350} />
<LandingPage dailySecret={dailySecret}/>
</div>
  )
}
export default Chart
