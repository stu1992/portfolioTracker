const Headline = ({date, headline, comment, link}) => {
  return (
  <div className='healine'>
  <h3>{date}: {headline}</h3>
  <p>{comment}</p>
  </div>
  )
}

export default Headline
