import News from '../backend/model/News'
import Headline from './Headline'
const Newsfeed = ({NewsList}) => {
  let list = "";
  for(var i = 0; i < NewsList.length; i++)
  {
    list += ".. " +NewsList[i]["title"];
  }
  return (
    <>
    <div style={{ padding: 5 }}>
    <p>{list}</p>
    </div>
    </>
  )
}

export default Newsfeed
