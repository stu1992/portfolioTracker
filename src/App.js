import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import Stocks from './components/Stocks'
import Chart from './components/Chart'
import LandingPage from './components/LandingPage'
import { useState , useEffect } from 'react'
import { render } from 'react-dom'

function App() {

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

  const basePortfolioURI = 'http://localhost:7000/Portfolio/'
  var portfolioURI = basePortfolioURI

  const fetchStocks = async() => {
    const res = await fetch (portfolioURI)
    const data = await res.json()
    console.log(data)
    return data
  }

  const [stocks, setStocks] = useState([
]);

const [dates, setDates] = useState([
]);

const [portfolio, setPortfolio] = useState([
]);

  function StuPortfolio(){
    portfolioURI = basePortfolioURI+'Stu'
    fetchUser()
  }

  function KianasPortfolio(){
    portfolioURI = basePortfolioURI+'Kiana'
    fetchUser()
  }

const search = window.location.search;
const params = new URLSearchParams(search);
const user = params.get('user');

if (user != null){
  portfolioURI = basePortfolioURI+user;
  return (
    <div className="App">
            <Chart stocks={stocks} dates={dates}/>
              <Stocks stocks={stocks} portfolio={portfolio} />
    </div>
  );
}else{
  return (
    <div className="App">
      <ul>
  <li>Want to be rich</li>
  <li>Invest. Dont speculate</li>
  <li>Gamify</li>
  <li>The system isn't rigged, your psychology is</li>
</ul>

      <LandingPage />
    </div>
  );
}
}

export default App;
