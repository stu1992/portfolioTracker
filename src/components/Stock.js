const Stock = ({stock, owned}) => {
  return (
  <div className='stock'>
  <h3>{stock.name}</h3>
  <p>I currently own {owned}</p>
  </div>
  )
}

export default Stock
