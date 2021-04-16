import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import Stocks from './components/Stocks'
import Chart from './components/Chart'
import { useState , useEffect } from 'react'

import { render } from 'react-dom'


function App() {

  useEffect(() =>{
    const getStocks = async () => {
      const StocksFromServer = await fetchStocks()
      setStocks(StocksFromServer)
    }
    const getDates = async () => {
      const DatesFromServer = await fetchDates()
      setDates(DatesFromServer)
    }
    const getPortfolio = async () => {
      const portfolioFromServer = await fetchPortfolio()
      setPortfolio(portfolioFromServer)
    }
    getStocks()
    getDates()
    getPortfolio()
  }, [])

  const fetchStocks = async() => {
    const res = await fetch ('http://localhost:3000/seriesdataset')
    const data = await res.json()
    return data
  }

  const fetchDates = async() => {
    const res = await fetch ('http://localhost:3000/dates')
    const data = await res.json()
    return data
  }

  const fetchPortfolio = async() => {
    const res = await fetch ('http://localhost:3000/portfolio')
    const data = await res.json()
    return data
  }

  const [stocks, setStocks] = useState([
]);

const [dates, setDates] = useState([
]);

const [portfolio, setPortfolio] = useState([
]);

  const name = "stu"
  return (
    <div className="App">
            <Chart stocks={stocks} dates={dates}/>
              <Stocks stocks={stocks} portfolio={portfolio} />
    </div>
  );
}

export default App;
