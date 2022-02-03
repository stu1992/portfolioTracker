import React, { useRef, useEffect, Component, useState } from 'react';
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';


const Home = ({loggedIn, loggedInCallBack, loggedOutCallBack}) => {


const fetchAnonNews = async() => {
  const res = await fetch ('/api/news/public', {
    method: 'GET',
    credentials: "same-origin"
    });
  const data = await res.json()
  return data
}

function fetchNews(){
  const getNews = async () => {
    const JsonFromServer = await fetchAnonNews()
    setNews(JsonFromServer)
  }
  getNews()
}
	
const [news, setNews] = React.useState([ 
]);

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <>
      <Hero className="illustration-section-01" loggedOutCallBack={loggedOutCallBack} loggedIn={loggedIn} loggedInCallBack={loggedInCallBack}/>
      <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
      <FeaturesTiles />
      <Testimonial topDivider NewsList={news} loggedIn={loggedIn}/>
    </>
  );
}

export default Home;

