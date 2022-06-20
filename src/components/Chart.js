
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import LandingPage from './LandingPage';
import React, { useEffect, useState} from 'react';
import Testimonial from './sections/Testimonial';
import Header from '../components/layout/HeaderLoggedIn';
const Chart = ({name, loggedIn, dailySecret, histSecret}) => {

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
      zoomType: 'x',
      backgroundColor: '#151719',
      height: 600
    },
	    rangeSelector: {
      buttons: [{
        text: '+',
        events: {
          click() {
            return false
          }
        }
      }, {
        text: '-',
        events: {
          click() {
            return false
          }
        }

      }]
    },
    title: {
        text: 'My asset portfolio',
	    style: { "color": "#ececec", "fontSize": "18px" }
    },
    subtitle: {
        text: name+'\'s investments',
	    style: { "color": "#ececec"}
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
      xDateFormat: '%d %B %Y',
      shared: true,
      split: false,
      pointFormat: '<b style="color: {series.color}">⬤</b><b>{series.name}: ${point.y}</b><br>',
      footerFormat: '<b>Worth: ${point.total} </b>',
    }
    ,
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#DDDDDD',
            lineWidth: 1,
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
function Mailto({ email, subject, body, ...props }) {
  return (
    <div style={{ paddingTop: '100px', fontSize: '35px', textAlign: "center"}}>
	  <a href={`mailto:${email}?subject=${subject || ""}&body=${body || ""}`}>
      {props.children}
    </a>
	  </div>
  );
}
return (
	<>
	<Header navPosition="right" className="reveal-from-bottom" />
	<main className="site-content">
	<div style={{ paddingTop: '100px' }}>
    <HighchartsReact
      containerProps={{ style: { height: "100%" } }}
    highcharts={Highcharts}
    options={options}
  />
<LandingPage dailySecret={dailySecret} histSecret={histSecret}/>
  <Mailto email="makingmymatesrich@gmail.com" subject="portfolio query" body="">
    Ask for help :)
  </Mailto>
<Testimonial topDivider NewsList={news} loggedIn={true}/>
</div>
</main>
	</>
  )
}

export default Chart
