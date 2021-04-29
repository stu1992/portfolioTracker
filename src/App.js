import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import Stocks from './components/Stocks'
import Chart from './components/Chart'
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

  var portfolioURI = 'http://192.168.0.17:7000/Portfolio/'

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
    portfolioURI = portfolioURI+'Stu'
    fetchUser()
  }

  function KianasPortfolio(){
    portfolioURI = portfolioURI+'Kiana'
    fetchUser()
  }

  return (
    <div className="App">
            <Chart stocks={stocks} dates={dates}/>
              <button onClick={StuPortfolio}>  Stu's portfolio</button>
              <button onClick={KianasPortfolio}>  Kiana's portfolio</button>
              <Stocks stocks={stocks} portfolio={portfolio} />
    </div>
  );
}

export default App;
