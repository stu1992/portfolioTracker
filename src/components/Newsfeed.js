import News from '../backend/model/News'
import Headline from './Headline'
const Newsfeed = ({NewsList}) => {
  return (
    <>
    {NewsList.map((news) => (<Headline date={news["date"]} headline={news["title"]} comment={news["comment"]} link={news["link"]}/>))}
    </>
  )
}

export default Newsfeed
