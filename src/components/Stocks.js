import Stock from './Stock'
const Stocks = ({stocks}) => {
  return (
    <>
    {stocks.map((stock) => (<Stock stock={stock} />))}
    </>
  )
}

    export default Stocks
