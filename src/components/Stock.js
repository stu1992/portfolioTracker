const Stock = ({stock}) => {
  return (
  <div className='stock'>
  <h3>{stock.name}</h3>
  <p>{stock.data[0]}</p>
  </div>
  )
}

export default Stock
