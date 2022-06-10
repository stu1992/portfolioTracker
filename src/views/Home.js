import React, { useRef, useEffect, Component, useState } from 'react';
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Header from '../components/layout/Header';
import HeaderLoggedIn from '../components/layout/HeaderLoggedIn';
import HeaderOnboarding from '../components/layout/HeaderOnboarding';
const Home = ({loggedIn, onboarded, loggedInCallBack, loggedOutCallBack, userLoggedIn}) => {


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
console.log("onboarded " +onboarded);
return (
    <>
    { loggedIn && onboarded && <HeaderLoggedIn navPosition="right" className="reveal-from-bottom" /> }
{ !loggedIn && !onboarded && <Header navPosition="right" className="reveal-from-bottom" /> }
{ loggedIn && !onboarded && <HeaderOnboarding navPosition="right" className="reveal-from-bottom" /> }
    <main className="site-content">
      <Hero className="illustration-section-01" loggedOutCallBack={loggedOutCallBack} loggedIn={loggedIn} loggedInCallBack={loggedInCallBack}/>
      <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
      <FeaturesTiles />
      <Testimonial topDivider NewsList={news} loggedIn={loggedIn}/>
</main>
    </>
  );
}

export default Home;

