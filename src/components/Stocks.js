import Stock from './Stock'
const Stocks = ({stocks, portfolio}) => {
  return (
    <>
    {stocks.map((stock) => (<Stock stock={stock} owned={portfolio[stock.name]}/>))}
    </>
  )
}

    export default Stocks
