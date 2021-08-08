import BTC from '../bitcoin.png';
import M3R from '../m3r.jpg';
import DEV from '../dev.jpeg';
import AAPL from '../aapl.png';
import VOO from '../VOO.png';
import ETH from '../ETH.png';
const Headline = ({date, headline, comment, link, tags}) => {
  let stamp = date.substring(0,10);
  var tag = M3R;
  if( tags.includes('BTC'))
  {
      tag = BTC;
  }
  if( tags.includes('ETH'))
  {
      tag = ETH;
  }
  if( tags.includes('DEV'))
  {
      tag = DEV;
  }
  if( tags.includes('AAPL'))
  {
      tag = AAPL;
  }
  if( tags.includes('VOO'))
  {
      tag = VOO;
  }
  return (
  <div className='healine'>
<img style={{float: "left", maxWidth:"20pt", marginRight: "5pt"}} src={tag} alt="bitcoinnews" />
  <h4>{headline} on {stamp}</h4>
  <p>{comment}</p>
  <a href={link}>Read More</a>
  </div>
  )
}
export default Headline
