import News from '../backend/model/News'
import Headline from './Headline'
const Newsfeed = ({NewsList}) => {
  return (
    <>
    <div style={{ padding: 30 }}>
    {NewsList.map((news) => (<Headline date={news["date"]} headline={news["title"]} comment={news["comment"]} link={news["link"]} tags={news["tags"]}/>))}
    </div>
    </>
  )
}

export default Newsfeed
