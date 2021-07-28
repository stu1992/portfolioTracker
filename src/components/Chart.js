import { useState , useEffect } from 'react'
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Mission from './Mission';
import Newsfeed from './Newsfeed';

const Chart = ({state}) => {

const [stocks, setStocks] = useState([
]);
const [dates, setDates] = useState([
]);
const [portfolio, setPortfolio] = useState([
]);

const [news, setNews] = useState([
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
           return  Highcharts.dateFormat('%B-%d/%y', this.value);
         }
       },
        categories: dates,
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
if(state['loggedin']){
return (
  <div style={{ padding: 10 }}>
    <HighchartsReact
      containerProps={{ style: { height: "100%" } }}
    highcharts={Highcharts}
    options={options}
  />
<Newsfeed NewsList={news}/>
</div>
  )
}else {
  return(
    <Mission />
    )
}
}
export default Chart
