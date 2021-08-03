const Headline = ({date, headline, comment, link}) => {
  let stamp = date.substring(0,10);
  return (
  <div className='healine'>
  <h4>{headline} on {stamp}</h4>
  <p>{comment}</p>
  <a href={link}>link</a>
  </div>
  )
}

export default Headline